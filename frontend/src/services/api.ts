export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized';

export class UnauthorizedError extends Error {
  constructor(message = 'Invalid or expired token') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

function clearAuthStorage() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('auth_user');
}

export function notifyUnauthorized() {
  clearAuthStorage();
  window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const accessToken = localStorage.getItem('access_token');
  const headers = new Headers(options.headers || {});
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(url, { ...options, headers });
  if (response.status === 401) {
    notifyUnauthorized();
    throw new UnauthorizedError();
  }

  return response;
}
