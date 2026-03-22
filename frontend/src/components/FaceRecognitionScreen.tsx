import { ArrowLeft, Camera, User } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useState, useEffect } from 'react';

interface FaceRecognitionScreenProps {
  onNavigate: (screen: string) => void;
  onSpeak: (text: string) => void;
}

const knownPeople = [
  { name: 'Anu', relation: 'your daughter' },
  { name: 'Rajesh', relation: 'your son' },
  { name: 'Priya', relation: 'your wife' },
  { name: 'Dr. Kumar', relation: 'your doctor' },
];

export function FaceRecognitionScreen({ onNavigate, onSpeak }: FaceRecognitionScreenProps) {
  const [detectedPerson, setDetectedPerson] = useState<{ name: string; relation: string } | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    // Simulate face detection after 2 seconds
    const timer = setTimeout(() => {
      setIsScanning(false);
      const randomPerson = Math.random() > 0.3 
        ? knownPeople[Math.floor(Math.random() * knownPeople.length)]
        : null;
      
      setDetectedPerson(randomPerson);
      
      if (randomPerson) {
        onSpeak(`This is ${randomPerson.name}, ${randomPerson.relation}`);
      } else {
        onSpeak('Unrecognized person');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [onSpeak]);

  const handleRescan = () => {
    setIsScanning(true);
    setDetectedPerson(null);
    
    setTimeout(() => {
      setIsScanning(false);
      const randomPerson = Math.random() > 0.3 
        ? knownPeople[Math.floor(Math.random() * knownPeople.length)]
        : null;
      
      setDetectedPerson(randomPerson);
      
      if (randomPerson) {
        onSpeak(`This is ${randomPerson.name}, ${randomPerson.relation}`);
      } else {
        onSpeak('Unrecognized person');
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="lg"
          onClick={() => onNavigate('home')}
          className="text-xl px-6 py-6"
        >
          <ArrowLeft className="w-8 h-8 mr-2" />
          Back to Home
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl w-full mx-auto space-y-8">
        <h1 className="text-5xl text-center">Face Recognition</h1>

        {/* Camera Feed Simulation */}
        <Card className="w-full aspect-video bg-muted flex items-center justify-center relative overflow-hidden">
          {isScanning ? (
            <div className="flex flex-col items-center gap-4">
              <Camera className="w-32 h-32 text-muted-foreground animate-pulse" />
              <p className="text-2xl text-muted-foreground">Scanning...</p>
            </div>
          ) : detectedPerson ? (
            <div className="flex flex-col items-center gap-6 p-8 text-center">
              <div className="w-48 h-48 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-32 h-32 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-5xl text-primary">{detectedPerson.name}</h2>
                <p className="text-3xl text-foreground">{detectedPerson.relation}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 p-8 text-center">
              <div className="w-48 h-48 rounded-full bg-muted flex items-center justify-center">
                <User className="w-32 h-32 text-muted-foreground" />
              </div>
              <p className="text-4xl text-muted-foreground">Unrecognized person</p>
            </div>
          )}
        </Card>

        {/* Action Button */}
        <Button
          size="lg"
          onClick={handleRescan}
          className="text-2xl px-12 py-8"
          disabled={isScanning}
        >
          <Camera className="w-8 h-8 mr-3" />
          Scan Again
        </Button>
      </div>
    </div>
  );
}
