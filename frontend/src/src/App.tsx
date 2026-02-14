import { useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { EnhancedDashboard } from './components/EnhancedDashboard';
import { CaregiverSettings } from './components/CaregiverSettings';
import { VoiceIndicator } from './components/VoiceIndicator';

type Mode = 'welcome' | 'patient' | 'caregiver';

export default function App() {
  const [currentMode, setCurrentMode] = useState<Mode>('welcome');
  const [voiceText, setVoiceText] = useState<string | null>(null);

  const handleSpeak = (text: string) => {
    setVoiceText(text);
  };

  const handleVoiceComplete = () => {
    setVoiceText(null);
  };

  return (
    <div className="size-full">
      {voiceText && <VoiceIndicator text={voiceText} onComplete={handleVoiceComplete} />}
      
      {currentMode === 'welcome' && (
        <WelcomeScreen onComplete={() => setCurrentMode('patient')} />
      )}
      
      {currentMode === 'patient' && (
        <EnhancedDashboard 
          onCaregiverAccess={() => setCurrentMode('caregiver')} 
          onSpeak={handleSpeak}
        />
      )}
      
      {currentMode === 'caregiver' && (
        <CaregiverSettings 
          onNavigate={(screen) => setCurrentMode(screen as Mode)} 
          onSpeak={handleSpeak}
        />
      )}
    </div>
  );
}
