import { useState } from 'react';
import { BookOpen, Calendar, Clock, Filter, User, Activity } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

interface ActivityLog {
  id: string;
  timestamp: Date;
  type: 'medication' | 'task' | 'interaction' | 'recognition' | 'mood' | 'system';
  title: string;
  description: string;
  status: 'completed' | 'missed' | 'info';
}

interface ActivityLogViewerProps {
}

export function ActivityLogViewer() {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('today');

  // Mock activity logs - in real app, this would come from a database
  const [logs] = useState<ActivityLog[]>([
    {
      id: '1',
      timestamp: new Date('2026-02-05T08:00:00'),
      type: 'medication',
      title: 'Morning Medication Taken',
      description: 'Blood pressure pill taken on time',
      status: 'completed',
    },
    {
      id: '2',
      timestamp: new Date('2026-02-05T08:15:00'),
      type: 'recognition',
      title: 'Person Recognized',
      description: 'Sarah Johnson (Daughter) detected in living room',
      status: 'info',
    },
    {
      id: '3',
      timestamp: new Date('2026-02-05T09:30:00'),
      type: 'task',
      title: 'Morning Walk Completed',
      description: 'Daily exercise routine completed',
      status: 'completed',
    },
    {
      id: '4',
      timestamp: new Date('2026-02-05T10:00:00'),
      type: 'mood',
      title: 'Mood Logged',
      description: 'Mood recorded as Happy',
      status: 'info',
    },
    {
      id: '5',
      timestamp: new Date('2026-02-05T12:00:00'),
      type: 'medication',
      title: 'Lunch Medication Missed',
      description: 'Vitamin D supplement not taken',
      status: 'missed',
    },
    {
      id: '6',
      timestamp: new Date('2026-02-05T14:00:00'),
      type: 'interaction',
      title: 'Video Call Made',
      description: 'Video call with Michael Johnson (Son) - 15 minutes',
      status: 'completed',
    },
    {
      id: '7',
      timestamp: new Date('2026-02-05T15:30:00'),
      type: 'task',
      title: 'Music Therapy Session',
      description: 'Listened to Classical Comfort playlist',
      status: 'completed',
    },
    {
      id: '8',
      timestamp: new Date('2026-02-05T17:00:00'),
      type: 'medication',
      title: 'Evening Medication Taken',
      description: 'Pain relief medication taken',
      status: 'completed',
    },
  ]);

  const filteredLogs = logs.filter((log) => {
    if (filterType !== 'all' && log.type !== filterType) return false;
    // In real app, would filter by date range too
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return '💊';
      case 'task':
        return '✓';
      case 'interaction':
        return '👥';
      case 'recognition':
        return '👤';
      case 'mood':
        return '😊';
      case 'system':
        return '⚙️';
      default:
        return '📝';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 text-white">Completed</Badge>;
      case 'missed':
        return <Badge className="bg-red-500 text-white">Missed</Badge>;
      case 'info':
        return <Badge variant="outline">Info</Badge>;
      default:
        return null;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <BookOpen className="w-12 h-12 text-primary" />
        <h2 className="text-4xl">Activity Logs</h2>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-6 h-6" />
            <span className="text-xl">Filter by:</span>
          </div>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-64 text-lg h-12">
              <SelectValue placeholder="All Activities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-lg">All Activities</SelectItem>
              <SelectItem value="medication" className="text-lg">Medications</SelectItem>
              <SelectItem value="task" className="text-lg">Tasks</SelectItem>
              <SelectItem value="interaction" className="text-lg">Interactions</SelectItem>
              <SelectItem value="recognition" className="text-lg">Recognition</SelectItem>
              <SelectItem value="mood" className="text-lg">Mood Logs</SelectItem>
              <SelectItem value="system" className="text-lg">System</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterDate} onValueChange={setFilterDate}>
            <SelectTrigger className="w-64 text-lg h-12">
              <SelectValue placeholder="Today" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today" className="text-lg">Today</SelectItem>
              <SelectItem value="yesterday" className="text-lg">Yesterday</SelectItem>
              <SelectItem value="week" className="text-lg">Last 7 Days</SelectItem>
              <SelectItem value="month" className="text-lg">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              setFilterType('all');
              setFilterDate('today');
            }}
            className="text-lg"
          >
            Reset Filters
          </Button>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 space-y-2">
          <p className="text-lg text-muted-foreground">Total Activities</p>
          <p className="text-4xl text-primary">{filteredLogs.length}</p>
        </Card>
        <Card className="p-6 space-y-2">
          <p className="text-lg text-muted-foreground">Completed</p>
          <p className="text-4xl text-green-500">
            {filteredLogs.filter((l) => l.status === 'completed').length}
          </p>
        </Card>
        <Card className="p-6 space-y-2">
          <p className="text-lg text-muted-foreground">Missed</p>
          <p className="text-4xl text-red-500">
            {filteredLogs.filter((l) => l.status === 'missed').length}
          </p>
        </Card>
        <Card className="p-6 space-y-2">
          <p className="text-lg text-muted-foreground">Info Events</p>
          <p className="text-4xl">
            {filteredLogs.filter((l) => l.status === 'info').length}
          </p>
        </Card>
      </div>

      {/* Activity Timeline */}
      <Card className="p-8">
        <h3 className="text-2xl mb-6 flex items-center gap-3">
          <Calendar className="w-8 h-8" />
          {formatDate(new Date())}
        </h3>

        <div className="space-y-4">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl">No activities found for the selected filters</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <Card key={log.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{getTypeIcon(log.type)}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <h4 className="text-xl">{log.title}</h4>
                        <p className="text-lg text-muted-foreground">{log.description}</p>
                      </div>
                      {getStatusBadge(log.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(log.timestamp)}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="capitalize">{log.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>

      {/* Export Options */}
      <Card className="p-8 bg-accent/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-2xl mb-2">Export Activity Report</h3>
            <p className="text-lg text-muted-foreground">
              Download a detailed report of patient activities
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" size="lg" className="text-lg px-6 py-6">
              Export as PDF
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-6 py-6">
              Export as CSV
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          (Export feature - demo only)
        </p>
      </Card>
    </div>
  );
}