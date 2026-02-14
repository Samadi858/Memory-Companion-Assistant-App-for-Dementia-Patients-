import { Pill, CheckCircle2, Circle, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';

interface MedicationTrackerProps {
  onSpeak: (text: string) => void;
}

interface Medication {
  id: string;
  name: string;
  time: string;
  taken: boolean;
  color: string;
}

export function MedicationTracker({ onSpeak }: MedicationTrackerProps) {
  const [medications, setMedications] = useState<Medication[]>([
    { id: '1', name: 'Blood Pressure', time: '8:00 AM', taken: true, color: 'bg-red-400' },
    { id: '2', name: 'Vitamin D', time: '8:00 AM', taken: true, color: 'bg-yellow-400' },
    { id: '3', name: 'Heart Medicine', time: '2:00 PM', taken: false, color: 'bg-blue-400' },
    { id: '4', name: 'Pain Relief', time: '6:00 PM', taken: false, color: 'bg-green-400' },
    { id: '5', name: 'Sleep Aid', time: '9:00 PM', taken: false, color: 'bg-purple-400' },
  ]);

  const handleToggleMedication = (id: string) => {
    setMedications(medications.map(med => {
      if (med.id === id) {
        const newTaken = !med.taken;
        onSpeak(newTaken ? `${med.name} marked as taken` : `${med.name} marked as not taken`);
        return { ...med, taken: newTaken };
      }
      return med;
    }));
  };

  const takenCount = medications.filter(m => m.taken).length;

  return (
    <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Pill className="w-10 h-10 text-blue-600" />
          <h2 className="text-[2.5rem]">Today's Medicine</h2>
        </div>
        <div className="text-right">
          <p className="text-[2rem] text-primary">{takenCount} of {medications.length}</p>
          <p className="text-[1.2rem] text-muted-foreground">taken</p>
        </div>
      </div>

      <div className="space-y-4">
        {medications.map((med) => (
          <button
            key={med.id}
            onClick={() => handleToggleMedication(med.id)}
            className="w-full group"
          >
            <div className={`flex items-center gap-6 p-4 rounded-2xl transition-all ${
              med.taken 
                ? 'bg-green-50 border-2 border-green-300' 
                : 'bg-gray-50 border-2 border-gray-200 hover:border-primary'
            }`}>
              <div className={`w-16 h-16 ${med.color} rounded-full flex items-center justify-center shadow-lg ${
                med.taken ? 'opacity-50' : ''
              }`}>
                <Pill className="w-8 h-8 text-white" />
              </div>

              <div className="flex-1 text-left">
                <p className={`text-[1.8rem] ${med.taken ? 'line-through text-muted-foreground' : ''}`}>
                  {med.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <p className="text-[1.3rem] text-muted-foreground">{med.time}</p>
                </div>
              </div>

              <div className="flex-shrink-0">
                {med.taken ? (
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                ) : (
                  <Circle className="w-12 h-12 text-gray-300 group-hover:text-primary transition-colors" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}
