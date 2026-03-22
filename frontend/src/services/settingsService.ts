import { API_BASE_URL, fetchWithAuth } from './api';

export interface SystemSettingsPayload {
  patient_name: string;
  primary_caregiver_name: string;
  caregiver_relationship: string;
  emergency_contact_number: string;
  patient_photo_url: string;
  caregiver_name: string;
  caregiver_phone: string;

  font_size: number;
  high_contrast: boolean;
  night_mode: boolean;
  animations: boolean;

  audio_alerts: boolean;
  visual_alerts: boolean;
  reminder_volume: number;
  snooze_enabled: boolean;
  snooze_duration: string;

  language: string;
  time_format: string;
  date_format: string;

  auto_lock_enabled: boolean;
  auto_lock_time: string;
  require_password_for_settings: boolean;
  activity_logging: boolean;
}

export interface SystemSettingsResponse extends SystemSettingsPayload {
  caregiver_user_id: number;
  updated_at: string;
}

export const settingsService = {
  async getSystemSettings() {
    const response = await fetchWithAuth(`${API_BASE_URL}/settings/system`);
    if (!response.ok) {
      throw new Error(`Failed to fetch settings: ${response.status}`);
    }
    return (await response.json()) as SystemSettingsResponse;
  },

  async updateSystemSettings(payload: SystemSettingsPayload) {
    const response = await fetchWithAuth(`${API_BASE_URL}/settings/system`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Failed to save settings: ${response.status}`);
    }
    return (await response.json()) as SystemSettingsResponse;
  },
};
