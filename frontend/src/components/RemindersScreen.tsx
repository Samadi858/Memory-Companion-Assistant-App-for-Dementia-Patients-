import { ArrowLeft, Bell, Plus, Trash2, Volume2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useEffect, useState } from 'react';
import { reminderService } from '../services/reminderService';

interface RemindersScreenProps {
  onNavigate: (screen: string) => void;
  onSpeak: (text: string) => void;
}

interface Reminder {
  id: number;
  time: string;
  activity: string;
  icon: string;
  enabled: boolean;
}

export function RemindersScreen({ onNavigate, onSpeak }: RemindersScreenProps) {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    void loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const data = await reminderService.getReminders();
      const mapped = data.map((r) => ({
        id: r.id,
        time: r.time,
        activity: r.name,
        icon: r.type === 'medication' ? '💊' : (r.icon || '📋'),
        enabled: Boolean(r.enabled),
      }));
      setReminders(mapped.filter((r) => r.enabled));
    } catch (error) {
      console.error('Failed to load reminders', error);
    }
  };

  const handleDelete = async (id: number, activity: string) => {
    try {
      await reminderService.deleteReminder(id);
      onSpeak(`Deleted reminder: ${activity}`);
      await loadReminders();
    } catch (error) {
      console.error('Failed to delete reminder', error);
    }
  };

  const handleReadReminder = (reminder: Reminder) => {
    onSpeak(`Reminder at ${reminder.time}: ${reminder.activity}`);
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => onNavigate('home')}
          className="text-xl px-6 py-6"
        >
          <ArrowLeft className="w-8 h-8 mr-2" />
          Back to Home
        </Button>
        
        <Button
          size="lg"
          onClick={() => onSpeak('Add new reminder feature coming soon')}
          className="text-xl px-6 py-6"
        >
          <Plus className="w-8 h-8 mr-2" />
          Add Reminder
        </Button>
      </div>

      <div className="flex-1 max-w-5xl w-full mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <Bell className="w-12 h-12 text-primary" />
          <h1 className="text-5xl">Your Reminders</h1>
        </div>

        {/* Reminders List */}
        <div className="space-y-4">
          {reminders.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-3xl text-muted-foreground">No reminders yet</p>
            </Card>
          ) : (
            reminders.map((reminder) => (
              <Card key={reminder.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-6">
                  <div className="text-6xl flex-shrink-0">{reminder.icon}</div>
                  
                  <div className="flex-1 space-y-2">
                    <p className="text-3xl text-primary">{reminder.time}</p>
                    <p className="text-2xl">{reminder.activity}</p>
                  </div>

                  <div className="flex gap-3 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleReadReminder(reminder)}
                      className="px-6 py-6"
                    >
                      <Volume2 className="w-8 h-8" />
                    </Button>
                    
                    <Button
                      variant="destructive"
                      size="lg"
                      onClick={() => handleDelete(reminder.id, reminder.activity)}
                      className="px-6 py-6"
                    >
                      <Trash2 className="w-8 h-8" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
