import { Music, Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';

interface MusicPlayerProps {
}

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const playlist = [
    { title: 'Classical Comfort', artist: 'Relaxing Piano', color: 'from-purple-500 to-pink-500' },
    { title: 'Golden Oldies', artist: 'Greatest Hits', color: 'from-blue-500 to-cyan-500' },
    { title: 'Nature Sounds', artist: 'Peaceful Rain', color: 'from-green-500 to-teal-500' },
  ];

  const currentSong = playlist[currentSongIndex];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const nextIndex = (currentSongIndex + 1) % playlist.length;
    setCurrentSongIndex(nextIndex);
  };

  const handlePrevious = () => {
    const prevIndex = currentSongIndex === 0 ? playlist.length - 1 : currentSongIndex - 1;
    setCurrentSongIndex(prevIndex);
  };

  return (
    <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl">
      <div className="flex items-center gap-4 mb-6">
        <Music className="w-10 h-10 text-purple-600" />
        <h2 className="text-[2.5rem]">Your Music</h2>
      </div>

      <div className={`bg-gradient-to-br ${currentSong.color} rounded-3xl p-8 mb-6 shadow-xl`}>
        <div className="text-white text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className={`w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}>
              <Music className="w-16 h-16" />
            </div>
          </div>
          <p className="text-[2rem]">{currentSong.title}</p>
          <p className="text-[1.3rem] opacity-90">{currentSong.artist}</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button
          size="lg"
          variant="outline"
          onClick={handlePrevious}
          className="w-20 h-20 rounded-full p-0"
        >
          <SkipBack className="w-8 h-8" />
        </Button>

        <Button
          size="lg"
          onClick={handlePlayPause}
          className="w-24 h-24 rounded-full p-0 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
        >
          {isPlaying ? (
            <Pause className="w-10 h-10" />
          ) : (
            <Play className="w-10 h-10 ml-1" />
          )}
        </Button>

        <Button
          size="lg"
          variant="outline"
          onClick={handleNext}
          className="w-20 h-20 rounded-full p-0"
        >
          <SkipForward className="w-8 h-8" />
        </Button>
      </div>

      <div className="mt-6 flex items-center gap-4 bg-gray-50 rounded-2xl p-4">
        <Volume2 className="w-6 h-6 text-muted-foreground" />
        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
        </div>
      </div>
    </Card>
  );
}