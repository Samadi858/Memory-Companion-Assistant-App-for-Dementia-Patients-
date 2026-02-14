import { useEffect, useState } from 'react';
import { Bell, X, Clock, Pill, Activity } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

interface UnifiedSchedulerProps {
}

export interface ScheduledItem {
  id: string;
  type: 'medication' | 'task';
  name: string;
  time: string; // HH:MM format
  color: string;
  icon?: string;
  days?: number[]; // 0-6 for Sunday-Saturday, undefined means daily
  enabled?: boolean;
}

const STORAGE_KEY = 'dementia-app-scheduled-items';

// Default scheduled items
const defaultItems: ScheduledItem[] = [
  { id: '1', type: 'medication', name: 'medicine.bloodPressure', time: '08:00', color: 'bg-red-400', enabled: true },
  { id: '2', type: 'medication', name: 'medicine.vitaminD', time: '08:00', color: 'bg-yellow-400', enabled: true },
  { id: '3', type: 'task', name: 'task.breakfast', time: '09:00', color: 'bg-orange-400', icon: '🍳', enabled: true },
  { id: '4', type: 'task', name: 'task.lunch', time: '12:00', color: 'bg-green-400', icon: '🍽️', enabled: true },
  { id: '5', type: 'medication', name: 'medicine.heart', time: '14:00', color: 'bg-blue-400', enabled: true },
  { id: '6', type: 'task', name: 'task.exercise', time: '16:00', color: 'bg-purple-400', icon: '🚶', enabled: true },
  { id: '7', type: 'task', name: 'task.dinner', time: '18:00', color: 'bg-pink-400', icon: '🍽️', enabled: true },
  { id: '8', type: 'medication', name: 'medicine.pain', time: '18:00', color: 'bg-green-400', enabled: true },
  { id: '9', type: 'medication', name: 'medicine.sleep', time: '21:00', color: 'bg-purple-400', enabled: true },
];

export function UnifiedScheduler() {
  const [activeAlert, setActiveAlert] = useState<ScheduledItem | null>(null);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [scheduledItems, setScheduledItems] = useState<ScheduledItem[]>([]);
  const { t } = useLanguage();

  // Load scheduled items from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setScheduledItems(JSON.parse(stored));
      } catch (e) {
        setScheduledItems(defaultItems);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultItems));
      }
    } else {
      setScheduledItems(defaultItems);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultItems));
    }
  }, []);

  useEffect(() => {
    const checkScheduledTime = () => {
      const now = new Date();
      const currentDay = now.getDay(); // 0-6
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      // Check if any item is due (within 5 minutes window)
      const dueItem = scheduledItems.find(item => {
        if (!item.enabled) return false;
        
        // Check if item should run today
        if (item.days && !item.days.includes(currentDay)) {
          return false;
        }
        
        const [hour, minute] = item.time.split(':').map(Number);
        const itemTime = new Date();
        itemTime.setHours(hour, minute, 0, 0);
        
        const diff = Math.abs(now.getTime() - itemTime.getTime()) / (1000 * 60); // difference in minutes
        
        return diff <= 5 && !dismissed.has(`${item.id}-${currentTime.split(':')[0]}`);
      });
      
      if (dueItem && !activeAlert) {
        setActiveAlert(dueItem);
        playAlertSound();
        
        const itemName = dueItem.type === 'task' && dueItem.icon 
          ? t(dueItem.name) 
          : t(dueItem.name);
        
        const alertMessage = dueItem.type === 'medication' 
          ? `${t('reminder.medication')} ${itemName}`
          : `${t('reminder.task')} ${itemName}`;
          
        // onSpeak(alertMessage);
      }
    };

    // Check immediately
    checkScheduledTime();
    
    // Check every minute
    const interval = setInterval(checkScheduledTime, 60000);
    
    return () => clearInterval(interval);
  }, [activeAlert, dismissed, t, scheduledItems]);

  const playAlertSound = () => {
    // Create a gentle chime sound using Web Audio API
    try {
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
    } catch (e) {
      console.warn('Could not play alert sound:', e);
    }
  };

  const handleDismiss = () => {
    if (activeAlert) {
      const now = new Date();
      const currentHour = String(now.getHours()).padStart(2, '0');
      setDismissed(prev => new Set(prev).add(`${activeAlert.id}-${currentHour}`));
      setActiveAlert(null);
    }
  };

  const handleSnooze = () => {
    if (activeAlert) {
      setActiveAlert(null);
      // onSpeak(t('reminder.snooze'));
      
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
          <div className={`rounded-3xl shadow-2xl p-8 border-4 border-white ${
            activeAlert.type === 'medication'
              ? 'bg-gradient-to-r from-orange-500 to-red-500'
              : 'bg-gradient-to-r from-blue-500 to-purple-500'
          }`}>
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="flex items-start gap-6">
              {/* Animated Icon */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>
                  <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center">
                    {activeAlert.type === 'medication' ? (
                      <Bell className="w-12 h-12 text-red-600 animate-pulse" />
                    ) : (
                      <Activity className="w-12 h-12 text-blue-600 animate-pulse" />
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-white">
                <h3 className="text-[2.5rem] mb-4">
                  {activeAlert.type === 'medication' ? t('reminder.medication') : t('reminder.task')}
                </h3>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 ${activeAlert.color} rounded-full flex items-center justify-center shadow-lg`}>
                    {activeAlert.type === 'medication' ? (
                      <Pill className="w-8 h-8 text-white" />
                    ) : (
                      <span className="text-3xl">{activeAlert.icon || '📋'}</span>
                    )}
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
                    className="flex-1 bg-white text-blue-600 hover:bg-gray-100 text-[1.5rem] py-6 h-auto"
                  >
                    ✓ {t('reminder.done')}
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleSnooze}
                    variant="outline"
                    className="flex-1 bg-white/20 text-white border-2 border-white hover:bg-white/30 text-[1.5rem] py-6 h-auto"
                  >
                    <Clock className="w-6 h-6 mr-2" />
                    {t('reminder.snooze')}
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

// Export storage key for use in schedule manager
export { STORAGE_KEY };