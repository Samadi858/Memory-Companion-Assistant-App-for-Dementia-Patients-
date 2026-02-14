import { User, Bell, BookOpen, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
  onSpeak: (text: string) => void;
}

export function HomeScreen({ onNavigate, onSpeak }: HomeScreenProps) {
  const handleNavigation = (screen: string, spokenText: string) => {
    onSpeak(spokenText);
    setTimeout(() => onNavigate(screen), 500);
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl text-primary">Memory Helper</h1>
          <p className="text-3xl text-foreground">Hello! I'm here to help you today.</p>
        </div>

        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Card
            className="p-8 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleNavigation('face', 'Opening Face Recognition')}
          >
            <Button
              variant="ghost"
              className="w-full h-auto flex flex-col items-center gap-4 p-6"
            >
              <User className="w-24 h-24 text-primary" />
              <span className="text-3xl">Recognize Faces</span>
            </Button>
          </Card>

          <Card
            className="p-8 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleNavigation('reminders', 'Opening Reminders')}
          >
            <Button
              variant="ghost"
              className="w-full h-auto flex flex-col items-center gap-4 p-6"
            >
              <Bell className="w-24 h-24 text-primary" />
              <span className="text-3xl">View Reminders</span>
            </Button>
          </Card>

          <Card
            className="p-8 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleNavigation('diary', 'Opening Memory Diary')}
          >
            <Button
              variant="ghost"
              className="w-full h-auto flex flex-col items-center gap-4 p-6"
            >
              <BookOpen className="w-24 h-24 text-primary" />
              <span className="text-3xl">Memory Diary</span>
            </Button>
          </Card>

          <Card
            className="p-8 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleNavigation('caregiver', 'Opening Caregiver Settings')}
          >
            <Button
              variant="ghost"
              className="w-full h-auto flex flex-col items-center gap-4 p-6"
            >
              <Settings className="w-24 h-24 text-primary" />
              <span className="text-3xl">Caregiver Settings</span>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
