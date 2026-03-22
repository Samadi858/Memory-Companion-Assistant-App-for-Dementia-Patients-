import { useState, useEffect } from 'react';
import { User, Sun, Moon, Cloud, Sunrise, Thermometer } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { PhotoMemoryWall } from './PhotoMemoryWall';
import { TodayScheduleWidget } from './TodayScheduleWidget';
import { QuickConnect } from './QuickConnect';
import { MoodTracker } from './MoodTracker';
import { MemoryDiaryWidget } from './MemoryDiaryWidget';
import { useLanguage } from '../contexts/LanguageContext';

interface EnhancedDashboardProps {
  onCaregiverAccess: () => void;
  onNavigateToMemoryDiary: () => void;
}

export function EnhancedDashboard({ onCaregiverAccess, onNavigateToMemoryDiary }: EnhancedDashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTimeOfDayInfo = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return {
      greeting: t('welcome.morning'),
      icon: <Sunrise className="w-12 h-12 text-orange-500" />,
      gradient: 'from-orange-100 via-yellow-50 to-blue-50'
    };
    if (hour < 17) return {
      greeting: t('welcome.afternoon'),
      icon: <Sun className="w-12 h-12 text-yellow-600" />,
      gradient: 'from-blue-100 via-cyan-50 to-yellow-50'
    };
    if (hour < 20) return {
      greeting: t('welcome.evening'),
      icon: <Cloud className="w-12 h-12 text-purple-500" />,
      gradient: 'from-purple-100 via-pink-50 to-orange-50'
    };
    return {
      greeting: t('welcome.night'),
      icon: <Moon className="w-12 h-12 text-indigo-500" />,
      gradient: 'from-indigo-200 via-purple-100 to-blue-100'
    };
  };

  const timeInfo = getTimeOfDayInfo();

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className={`bg-gradient-to-r ${timeInfo.gradient} border-b-4 border-primary/20 shadow-lg py-6 px-6 sticky top-0 z-10 backdrop-blur-sm`}>
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            {timeInfo.icon}
            <div>
              <p className="text-[3.5rem] leading-none bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {formatTime(currentTime)}
              </p>
              <p className="text-[1.5rem] mt-1 text-foreground/70">{formatDate(currentTime)}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <Card className="px-6 py-4 bg-white/80 backdrop-blur-sm shadow-md">
              <div className="flex items-center gap-3">
                <Thermometer className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-[2rem] leading-none">72°F</p>
                  <p className="text-[1rem] text-muted-foreground">Sunny</p>
                </div>
              </div>
            </Card>

            <Button
              size="lg"
              variant="ghost"
              onClick={onCaregiverAccess}
              className="w-16 h-16 rounded-full hover:bg-white/50"
            >
              <User className="w-8 h-8" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 mt-8">
        <div className="mb-6">
          <h1 className="text-[3rem] mb-2">{timeInfo.greeting}!</h1>
          <p className="text-[1.8rem] text-muted-foreground">{t('dashboard.greeting')}</p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Photo Memory Wall - spans 2 columns on xl */}
          <div className="xl:col-span-2 photo-memory-wall">
            <PhotoMemoryWall />
          </div>

          {/* Quick Connect */}
          <div className="quick-connect">
            <QuickConnect />
          </div>

          {/* Today's Schedule - spans 2 columns on lg */}
          <div className="lg:col-span-2 xl:col-span-2 today-schedule">
            <TodayScheduleWidget />
          </div>

          {/* Mood Tracker - full width */}
          <div className="lg:col-span-2 xl:col-span-3 mood-tracker">
            <MoodTracker />
          </div>

          {/* Memory Diary Widget - full width */}
          <div className="lg:col-span-2 xl:col-span-3">
            <MemoryDiaryWidget onNavigate={onNavigateToMemoryDiary} />
          </div>
        </div>
      </div>

      {/* Hidden caregiver trigger */}
      <div
        className="fixed top-0 left-0 w-16 h-16 cursor-pointer opacity-0"
        onClick={onCaregiverAccess}
      />
    </div>
  );
}
