import { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, User } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';

interface LiveCameraFeedProps {
  onSpeak: (text: string) => void;
}

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  color: string;
}

const familyMembers: FamilyMember[] = [
  { id: '1', name: 'Priya', relation: 'family.wife', color: 'from-pink-400 to-rose-400' },
  { id: '2', name: 'Anu', relation: 'family.daughter', color: 'from-purple-400 to-pink-400' },
  { id: '3', name: 'Ravi', relation: 'family.son', color: 'from-blue-400 to-cyan-400' },
  { id: '4', name: 'Maya', relation: 'family.granddaughter', color: 'from-yellow-400 to-orange-400' },
  { id: '5', name: 'Arjun', relation: 'family.grandson', color: 'from-green-400 to-emerald-400' },
  { id: '6', name: 'Dr. Kumar', relation: 'family.doctor', color: 'from-teal-400 to-cyan-400' },
];

export function LiveCameraFeed({ onSpeak }: LiveCameraFeedProps) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detectedPerson, setDetectedPerson] = useState<FamilyMember | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useLanguage();

  // Simulate face detection
  const simulateFaceDetection = () => {
    setIsDetecting(true);
    setTimeout(() => {
      // Randomly detect a family member (simulation)
      const randomMember = familyMembers[Math.floor(Math.random() * familyMembers.length)];
      setDetectedPerson(randomMember);
      setIsDetecting(false);
      
      // Speak the person's name
      const relationText = t(randomMember.relation);
      onSpeak(`${t('camera.thisIs')} ${randomMember.name}, ${relationText}`);
      
      // Clear detection after 5 seconds
      setTimeout(() => {
        setDetectedPerson(null);
      }, 5000);
    }, 2000);
  };

  const startCamera = async () => {
    setCameraError(null);
    
    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const errorMsg = 'Camera is not supported in this browser or environment.';
      setCameraError(errorMsg);
      onSpeak(errorMsg);
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      
      setIsCameraActive(true);
      setCameraError(null);
      onSpeak(t('camera.title'));
      
      // Start periodic face detection simulation
      const detectionInterval = setInterval(() => {
        if (isCameraActive && !isDetecting) {
          simulateFaceDetection();
        }
      }, 8000);
      
      return () => clearInterval(detectionInterval);
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      
      let errorMsg = '';
      if (error.name === 'NotAllowedError') {
        errorMsg = 'Camera access denied. Please grant camera permissions in your browser settings.';
      } else if (error.name === 'NotFoundError') {
        errorMsg = 'No camera found on this device.';
      } else if (error.name === 'NotReadableError') {
        errorMsg = 'Camera is already in use by another application.';
      } else if (error.name === 'SecurityError') {
        errorMsg = 'Camera access requires a secure connection (HTTPS).';
      } else {
        errorMsg = 'Unable to access camera. Please try again.';
      }
      
      setCameraError(errorMsg);
      onSpeak(errorMsg);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    
    setIsCameraActive(false);
    setDetectedPerson(null);
    setIsDetecting(false);
    setCameraError(null);
    setDemoMode(false);
  };

  const startDemoMode = () => {
    setDemoMode(true);
    setIsCameraActive(false);
    setCameraError(null);
    onSpeak('Starting demo mode - simulating face recognition');
    
    // Start periodic detection in demo mode
    detectionIntervalRef.current = setInterval(() => {
      if (!isDetecting) {
        simulateFaceDetection();
      }
    }, 8000);
    
    // Trigger first detection immediately
    setTimeout(simulateFaceDetection, 2000);
  };

  const stopDemoMode = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    setDemoMode(false);
    setDetectedPerson(null);
    setIsDetecting(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Camera className="w-10 h-10 text-purple-600" />
          <h2 className="text-[2.5rem]">{t('camera.title')}</h2>
        </div>
        
        <div className="flex gap-3">
          {!demoMode && (
            <Button
              size="lg"
              onClick={isCameraActive ? stopCamera : startCamera}
              className={`text-[1.3rem] px-6 py-6 ${
                isCameraActive 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              }`}
            >
              {isCameraActive ? (
                <>
                  <CameraOff className="w-6 h-6 mr-2" />
                  {t('camera.stopCamera')}
                </>
              ) : (
                <>
                  <Camera className="w-6 h-6 mr-2" />
                  {t('camera.startCamera')}
                </>
              )}
            </Button>
          )}
          
          <Button
            size="lg"
            onClick={demoMode ? stopDemoMode : startDemoMode}
            variant={demoMode ? 'destructive' : 'outline'}
            className="text-[1.3rem] px-6 py-6"
          >
            {demoMode ? (
              <>
                <CameraOff className="w-6 h-6 mr-2" />
                Stop Demo
              </>
            ) : (
              <>
                <User className="w-6 h-6 mr-2" />
                Demo Mode
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="relative rounded-3xl overflow-hidden bg-gray-900 aspect-video">
        {isCameraActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Detection Overlay */}
            {(isDetecting || detectedPerson) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="text-center space-y-6">
                  {isDetecting ? (
                    <>
                      <div className="w-32 h-32 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-[2rem] text-white">{t('camera.detecting')}</p>
                    </>
                  ) : detectedPerson ? (
                    <div className="animate-in zoom-in duration-500">
                      <div className={`w-48 h-48 mx-auto rounded-full bg-gradient-to-br ${detectedPerson.color} flex items-center justify-center shadow-2xl mb-6`}>
                        <User className="w-24 h-24 text-white" />
                      </div>
                      <div className="bg-white/95 rounded-3xl px-12 py-8 shadow-2xl">
                        <p className="text-[1.5rem] text-muted-foreground mb-2">{t('camera.thisIs')}</p>
                        <p className="text-[3rem] mb-3">{detectedPerson.name}</p>
                        <p className="text-[2rem] text-primary">{t(detectedPerson.relation)}</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </>
        ) : demoMode ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900 relative">
            {/* Demo Mode Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(147,51,234,0.3),transparent_50%)]"></div>
            
            {/* Detection Overlay for Demo */}
            {(isDetecting || detectedPerson) ? (
              <div className="relative z-10 text-center space-y-6">
                {isDetecting ? (
                  <>
                    <div className="w-32 h-32 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-[2rem] text-white">{t('camera.detecting')}</p>
                  </>
                ) : detectedPerson ? (
                  <div className="animate-in zoom-in duration-500">
                    <div className={`w-48 h-48 mx-auto rounded-full bg-gradient-to-br ${detectedPerson.color} flex items-center justify-center shadow-2xl mb-6`}>
                      <User className="w-24 h-24 text-white" />
                    </div>
                    <div className="bg-white/95 rounded-3xl px-12 py-8 shadow-2xl">
                      <p className="text-[1.5rem] text-muted-foreground mb-2">{t('camera.thisIs')}</p>
                      <p className="text-[3rem] mb-3">{detectedPerson.name}</p>
                      <p className="text-[2rem] text-primary">{t(detectedPerson.relation)}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="relative z-10 text-center space-y-4">
                <Camera className="w-32 h-32 text-white/60 mx-auto animate-pulse" />
                <p className="text-[2rem] text-white">Demo Mode Active</p>
                <p className="text-[1.3rem] text-white/80">Simulating face recognition...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center p-8">
            <div className="text-center space-y-6 max-w-2xl">
              <CameraOff className="w-32 h-32 text-gray-600 mx-auto" />
              <p className="text-[2rem] text-gray-400">{t('camera.startCamera')}</p>
              
              {cameraError && (
                <div className="bg-red-500/10 border-2 border-red-500 rounded-2xl p-6 text-white">
                  <p className="text-[1.5rem] mb-2">⚠️ Camera Error</p>
                  <p className="text-[1.2rem] opacity-90">{cameraError}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {!isCameraActive && !demoMode && (
        <div className="mt-6 p-6 bg-blue-50 rounded-2xl border-2 border-blue-200">
          <p className="text-[1.3rem] text-blue-900 text-center mb-3">
            💡 The camera will help you recognize family members when they visit
          </p>
          {cameraError && (
            <p className="text-[1.1rem] text-blue-700 text-center">
              💡 Tip: Use <strong>Demo Mode</strong> to see how face recognition works without camera access
            </p>
          )}
        </div>
      )}
      
      {demoMode && !isDetecting && !detectedPerson && (
        <div className="mt-6 p-6 bg-purple-50 rounded-2xl border-2 border-purple-300">
          <p className="text-[1.3rem] text-purple-900 text-center">
            🎭 Demo Mode: Simulating face recognition every 8 seconds
          </p>
        </div>
      )}
    </Card>
  );
}
