import { useEffect, useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { EnhancedDashboard } from './components/EnhancedDashboard';
import { CaregiverSettings } from './components/CaregiverSettings';
import { MemoryDiaryScreen } from './components/MemoryDiaryScreen';
import { UnifiedScheduler } from './components/UnifiedScheduler';
import { LanguageProvider } from './contexts/LanguageContext';
import { AUTH_UNAUTHORIZED_EVENT } from './services/api';

type Mode = 'welcome' | 'patient' | 'caregiver' | 'memory-diary';

export default function App() {
  const [currentMode, setCurrentMode] = useState<Mode>('welcome');

  useEffect(() => {
    const handleUnauthorized = () => {
      setCurrentMode('caregiver');
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  return (
    <LanguageProvider>
      <div className="size-full">
        {/* Unified Scheduler - Shows medication and task reminders on patient screen */}
        {currentMode === 'patient' && <UnifiedScheduler />}
        
        {currentMode === 'welcome' && (
          <WelcomeScreen onComplete={() => setCurrentMode('patient')} />
        )}
        
        {currentMode === 'patient' && (
          <EnhancedDashboard 
            onCaregiverAccess={() => setCurrentMode('caregiver')} 
            onNavigateToMemoryDiary={() => setCurrentMode('memory-diary')}
          />
        )}
        
        {currentMode === 'memory-diary' && (
          <MemoryDiaryScreen 
            onNavigate={(screen) => setCurrentMode(screen as Mode)} 
          />
        )}
        
        {currentMode === 'caregiver' && (
          <CaregiverSettings 
            onNavigate={(screen) => setCurrentMode(screen as Mode)} 
          />
        )}
      </div>
    </LanguageProvider>
  );
}
