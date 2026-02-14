import { ArrowLeft, Lock, Bell, BookOpen, Key, Heart, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { useState } from 'react';
import { ScheduleManager } from './ScheduleManager';
import { ActivityLogViewer } from './ActivityLogViewer';
import { SystemSettingsManager } from './SystemSettingsManager';
import { PhotoDatabaseManager } from './PhotoDatabaseManager';
import { PatientReportGenerator } from './PatientReportGenerator';

interface CaregiverSettingsProps {
  onNavigate: (screen: string) => void;
}

export function CaregiverSettings({ onNavigate }: CaregiverSettingsProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showScheduleManager, setShowScheduleManager] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [showSystemSettings, setShowSystemSettings] = useState(false);
  const [showPhotoDatabase, setShowPhotoDatabase] = useState(false);
  const [showReportGenerator, setShowReportGenerator] = useState(false);

  const handleLogin = () => {
    // Simple mock authentication (password: "caregiver")
    if (password === 'caregiver') {
      setIsAuthenticated(true);
    } else {
      setPassword('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background p-6 flex flex-col">
        <Button
          variant="outline"
          size="lg"
          onClick={() => onNavigate('patient')}
          className="text-xl px-6 py-6 self-start mb-8"
        >
          <ArrowLeft className="w-8 h-8 mr-2" />
          Back to Patient View
        </Button>

        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-2xl w-full p-12 space-y-8">
            <div className="flex flex-col items-center gap-4">
              <Lock className="w-24 h-24 text-primary" />
              <h1 className="text-4xl text-center">Caregiver Login</h1>
              <p className="text-2xl text-center text-muted-foreground">
                This area is password protected
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-2xl">Enter Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="text-2xl px-6 py-6 h-auto"
                  placeholder="Password"
                />
              </div>

              <Button
                size="lg"
                onClick={handleLogin}
                className="w-full text-2xl px-8 py-8"
              >
                <Key className="w-8 h-8 mr-3" />
                Enter Settings
              </Button>

              <p className="text-xl text-center text-muted-foreground italic">
                Demo password: "caregiver"
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => onNavigate('patient')}
          className="text-xl px-6 py-6"
        >
          <ArrowLeft className="w-8 h-8 mr-2" />
          Back to Patient View
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            setIsAuthenticated(false);
            setPassword('');
          }}
          className="text-xl px-6 py-6"
        >
          <Lock className="w-8 h-8 mr-2" />
          Logout
        </Button>
      </div>

      <div className="flex-1 max-w-5xl w-full mx-auto space-y-8">
        <h1 className="text-5xl">Caregiver Dashboard</h1>

        {/* Show different views based on state */}
        {showScheduleManager ? (
          <div className="space-y-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowScheduleManager(false)}
              className="text-xl px-6 py-6"
            >
              <ArrowLeft className="w-8 h-8 mr-2" />
              Back to Dashboard
            </Button>
            <ScheduleManager />
          </div>
        ) : showActivityLog ? (
          <div className="space-y-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowActivityLog(false)}
              className="text-xl px-6 py-6"
            >
              <ArrowLeft className="w-8 h-8 mr-2" />
              Back to Dashboard
            </Button>
            <ActivityLogViewer />
          </div>
        ) : showSystemSettings ? (
          <div className="space-y-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowSystemSettings(false)}
              className="text-xl px-6 py-6"
            >
              <ArrowLeft className="w-8 h-8 mr-2" />
              Back to Dashboard
            </Button>
            <SystemSettingsManager />
          </div>
        ) : showPhotoDatabase ? (
          <div className="space-y-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowPhotoDatabase(false)}
              className="text-xl px-6 py-6"
            >
              <ArrowLeft className="w-8 h-8 mr-2" />
              Back to Dashboard
            </Button>
            <PhotoDatabaseManager />
          </div>
        ) : showReportGenerator ? (
          <div className="space-y-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowReportGenerator(false)}
              className="text-xl px-6 py-6"
            >
              <ArrowLeft className="w-8 h-8 mr-2" />
              Back to Dashboard
            </Button>
            <PatientReportGenerator />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Manage Reminders */}
          <Card className="p-8 hover:shadow-lg transition-shadow">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <Bell className="w-16 h-16 text-primary" />
                <h2 className="text-3xl">Manage Reminders</h2>
              </div>
              <p className="text-xl text-muted-foreground">
                Set up medication times, meals, and daily routines
              </p>
              <Button 
                size="lg" 
                className="text-xl px-6 py-6"
                onClick={() => setShowScheduleManager(true)}
              >
                Edit Reminders
              </Button>
            </div>
          </Card>

          {/* View Activity Log */}
          <Card className="p-8 hover:shadow-lg transition-shadow">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <BookOpen className="w-16 h-16 text-primary" />
                <h2 className="text-3xl">Activity Logs</h2>
              </div>
              <p className="text-xl text-muted-foreground">
                Review patient's daily activities and system usage
              </p>
              <Button 
                size="lg" 
                className="text-xl px-6 py-6"
                onClick={() => setShowActivityLog(true)}
              >
                View Full Logs
              </Button>
            </div>
          </Card>

          {/* System Settings */}
          <Card className="p-8 hover:shadow-lg transition-shadow md:col-span-2">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <Lock className="w-16 h-16 text-primary" />
                <h2 className="text-3xl">System Settings</h2>
              </div>
              <p className="text-xl text-muted-foreground">
                Configure display preferences, notifications, and security
              </p>
              <Button 
                size="lg" 
                className="text-xl px-6 py-6 max-w-md"
                onClick={() => setShowSystemSettings(true)}
              >
                Open Settings
              </Button>
            </div>
          </Card>

          {/* Photo Database */}
          <Card className="p-8 hover:shadow-lg transition-shadow md:col-span-2">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <Heart className="w-16 h-16 text-primary" />
                <h2 className="text-3xl">Photo Database</h2>
              </div>
              <p className="text-xl text-muted-foreground">
                Manage family photos and information to help with memory and recognition
              </p>
              <Button 
                size="lg" 
                className="text-xl px-6 py-6 max-w-md"
                onClick={() => setShowPhotoDatabase(true)}
              >
                Manage Photos
              </Button>
            </div>
          </Card>

          {/* Patient Report Generator */}
          <Card className="p-8 hover:shadow-lg transition-shadow md:col-span-2">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <FileText className="w-16 h-16 text-primary" />
                <h2 className="text-3xl">Patient Report Generator</h2>
              </div>
              <p className="text-xl text-muted-foreground">
                Generate comprehensive reports on patient activities and progress
              </p>
              <Button 
                size="lg" 
                className="text-xl px-6 py-6 max-w-md"
                onClick={() => setShowReportGenerator(true)}
              >
                Generate Report
              </Button>
            </div>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card className="p-8 bg-accent/30">
          <h2 className="text-3xl mb-6">Today's Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-xl text-muted-foreground">Reminders Today</p>
              <p className="text-4xl text-primary">6</p>
            </div>
            <div className="space-y-2">
              <p className="text-xl text-muted-foreground">Activities Logged</p>
              <p className="text-4xl text-primary">8</p>
            </div>
            <div className="space-y-2">
              <p className="text-xl text-muted-foreground">Mood Entries</p>
              <p className="text-4xl text-primary">2</p>
            </div>
          </div>
        </Card>
          </>
        )}
      </div>
    </div>
  );
}