import { BookOpen, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface MemoryDiaryWidgetProps {
  onNavigate: () => void;
}

export function MemoryDiaryWidget({ onNavigate }: MemoryDiaryWidgetProps) {
  const recentActivities = [
    { icon: '🍽️', activity: 'Had lunch', time: '12:00 PM' },
    { icon: '📞', activity: 'Called family', time: '3:30 PM' },
  ];

  const handleViewDiary = () => {
    onNavigate();
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 shadow-lg hover:shadow-xl transition-shadow border-2 border-purple-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-10 h-10 text-purple-600" />
          <h2 className="text-[2rem]">Memory Diary</h2>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {recentActivities.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 bg-white/70 rounded-xl"
          >
            <span className="text-4xl">{item.icon}</span>
            <div className="flex-1">
              <p className="text-[1.3rem]">{item.activity}</p>
              <p className="text-[1rem] text-muted-foreground">{item.time}</p>
            </div>
          </div>
        ))}
      </div>

      <Button
        size="lg"
        onClick={handleViewDiary}
        className="w-full text-[1.3rem] py-6 bg-purple-600 hover:bg-purple-700"
      >
        View Full Diary
        <ArrowRight className="w-6 h-6 ml-2" />
      </Button>
    </Card>
  );
}