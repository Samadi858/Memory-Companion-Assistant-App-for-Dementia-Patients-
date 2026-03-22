import { useEffect, useMemo, useState } from 'react';
import { Calendar, Clock, Download, Filter, HeartPulse } from 'lucide-react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { moodService, MoodEntry } from '../services/moodService';

const moodEmoji: Record<string, string> = {
  happy: '😊',
  calm: '😌',
  excited: '🤗',
  sad: '😢',
  confused: '😕',
};

type MoodPeriod = 'today' | 'yesterday' | 'last_7_days' | 'last_30_days' | 'all';

function formatMood(value: string) {
  return value.replaceAll('_', ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}

function getMoodStatus(mood: string): 'positive' | 'neutral' | 'negative' {
  const value = mood.toLowerCase();
  if (value === 'happy' || value === 'calm' || value === 'excited') {
    return 'positive';
  }
  if (value === 'sad' || value === 'confused') {
    return 'negative';
  }
  return 'neutral';
}

function statusBadge(status: 'positive' | 'neutral' | 'negative') {
  if (status === 'positive') {
    return <Badge className="bg-green-500 text-white">Positive</Badge>;
  }
  if (status === 'negative') {
    return <Badge className="bg-red-500 text-white">Needs Attention</Badge>;
  }
  return <Badge variant="outline">Neutral</Badge>;
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

function isInPeriod(value: string, period: MoodPeriod) {
  if (period === 'all') {
    return true;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (period === 'today') {
    return date >= startOfToday;
  }

  if (period === 'yesterday') {
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    return date >= startOfYesterday && date < startOfToday;
  }

  const days = period === 'last_7_days' ? 7 : 30;
  const threshold = new Date(startOfToday);
  threshold.setDate(threshold.getDate() - days + 1);
  return date >= threshold;
}

export function MoodHistoryLog() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);
  const [filterMood, setFilterMood] = useState('all');
  const [filterDate, setFilterDate] = useState<MoodPeriod>('today');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const items = await moodService.getMoodHistory(undefined, 100);
        setEntries(items);
      } catch (err) {
        setEntries([]);
        setError(err instanceof Error ? err.message : 'Failed to load mood history');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const filteredEntries = useMemo(
    () =>
      entries.filter((entry) => {
        if (filterMood !== 'all' && entry.mood !== filterMood) {
          return false;
        }
        return isInPeriod(entry.created_at, filterDate);
      }),
    [entries, filterMood, filterDate]
  );

  const stats = useMemo(
    () => ({
      total: filteredEntries.length,
      positive: filteredEntries.filter((item) => getMoodStatus(item.mood) === 'positive').length,
      negative: filteredEntries.filter((item) => getMoodStatus(item.mood) === 'negative').length,
      withNotes: filteredEntries.filter((item) => Boolean(item.note && item.note.trim())).length,
    }),
    [filteredEntries]
  );

  const handleExportCsv = async () => {
    setExporting(true);
    setError('');
    try {
      const rows = [
        ['Mood', 'Status', 'Note', 'Date / Time'],
        ...filteredEntries.map((entry) => [
          formatMood(entry.mood),
          getMoodStatus(entry.mood),
          entry.note || '',
          new Date(entry.created_at).toLocaleString(),
        ]),
      ];
      const csv = rows
        .map((row) =>
          row
            .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
            .join(',')
        )
        .join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      downloadBlob(blob, `mood_history_${new Date().toISOString().slice(0, 10)}.csv`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export mood history');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center gap-2 sm:gap-4">
        <HeartPulse className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-rose-500" />
        <h2 className="text-2xl sm:text-3xl lg:text-4xl">Mood History Log</h2>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-base sm:text-lg lg:text-xl">Filter by:</span>
          </div>

          <Select value={filterMood} onValueChange={setFilterMood}>
            <SelectTrigger className="w-full sm:w-64 text-sm sm:text-base lg:text-lg h-10 sm:h-12">
              <SelectValue placeholder="All Moods" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-sm sm:text-base lg:text-lg">All Moods</SelectItem>
              <SelectItem value="happy" className="text-sm sm:text-base lg:text-lg">Happy</SelectItem>
              <SelectItem value="calm" className="text-sm sm:text-base lg:text-lg">Calm</SelectItem>
              <SelectItem value="excited" className="text-sm sm:text-base lg:text-lg">Excited</SelectItem>
              <SelectItem value="sad" className="text-sm sm:text-base lg:text-lg">Sad</SelectItem>
              <SelectItem value="confused" className="text-sm sm:text-base lg:text-lg">Confused</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterDate} onValueChange={(value) => setFilterDate(value as MoodPeriod)}>
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
              setFilterMood('all');
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
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">Total Entries</p>
          <p className="text-2xl sm:text-3xl lg:text-4xl text-primary">{stats.total}</p>
        </Card>
        <Card className="p-4 sm:p-6 space-y-2">
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">Positive</p>
          <p className="text-2xl sm:text-3xl lg:text-4xl text-green-500">{stats.positive}</p>
        </Card>
        <Card className="p-4 sm:p-6 space-y-2">
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">Needs Attention</p>
          <p className="text-2xl sm:text-3xl lg:text-4xl text-red-500">{stats.negative}</p>
        </Card>
        <Card className="p-4 sm:p-6 space-y-2">
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">With Notes</p>
          <p className="text-2xl sm:text-3xl lg:text-4xl">{stats.withNotes}</p>
        </Card>
      </div>

      <Card className="p-4 sm:p-8">
        <h3 className="text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <Calendar className="w-6 h-6 sm:w-8 sm:h-8" />
          Mood Timeline
        </h3>

        {error && <p className="text-red-600 mb-4 text-sm sm:text-base lg:text-lg">{error}</p>}

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-base sm:text-lg lg:text-xl">Loading mood history...</p>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <HeartPulse className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-base sm:text-lg lg:text-xl">No mood entries found for the selected filters</p>
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const moodStatus = getMoodStatus(entry.mood);
              return (
                <Card key={entry.id} className="p-4 sm:p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="text-2xl sm:text-3xl lg:text-4xl">{moodEmoji[entry.mood] || '🙂'}</div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <h4 className="text-base sm:text-lg lg:text-xl">{formatMood(entry.mood)}</h4>
                          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">{entry.note || '-'}</p>
                        </div>
                        {statusBadge(moodStatus)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(entry.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div>
                          {new Date(entry.created_at).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </Card>

      <Card className="p-4 sm:p-8 bg-accent/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg sm:text-xl lg:text-2xl mb-2">Export Mood Report</h3>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">Download filtered mood history as CSV</p>
          </div>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto text-sm sm:text-base lg:text-lg px-3 sm:px-5 lg:px-6 py-3 sm:py-5 lg:py-6"
            onClick={() => void handleExportCsv()}
            disabled={exporting}
          >
            <Download className="w-5 h-5 mr-2" />
            {exporting ? 'Exporting...' : 'Export as CSV'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
