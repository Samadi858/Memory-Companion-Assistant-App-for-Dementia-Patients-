import { API_BASE_URL } from './api';

export interface PatientDetails {
  id: number;
  full_name: string;
  email: string;
  date: string;
}

export interface PatientReminder {
  id: number;
  title: string;
  time: string;
  type: 'Medicine' | 'Task';
  completed: boolean;
  icon_color: string;
  icon: string;
  image_url?: string | null;
}

export const patientService = {
  async getPatientDetails(userId?: number) {
    const url = new URL(`${API_BASE_URL}/patient/details`);
    const resolvedUserId = typeof userId === 'number' ? userId : getStoredAuthUserId();
    if (typeof resolvedUserId === 'number') {
      url.searchParams.set('user_id', String(resolvedUserId));
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Failed to fetch patient details: ${response.status}`);
    }
    return (await response.json()) as PatientDetails;
  },

  async getTodaysReminders(userId?: number) {
    const url = new URL(`${API_BASE_URL}/patient/reminders/today`);
    const resolvedUserId = typeof userId === 'number' ? userId : getStoredAuthUserId();
    if (typeof resolvedUserId === 'number') {
      url.searchParams.set('user_id', String(resolvedUserId));
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Failed to fetch today's reminders: ${response.status}`);
    }
    return (await response.json()) as PatientReminder[];
  },

  async setReminderCompletion(reminderId: number, completed: boolean, userId?: number) {
    const url = new URL(`${API_BASE_URL}/patient/reminders/${reminderId}/completion`);
    const resolvedUserId = typeof userId === 'number' ? userId : getStoredAuthUserId();
    if (typeof resolvedUserId === 'number') {
      url.searchParams.set('user_id', String(resolvedUserId));
    }

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
    if (!response.ok) {
      throw new Error(`Failed to save reminder completion: ${response.status}`);
    }
  },
};

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
