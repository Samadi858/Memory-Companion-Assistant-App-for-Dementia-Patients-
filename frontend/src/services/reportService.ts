import { API_BASE_URL, fetchWithAuth } from './api';

export interface ReportSummary {
  total_activities: number;
  medication_count: number;
  call_count: number;
  mood_count: number;
  avg_activities_per_day: string;
}

export interface MedicationStats {
  taken: number;
  expected: number;
  rate: string;
}

export interface ActivityBreakdownItem {
  name: string;
  value: number;
}

export interface DailyTrendItem {
  date: string;
  activities: number;
}

export interface MoodDistributionItem {
  mood: string;
  count: number;
}

export interface HourlyPatternItem {
  hour: string;
  activities: number;
}

export interface InsightItem {
  type: 'positive' | 'warning' | 'info' | string;
  message: string;
}

export interface FullReportResponse {
  patient_id: number;
  days: number;
  summary: ReportSummary;
  medication: MedicationStats;
  activity_breakdown: ActivityBreakdownItem[];
  daily_trend: DailyTrendItem[];
  mood_distribution: MoodDistributionItem[];
  hourly_pattern: HourlyPatternItem[];
  insights: InsightItem[];
}

async function parseErrorMessage(response: Response, fallback: string) {
  try {
    const payload = (await response.json()) as { detail?: string };
    if (payload?.detail) {
      return payload.detail;
    }
  } catch {
    // ignore parse issues and use fallback
  }
  return fallback;
}

export const reportService = {
  async getPatientReport(days: number) {
    const response = await fetchWithAuth(`${API_BASE_URL}/reports/patient?days=${days}`);
    if (!response.ok) {
      throw new Error(await parseErrorMessage(response, `Failed to fetch report: ${response.status}`));
    }
    return (await response.json()) as FullReportResponse;
  },

  async downloadCsv(days: number) {
    const response = await fetchWithAuth(`${API_BASE_URL}/reports/patient/export/csv?days=${days}`);
    if (!response.ok) {
      throw new Error(await parseErrorMessage(response, `Failed to export CSV: ${response.status}`));
    }
    return response.blob();
  },

  async downloadPdf(days: number) {
    const response = await fetchWithAuth(`${API_BASE_URL}/reports/patient/export/pdf?days=${days}`);
    if (!response.ok) {
      throw new Error(await parseErrorMessage(response, `Failed to export PDF: ${response.status}`));
    }
    return response.blob();
  },
};
