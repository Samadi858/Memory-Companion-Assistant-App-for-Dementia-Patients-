import { API_BASE_URL, fetchWithAuth } from './api';

export interface Reminder {
    id: number;
    user_id?: number;
    time: string;
    name: string;
    type: string;
    frequency: string;
    image_url?: string | null;
    color: string;
    icon: string;
    enabled: boolean;
}

export interface ReminderCreate {
    time: string;
    name: string;
    type?: string;
    frequency?: string;
    image_url?: string | null;
    color?: string;
    icon?: string;
    enabled?: boolean;
}

export interface ReminderUpdate {
    time?: string;
    name?: string;
    type?: string;
    frequency?: string;
    image_url?: string | null;
    color?: string;
    icon?: string;
    enabled?: boolean;
}

export const reminderService = {
    getReminders: async () => {
        const response = await fetchWithAuth(`${API_BASE_URL}/reminders/`);
        if (!response.ok) {
            throw new Error(`Failed to fetch reminders: ${response.status}`);
        }
        return (await response.json()) as Reminder[];
    },

    createReminder: async (reminder: ReminderCreate) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/reminders/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reminder),
        });
        if (!response.ok) {
            const message = await parseErrorMessage(response, `Failed to create reminder: ${response.status}`);
            throw new Error(message);
        }
        return (await response.json()) as Reminder;
    },

    updateReminder: async (id: number | string, reminder: ReminderUpdate) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/reminders/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reminder),
        });
        if (!response.ok) {
            const message = await parseErrorMessage(response, `Failed to update reminder: ${response.status}`);
            throw new Error(message);
        }
        return (await response.json()) as Reminder;
    },

    deleteReminder: async (id: number | string) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/reminders/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Failed to delete reminder: ${response.status}`);
        }
    },
};

async function parseErrorMessage(response: Response, fallback: string) {
    try {
        const payload = (await response.json()) as { detail?: string };
        if (payload.detail) {
            return payload.detail;
        }
    } catch {
        // ignore parse errors and use fallback
    }
    return fallback;
}
