import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface VoiceCommandButtonProps {
  onCommand: (command: string) => void;
  onSpeak: (text: string) => void;
}

export function VoiceCommandButton({ onCommand, onSpeak }: VoiceCommandButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      
      // Set language based on current app language
      const langMap = {
        'en': 'en-US',
        'si': 'si-LK',
        'ta': 'ta-IN'
      };
      recognitionRef.current.lang = langMap[language] || 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);

        if (event.results[current].isFinal) {
          processCommand(transcriptText.toLowerCase());
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setTranscript('');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setTranscript('');
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language]);

  const processCommand = (command: string) => {
    // Map voice commands to actions
    const commandMap: { [key: string]: string } = {
      // English
      'show my family': 'family',
      'show family': 'family',
      'family': 'family',
      'medicine': 'medicine',
      'medication': 'medicine',
      'show medicine': 'medicine',
      'diary': 'diary',
      'memory': 'diary',
      'show diary': 'diary',
      'call someone': 'call',
      'make a call': 'call',
      'music': 'music',
      'play music': 'music',
      'how do i feel': 'mood',
      'mood': 'mood',
      'camera': 'camera',
      'face recognition': 'camera',
      
      // Sinhala (phonetic)
      'පවුල': 'family',
      'පවුල පෙන්වන්න': 'family',
      'ඖෂධ': 'medicine',
      'දිනපොත': 'diary',
      'සංගීතය': 'music',
      
      // Tamil (phonetic)
      'குடும்பம்': 'family',
      'மருந்து': 'medicine',
      'நாட்குறிப்பு': 'diary',
      'இசை': 'music',
    };

    // Find matching command
    for (const [key, value] of Object.entries(commandMap)) {
      if (command.includes(key)) {
        onCommand(value);
        onSpeak(`Opening ${value}`);
        return;
      }
    }

    // If no command matched
    onSpeak('Sorry, I did not understand that command');
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      onSpeak('Voice recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setTranscript('');
    } else {
      setIsListening(true);
      setTranscript('');
      recognitionRef.current.start();
      onSpeak(t('voice.listening'));
    }
  };

  return (
    <div className="relative">
      <Button
        size="lg"
        onClick={toggleListening}
        className={`relative overflow-hidden transition-all duration-300 ${
          isListening
            ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 scale-110'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
        } text-[1.3rem] px-8 py-8 h-auto shadow-xl`}
      >
        {isListening ? (
          <>
            <MicOff className="w-8 h-8 mr-3" />
            {t('voice.listening')}
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </>
        ) : (
          <>
            <Mic className="w-8 h-8 mr-3" />
            {t('voice.clickToSpeak')}
          </>
        )}
      </Button>

      {/* Listening Animation */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-max"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-primary">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-12 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-3 h-16 bg-primary rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-3 h-10 bg-primary rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                  <div className="w-3 h-14 bg-primary rounded-full animate-pulse" style={{ animationDelay: '450ms' }}></div>
                </div>
                <p className="text-[1.5rem]">{transcript || t('voice.listening')}</p>
              </div>
              <p className="text-[1.1rem] text-muted-foreground text-center">
                {t('voice.tryCommands')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
