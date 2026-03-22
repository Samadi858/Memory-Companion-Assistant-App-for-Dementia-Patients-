import { useEffect, useState } from 'react';
import { ArrowLeft, Lock, Bell, BookOpen, Key, Heart, FileText, UserCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { ScheduleManager } from './ScheduleManager';
import { ActivityLogViewer } from './ActivityLogViewer';
import { SystemSettingsManager } from './SystemSettingsManager';
import { PhotoDatabaseManager } from './PhotoDatabaseManager';
import { PatientReportGenerator } from './PatientReportGenerator';
import { MoodHistoryLog } from './MoodHistoryLog';
import { useLanguage } from '../contexts/LanguageContext';
import { authService } from '../services/authService';

interface CaregiverSettingsProps {
  onNavigate: (screen: string) => void;
}

export function CaregiverSettings({ onNavigate }: CaregiverSettingsProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [caregiverName, setCaregiverName] = useState('');

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [showScheduleManager, setShowScheduleManager] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [showSystemSettings, setShowSystemSettings] = useState(false);
  const [showPhotoDatabase, setShowPhotoDatabase] = useState(false);
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [showMoodHistory, setShowMoodHistory] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);

  const [registrationData, setRegistrationData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { t } = useLanguage();

  useEffect(() => {
    const initializeAuth = async () => {
      if (!authService.isAuthenticated()) {
        setIsAuthLoading(false);
        return;
      }

      const localUser = authService.getUser();
      if (localUser) {
        setCaregiverName(localUser.full_name);
      }

      try {
        const user = await authService.me();
        setCaregiverName(user.full_name);
        setIsAuthenticated(true);
      } catch {
        await authService.logout();
        setIsAuthenticated(false);
      } finally {
        setIsAuthLoading(false);
      }
    };

    void initializeAuth();
  }, []);

  const handleLogin = async () => {
    setAuthError('');
    setAuthSuccess('');

    if (!loginData.email || !loginData.password) {
      setAuthError('Please enter both email and password');
      return;
    }

    try {
      const result = await authService.login(loginData);
      setCaregiverName(result.user.full_name);
      setIsAuthenticated(true);
      setAuthSuccess('Login successful');
      setLoginData({ email: '', password: '' });
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const handleRegistration = async () => {
    setAuthError('');
    setAuthSuccess('');

    if (
      !registrationData.fullName ||
      !registrationData.email ||
      !registrationData.password ||
      !registrationData.confirmPassword
    ) {
      setAuthError('Please fill in all fields');
      return;
    }

    try {
      const result = await authService.register(registrationData);
      setCaregiverName(result.user.full_name);
      setShowRegistration(false);
      setIsAuthenticated(true);
      setAuthSuccess('Registration successful');
      setRegistrationData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setCaregiverName('');
    setLoginData({ email: '', password: '' });
    setAuthError('');
    setAuthSuccess('');
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <Card className="p-8">
          <p className="text-2xl">Loading caregiver access...</p>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background p-3 sm:p-6 flex flex-col">
        <Button
          variant="outline"
          size="lg"
          onClick={() => onNavigate('patient')}
          className="text-sm sm:text-lg lg:text-xl px-3 sm:px-5 lg:px-6 py-3 sm:py-5 lg:py-6 self-start mb-4 sm:mb-8"
        >
          <ArrowLeft className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2" />
          {t('caregiver.back')}
        </Button>

        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-2xl w-full p-4 sm:p-8 lg:p-12 space-y-5 sm:space-y-8">
            <div className="flex flex-col items-center gap-4">
              <Lock className="w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 text-primary" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl text-center">{t('caregiver.secureAccess')}</h1>
              <p className="text-base sm:text-xl lg:text-2xl text-center text-muted-foreground">{t('caregiver.loginPrompt')}</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-base sm:text-xl lg:text-2xl">Email</label>
                <Input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="text-base sm:text-xl lg:text-2xl px-3 sm:px-5 lg:px-6 py-3 sm:py-5 lg:py-6 h-auto"
                  placeholder="caregiver@example.com"
                />
              </div>

              <div className="space-y-3">
                <label className="text-base sm:text-xl lg:text-2xl">{t('caregiver.password')}</label>
                <Input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && void handleLogin()}
                  className="text-base sm:text-xl lg:text-2xl px-3 sm:px-5 lg:px-6 py-3 sm:py-5 lg:py-6 h-auto"
                  placeholder="Password"
                />
              </div>

              {authError && <p className="text-red-500 text-sm sm:text-lg lg:text-xl text-center">{authError}</p>}
              {authSuccess && <p className="text-green-600 text-sm sm:text-lg lg:text-xl text-center">{authSuccess}</p>}

              <Button
                size="lg"
                onClick={() => void handleLogin()}
                className="w-full text-base sm:text-xl lg:text-2xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8"
              >
                <Key className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mr-3" />
                Enter Settings
              </Button>

              <div className="pt-4 border-t border-border">
                <p className="text-sm sm:text-lg lg:text-xl text-center text-muted-foreground">
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => {
                      setAuthError('');
                      setAuthSuccess('');
                      setShowRegistration(true);
                    }}
                    className="text-primary hover:underline font-semibold"
                  >
                    Register here
                  </button>
                </p>
              </div>
            </div>
          </Card>
        </div>

        {showRegistration && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full p-4 sm:p-8 lg:p-12 space-y-5 sm:space-y-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl text-center">Register</h1>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-base sm:text-xl lg:text-2xl">Name</label>
                  <Input
                    type="text"
                    value={registrationData.fullName}
                    onChange={(e) => setRegistrationData({ ...registrationData, fullName: e.target.value })}
                    className="text-base sm:text-xl lg:text-2xl px-3 sm:px-5 lg:px-6 py-3 sm:py-5 lg:py-6 h-auto"
                    placeholder="Full name"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-base sm:text-xl lg:text-2xl">Email</label>
                  <Input
                    type="email"
                    value={registrationData.email}
                    onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                    className="text-base sm:text-xl lg:text-2xl px-3 sm:px-5 lg:px-6 py-3 sm:py-5 lg:py-6 h-auto"
                    placeholder="Email"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-base sm:text-xl lg:text-2xl">Password</label>
                  <Input
                    type="password"
                    value={registrationData.password}
                    onChange={(e) => setRegistrationData({ ...registrationData, password: e.target.value })}
                    className="text-base sm:text-xl lg:text-2xl px-3 sm:px-5 lg:px-6 py-3 sm:py-5 lg:py-6 h-auto"
                    placeholder="Password"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-base sm:text-xl lg:text-2xl">Confirm Password</label>
                  <Input
                    type="password"
                    value={registrationData.confirmPassword}
                    onChange={(e) =>
                      setRegistrationData({ ...registrationData, confirmPassword: e.target.value })
                    }
                    className="text-base sm:text-xl lg:text-2xl px-3 sm:px-5 lg:px-6 py-3 sm:py-5 lg:py-6 h-auto"
                    placeholder="Confirm Password"
                  />
                </div>

                {authError && <p className="text-red-500 text-sm sm:text-lg lg:text-xl text-center">{authError}</p>}

                <Button
                  size="lg"
                  onClick={() => void handleRegistration()}
                  className="w-full text-base sm:text-xl lg:text-2xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8"
                >
                  Register
                </Button>

                <p className="text-sm sm:text-lg lg:text-xl text-center text-muted-foreground italic">
                  Already have an account?{' '}
                  <button
                    onClick={() => {
                      setShowRegistration(false);
                      setAuthError('');
                      setAuthSuccess('');
                    }}
                    className="text-primary hover:underline font-semibold"
                  >
                    Login here
                  </button>
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Topbar */}
      <div className="sticky top-0 z-10 bg-background border-b border-border shadow-sm px-3 sm:px-6 py-3 sm:py-4">
        <div className="max-w-5xl w-full mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => onNavigate('patient')}
            className="text-xs sm:text-base lg:text-lg px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-5 shrink-0"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Back</span>
            <span className="hidden sm:inline"> to Patient View</span>
          </Button>

          <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 min-w-0">
            <div className="flex items-center gap-1 sm:gap-2 rounded-md border border-border px-2 sm:px-3 py-1.5 sm:py-2 min-w-0 max-w-[140px] sm:max-w-none">
              <UserCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="text-xs sm:text-sm lg:text-base truncate">{caregiverName || 'Caregiver'}</span>
            </div>
            <Button variant="outline" size="lg" onClick={() => void handleLogout()} className="text-xs sm:text-base lg:text-lg px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-5 shrink-0">
              <Lock className="w-3.5 h-3.5 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Exit</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
        <h1 className="text-xl sm:text-3xl lg:text-5xl">Family Member/ Guadian Dashboard</h1>

        {showScheduleManager ? (
          <div className="space-y-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowScheduleManager(false)}
              className="text-sm sm:text-lg lg:text-xl px-3 sm:px-5 lg:px-6 py-3 sm:py-5 lg:py-6"
            >
              <ArrowLeft className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2" />
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
              className="text-sm sm:text-lg lg:text-xl px-3 sm:px-5 lg:px-6 py-3 sm:py-5 lg:py-6"
            >
              <ArrowLeft className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2" />
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
              className="text-sm sm:text-lg lg:text-xl px-3 sm:px-5 lg:px-6 py-3 sm:py-5 lg:py-6"
            >
              <ArrowLeft className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2" />
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
              className="text-sm sm:text-lg lg:text-xl px-3 sm:px-5 lg:px-6 py-3 sm:py-5 lg:py-6"
            >
              <ArrowLeft className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2" />
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
              className="text-sm sm:text-lg lg:text-xl px-3 sm:px-5 lg:px-6 py-3 sm:py-5 lg:py-6"
            >
              <ArrowLeft className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2" />
              Back to Dashboard
            </Button>
            <PatientReportGenerator />
          </div>
        ) : showMoodHistory ? (
          <div className="space-y-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowMoodHistory(false)}
              className="text-sm sm:text-lg lg:text-xl px-3 sm:px-5 lg:px-6 py-3 sm:py-5 lg:py-6"
            >
              <ArrowLeft className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2" />
              Back to Dashboard
            </Button>
            <MoodHistoryLog />
          </div>
        ) : (
          <>
            {/* Dashboard Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Manage Reminders */}
              <Card className="p-4 sm:p-6 lg:p-8 hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => setShowScheduleManager(true)}>
                <div className="flex flex-col h-full gap-3 sm:gap-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Bell className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-primary" />
                    </div>
                    <h2 className="text-base sm:text-xl lg:text-2xl font-semibold">Manage Reminders</h2>
                  </div>
                  <p className="text-sm sm:text-base lg:text-lg text-muted-foreground flex-1">
                    Set up medication times, meals, and daily routines
                  </p>
                  <Button size="sm" className="text-xs sm:text-sm lg:text-base w-full sm:w-auto mt-auto" onClick={(e) => { e.stopPropagation(); setShowScheduleManager(true); }}>
                    Edit Reminders
                  </Button>
                </div>
              </Card>

              {/* Activity Logs */}
              <Card className="p-4 sm:p-6 lg:p-8 hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => setShowActivityLog(true)}>
                <div className="flex flex-col h-full gap-3 sm:gap-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-primary" />
                    </div>
                    <h2 className="text-base sm:text-xl lg:text-2xl font-semibold">Activity Logs</h2>
                  </div>
                  <p className="text-sm sm:text-base lg:text-lg text-muted-foreground flex-1">
                    Review patient&apos;s daily activities and system usage
                  </p>
                  <Button size="sm" className="text-xs sm:text-sm lg:text-base w-full sm:w-auto mt-auto" onClick={(e) => { e.stopPropagation(); setShowActivityLog(true); }}>
                    View Full Logs
                  </Button>
                </div>
              </Card>

              {/* System Settings */}
              <Card className="p-4 sm:p-6 lg:p-8 hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => setShowSystemSettings(true)}>
                <div className="flex flex-col h-full gap-3 sm:gap-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Lock className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-primary" />
                    </div>
                    <h2 className="text-base sm:text-xl lg:text-2xl font-semibold">System Settings</h2>
                  </div>
                  <p className="text-sm sm:text-base lg:text-lg text-muted-foreground flex-1">
                    Configure display preferences, notifications, and security
                  </p>
                  <Button size="sm" className="text-xs sm:text-sm lg:text-base w-full sm:w-auto mt-auto" onClick={(e) => { e.stopPropagation(); setShowSystemSettings(true); }}>
                    Open Settings
                  </Button>
                </div>
              </Card>

              {/* Photo Database */}
              <Card className="p-4 sm:p-6 lg:p-8 hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => setShowPhotoDatabase(true)}>
                <div className="flex flex-col h-full gap-3 sm:gap-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-3 rounded-xl bg-rose-100 group-hover:bg-rose-200 transition-colors">
                      <Heart className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-rose-500" />
                    </div>
                    <h2 className="text-base sm:text-xl lg:text-2xl font-semibold">Photo Database</h2>
                  </div>
                  <p className="text-sm sm:text-base lg:text-lg text-muted-foreground flex-1">
                    Manage family photos and memories for the patient
                  </p>
                  <Button size="sm" variant="outline" className="text-xs sm:text-sm lg:text-base w-full sm:w-auto mt-auto" onClick={(e) => { e.stopPropagation(); setShowPhotoDatabase(true); }}>
                    Manage Photos
                  </Button>
                </div>
              </Card>

              {/* Patient Report Generator */}
              <Card className="p-4 sm:p-6 lg:p-8 hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => setShowReportGenerator(true)}>
                <div className="flex flex-col h-full gap-3 sm:gap-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-3 rounded-xl bg-blue-100 group-hover:bg-blue-200 transition-colors">
                      <FileText className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-blue-600" />
                    </div>
                    <h2 className="text-base sm:text-xl lg:text-2xl font-semibold">Patient Report</h2>
                  </div>
                  <p className="text-sm sm:text-base lg:text-lg text-muted-foreground flex-1">
                    Generate comprehensive reports on patient activities
                  </p>
                  <Button size="sm" variant="outline" className="text-xs sm:text-sm lg:text-base w-full sm:w-auto mt-auto" onClick={(e) => { e.stopPropagation(); setShowReportGenerator(true); }}>
                    Generate Report
                  </Button>
                </div>
              </Card>

              {/* Mood History */}
              <Card className="p-4 sm:p-6 lg:p-8 hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => setShowMoodHistory(true)}>
                <div className="flex flex-col h-full gap-3 sm:gap-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-3 rounded-xl bg-purple-100 group-hover:bg-purple-200 transition-colors">
                      <Heart className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-purple-500" />
                    </div>
                    <h2 className="text-base sm:text-xl lg:text-2xl font-semibold">Mood History</h2>
                  </div>
                  <p className="text-sm sm:text-base lg:text-lg text-muted-foreground flex-1">
                    Review patient mood and diary submissions over time
                  </p>
                  <Button size="sm" variant="outline" className="text-xs sm:text-sm lg:text-base w-full sm:w-auto mt-auto" onClick={(e) => { e.stopPropagation(); setShowMoodHistory(true); }}>
                    View Mood Log
                  </Button>
                </div>
              </Card>
            </div>

            {/* Today's Summary */}
            <Card className="p-4 sm:p-6 lg:p-8 bg-accent/30">
              <h2 className="text-base sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-6">Today&apos;s Summary</h2>
              <div className="grid grid-cols-3 gap-3 sm:gap-6">
                <div className="space-y-1 sm:space-y-2 text-center sm:text-left">
                  <p className="text-xs sm:text-base lg:text-lg text-muted-foreground">Reminders</p>
                  <p className="text-xl sm:text-3xl lg:text-4xl text-primary font-semibold">6</p>
                </div>
                <div className="space-y-1 sm:space-y-2 text-center sm:text-left">
                  <p className="text-xs sm:text-base lg:text-lg text-muted-foreground">Activities</p>
                  <p className="text-xl sm:text-3xl lg:text-4xl text-primary font-semibold">8</p>
                </div>
                <div className="space-y-1 sm:space-y-2 text-center sm:text-left">
                  <p className="text-xs sm:text-base lg:text-lg text-muted-foreground">Mood Entries</p>
                  <p className="text-xl sm:text-3xl lg:text-4xl text-primary font-semibold">2</p>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
