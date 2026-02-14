import { useEffect, useState } from 'react';
import { Clock, Pill, Activity, CheckCircle2, Circle } from 'lucide-react';
import { Card } from './ui/card';
import { useLanguage } from '../contexts/LanguageContext';
import { ScheduledItem, STORAGE_KEY } from './UnifiedScheduler';

interface TodayScheduleWidgetProps {
}

export function TodayScheduleWidget() {
  const [items, setItems] = useState<ScheduledItem[]>([]);
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const { t } = useLanguage();

  useEffect(() => {
    const loadItems = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const allItems = JSON.parse(stored) as ScheduledItem[];
          const now = new Date();
          const currentDay = now.getDay();
          
          // Filter items for today and enabled items
          const todayItems = allItems.filter(item => {
            if (!item.enabled) return false;
            if (item.days && !item.days.includes(currentDay)) return false;
            return true;
          });
          
          setItems(todayItems.sort((a, b) => a.time.localeCompare(b.time)));
        } catch (e) {
          console.error('Failed to load scheduled items:', e);
        }
      }
    };

    loadItems();
    
    // Reload items every minute in case of updates
    const interval = setInterval(loadItems, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleComplete = (id: string, name: string) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedItems(newCompleted);
  };

  const isPastTime = (time: string) => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const itemTime = new Date();
    itemTime.setHours(hours, minutes, 0, 0);
    return now > itemTime;
  };

  const completedCount = completedItems.size;
  const totalCount = items.length;

  if (items.length === 0) {
    return (
      <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <Clock className="w-10 h-10 text-blue-600" />
          <h2 className="text-[2.5rem]">Today's Schedule</h2>
        </div>
        <p className="text-[1.5rem] text-muted-foreground text-center py-8">
          No reminders scheduled for today
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Clock className="w-10 h-10 text-blue-600" />
          <h2 className="text-[2.5rem]">Today's Schedule</h2>
        </div>
        <div className="text-right">
          <p className="text-[2rem] text-primary">{completedCount} of {totalCount}</p>
          <p className="text-[1.2rem] text-muted-foreground">completed</p>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const isCompleted = completedItems.has(item.id);
          const isPast = isPastTime(item.time);
          
          return (
            <button
              key={item.id}
              onClick={() => handleToggleComplete(item.id, t(item.name))}
              className="w-full group"
            >
              <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                isCompleted 
                  ? 'bg-green-50 border-2 border-green-300' 
                  : isPast
                  ? 'bg-orange-50 border-2 border-orange-300'
                  : 'bg-gray-50 border-2 border-gray-200 hover:border-primary'
              }`}>
                <div className={`w-14 h-14 ${item.color} rounded-full flex items-center justify-center shadow-lg ${
                  isCompleted ? 'opacity-50' : ''
                }`}>
                  {item.type === 'medication' ? (
                    <Pill className="w-7 h-7 text-white" />
                  ) : (
                    <span className="text-2xl">{item.icon || '📋'}</span>
                  )}
                </div>

                <div className="flex-1 text-left">
                  <p className={`text-[1.8rem] ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                    {t(item.name)}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <p className="text-[1.3rem] text-muted-foreground">{item.time}</p>
                    <span className="text-sm px-2 py-0.5 bg-white/50 rounded-full">
                      {item.type === 'medication' ? (
                        <span className="flex items-center gap-1">
                          <Pill className="w-3 h-3" />
                          Medicine
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          Task
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  ) : (
                    <Circle className="w-12 h-12 text-gray-300 group-hover:text-primary transition-colors" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}