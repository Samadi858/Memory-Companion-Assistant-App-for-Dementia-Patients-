import { useEffect, useState } from 'react';
import { Heart, Image as ImageIcon, User } from 'lucide-react';

import { Card } from './ui/card';
import { useLanguage } from '../contexts/LanguageContext';
import { memoryService, MemoryItem } from '../services/memoryService';
import { API_BASE_URL } from '../services/api';

const DEFAULT_COLOR = 'from-blue-400 to-indigo-500';

export function PhotoMemoryWall() {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const load = async () => {
      try {
        const items = await memoryService.getTimelineMemories();
        setMemories(items);
      } catch {
        setMemories([]);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <Card className="p-4 sm:p-6 lg:p-8 bg-white/90 backdrop-blur-sm shadow-xl">
      <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
        <Heart className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-rose-500" />
        <h2 className="text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem]">{t('family.title')}</h2>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading memories...</div>
      ) : memories.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-[1.1rem] sm:text-[1.3rem] lg:text-[1.5rem] text-muted-foreground">No photo memories yet</p>
        </div>
      ) : (
        <div className="pr-1 sm:pr-2">
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {memories.map((memory) => (
              <div key={memory.id} className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]">
                <div className="relative">
                  <div className={`w-full aspect-square rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-shadow bg-gradient-to-br ${memory.display_color || DEFAULT_COLOR}`}>
                    {memory.image_url ? (
                      <img
                        src={`${API_BASE_URL}${memory.image_url}`}
                        alt={memory.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-14 h-14 sm:w-16 sm:h-16 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>

                <div className="mt-2 text-center">
                  <p className="text-sm sm:text-base lg:text-lg font-medium truncate">{memory.name}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{memory.relationship}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
