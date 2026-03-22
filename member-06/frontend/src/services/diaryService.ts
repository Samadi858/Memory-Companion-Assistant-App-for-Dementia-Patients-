import { API_BASE_URL } from './api';

export interface DiaryEntry {
  id: number;
  user_id: number;
  activity: string;
  icon: string;
  occurred_at: string;
  created_at: string;
  updated_at?: string | null;
}

interface CreateDiaryEntryPayload {
  activity: string;
  icon?: string;
  occurred_at?: string;
  user_id?: number;
}

interface UpdateDiaryEntryPayload {
  activity?: string;
  icon?: string;
  occurred_at?: string;
  user_id?: number;
}

function getStoredAuthUserId(): number | undefined {
  const raw = localStorage.getItem('auth_user');
  if (!raw) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(raw) as { id?: unknown };
    if (typeof parsed.id === 'number') {
      return parsed.id;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

export const diaryService = {
  async createEntry(payload: CreateDiaryEntryPayload): Promise<DiaryEntry> {
    const userId = typeof payload.user_id === 'number' ? payload.user_id : getStoredAuthUserId();
    const response = await fetch(`${API_BASE_URL}/diary/entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        activity: payload.activity,
        icon: payload.icon || '📝',
        occurred_at: payload.occurred_at,
        user_id: userId,
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to create diary entry: ${response.status}`);
    }
    return (await response.json()) as DiaryEntry;
  },

  async getEntries(userId?: number, limit: number = 100): Promise<DiaryEntry[]> {
    const resolvedUserId = typeof userId === 'number' ? userId : getStoredAuthUserId();
    const url = new URL(`${API_BASE_URL}/diary/entries`);
    if (typeof resolvedUserId === 'number') {
      url.searchParams.set('user_id', String(resolvedUserId));
    }
    url.searchParams.set('limit', String(limit));

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Failed to fetch diary entries: ${response.status}`);
    }
    return (await response.json()) as DiaryEntry[];
  },

  async updateEntry(entryId: number, payload: UpdateDiaryEntryPayload): Promise<DiaryEntry> {
    const userId = typeof payload.user_id === 'number' ? payload.user_id : getStoredAuthUserId();
    const response = await fetch(`${API_BASE_URL}/diary/entries/${entryId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        activity: payload.activity,
        icon: payload.icon,
        occurred_at: payload.occurred_at,
        user_id: userId,
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to update diary entry: ${response.status}`);
    }
    return (await response.json()) as DiaryEntry;
  },

  async deleteEntry(entryId: number, userId?: number): Promise<void> {
    const resolvedUserId = typeof userId === 'number' ? userId : getStoredAuthUserId();
    const url = new URL(`${API_BASE_URL}/diary/entries/${entryId}`);
    if (typeof resolvedUserId === 'number') {
      url.searchParams.set('user_id', String(resolvedUserId));
    }
    const response = await fetch(url.toString(), { method: 'DELETE' });
    if (!response.ok) {
      throw new Error(`Failed to delete diary entry: ${response.status}`);
    }
  },
};

