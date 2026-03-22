import { API_BASE_URL, fetchWithAuth } from './api';

export interface MemoryItem {
  id: number;
  user_id: number;
  name: string;
  relationship: string;
  phone_number?: string | null;
  display_color?: string | null;
  notes?: string | null;
  description?: string | null;
  image_url?: string | null;
  created_at: string;
}

export interface MemoryCreatePayload {
  name: string;
  relationship: string;
  phone_number?: string;
  display_color?: string;
  notes?: string;
  description?: string;
}

export interface MemoryUpdatePayload {
  name?: string;
  relationship?: string;
  phone_number?: string;
  display_color?: string;
  notes?: string;
  description?: string;
}

function getAccessToken() {
  return localStorage.getItem('access_token');
}

function getStoredAuthUserId(): number | undefined {
  const raw = localStorage.getItem('auth_user');
  if (!raw) return undefined;

  try {
    const parsed = JSON.parse(raw) as { id?: unknown };
    return typeof parsed.id === 'number' ? parsed.id : undefined;
  } catch {
    return undefined;
  }
}

export const memoryService = {
  async uploadMemory(payload: MemoryCreatePayload, image?: File | null): Promise<MemoryItem> {
    const token = getAccessToken();
    if (!token) {
      throw new Error('Please login as caregiver first');
    }

    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('relationship', payload.relationship);
    if (payload.phone_number) formData.append('phone_number', payload.phone_number);
    if (payload.display_color) formData.append('display_color', payload.display_color);
    if (payload.notes) formData.append('notes', payload.notes);
    if (payload.description) formData.append('description', payload.description);
    if (image) formData.append('image', image);

    const response = await fetchWithAuth(`${API_BASE_URL}/memories/`, {
      method: 'POST',
      headers: {
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload memory: ${response.status}`);
    }

    const data = (await response.json()) as Omit<MemoryItem, 'user_id'>;
    return {
      id: data.id,
      user_id: getStoredAuthUserId() || 0,
      name: data.name,
      relationship: data.relationship,
      phone_number: data.phone_number ?? null,
      display_color: data.display_color ?? null,
      notes: data.notes ?? null,
      description: data.description ?? null,
      image_url: data.image_url,
      created_at: data.created_at,
    };
  },

  async getMyMemories(): Promise<MemoryItem[]> {
    const token = getAccessToken();
    if (!token) {
      return [];
    }

    const response = await fetchWithAuth(`${API_BASE_URL}/memories/mine`);

    if (!response.ok) {
      throw new Error(`Failed to fetch memories: ${response.status}`);
    }
    return (await response.json()) as MemoryItem[];
  },

  async getTimelineMemories(userId?: number): Promise<MemoryItem[]> {
    const resolvedUserId = typeof userId === 'number' ? userId : getStoredAuthUserId();
    const url = new URL(`${API_BASE_URL}/memories/timeline`);
    if (typeof resolvedUserId === 'number') {
      url.searchParams.set('user_id', String(resolvedUserId));
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Failed to fetch timeline memories: ${response.status}`);
    }
    return (await response.json()) as MemoryItem[];
  },

  async updateMemory(memoryId: number, payload: MemoryUpdatePayload): Promise<MemoryItem> {
    const token = getAccessToken();
    if (!token) {
      throw new Error('Please login as caregiver first');
    }

    const response = await fetchWithAuth(`${API_BASE_URL}/memories/${memoryId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to update memory: ${response.status}`);
    }
    return (await response.json()) as MemoryItem;
  },

  async deleteMemory(memoryId: number): Promise<void> {
    const token = getAccessToken();
    if (!token) {
      throw new Error('Please login as caregiver first');
    }

    const response = await fetchWithAuth(`${API_BASE_URL}/memories/${memoryId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete memory: ${response.status}`);
    }
  },
};
