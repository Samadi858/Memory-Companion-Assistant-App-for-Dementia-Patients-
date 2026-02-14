import api from './api';

export interface Reminder {
    id: number;
    time: string;
    name: string;
    type: string;
    color: string;
    icon: string;
    enabled: boolean;
}

export interface ReminderCreate {
    time: string;
    name: string;
    type?: string;
    color?: string;
    icon?: string;
    enabled?: boolean;
}

export interface ReminderUpdate {
    time?: string;
    name?: string;
    type?: string;
    color?: string;
    icon?: string;
    enabled?: boolean;
}

export const reminderService = {
    getReminders: async () => {
        const response = await api.get<Reminder[]>('/reminders/');
        return response.data;
    },

    createReminder: async (reminder: ReminderCreate) => {
        const response = await api.post<Reminder>('/reminders/', reminder);
        return response.data;
    },

    updateReminder: async (id: number | string, reminder: ReminderUpdate) => {
        const response = await api.put<Reminder>(`/reminders/${id}`, reminder);
        return response.data;
    },

    deleteReminder: async (id: number | string) => {
        await api.delete(`/reminders/${id}`);
    },
};
