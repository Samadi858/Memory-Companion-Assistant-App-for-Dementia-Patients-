import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Clock, Plus, Volume2, X } from 'lucide-react';

import { Button } from './ui/button';
import { Card } from './ui/card';
import { diaryService, type DiaryEntry } from '../services/diaryService';

interface MemoryDiaryScreenProps {
  onNavigate: (screen: string) => void;
}

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
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [message, setMessage] = useState('');

  const loadEntries = async () => {
    setLoading(true);
    setMessage('');
    try {
      const items = await diaryService.getEntries(undefined, 200);
      setEntries(items);
    } catch (error) {
      setEntries([]);
      setMessage(error instanceof Error ? error.message : 'Failed to load diary entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadEntries();
  }, []);

  const handleReadAll = () => {
    // Reserved for future TTS integration.
  };

  const handleReadEntry = (_entry: DiaryEntry) => {
    // Reserved for future TTS integration.
  };

  const handleAddActivity = async (template: { text: string; icon: string }) => {
    setMessage('');
    try {
      const nowIso = new Date().toISOString();
      await diaryService.createEntry({
        activity: template.text,
        icon: template.icon,
        occurred_at: nowIso,
      });
      setShowAddPanel(false);
      setMessage('Diary entry added');
      await loadEntries();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to add diary entry');
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => onNavigate('patient')}
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
            variant={showAddPanel ? 'secondary' : 'default'}
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
            <p className="text-2xl">
              Today - {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </Card>

        {showAddPanel && (
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-primary">
            <h2 className="text-3xl mb-6">What did you do?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {activityTemplates.map((template) => (
                <Button
                  key={`${template.text}-${template.icon}`}
                  variant="outline"
                  size="lg"
                  onClick={() => void handleAddActivity(template)}
                  className="h-auto py-6 px-4 flex flex-col items-center gap-3 hover:bg-white hover:scale-105 transition-transform bg-white/80"
                >
                  <span className="text-5xl">{template.icon}</span>
                  <span className="text-xl">{template.text}</span>
                </Button>
              ))}
            </div>
          </Card>
        )}

        {message && (
          <p className={message.toLowerCase().includes('failed') ? 'text-red-600' : 'text-green-600'}>
            {message}
          </p>
        )}

        <div className="space-y-4 relative pl-8">
          <div className="absolute left-[19px] top-0 bottom-0 w-1 bg-primary/30" />
          {loading ? (
            <Card className="p-6 ml-4">Loading diary entries...</Card>
          ) : entries.length === 0 ? (
            <Card className="p-6 ml-4">No entries yet</Card>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="relative">
                <div className="absolute left-[-31px] w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-white" />
                </div>

                <Card className="p-6 hover:shadow-lg transition-shadow ml-4">
                  <div className="flex items-center gap-6">
                    <div className="text-5xl flex-shrink-0">{entry.icon || '📝'}</div>
                    <div className="flex-1 space-y-2">
                      <p className="text-2xl text-primary">
                        {new Date(entry.occurred_at).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </p>
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
