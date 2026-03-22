import { API_BASE_URL, notifyUnauthorized } from './api';

const AUTH_BASE = `${API_BASE_URL}/auth`;

export interface AuthUser {
  id: number;
  full_name: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: AuthUser;
}

interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'auth_user';

const tokenStorage = {
  getAccess: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  getUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },
  setUser: (user: AuthUser) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
};

async function parseResponse(response: Response) {
  const data: unknown = await response.json().catch(() => ({}));
  if (!response.ok) {
    const parsed = data as { detail?: string | Array<{ msg?: string }> };
    const detail = parsed.detail;
    const message = Array.isArray(detail)
      ? detail.map((item) => item.msg || 'Validation error').join(', ')
      : detail || `Request failed (${response.status})`;

    throw new Error(message);
  }

  return data;
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = tokenStorage.getRefresh();
  if (!refreshToken) {
    return false;
  }

  try {
    const response = await fetch(`${AUTH_BASE}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      return false;
    }

    const payload = (await response.json()) as AccessTokenResponse;
    localStorage.setItem(ACCESS_TOKEN_KEY, payload.access_token);
    return true;
  } catch {
    return false;
  }
}

async function authFetch(url: string, options: RequestInit = {}, retry = true) {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  const accessToken = tokenStorage.getAccess();
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401 && retry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return authFetch(url, options, false);
    }
  }

  if (response.status === 401) {
    tokenStorage.clear();
    notifyUnauthorized();
  }

  return response;
}

export const authService = {
  isAuthenticated() {
    return Boolean(tokenStorage.getAccess());
  },

  getUser() {
    return tokenStorage.getUser();
  },

  async register(payload: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    const response = await fetch(`${AUTH_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: payload.fullName,
        email: payload.email,
        password: payload.password,
        confirm_password: payload.confirmPassword,
      }),
    });

    const data = (await parseResponse(response)) as AuthResponse;
    tokenStorage.setTokens(data.access_token, data.refresh_token);
    tokenStorage.setUser(data.user);
    return data;
  },

  async login(payload: { email: string; password: string }) {
    const response = await fetch(`${AUTH_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = (await parseResponse(response)) as AuthResponse;
    tokenStorage.setTokens(data.access_token, data.refresh_token);
    tokenStorage.setUser(data.user);
    return data;
  },

  async me() {
    const response = await authFetch(`${AUTH_BASE}/me`, { method: 'GET' });
    const user = (await parseResponse(response)) as AuthUser;
    tokenStorage.setUser(user);
    return user;
  },

  async logout() {
    try {
      await authFetch(`${AUTH_BASE}/logout`, { method: 'POST' });
    } finally {
      tokenStorage.clear();
    }
  },

  async changePassword(payload: { newPassword: string; confirmPassword: string }) {
    const response = await authFetch(`${AUTH_BASE}/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        new_password: payload.newPassword,
        confirm_password: payload.confirmPassword,
      }),
    });

    return parseResponse(response);
  },
};
