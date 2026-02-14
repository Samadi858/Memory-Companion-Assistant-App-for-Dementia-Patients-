import { useState, useEffect } from 'react';
import { User, Heart } from 'lucide-react';
import { Card } from './ui/card';
import { FamilyMember } from './PhotoDatabaseManager';

const PHOTO_STORAGE_KEY = 'dementia-care-family-members';

const defaultMembers: FamilyMember[] = [
  { id: '1', name: 'Sarah', relation: 'Daughter', color: 'from-pink-400 to-rose-500' },
  { id: '2', name: 'Michael', relation: 'Son', color: 'from-blue-400 to-indigo-500' },
  { id: '3', name: 'Emily', relation: 'Granddaughter', color: 'from-purple-400 to-pink-500' },
  { id: '4', name: 'Robert', relation: 'Brother', color: 'from-green-400 to-teal-500' },
  { id: '5', name: 'Lisa', relation: 'Friend', color: 'from-yellow-400 to-orange-500' },
  { id: '6', name: 'David', relation: 'Grandson', color: 'from-cyan-400 to-blue-500' },
];

interface PhotoMemoryWallProps {
}

export function PhotoMemoryWall() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(defaultMembers);

  useEffect(() => {
    // Load family members from localStorage
    const stored = localStorage.getItem(PHOTO_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFamilyMembers(parsed);
      } catch (e) {
        console.error('Failed to load family members:', e);
        setFamilyMembers(defaultMembers);
      }
    }

    // Listen for storage changes (when caregiver updates the database)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === PHOTO_STORAGE_KEY && e.newValue) {
        try {
          setFamilyMembers(JSON.parse(e.newValue));
        } catch (err) {
          console.error('Failed to update family members:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl">
      <div className="flex items-center gap-4 mb-6">
        <Heart className="w-10 h-10 text-rose-500" />
        <h2 className="text-[2.5rem]">Your Loved Ones</h2>
      </div>
      
      {familyMembers.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-[1.5rem] text-muted-foreground">No family members added yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {familyMembers.map((member) => (
            <div
              key={member.id}
              className="group cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div className="relative">
                <div className={`w-full aspect-square rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow overflow-hidden`}>
                  {member.imageUrl ? (
                    <img 
                      src={member.imageUrl} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-colors"></div>
              </div>
              <div className="mt-3 text-center">
                <p className="text-[1.5rem]">{member.name}</p>
                <p className="text-[1.1rem] text-muted-foreground">{member.relation}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
