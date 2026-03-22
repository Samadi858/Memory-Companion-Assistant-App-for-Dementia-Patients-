import { API_BASE_URL } from './api';

export interface MoodEntry {
  id: number;
  user_id: number;
  mood: string;
  note?: string | null;
  created_at: string;
}

interface CreateMoodPayload {
  mood: string;
  note?: string;
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

export const moodService = {
  async createMoodEntry(payload: CreateMoodPayload): Promise<MoodEntry> {
    const userId = typeof payload.user_id === 'number' ? payload.user_id : getStoredAuthUserId();
    const response = await fetch(`${API_BASE_URL}/mood/entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mood: payload.mood,
        note: payload.note,
        user_id: userId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create mood entry: ${response.status}`);
    }
    return (await response.json()) as MoodEntry;
  },

  async getMoodHistory(userId?: number, limit: number = 50): Promise<MoodEntry[]> {
    const resolvedUserId = typeof userId === 'number' ? userId : getStoredAuthUserId();
    const url = new URL(`${API_BASE_URL}/mood/entries`);
    if (typeof resolvedUserId === 'number') {
      url.searchParams.set('user_id', String(resolvedUserId));
    }
    url.searchParams.set('limit', String(limit));

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Failed to fetch mood history: ${response.status}`);
    }
    return (await response.json()) as MoodEntry[];
  },
};
