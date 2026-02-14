import { Smile, Heart } from 'lucide-react';
import { Card } from './ui/card';
import { useState } from 'react';

interface MoodTrackerProps {
}

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moods = [
    { id: 'happy', emoji: '😊', label: 'Happy', color: 'from-yellow-300 to-orange-400' },
    { id: 'calm', emoji: '😌', label: 'Calm', color: 'from-blue-300 to-cyan-400' },
    { id: 'excited', emoji: '🤗', label: 'Excited', color: 'from-pink-300 to-rose-400' },
    { id: 'sad', emoji: '😢', label: 'Sad', color: 'from-gray-300 to-slate-400' },
    { id: 'confused', emoji: '😕', label: 'Confused', color: 'from-purple-300 to-indigo-400' },
  ];

  const handleMoodSelect = (mood: typeof moods[0]) => {
    setSelectedMood(mood.id);
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-pink-50 to-purple-50 shadow-xl border-2 border-pink-200">
      <div className="flex items-center gap-4 mb-8">
        <Heart className="w-12 h-12 text-rose-500" />
        <h2 className="text-[2.5rem]">How are you feeling?</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => handleMoodSelect(mood)}
            className={`group relative transition-all duration-300 ${
              selectedMood === mood.id ? 'scale-105' : 'hover:scale-105'
            }`}
          >
            <div className={`
              relative rounded-2xl p-6 shadow-lg transition-all
              ${selectedMood === mood.id 
                ? `bg-gradient-to-br ${mood.color} ring-4 ring-offset-2 ring-primary shadow-2xl` 
                : 'bg-white hover:shadow-xl hover:bg-gray-50'
              }
            `}>
              <div className="text-center space-y-2">
                <div className="text-[3.5rem] leading-none">{mood.emoji}</div>
                <p className={`text-[1.2rem] ${selectedMood === mood.id ? 'text-white' : 'text-foreground'}`}>
                  {mood.label}
                </p>
              </div>
              
              {selectedMood === mood.id && (
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                  <span className="text-white text-xl">✓</span>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {selectedMood && (
        <div className="mt-8 p-6 bg-white/80 rounded-2xl border-2 border-green-300 shadow-lg animate-in slide-in-from-bottom duration-500">
          <p className="text-[1.5rem] text-center text-green-700">
            ✨ Thank you for sharing. Your caregiver will be notified.
          </p>
        </div>
      )}
    </Card>
  );
}