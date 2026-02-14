import { useState, useEffect, useMemo } from 'react';
import { FileText, Download, Calendar, TrendingUp, Heart, Pill, Music, Phone, Clock, AlertCircle, CheckCircle, Database } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { loadSampleData } from '../utils/sampleDataGenerator';

interface ActivityLogEntry {
  id: string;
  timestamp: Date;
  type: string;
  action: string;
  details?: string;
  mood?: string;
}

type TimeRange = '7days' | '14days' | '30days' | 'all';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function PatientReportGenerator() {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('7days');
  const [patientName, setPatientName] = useState('Patient');

  useEffect(() => {
    // Load activity logs
    const stored = localStorage.getItem('dementia-care-activity-log');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const formatted = parsed.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }));
        setActivities(formatted);
      } catch (e) {
        console.error('Failed to load activity logs:', e);
      }
    }

    // Load patient name from settings
    const settings = localStorage.getItem('dementia-care-settings');
    if (settings) {
      try {
        const parsed = JSON.parse(settings);
        if (parsed.patientName) {
          setPatientName(parsed.patientName);
        }
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }, []);

  // Filter activities by time range
  const filteredActivities = useMemo(() => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeRange) {
      case '7days':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '14days':
        cutoffDate.setDate(now.getDate() - 14);
        break;
      case '30days':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case 'all':
        cutoffDate.setFullYear(2000);
        break;
    }

    return activities.filter(activity => activity.timestamp >= cutoffDate);
  }, [activities, timeRange]);

  // Helper function to get days count based on time range
  const getDaysCount = () => {
    switch (timeRange) {
      case '7days': return 7;
      case '14days': return 14;
      case '30days': return 30;
      case 'all': return Math.max(1, Math.ceil((Date.now() - (filteredActivities[0]?.timestamp?.getTime() || Date.now())) / (1000 * 60 * 60 * 24)));
    }
  };

  // Generate statistics
  const stats = useMemo(() => {
    const medicationCount = filteredActivities.filter(a => a.type === 'medication').length;
    const musicCount = filteredActivities.filter(a => a.type === 'music').length;
    const callCount = filteredActivities.filter(a => a.type === 'call').length;
    const moodCount = filteredActivities.filter(a => a.type === 'mood').length;
    
    const moodEntries = filteredActivities.filter(a => a.mood);
    const moods = moodEntries.map(a => a.mood);

    const daysCount = (() => {
      switch (timeRange) {
        case '7days': return 7;
        case '14days': return 14;
        case '30days': return 30;
        case 'all': return Math.max(1, Math.ceil((Date.now() - (filteredActivities[0]?.timestamp?.getTime() || Date.now())) / (1000 * 60 * 60 * 24)));
      }
    })();
    
    return {
      totalActivities: filteredActivities.length,
      medicationCount,
      musicCount,
      callCount,
      moodCount,
      moods,
      avgActivitiesPerDay: (filteredActivities.length / daysCount).toFixed(1),
    };
  }, [filteredActivities, timeRange]);

  // Activity breakdown by type
  const activityBreakdown = useMemo(() => {
    const breakdown: { [key: string]: number } = {};
    filteredActivities.forEach(activity => {
      breakdown[activity.type] = (breakdown[activity.type] || 0) + 1;
    });
    
    return Object.entries(breakdown).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [filteredActivities]);

  // Daily activity trend
  const dailyTrend = useMemo(() => {
    const dailyData: { [key: string]: number } = {};
    
    filteredActivities.forEach(activity => {
      const date = activity.timestamp.toLocaleDateString();
      dailyData[date] = (dailyData[date] || 0) + 1;
    });

    return Object.entries(dailyData)
      .map(([date, count]) => ({ date, activities: count }))
      .slice(-14); // Last 14 days
  }, [filteredActivities]);

  // Mood distribution
  const moodDistribution = useMemo(() => {
    const moodCounts: { [key: string]: number } = {};
    
    filteredActivities.forEach(activity => {
      if (activity.mood) {
        moodCounts[activity.mood] = (moodCounts[activity.mood] || 0) + 1;
      }
    });

    return Object.entries(moodCounts).map(([mood, count]) => ({
      mood,
      count,
    }));
  }, [filteredActivities]);

  // Hourly activity pattern
  const hourlyPattern = useMemo(() => {
    const hourlyData: { [key: number]: number } = {};
    
    for (let i = 0; i < 24; i++) {
      hourlyData[i] = 0;
    }

    filteredActivities.forEach(activity => {
      const hour = activity.timestamp.getHours();
      hourlyData[hour]++;
    });

    return Object.entries(hourlyData).map(([hour, count]) => ({
      hour: `${hour}:00`,
      activities: count,
    }));
  }, [filteredActivities]);

  // Medication adherence
  const medicationAdherence = useMemo(() => {
    const medicationActivities = filteredActivities.filter(a => a.type === 'medication');
    const totalExpected = getDaysCount() * 3; // Assuming 3 medications per day
    const adherenceRate = ((medicationActivities.length / totalExpected) * 100).toFixed(1);
    
    return {
      taken: medicationActivities.length,
      expected: totalExpected,
      rate: adherenceRate,
    };
  }, [filteredActivities, timeRange]);

  // Generate insights
  const insights = useMemo(() => {
    const insightsList: { type: 'positive' | 'warning' | 'info'; message: string }[] = [];

    // Medication adherence insight
    if (parseFloat(medicationAdherence.rate) >= 90) {
      insightsList.push({
        type: 'positive',
        message: `Excellent medication adherence at ${medicationAdherence.rate}%! Patient is consistently taking medications.`,
      });
    } else if (parseFloat(medicationAdherence.rate) < 70) {
      insightsList.push({
        type: 'warning',
        message: `Low medication adherence at ${medicationAdherence.rate}%. Consider setting more reminders or investigating barriers.`,
      });
    }

    // Activity level insight
    if (stats.totalActivities < getDaysCount() * 2) {
      insightsList.push({
        type: 'warning',
        message: 'Low overall activity level detected. Patient may need more engagement and stimulation.',
      });
    } else if (stats.totalActivities > getDaysCount() * 10) {
      insightsList.push({
        type: 'positive',
        message: 'High engagement level! Patient is actively using the system features.',
      });
    }

    // Mood insight
    const happyMoods = moodDistribution.filter(m => ['great', 'good', 'happy'].includes(m.mood.toLowerCase()));
    const sadMoods = moodDistribution.filter(m => ['sad', 'anxious', 'confused'].includes(m.mood.toLowerCase()));
    
    const happyCount = happyMoods.reduce((sum, m) => sum + m.count, 0);
    const sadCount = sadMoods.reduce((sum, m) => sum + m.count, 0);
    
    if (happyCount > sadCount * 2) {
      insightsList.push({
        type: 'positive',
        message: 'Predominantly positive mood patterns observed. Patient appears to be in good spirits.',
      });
    } else if (sadCount > happyCount) {
      insightsList.push({
        type: 'warning',
        message: 'More negative mood entries than positive. Consider discussing emotional support options.',
      });
    }

    // Music therapy insight
    if (stats.musicCount > getDaysCount() * 0.5) {
      insightsList.push({
        type: 'positive',
        message: 'Regular music therapy engagement. This is beneficial for memory and mood.',
      });
    }

    // Social connection insight
    if (stats.callCount < getDaysCount() * 0.3) {
      insightsList.push({
        type: 'info',
        message: 'Limited video call usage. Consider encouraging more social connections with family.',
      });
    }

    return insightsList;
  }, [stats, medicationAdherence, moodDistribution, getDaysCount]);

  const handleExportReport = () => {
    const reportContent = `
DEMENTIA CARE PATIENT REPORT
Generated: ${new Date().toLocaleString()}
Patient: ${patientName}
Period: ${timeRange === '7days' ? 'Last 7 Days' : timeRange === '14days' ? 'Last 14 Days' : timeRange === '30days' ? 'Last 30 Days' : 'All Time'}

=== SUMMARY ===
Total Activities: ${stats.totalActivities}
Average Activities/Day: ${stats.avgActivitiesPerDay}

=== ACTIVITY BREAKDOWN ===
Medication Events: ${stats.medicationCount}
Music Therapy Sessions: ${stats.musicCount}
Video Calls: ${stats.callCount}
Mood Entries: ${stats.moodCount}

=== MEDICATION ADHERENCE ===
Medications Taken: ${medicationAdherence.taken}
Expected: ${medicationAdherence.expected}
Adherence Rate: ${medicationAdherence.rate}%

=== MOOD PATTERNS ===
${moodDistribution.map(m => `${m.mood}: ${m.count} entries`).join('\n')}

=== KEY INSIGHTS ===
${insights.map((insight, i) => `${i + 1}. ${insight.message}`).join('\n')}

=== RECOMMENDATIONS ===
- Continue monitoring medication adherence patterns
- Encourage regular social interactions
- Maintain consistent daily routines
- Track mood patterns for healthcare provider discussions
- Consider adjusting reminder schedules based on activity patterns

---
This report is generated automatically from system activity logs.
Please consult with healthcare professionals for medical decisions.
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `patient-report-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleLoadSampleData = () => {
    const sampleData = loadSampleData();
    const formatted = sampleData.map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp)
    }));
    setActivities(formatted);
  };

  return (
    <div className="space-y-8 print:space-y-6">
      {/* No Data Message */}
      {activities.length === 0 && (
        <Card className="p-8 bg-blue-50 border-2 border-blue-300">
          <div className="flex flex-col items-center text-center gap-4">
            <Database className="w-16 h-16 text-blue-600" />
            <div>
              <h3 className="text-2xl mb-2">No Activity Data Available</h3>
              <p className="text-lg text-muted-foreground mb-4">
                There are no activity logs to generate a report. The system will automatically start tracking activities once the patient begins using the application.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                For testing purposes, you can load sample data to see how the report looks.
              </p>
            </div>
            <Button size="lg" onClick={handleLoadSampleData} className="text-xl px-8 py-6">
              <Database className="w-6 h-6 mr-2" />
              Load Sample Data (Demo)
            </Button>
          </div>
        </Card>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 print:flex-col print:items-start">
        <div className="flex items-center gap-4">
          <FileText className="w-12 h-12 text-primary print:w-8 print:h-8" />
          <div>
            <h2 className="text-4xl print:text-2xl">Patient Report</h2>
            <p className="text-xl text-muted-foreground print:text-sm">
              Generated {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="flex gap-3 print:hidden">
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
            <SelectTrigger className="w-48 text-lg py-6">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days" className="text-lg">Last 7 Days</SelectItem>
              <SelectItem value="14days" className="text-lg">Last 14 Days</SelectItem>
              <SelectItem value="30days" className="text-lg">Last 30 Days</SelectItem>
              <SelectItem value="all" className="text-lg">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Button size="lg" variant="outline" onClick={handlePrintReport} className="text-lg px-6 py-6">
            <FileText className="w-5 h-5 mr-2" />
            Print
          </Button>

          <Button size="lg" onClick={handleExportReport} className="text-lg px-6 py-6">
            <Download className="w-5 h-5 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-blue-50">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <p className="text-lg text-muted-foreground">Total Activities</p>
          </div>
          <p className="text-5xl text-blue-600">{stats.totalActivities}</p>
          <p className="text-sm text-muted-foreground mt-1">{stats.avgActivitiesPerDay} per day</p>
        </Card>

        <Card className="p-6 bg-green-50">
          <div className="flex items-center gap-3 mb-2">
            <Pill className="w-8 h-8 text-green-600" />
            <p className="text-lg text-muted-foreground">Medication</p>
          </div>
          <p className="text-5xl text-green-600">{medicationAdherence.rate}%</p>
          <p className="text-sm text-muted-foreground mt-1">Adherence rate</p>
        </Card>

        <Card className="p-6 bg-purple-50">
          <div className="flex items-center gap-3 mb-2">
            <Music className="w-8 h-8 text-purple-600" />
            <p className="text-lg text-muted-foreground">Music Sessions</p>
          </div>
          <p className="text-5xl text-purple-600">{stats.musicCount}</p>
          <p className="text-sm text-muted-foreground mt-1">Therapy sessions</p>
        </Card>

        <Card className="p-6 bg-rose-50">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-rose-600" />
            <p className="text-lg text-muted-foreground">Mood Entries</p>
          </div>
          <p className="text-5xl text-rose-600">{stats.moodCount}</p>
          <p className="text-sm text-muted-foreground mt-1">Tracked moods</p>
        </Card>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <Card className="p-6 bg-amber-50 border-2 border-amber-200">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-amber-600" />
            <h3 className="text-2xl">Key Insights & Recommendations</h3>
          </div>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg">
                {insight.type === 'positive' && <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />}
                {insight.type === 'warning' && <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />}
                {insight.type === 'info' && <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />}
                <p className="text-lg">{insight.message}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Breakdown */}
        <Card className="p-6">
          <h3 className="text-2xl mb-4">Activity Breakdown</h3>
          {activityBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={activityBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {activityBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No activity data available
            </div>
          )}
        </Card>

        {/* Mood Distribution */}
        <Card className="p-6">
          <h3 className="text-2xl mb-4">Mood Distribution</h3>
          {moodDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={moodDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mood" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ec4899" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No mood data available
            </div>
          )}
        </Card>

        {/* Daily Activity Trend */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-2xl mb-4">Daily Activity Trend</h3>
          {dailyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="activities" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No activity trend data available
            </div>
          )}
        </Card>

        {/* Hourly Pattern */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-2xl mb-4">Activity Pattern by Hour</h3>
          {hourlyPattern.some(h => h.activities > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyPattern}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="activities" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No hourly pattern data available
            </div>
          )}
        </Card>
      </div>

      {/* Medication Details */}
      <Card className="p-6">
        <h3 className="text-2xl mb-4">Medication Adherence Detail</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div>
              <p className="text-lg text-muted-foreground">Medications Taken</p>
              <p className="text-3xl text-green-600">{medicationAdherence.taken}</p>
            </div>
            <div>
              <p className="text-lg text-muted-foreground">Expected</p>
              <p className="text-3xl">{medicationAdherence.expected}</p>
            </div>
            <div>
              <p className="text-lg text-muted-foreground">Adherence Rate</p>
              <p className="text-3xl text-green-600">{medicationAdherence.rate}%</p>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-6">
            <div 
              className="bg-green-600 h-6 rounded-full transition-all duration-500"
              style={{ width: `${medicationAdherence.rate}%` }}
            ></div>
          </div>

          <p className="text-lg text-muted-foreground italic">
            {parseFloat(medicationAdherence.rate) >= 90 
              ? '✅ Excellent adherence! Patient is taking medications consistently.'
              : parseFloat(medicationAdherence.rate) >= 70
              ? '⚠️ Good adherence, but there\'s room for improvement.'
              : '❗ Low adherence detected. Please review medication schedule and barriers.'}
          </p>
        </div>
      </Card>

      {/* Footer Note */}
      <Card className="p-6 bg-gray-50">
        <p className="text-lg text-muted-foreground">
          <strong>Note:</strong> This report is generated automatically from system activity logs. 
          Please consult with healthcare professionals for medical decisions and treatment planning. 
          Use this data as supplementary information for comprehensive patient care.
        </p>
      </Card>
    </div>
  );
}