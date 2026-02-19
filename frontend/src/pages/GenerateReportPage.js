import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  ReferenceLine,
} from "recharts";
import {
  ArrowLeft,
  LogOut,
  FileText,
  Activity,
  Pill,
  Smile,
  Lightbulb,
  Download,
  CheckCircle,
  AlertTriangle,
  Info,
  Database
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Select, SelectOption } from "../components/ui/Select";
import { loadActivityData, loadSampleData, exportReport } from "../utils/sampleData";

const CHART_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

function GenerateReportPage() {
  const [activities, setActivities] = useState([]);
  const [timeRange, setTimeRange] = useState("7days");
  // Patient name can be loaded from settings if needed

  useEffect(() => {
    const data = loadActivityData();
    setActivities(data);
  }, []);

  const getDays = useCallback(() => {
    switch (timeRange) {
      case "7days": return 7;
      case "14days": return 14;
      case "30days": return 30;
      case "all":
        return Math.max(
          1,
          Math.ceil(
            (Date.now() - (activities[0]?.timestamp?.getTime() || Date.now())) /
              (1000 * 60 * 60 * 24)
          )
        );
      default: return 7;
    }
  }, [timeRange, activities]);

  const filteredActivities = useMemo(() => {
    const now = new Date();
    const start = new Date();
    switch (timeRange) {
      case "7days": start.setDate(now.getDate() - 7); break;
      case "14days": start.setDate(now.getDate() - 14); break;
      case "30days": start.setDate(now.getDate() - 30); break;
      case "all": start.setFullYear(2000); break;
      default: start.setDate(now.getDate() - 7);
    }
    return activities.filter((a) => a.timestamp >= start);
  }, [activities, timeRange]);

  const stats = useMemo(() => {
    const medicationCount = filteredActivities.filter((a) => a.type === "medication").length;
    const callCount = filteredActivities.filter((a) => a.type === "call" || a.type === "emergency").length;
    const moodCount = filteredActivities.filter((a) => a.type === "mood").length;
    const days = getDays();
    return {
      totalActivities: filteredActivities.length,
      medicationCount,
      callCount,
      moodCount,
      avgActivitiesPerDay: (filteredActivities.length / days).toFixed(1),
    };
  }, [filteredActivities, getDays]);

  const activityBreakdown = useMemo(() => {
    const counts = {};
    filteredActivities.forEach((a) => {
      counts[a.type] = (counts[a.type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [filteredActivities]);

  const dailyTrend = useMemo(() => {
    const counts = {};
    filteredActivities.forEach((a) => {
      const date = a.timestamp.toLocaleDateString();
      counts[date] = (counts[date] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([date, activities]) => ({ date, activities }))
      .slice(-14);
  }, [filteredActivities]);

  const moodDistribution = useMemo(() => {
    const counts = {};
    filteredActivities.forEach((a) => {
      if (a.mood) {
        counts[a.mood] = (counts[a.mood] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([mood, count]) => ({ mood, count }));
  }, [filteredActivities]);

  const hourlyPattern = useMemo(() => {
    const counts = {};
    for (let i = 0; i < 24; i++) counts[i] = 0;
    filteredActivities.forEach((a) => {
      const hour = a.timestamp.getHours();
      counts[hour]++;
    });
    return Object.entries(counts).map(([hour, activities]) => ({
      hour: `${hour}:00`,
      activities,
    }));
  }, [filteredActivities]);

  const medication = useMemo(() => {
    const taken = filteredActivities.filter((a) => a.type === "medication").length;
    const expected = getDays() * 3;
    const rate = ((taken / expected) * 100).toFixed(1);
    return { taken, expected, rate };
  }, [filteredActivities, getDays]);

  const insights = useMemo(() => {
    const msgs = [];
    if (parseFloat(medication.rate) >= 90) {
      msgs.push({
        type: "positive",
        message: `Excellent medication adherence at ${medication.rate}%! Patient is consistently taking medications.`,
      });
    } else if (parseFloat(medication.rate) < 70) {
      msgs.push({
        type: "warning",
        message: `Low medication adherence at ${medication.rate}%. Consider setting more reminders or investigating barriers.`,
      });
    }

    if (stats.totalActivities < getDays() * 2) {
      msgs.push({
        type: "warning",
        message: "Low overall activity level detected. Patient may need more engagement and stimulation.",
      });
    } else if (stats.totalActivities > getDays() * 10) {
      msgs.push({
        type: "positive",
        message: "High engagement level! Patient is actively using the system features.",
      });
    }

    const positive = moodDistribution
      .filter((m) => ["great", "good", "happy"].includes(m.mood.toLowerCase()))
      .reduce((s, m) => s + m.count, 0);
    const negative = moodDistribution
      .filter((m) => ["sad", "anxious", "confused"].includes(m.mood.toLowerCase()))
      .reduce((s, m) => s + m.count, 0);

    if (positive > negative * 2) {
      msgs.push({
        type: "positive",
        message: "Predominantly positive mood patterns observed. Patient appears to be in good spirits.",
      });
    } else if (negative > positive) {
      msgs.push({
        type: "warning",
        message: "More negative mood entries than positive. Consider discussing emotional support options.",
      });
    }

    if (stats.callCount < getDays() * 0.2) {
      msgs.push({
        type: "info",
        message: "Limited emergency call usage. Ensure patient knows how to use the emergency feature.",
      });
    }

    return msgs;
  }, [stats, medication, moodDistribution, getDays]);

  const handleExport = () => {
    exportReport({
      ...stats,
      medication,
      moods: moodDistribution,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLoadSample = () => {
    const data = loadSampleData();
    setActivities(data);
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleLogout = () => {
    console.log("Logging out...");
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={handleBack}
          className="text-xl px-6 py-6"
        >
          <ArrowLeft className="w-8 h-8 mr-2" />
          Back to Patient View
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleLogout}
          className="text-xl px-6 py-6"
        >
          <LogOut className="w-8 h-8 mr-2" />
          Logout
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-5xl w-full mx-auto space-y-8">
        <h1 className="text-5xl font-bold">Caregiver Dashboard</h1>

        {/* Back to Dashboard button */}
        <Button
          variant="outline"
          size="lg"
          onClick={handleBack}
          className="text-xl px-6 py-6"
        >
          <ArrowLeft className="w-8 h-8 mr-2" />
          Back to Dashboard
        </Button>

        {/* Report Content */}
        <div className="space-y-8">
          {/* No Data State */}
          {activities.length === 0 && (
            <Card className="p-8 bg-blue-50 border-2 border-blue-300">
              <div className="flex flex-col items-center text-center gap-4">
                <Database className="w-16 h-16 text-blue-600" />
                <div>
                  <h3 className="text-2xl font-semibold mb-2">No Activity Data Available</h3>
                  <p className="text-lg text-muted-foreground mb-4">
                    There are no activity logs to generate a report. The system will automatically
                    start tracking activities once the patient begins using the application.
                  </p>
                  <p className="text-lg text-muted-foreground mb-6">
                    For testing purposes, you can load sample data to see how the report looks.
                  </p>
                </div>
                <Button size="lg" onClick={handleLoadSample} className="text-xl px-8 py-6">
                  <Database className="w-6 h-6 mr-2" />
                  Load Sample Data (Demo)
                </Button>
              </div>
            </Card>
          )}

          {/* Report Header */}
          <div className="flex items-center justify-between flex-wrap gap-4 print:flex-col print:items-start">
            <div className="flex items-center gap-4">
              <FileText className="w-12 h-12 text-primary print:w-8 print:h-8" />
              <div>
                <h2 className="text-4xl font-bold print:text-2xl">Patient Report</h2>
                <p className="text-xl text-muted-foreground print:text-sm">
                  Generated {new Date().toLocaleDateString()} at{" "}
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex gap-3 print:hidden">
              <Select
                value={timeRange}
                onValueChange={(val) => setTimeRange(val)}
                className="w-48 text-lg py-6"
              >
                <SelectOption value="7days">Last 7 Days</SelectOption>
                <SelectOption value="14days">Last 14 Days</SelectOption>
                <SelectOption value="30days">Last 30 Days</SelectOption>
                <SelectOption value="all">All Time</SelectOption>
              </Select>
              <Button
                size="lg"
                variant="outline"
                onClick={handlePrint}
                className="text-lg px-6 py-6"
              >
                <FileText className="w-5 h-5 mr-2" />
                Print
              </Button>
              <Button
                size="lg"
                onClick={handleExport}
                className="text-lg px-6 py-6"
              >
                <Download className="w-5 h-5 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Activities */}
            <Card className="p-6 bg-blue-50">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-8 h-8 text-blue-600" />
                <p className="text-lg text-muted-foreground">Total Activities</p>
              </div>
              <p className="text-5xl font-bold text-blue-600">{stats.totalActivities}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {stats.avgActivitiesPerDay} per day
              </p>
            </Card>

            {/* Medication */}
            <Card className="p-6 bg-green-50">
              <div className="flex items-center gap-3 mb-2">
                <Pill className="w-8 h-8 text-green-600" />
                <p className="text-lg text-muted-foreground">Medication</p>
              </div>
              <p className="text-5xl font-bold text-green-600">{medication.rate}%</p>
              <p className="text-sm text-muted-foreground mt-1">Adherence rate</p>
            </Card>

            {/* Mood Entries */}
            <Card className="p-6 bg-rose-50">
              <div className="flex items-center gap-3 mb-2">
                <Smile className="w-8 h-8 text-rose-600" />
                <p className="text-lg text-muted-foreground">Mood Entries</p>
              </div>
              <p className="text-5xl font-bold text-rose-600">{stats.moodCount}</p>
              <p className="text-sm text-muted-foreground mt-1">Tracked moods</p>
            </Card>
          </div>

          {/* Key Insights */}
          {insights.length > 0 && (
            <Card className="p-6 bg-amber-50 border-2 border-amber-200">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-8 h-8 text-amber-600" />
                <h3 className="text-2xl font-semibold">Key Insights & Recommendations</h3>
              </div>
              <div className="space-y-3">
                {insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 bg-white rounded-lg"
                  >
                    {insight.type === "positive" && (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    )}
                    {insight.type === "warning" && (
                      <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                    )}
                    {insight.type === "info" && (
                      <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    )}
                    <p className="text-lg">{insight.message}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity Breakdown - Pie Chart */}
            <Card className="p-6">
              <h3 className="text-2xl font-semibold mb-4">Activity Breakdown</h3>
              {activityBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={activityBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {activityBreakdown.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
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

            {/* Mood Distribution - Bar Chart */}
            <Card className="p-6">
              <h3 className="text-2xl font-semibold mb-4">Mood Distribution</h3>
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

            {/* Daily Activity Trend - Line Chart (full width) */}
            <Card className="p-6 lg:col-span-2">
              <h3 className="text-2xl font-semibold mb-4">Daily Activity Trend</h3>
              {dailyTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis />
                    <Tooltip />
                    <ReferenceLine />
                    <Line
                      type="monotone"
                      dataKey="activities"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No activity trend data available
                </div>
              )}
            </Card>

            {/* Activity Pattern by Hour - Bar Chart (full width) */}
            <Card className="p-6 lg:col-span-2">
              <h3 className="text-2xl font-semibold mb-4">Activity Pattern by Hour</h3>
              {hourlyPattern.some((h) => h.activities > 0) ? (
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

          {/* Medication Adherence Detail */}
          <Card className="p-6">
            <h3 className="text-2xl font-semibold mb-4">Medication Adherence Detail</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-lg text-muted-foreground">Medications Taken</p>
                  <p className="text-3xl font-bold text-green-600">{medication.taken}</p>
                </div>
                <div>
                  <p className="text-lg text-muted-foreground">Expected</p>
                  <p className="text-3xl font-bold">{medication.expected}</p>
                </div>
                <div>
                  <p className="text-lg text-muted-foreground">Adherence Rate</p>
                  <p className="text-3xl font-bold text-green-600">{medication.rate}%</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div
                  className="bg-green-600 h-6 rounded-full transition-all duration-500"
                  style={{ width: `${medication.rate}%` }}
                />
              </div>
              <p className="text-lg text-muted-foreground italic">
                {parseFloat(medication.rate) >= 90
                  ? "✅ Excellent adherence! Patient is taking medications consistently."
                  : parseFloat(medication.rate) >= 70
                  ? "⚠️ Good adherence, but there's room for improvement."
                  : "❗ Low adherence detected. Please review medication schedule and barriers."}
              </p>
            </div>
          </Card>

          {/* Footer Note */}
          <Card className="p-6 bg-gray-50">
            <p className="text-lg text-muted-foreground">
              <strong>Note:</strong> This report is generated automatically from system activity
              logs. Please consult with healthcare professionals for medical decisions and
              treatment planning. Use this data as supplementary information for comprehensive
              patient care.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default GenerateReportPage;
