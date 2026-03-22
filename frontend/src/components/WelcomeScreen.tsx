import { useState, useEffect } from 'react';
import { Sun, Cloud, Moon, Sunrise } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Auto-advance after 3 seconds
    const advanceTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(advanceTimer);
    };
  }, [onComplete]);

  const getTimeOfDay = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { greeting: 'Good Morning', icon: <Sunrise className="w-32 h-32 text-orange-400" />, gradient: 'from-orange-200 via-yellow-100 to-blue-100' };
    if (hour < 17) return { greeting: 'Good Afternoon', icon: <Sun className="w-32 h-32 text-yellow-500" />, gradient: 'from-blue-200 via-cyan-100 to-yellow-100' };
    if (hour < 20) return { greeting: 'Good Evening', icon: <Cloud className="w-32 h-32 text-purple-400" />, gradient: 'from-purple-200 via-pink-100 to-orange-100' };
    return { greeting: 'Good Night', icon: <Moon className="w-32 h-32 text-indigo-400" />, gradient: 'from-indigo-300 via-purple-200 to-blue-300' };
  };

  const timeOfDay = getTimeOfDay();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${timeOfDay.gradient} flex items-center justify-center animate-in fade-in duration-1000`}>
      <div className="text-center space-y-12 animate-in zoom-in duration-700">
        <div className="flex justify-center">
          {timeOfDay.icon}
        </div>
        <h1 className="text-[6rem] leading-none bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          {timeOfDay.greeting}
        </h1>
        <div className="flex gap-3 justify-center mt-8">
          <div className="w-4 h-4 bg-gray-400 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
          <div className="w-4 h-4 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
        </div>
      </div>
    </div>
  );
}
