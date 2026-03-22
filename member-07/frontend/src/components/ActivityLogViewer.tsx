import { useEffect, useMemo, useState } from 'react';
import { Activity, BookOpen, Calendar, Clock, Download, Filter } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { activityLogService, type ActivityLogItem, type ActivityPeriod } from '../services/activityLogService';

function statusBadge(status: string) {
  const value = (status || 'info').toLowerCase();
  if (value === 'completed') {
    return <Badge className="bg-green-500 text-white">Completed</Badge>;
  }
  if (value === 'missed') {
    return <Badge className="bg-red-500 text-white">Missed</Badge>;
  }
  return <Badge variant="outline">Info</Badge>;
}

function logIcon(item: ActivityLogItem) {
  if (item.event_type.includes('reminder') || item.event_type.includes('alert')) return '💊';
  if (item.event_type.includes('mood')) return '😊';
  if (item.event_type.includes('memory')) return '🖼️';
  if (item.event_type.includes('auth')) return '🔐';
  if (item.event_type.includes('settings')) return '⚙️';
  return '📝';
}

function formatSource(eventType: string) {
  return eventType.replaceAll('_', ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function ActivityLogViewer() {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState<ActivityPeriod>('today');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await activityLogService.getActivityLogs({
          event_type: filterType,
          period: filterDate,
          limit: 500,
        });
        setLogs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load activity logs');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [filterType, filterDate]);

  const stats = useMemo(
    () => ({
      total: logs.length,
      completed: logs.filter((item) => item.status.toLowerCase() === 'completed').length,
      missed: logs.filter((item) => item.status.toLowerCase() === 'missed').length,
      info: logs.filter((item) => item.status.toLowerCase() === 'info').length,
    }),
    [logs]
  );

  const handleExportCsv = async () => {
    setExporting(true);
    setError('');
    try {
      const blob = await activityLogService.exportCsv(filterType, filterDate);
      downloadBlob(blob, `activity_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export logs');
    } finally {
      setExporting(false);
    }
  };

  const formatTime = (value: string) =>
    new Date(value).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center gap-2 sm:gap-4">
        <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-primary" />
        <h2 className="text-2xl sm:text-3xl lg:text-4xl">Activity Logs</h2>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-base sm:text-lg lg:text-xl">Filter by:</span>
          </div>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-64 text-sm sm:text-base lg:text-lg h-10 sm:h-12">
              <SelectValue placeholder="All Activities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-sm sm:text-base lg:text-lg">All Activities</SelectItem>
              <SelectItem value="reminder_created" className="text-sm sm:text-base lg:text-lg">Reminder Created</SelectItem>
              <SelectItem value="reminder_updated" className="text-sm sm:text-base lg:text-lg">Reminder Updated</SelectItem>
              <SelectItem value="alert_done" className="text-sm sm:text-base lg:text-lg">Medicine Taken</SelectItem>
              <SelectItem value="mood_logged" className="text-sm sm:text-base lg:text-lg">Mood Logs</SelectItem>
              <SelectItem value="memory_uploaded" className="text-sm sm:text-base lg:text-lg">Photo Uploads</SelectItem>
              <SelectItem value="settings_updated" className="text-sm sm:text-base lg:text-lg">Settings Changes</SelectItem>
              <SelectItem value="auth_login" className="text-sm sm:text-base lg:text-lg">Login Events</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterDate} onValueChange={(value) => setFilterDate(value as ActivityPeriod)}>
            <SelectTrigger className="w-full sm:w-64 text-sm sm:text-base lg:text-lg h-10 sm:h-12">
              <SelectValue placeholder="Today" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today" className="text-sm sm:text-base lg:text-lg">Today</SelectItem>
              <SelectItem value="yesterday" className="text-sm sm:text-base lg:text-lg">Yesterday</SelectItem>
              <SelectItem value="last_7_days" className="text-sm sm:text-base lg:text-lg">Last 7 Days</SelectItem>
              <SelectItem value="last_30_days" className="text-sm sm:text-base lg:text-lg">Last 30 Days</SelectItem>
              <SelectItem value="all" className="text-sm sm:text-base lg:text-lg">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              setFilterType('all');
              setFilterDate('today');
            }}
            className="w-full sm:w-auto text-sm sm:text-base lg:text-lg"
          >
            Reset Filters
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4 sm:p-6 space-y-2">
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">Total Activities</p>
          <p className="text-2xl sm:text-3xl lg:text-4xl text-primary">{stats.total}</p>
        </Card>
        <Card className="p-4 sm:p-6 space-y-2">
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">Completed</p>
          <p className="text-2xl sm:text-3xl lg:text-4xl text-green-500">{stats.completed}</p>
        </Card>
        <Card className="p-4 sm:p-6 space-y-2">
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">Missed</p>
          <p className="text-2xl sm:text-3xl lg:text-4xl text-red-500">{stats.missed}</p>
        </Card>
        <Card className="p-4 sm:p-6 space-y-2">
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">Info Events</p>
          <p className="text-2xl sm:text-3xl lg:text-4xl">{stats.info}</p>
        </Card>
      </div>

      <Card className="p-4 sm:p-8">
        <h3 className="text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <Calendar className="w-6 h-6 sm:w-8 sm:h-8" />
          {logs[0] ? formatDate(logs[0].created_at) : 'Activity Timeline'}
        </h3>

        {error && <p className="text-red-600 mb-4 text-sm sm:text-base lg:text-lg">{error}</p>}

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-base sm:text-lg lg:text-xl">Loading activity logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-base sm:text-lg lg:text-xl">No activities found for the selected filters</p>
            </div>
          ) : (
            logs.map((log) => (
              <Card key={log.id} className="p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="text-2xl sm:text-3xl lg:text-4xl">{logIcon(log)}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <h4 className="text-base sm:text-lg lg:text-xl">{log.title}</h4>
                        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">{log.description || '-'}</p>
                      </div>
                      {statusBadge(log.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(log.created_at)}
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{formatSource(log.event_type)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>

      <Card className="p-4 sm:p-8 bg-accent/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg sm:text-xl lg:text-2xl mb-2">Export Activity Report</h3>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">Download activity logs as CSV</p>
          </div>
          <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm sm:text-base lg:text-lg px-3 sm:px-5 lg:px-6 py-3 sm:py-5 lg:py-6" onClick={() => void handleExportCsv()} disabled={exporting}>
            <Download className="w-5 h-5 mr-2" />
            {exporting ? 'Exporting...' : 'Export as CSV'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
