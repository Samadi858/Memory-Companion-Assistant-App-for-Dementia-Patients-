import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  Download,
  FileText,
  Heart,
  Pill,
  TrendingUp,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { reportService, type FullReportResponse } from '../services/reportService';

type TimeRange = '7days' | '14days' | '30days' | 'all';
const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

function daysFromRange(range: TimeRange) {
  if (range === '7days') return 7;
  if (range === '14days') return 14;
  if (range === '30days') return 30;
  return 365;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function PatientReportGenerator() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7days');
  const [report, setReport] = useState<FullReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const days = useMemo(() => daysFromRange(timeRange), [timeRange]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const data = await reportService.getPatientReport(days);
        setReport(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load report';
        setErrorMessage(message);
        setReport(null);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [days]);

  const handleExportCsv = async () => {
    setIsDownloading(true);
    setErrorMessage('');
    try {
      const blob = await reportService.downloadCsv(days);
      downloadBlob(blob, `patient-report-${new Date().toISOString().split('T')[0]}.csv`);
      setPreviewOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to export CSV';
      setErrorMessage(message);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleExportPdf = async () => {
    setIsDownloading(true);
    setErrorMessage('');
    try {
      const blob = await reportService.downloadPdf(days);
      downloadBlob(blob, `patient-report-${new Date().toISOString().split('T')[0]}.pdf`);
      setPreviewOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to export PDF';
      setErrorMessage(message);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => window.print();
  const handleOpenDownload = () => {
    if (!report) {
      setErrorMessage('Report data is still loading. Please try again in a moment.');
      return;
    }
    setPreviewOpen(true);
  };

  const medicationRate = Number(report?.medication.rate || '0');

  return (
    <div className="space-y-5 sm:space-y-8 print:space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 print:flex-col print:items-start">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <FileText className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-primary print:w-8 print:h-8" />
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl print:text-2xl">Patient Report</h2>
            <p className="text-sm sm:text-base lg:text-xl text-muted-foreground print:text-sm">
              Generated {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-3 print:hidden w-full sm:w-auto flex-wrap">
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
            <SelectTrigger className="w-full sm:w-48 text-sm sm:text-base lg:text-lg py-3 sm:py-5 lg:py-6">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days" className="text-sm sm:text-base lg:text-lg">Last 7 Days</SelectItem>
              <SelectItem value="14days" className="text-sm sm:text-base lg:text-lg">Last 14 Days</SelectItem>
              <SelectItem value="30days" className="text-sm sm:text-base lg:text-lg">Last 30 Days</SelectItem>
              <SelectItem value="all" className="text-sm sm:text-base lg:text-lg">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Button type="button" size="lg" variant="outline" onClick={handlePrint} className="text-sm sm:text-base lg:text-lg px-3 sm:px-5 lg:px-6 py-3 sm:py-5 lg:py-6">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Print
          </Button>

          <Button
            type="button"
            size="lg"
            onClick={handleOpenDownload}
            className="text-sm sm:text-base lg:text-lg px-3 sm:px-5 lg:px-6 py-3 sm:py-5 lg:py-6"
            disabled={isLoading}
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {isLoading && (
        <Card className="p-5 sm:p-8">
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">Loading report...</p>
        </Card>
      )}

      {errorMessage && (
        <Card className="p-4 sm:p-6 bg-red-50 border border-red-200">
          <p className="text-red-700 text-sm sm:text-base lg:text-lg">{errorMessage}</p>
        </Card>
      )}

      {!isLoading && !report && !errorMessage && (
        <Card className="p-5 sm:p-8 bg-blue-50 border-2 border-blue-300">
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">No report data available for the selected period.</p>
        </Card>
      )}

      {report && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 sm:p-6 bg-blue-50">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">Total Activities</p>
              </div>
              <p className="text-3xl sm:text-4xl lg:text-5xl text-blue-600">{report.summary.total_activities}</p>
              <p className="text-sm text-muted-foreground mt-1">{report.summary.avg_activities_per_day} per day</p>
            </Card>

            <Card className="p-4 sm:p-6 bg-green-50">
              <div className="flex items-center gap-3 mb-2">
                <Pill className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">Medication</p>
              </div>
              <p className="text-3xl sm:text-4xl lg:text-5xl text-green-600">{report.medication.rate}%</p>
              <p className="text-sm text-muted-foreground mt-1">Adherence rate</p>
            </Card>

            <Card className="p-4 sm:p-6 bg-rose-50">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-rose-600" />
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">Mood Entries</p>
              </div>
              <p className="text-3xl sm:text-4xl lg:text-5xl text-rose-600">{report.summary.mood_count}</p>
              <p className="text-sm text-muted-foreground mt-1">Tracked moods</p>
            </Card>
          </div>

          {report.insights.length > 0 && (
            <Card className="p-4 sm:p-6 bg-amber-50 border-2 border-amber-200">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
                <h3 className="text-lg sm:text-xl lg:text-2xl">Key Insights & Recommendations</h3>
              </div>

              <div className="space-y-3">
                {report.insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg">
                    {insight.type === 'positive' && <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />}
                    {insight.type === 'warning' && <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />}
                    {insight.type === 'info' && <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />}
                    <p className="text-sm sm:text-base lg:text-lg">{insight.message}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl lg:text-2xl mb-4">Activity Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={report.activity_breakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {report.activity_breakdown.map((entry, index) => (
                      <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl lg:text-2xl mb-4">Mood Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={report.mood_distribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mood" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ec4899" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4 sm:p-6 lg:col-span-2">
              <h3 className="text-lg sm:text-xl lg:text-2xl mb-4">Daily Activity Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={report.daily_trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="activities" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl mb-4">Medication Adherence Detail</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:items-center sm:justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">Medications Taken</p>
                  <p className="text-2xl sm:text-3xl text-green-600">{report.medication.taken}</p>
                </div>
                <div>
                  <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">Expected</p>
                  <p className="text-2xl sm:text-3xl">{report.medication.expected}</p>
                </div>
                <div>
                  <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">Adherence Rate</p>
                  <p className="text-2xl sm:text-3xl text-green-600">{report.medication.rate}%</p>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-6">
                <div
                  className="bg-green-600 h-6 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, medicationRate))}%` }}
                ></div>
              </div>
            </div>
          </Card>
        </>
      )}

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">Report Preview</DialogTitle>
            <DialogDescription>
              Choose the format to download the generated patient report.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm sm:text-base lg:text-lg">
              Period: Last <strong>{days}</strong> day(s)
            </p>
            <p className="text-sm sm:text-base lg:text-lg">
              Total activities: <strong>{report?.summary.total_activities ?? 0}</strong>
            </p>
            <p className="text-sm sm:text-base lg:text-lg">
              Medication adherence: <strong>{report?.medication.rate ?? '0'}%</strong>
            </p>
            <p className="text-muted-foreground">
              Choose export format:
            </p>
            <div className="flex gap-3 flex-wrap">
              <Button type="button" onClick={() => void handleExportPdf()} disabled={isDownloading || !report}>
                {isDownloading ? 'Preparing...' : 'Download PDF'}
              </Button>
              <Button type="button" variant="outline" onClick={() => void handleExportCsv()} disabled={isDownloading || !report}>
                {isDownloading ? 'Preparing...' : 'Download CSV'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
