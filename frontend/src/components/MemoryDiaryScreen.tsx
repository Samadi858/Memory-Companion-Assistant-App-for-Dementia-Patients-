import { useState } from 'react';
import { ArrowLeft, BookOpen, Volume2, Clock, Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface MemoryDiaryScreenProps {
  onNavigate: (screen: string) => void;
}

interface MemoryEntry {
  id: string;
  time: string;
  activity: string;
  icon: string;
}

const defaultEntries: MemoryEntry[] = [
  { id: '1', time: '8:00 AM', activity: 'You took your morning medicine', icon: '💊' },
  { id: '2', time: '9:00 AM', activity: 'You had breakfast with scrambled eggs', icon: '🍳' },
  { id: '3', time: '10:30 AM', activity: 'You watched your favorite TV show', icon: '📺' },
  { id: '4', time: '12:00 PM', activity: 'You had lunch with chicken curry', icon: '🍽️' },
  { id: '5', time: '2:00 PM', activity: 'You took your afternoon medicine', icon: '💊' },
  { id: '6', time: '3:30 PM', activity: 'Your daughter Anu called you', icon: '📞' },
];

const activityTemplates = [
  { text: 'Had a meal', icon: '🍽️' },
  { text: 'Watched TV', icon: '📺' },
  { text: 'Talked to family', icon: '📞' },
  { text: 'Went for a walk', icon: '🚶' },
  { text: 'Listened to music', icon: '🎵' },
  { text: 'Read a book', icon: '📖' },
  { text: 'Took medicine', icon: '💊' },
  { text: 'Had a nap', icon: '😴' },
];

export function MemoryDiaryScreen({ onNavigate }: MemoryDiaryScreenProps) {
  const [entries, setEntries] = useState<MemoryEntry[]>(defaultEntries);
  const [showAddPanel, setShowAddPanel] = useState(false);

  const handleReadAll = () => {
    // Read all entries
  };

  const handleReadEntry = (entry: MemoryEntry) => {
    // Read single entry
  };

  const handleAddActivity = (template: { text: string; icon: string }) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const newEntry: MemoryEntry = {
      id: Date.now().toString(),
      time: timeString,
      activity: template.text,
      icon: template.icon,
    };

    setEntries([...entries, newEntry]);
    setShowAddPanel(false);
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
        
        <div className="flex gap-4">
          <Button
            size="lg"
            onClick={handleReadAll}
            className="text-xl px-6 py-6"
          >
            <Volume2 className="w-8 h-8 mr-2" />
            Read All
          </Button>
          
          <Button
            size="lg"
            variant={showAddPanel ? "secondary" : "default"}
            onClick={() => setShowAddPanel(!showAddPanel)}
            className="text-xl px-6 py-6"
          >
            {showAddPanel ? (
              <>
                <X className="w-8 h-8 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="w-8 h-8 mr-2" />
                Add Memory
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 max-w-5xl w-full mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <BookOpen className="w-12 h-12 text-primary" />
          <h1 className="text-5xl">Memory Diary</h1>
        </div>

        <Card className="p-6 bg-accent/30">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-primary" />
            <p className="text-2xl">Today - Saturday, October 19, 2025</p>
          </div>
        </Card>

        {/* Add Activity Panel */}
        {showAddPanel && (
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-primary">
            <h2 className="text-3xl mb-6">What did you do?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {activityTemplates.map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="lg"
                  onClick={() => handleAddActivity(template)}
                  className="h-auto py-6 px-4 flex flex-col items-center gap-3 hover:bg-white hover:scale-105 transition-transform bg-white/80"
                >
                  <span className="text-5xl">{template.icon}</span>
                  <span className="text-xl">{template.text}</span>
                </Button>
              ))}
            </div>
          </Card>
        )}

        {/* Timeline */}
        <div className="space-y-4 relative pl-8">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-1 bg-primary/30"></div>

          {entries.map((entry, index) => (
            <div key={entry.id} className="relative">
              {/* Timeline dot */}
              <div className="absolute left-[-31px] w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-white"></div>
              </div>

              <Card className="p-6 hover:shadow-lg transition-shadow ml-4">
                <div className="flex items-center gap-6">
                  <div className="text-5xl flex-shrink-0">{entry.icon}</div>
                  
                  <div className="flex-1 space-y-2">
                    <p className="text-2xl text-primary">{entry.time}</p>
                    <p className="text-2xl">{entry.activity}</p>
                  </div>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleReadEntry(entry)}
                    className="px-6 py-6 flex-shrink-0"
                  >
                    <Volume2 className="w-8 h-8" />
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}