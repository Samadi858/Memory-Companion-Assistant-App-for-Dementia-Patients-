import { Camera, HelpCircle, User } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';

interface PatientDashboardProps {
  onCaregiverAccess: () => void;
  onSpeak: (text: string) => void;
}

interface Person {
  name: string;
  relation: string;
  lastVisit?: string;
}

interface Reminder {
  time: string;
  activity: string;
  icon: string;
}

const knownPeople: Person[] = [
  { name: 'Anu', relation: 'Your Daughter', lastVisit: 'Yesterday' },
  { name: 'Ravi', relation: 'Your Son', lastVisit: 'Last week' },
  { name: 'Priya', relation: 'Your Wife' },
  { name: 'Dr. Kumar', relation: 'Your Doctor', lastVisit: 'Last month' },
];

const upcomingReminders: Reminder[] = [
  { time: '4:00 PM', activity: 'Take blood pressure medicine', icon: '💊' },
  { time: '6:00 PM', activity: 'Dinner time', icon: '🍽️' },
  { time: '9:00 PM', activity: 'Take evening medicine', icon: '💊' },
];

export function PatientDashboard({ onCaregiverAccess, onSpeak }: PatientDashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isScanning, setIsScanning] = useState(false);
  const [detectedPerson, setDetectedPerson] = useState<Person | null>(null);
  const [showRecognition, setShowRecognition] = useState(false);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-detect faces periodically (simulation)
  useEffect(() => {
    const detectTimer = setInterval(() => {
      // Randomly trigger face detection (30% chance)
      if (Math.random() < 0.3 && !showRecognition) {
        startFaceDetection();
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(detectTimer);
  }, [showRecognition]);

  const startFaceDetection = () => {
    setIsScanning(true);
    setShowRecognition(true);

    setTimeout(() => {
      setIsScanning(false);
      const randomPerson = Math.random() > 0.2
        ? knownPeople[Math.floor(Math.random() * knownPeople.length)]
        : null;

      setDetectedPerson(randomPerson);

      if (randomPerson) {
        onSpeak(`This is ${randomPerson.name}, ${randomPerson.relation}`);
      } else {
        onSpeak('I am not sure who this is');
      }

      // Hide recognition after 30 seconds
      setTimeout(() => {
        setShowRecognition(false);
        setDetectedPerson(null);
      }, 30000);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const nextReminder = upcomingReminders[0];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Always visible clock and date */}
      <div className="bg-gradient-to-r from-blue-50 via-white to-emerald-50 border-b-4 border-primary shadow-lg py-8 px-6 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex-1">
            <p className="text-[4rem] leading-none bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{formatTime(currentTime)}</p>
            <p className="text-[2rem] mt-2 text-foreground/80">{formatDate(currentTime)}</p>
          </div>
          <Button
            variant="ghost"
            size="lg"
            onClick={onCaregiverAccess}
            className="text-muted-foreground hover:text-foreground hover:bg-white/80 transition-all"
          >
            <HelpCircle className="w-8 h-8" />
          </Button>
        </div>
      </div>

      {/* Main Content Area - Face Recognition */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          {showRecognition ? (
            <div className="transition-all duration-1000 ease-in-out">
              {isScanning ? (
                <div className="flex flex-col items-center gap-8 py-16">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-emerald-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                    <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center shadow-2xl border-4 border-white">
                      <Camera className="w-32 h-32 text-primary animate-pulse" />
                    </div>
                  </div>
                  <p className="text-[3rem] bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Looking...</p>
                </div>
              ) : detectedPerson ? (
                <div className="flex flex-col items-center gap-8 py-16 animate-in fade-in duration-1000">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-emerald-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                    <div className="relative w-80 h-80 rounded-full bg-gradient-to-br from-blue-100 to-emerald-100 border-8 border-white shadow-2xl flex items-center justify-center">
                      <User className="w-48 h-48 text-primary" />
                    </div>
                  </div>
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-4">
                      <span className="text-[4rem] drop-shadow-lg">👤</span>
                      <h2 className="text-[5rem] leading-none bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">{detectedPerson.name}</h2>
                    </div>
                    <p className="text-[3rem] text-foreground/80">{detectedPerson.relation}</p>
                    {detectedPerson.lastVisit && (
                      <div className="mt-6 bg-white/80 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg inline-block">
                        <p className="text-[2rem] text-muted-foreground">
                          Last visit: {detectedPerson.lastVisit}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-8 py-16 animate-in fade-in duration-1000">
                  <div className="w-80 h-80 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl flex items-center justify-center border-4 border-white">
                    <User className="w-48 h-48 text-muted-foreground" />
                  </div>
                  <p className="text-[4rem] text-muted-foreground">I'm not sure who this is</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-8 py-16 opacity-60">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-emerald-300 rounded-full blur-xl opacity-20"></div>
                <div className="relative bg-gradient-to-br from-blue-50 to-emerald-50 p-12 rounded-full shadow-lg">
                  <Camera className="w-32 h-32 text-primary/60" />
                </div>
              </div>
              <p className="text-[2.5rem] text-muted-foreground text-center max-w-2xl">
                I'll help you recognize people when they come near
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer - Next Reminder */}
      <div className="bg-card border-t-4 border-primary py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {nextReminder ? (
            <div className="flex items-center gap-6">
              <div className="text-[4rem]">{nextReminder.icon}</div>
              <div className="flex-1">
                <p className="text-[1.5rem] text-muted-foreground">Next reminder:</p>
                <p className="text-[2.5rem] mt-1">
                  {nextReminder.activity} at {nextReminder.time}
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => onSpeak(`Your next reminder is: ${nextReminder.activity} at ${nextReminder.time}`)}
                className="px-12 py-12 text-[2rem] h-auto min-w-[200px]"
              >
                Read to me
              </Button>
            </div>
          ) : (
            <p className="text-[2.5rem] text-center text-muted-foreground">No upcoming reminders</p>
          )}
        </div>
      </div>

      {/* Hidden trigger for caregiver mode - press and hold top-left corner */}
      <div
        className="fixed top-0 left-0 w-16 h-16 cursor-pointer opacity-0 hover:opacity-10"
        onClick={onCaregiverAccess}
      />
    </div>
  );
}
