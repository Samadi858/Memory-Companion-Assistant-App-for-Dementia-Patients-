import { useEffect, useState } from 'react';
import { Bell, X, Clock, Pill } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

interface MedicationAlertProps {
  onSpeak: (text: string) => void;
}

interface Medication {
  id: string;
  name: string;
  time: string;
  color: string;
}

const medications: Medication[] = [
  { id: '1', name: 'medicine.bloodPressure', time: '08:00', color: 'bg-red-400' },
  { id: '2', name: 'medicine.vitaminD', time: '08:00', color: 'bg-yellow-400' },
  { id: '3', name: 'medicine.heart', time: '14:00', color: 'bg-blue-400' },
  { id: '4', name: 'medicine.pain', time: '18:00', color: 'bg-green-400' },
  { id: '5', name: 'medicine.sleep', time: '21:00', color: 'bg-purple-400' },
];

export function MedicationAlert({ onSpeak }: MedicationAlertProps) {
  const [activeAlert, setActiveAlert] = useState<Medication | null>(null);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const { t } = useLanguage();

  useEffect(() => {
    const checkMedicationTime = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      // Check if any medication is due (within 5 minutes window)
      const dueMedication = medications.find(med => {
        const [hour, minute] = med.time.split(':').map(Number);
        const medTime = new Date();
        medTime.setHours(hour, minute, 0, 0);
        
        const diff = Math.abs(now.getTime() - medTime.getTime()) / (1000 * 60); // difference in minutes
        
        return diff <= 5 && !dismissed.has(med.id);
      });
      
      if (dueMedication && !activeAlert) {
        setActiveAlert(dueMedication);
        playAlertSound();
        onSpeak(`${t('medicine.alert')} ${t(dueMedication.name)}`);
      }
    };

    // Check immediately
    checkMedicationTime();
    
    // Check every minute
    const interval = setInterval(checkMedicationTime, 60000);
    
    return () => clearInterval(interval);
  }, [activeAlert, dismissed, onSpeak, t]);

  const playAlertSound = () => {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const handleDismiss = () => {
    if (activeAlert) {
      setDismissed(prev => new Set(prev).add(activeAlert.id));
      setActiveAlert(null);
    }
  };

  const handleSnooze = () => {
    if (activeAlert) {
      setActiveAlert(null);
      onSpeak(t('medicine.snooze'));
      
      // Re-show alert after 10 minutes
      setTimeout(() => {
        setActiveAlert(activeAlert);
        playAlertSound();
      }, 10 * 60 * 1000);
    }
  };

  return (
    <AnimatePresence>
      {activeAlert && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
        >
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl shadow-2xl p-8 border-4 border-white">
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="flex items-start gap-6">
              {/* Animated Bell Icon */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>
                  <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center">
                    <Bell className="w-12 h-12 text-red-600 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-white">
                <h3 className="text-[2.5rem] mb-4">
                  {t('medicine.alert')}
                </h3>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 ${activeAlert.color} rounded-full flex items-center justify-center shadow-lg`}>
                    <Pill className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-[2rem]">{t(activeAlert.name)}</p>
                    <div className="flex items-center gap-2 text-[1.3rem] opacity-90">
                      <Clock className="w-5 h-5" />
                      <span>{activeAlert.time}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    onClick={handleDismiss}
                    className="flex-1 bg-white text-red-600 hover:bg-gray-100 text-[1.5rem] py-6 h-auto"
                  >
                    ✓ {t('medicine.dismiss')}
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleSnooze}
                    variant="outline"
                    className="flex-1 bg-white/20 text-white border-2 border-white hover:bg-white/30 text-[1.5rem] py-6 h-auto"
                  >
                    <Clock className="w-6 h-6 mr-2" />
                    {t('medicine.snooze')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
