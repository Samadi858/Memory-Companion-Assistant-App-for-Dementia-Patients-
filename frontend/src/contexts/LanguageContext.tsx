import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'si' | 'ta';

interface Translations {
  [key: string]: {
    en: string;
    si: string;
    ta: string;
  };
}

const translations: Translations = {
  // Welcome Screen
  'welcome.morning': { en: 'Good Morning', si: 'සුබ උදෑසනක්', ta: 'காலை வணக்கம்' },
  'welcome.afternoon': { en: 'Good Afternoon', si: 'සුබ පස්වරුවක්', ta: 'மதிய வணக்கம்' },
  'welcome.evening': { en: 'Good Evening', si: 'සුබ සන්ධ්‍යාවක්', ta: 'மாலை வணக்கம்' },
  'welcome.night': { en: 'Good Night', si: 'සුබ රාත්‍රියක්', ta: 'இரவு வணக்கம்' },
  
  // Dashboard
  'dashboard.greeting': { en: "Here's your day at a glance", si: 'ඔබේ දිනය එකබලා', ta: 'உங்கள் நாளின் சுருக்கம்' },
  
  // Photo Memory Wall
  'family.title': { en: 'Your Loved Ones', si: 'ඔබේ ආදරණීයයන්', ta: 'உங்கள் அன்புக்குரியவர்கள்' },
  'family.wife': { en: 'Your Wife', si: 'ඔබේ බිරිඳ', ta: 'உங்கள் மனைவி' },
  'family.daughter': { en: 'Your Daughter', si: 'ඔබේ දුව', ta: 'உங்கள் மகள்' },
  'family.son': { en: 'Your Son', si: 'ඔබේ පුතා', ta: 'உங்கள் மகன்' },
  'family.granddaughter': { en: 'Your Granddaughter', si: 'ඔබේ මිණිබිරිය', ta: 'உங்கள் பேத்தி' },
  'family.grandson': { en: 'Your Grandson', si: 'ඔබේ මුනුබුරා', ta: 'உங்கள் பேரன்' },
  'family.doctor': { en: 'Your Doctor', si: 'ඔබේ වෛද්‍යවරයා', ta: 'உங்கள் மருத்துவர்' },
  
  // Medication
  'medicine.title': { en: "Today's Medicine", si: 'අද ඖෂධ', ta: 'இன்றைய மருந்து' },
  'medicine.taken': { en: 'taken', si: 'ගත්තා', ta: 'எடுத்தது' },
  'medicine.bloodPressure': { en: 'Blood Pressure', si: 'රුධිර පීඩනය', ta: 'இரத்த அழுத்தம்' },
  'medicine.vitaminD': { en: 'Vitamin D', si: 'විටමින් ඩී', ta: 'வைட்டமின் டி' },
  'medicine.heart': { en: 'Heart Medicine', si: 'හෘද ඖෂධය', ta: 'இதய மருந்து' },
  'medicine.pain': { en: 'Pain Relief', si: 'වේදනා නිවාරණය', ta: 'வலி நிவாரணி' },
  'medicine.sleep': { en: 'Sleep Aid', si: 'නිදි ඖෂධය', ta: 'தூக்க மருந்து' },
  'medicine.alert': { en: 'Time to take your medicine!', si: 'ඖෂධ ගන්න වේලාව!', ta: 'மருந்து எடுக்க வேண்டிய நேரம்!' },
  'medicine.dismiss': { en: 'Dismiss', si: 'නිෂ්ක්‍රීයයි', ta: 'நீக்கு' },
  'medicine.snooze': { en: 'Remind in 10 min', si: 'මිනිත්තු 10කින් මතක්කරන්න', ta: '10 நிமிடத்தில் நினைவூட்டு' },
  
  // Quick Connect
  'connect.title': { en: 'Call Someone', si: 'කෙනෙකුට කතා කරන්න', ta: 'ஒருவரை அழைக்கவும்' },
  'connect.video': { en: 'Video', si: 'වීඩියෝ', ta: 'வீடியோ' },
  'connect.call': { en: 'Call', si: 'කතා කරන්න', ta: 'அழைப்பு' },
  'connect.emergency': { en: 'Emergency', si: 'හදිසි', ta: 'அவசரநிலை' },
  
  // Music
  'music.title': { en: 'Your Music', si: 'ඔබේ සංගීතය', ta: 'உங்கள் இசை' },
  
  // Memory Diary
  'diary.title': { en: 'Memory Diary', si: 'මතක දිනපොත', ta: 'நினைவு நாட்குறிப்பு' },
  'diary.recent': { en: 'Recent Activities', si: 'මෑත ක්‍රියාකාරකම්', ta: 'சமீபத்திய செயல்பாடுகள்' },
  'diary.viewAll': { en: 'View All Memories', si: 'සියලු මතක බලන්න', ta: 'அனைத்து நினைவுகளையும் பார்க்க' },
  'diary.addMemory': { en: 'Add Memory', si: 'මතකය එක් කරන්න', ta: 'நினைவைச் சேர்க்கவும்' },
  'diary.back': { en: 'Back to Home', si: 'ආපසු මුල් පිටුවට', ta: 'முகப்புக்குத் திரும்பு' },
  'diary.readAll': { en: 'Read All', si: 'සියල්ල කියවන්න', ta: 'அனைத்தையும் படிக்கவும்' },
  'diary.whatDidYouDo': { en: 'What did you do?', si: 'ඔබ මොනවා කළාද?', ta: 'நீங்கள் என்ன செய்தீர்கள்?' },
  
  // Mood Tracker
  'mood.title': { en: 'How are you feeling?', si: 'ඔබට කොහොමද?', ta: 'நீங்கள் எப்படி உணருகிறீர்கள்?' },
  'mood.happy': { en: 'Happy', si: 'සතුටුයි', ta: 'மகிழ்ச்சி' },
  'mood.calm': { en: 'Calm', si: 'සන්සුන්', ta: 'அமைதியான' },
  'mood.okay': { en: 'Okay', si: 'හොඳයි', ta: 'சரி' },
  'mood.sad': { en: 'Sad', si: 'දුකයි', ta: 'சோகம்' },
  'mood.worried': { en: 'Worried', si: 'කනස්සල්ලෙන්', ta: 'கவலை' },
  'mood.thankyou': { en: '✨ Thank you for sharing. Your caregiver will be notified.', si: '✨ බෙදාගැනීමට ස්තූතියි. ඔබේ භාරකරුට දැනුම් දෙනු ඇත.', ta: '✨ பகிர்ந்ததற்கு நன்றி. உங்கள் பராமரிப்பாளருக்கு அறிவிக்கப்படும்.' },
  
  // Camera/Face Recognition
  'camera.title': { en: 'Face Recognition', si: 'මුහුණ හඳුනාගැනීම', ta: 'முக அங்கீகாரம்' },
  'camera.detecting': { en: 'Detecting...', si: 'හඳුනාගනිමින්...', ta: 'கண்டறிகிறது...' },
  'camera.thisIs': { en: 'This is', si: 'මෙය', ta: 'இது' },
  'camera.startCamera': { en: 'Start Camera', si: 'කැමරාව ආරම්භ කරන්න', ta: 'கேமராவைத் தொடங்கு' },
  'camera.stopCamera': { en: 'Stop Camera', si: 'කැමරාව නවත්වන්න', ta: 'கேமராவை நிறுத்து' },
  'camera.showCamera': { en: 'Show Camera', si: 'කැමරාව පෙන්වන්න', ta: 'கேமராவைக் காட்டு' },
  'camera.hideCamera': { en: 'Hide Camera', si: 'කැමරාව සඟවන්න', ta: 'கேமராவை மறைக்கவும்' },
  
  // Voice Commands
  'voice.listening': { en: 'Listening...', si: 'අහනවා...', ta: 'கேட்கிறது...' },
  'voice.clickToSpeak': { en: 'Click to speak', si: 'කතා කිරීමට ක්ලික් කරන්න', ta: 'பேச கிளிக் செய்யவும்' },
  'voice.tryCommands': { en: 'Try: "Show my family", "Medicine", "Diary"', si: '"මගේ පවුල පෙන්වන්න", "ඖෂධ", "දිනපොත"', ta: '"என் குடும்பத்தைக் காட்டு", "மருந்து", "நாட்குறிப்பு"' },
  
  // Settings
  'settings.title': { en: 'Settings', si: 'සැකසීම්', ta: 'அமைப்புகள்' },
  'settings.language': { en: 'Language', si: 'භාෂාව', ta: 'மொழி' },
  'settings.english': { en: 'English', si: 'English', ta: 'English' },
  'settings.sinhala': { en: 'සිංහල', si: 'සිංහල', ta: 'සිංහල' },
  'settings.tamil': { en: 'தமிழ்', si: 'தமிழ்', ta: 'தமிழ்' },
  
  // Caregiver
  'caregiver.title': { en: 'Caregiver Dashboard', si: 'භාරකරු පුවරුව', ta: 'பராமரிப்பாளர் டாஷ்போர்டு' },
  'caregiver.back': { en: 'Back to Patient View', si: 'රෝගියාගේ දසුනට', ta: 'நோயாளி பார்வைக்குத் திரும்பு' },
  
  // Reminders/Scheduler
  'reminder.medication': { en: 'Time for your medicine!', si: 'ඖෂධ ගන්න වේලාව!', ta: 'மருந்து எடுக்க வேண்டிய நேரம்!' },
  'reminder.task': { en: 'Time for:', si: 'කරන්න වේලාව:', ta: 'நேரம்:' },
  'reminder.done': { en: 'Done', si: 'කළා', ta: 'முடிந்தது' },
  'reminder.snooze': { en: 'Remind in 10 min', si: 'මිනිත්තු 10කින්', ta: '10 நிமிடத்தில்' },
  'task.breakfast': { en: 'Breakfast Time', si: 'උදෑසන කෑම වේලාව', ta: 'காலை உணவு நேரம்' },
  'task.lunch': { en: 'Lunch Time', si: 'දිවා කෑම වේලාව', ta: 'மதிய உணவு நேரம்' },
  'task.dinner': { en: 'Dinner Time', si: 'රාත්‍රී කෑම වේලාව', ta: 'இரவு உணவு நேரம்' },
  'task.exercise': { en: 'Exercise Time', si: 'ව්‍යායාම වේලාව', ta: 'உடற்பயிற்சி நேரம்' },
  'schedule.saved': { en: 'Schedule updated', si: 'කාලසටහන යාවත්කාලීන කළා', ta: 'அட்டவணை புதுப்பிக்கப்பட்டது' },
  
  // Common
  'common.of': { en: 'of', si: 'න්', ta: 'இல்' },
  'common.today': { en: 'Today', si: 'අද', ta: 'இன்று' },
  'common.close': { en: 'Close', si: 'වසන්න', ta: 'மூடு' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('dementia-app-language');
    return (stored as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('dementia-app-language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
