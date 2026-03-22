import { Volume2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface VoiceIndicatorProps {
  text: string;
  onComplete?: () => void;
}

export function VoiceIndicator({ text, onComplete }: VoiceIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 text-white px-12 py-8 rounded-2xl shadow-2xl flex items-center gap-6 max-w-5xl border-4 border-white/50 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex gap-2">
        <div className="w-4 h-4 bg-white rounded-full animate-pulse shadow-lg" style={{ animationDelay: '0ms' }}></div>
        <div className="w-4 h-4 bg-white rounded-full animate-pulse shadow-lg" style={{ animationDelay: '150ms' }}></div>
        <div className="w-4 h-4 bg-white rounded-full animate-pulse shadow-lg" style={{ animationDelay: '300ms' }}></div>
      </div>
      <Volume2 className="w-12 h-12 flex-shrink-0 drop-shadow-lg" />
      <p className="text-[2rem] leading-tight drop-shadow-md">{text}</p>
    </div>
  );
}
