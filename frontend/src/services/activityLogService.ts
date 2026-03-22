import { API_BASE_URL, fetchWithAuth } from './api';

export type ActivityPeriod = 'today' | 'yesterday' | 'last_7_days' | 'last_30_days' | 'all';

export interface ActivityLogItem {
  id: number;
  user_id: number;
  event_type: string;
  title: string;
  description: string | null;
  status: 'completed' | 'missed' | 'info' | string;
  source: string;
  created_at: string;
}

export const activityLogService = {
  async getActivityLogs(params?: {
    event_type?: string;
    period?: ActivityPeriod;
    skip?: number;
    limit?: number;
  }) {
    const search = new URLSearchParams();
    if (params?.event_type) search.set('event_type', params.event_type);
    if (params?.period) search.set('period', params.period);
    if (typeof params?.skip === 'number') search.set('skip', String(params.skip));
    if (typeof params?.limit === 'number') search.set('limit', String(params.limit));

    const query = search.toString();
    const url = `${API_BASE_URL}/activity-logs${query ? `?${query}` : ''}`;
    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch activity logs: ${response.status}`);
    }
    return (await response.json()) as ActivityLogItem[];
  },

  async exportCsv(eventType = 'all', period: ActivityPeriod = 'all') {
    const search = new URLSearchParams({
      event_type: eventType,
      period,
    });
    const response = await fetchWithAuth(`${API_BASE_URL}/activity-logs/export/csv?${search.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to export logs: ${response.status}`);
    }
    return response.blob();
  },
};
