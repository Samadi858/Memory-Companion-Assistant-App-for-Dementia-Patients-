import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en';

interface Translations {
  [key: string]: string;
}

const translations: Translations = {
  // Welcome Screen
  'welcome.morning': 'Good Morning',
  'welcome.afternoon': 'Good Afternoon',
  'welcome.evening': 'Good Evening',
  'welcome.night': 'Good Night',
  
  // Dashboard
  'dashboard.greeting': "Here's your day at a glance",
  'dashboard.todaySchedule': "Today's Schedule",
  
  // Photo Memory Wall
  'family.title': 'Your Loved Ones',
  'family.wife': 'Wife',
  'family.husband': 'Husband',
  'family.daughter': 'Daughter',
  'family.son': 'Son',
  'family.granddaughter': 'Granddaughter',
  'family.grandson': 'Grandson',
  'family.sister': 'Sister',
  'family.brother': 'Brother',
  'family.mother': 'Mother',
  'family.father': 'Father',
  'family.friend': 'Friend',
  'family.caregiver': 'Caregiver',
  'family.doctor': 'Doctor',
  'family.nurse': 'Nurse',
  'family.neighbor': 'Neighbor',
  'family.spouse': 'Spouse',
  'family.noMembers': 'No family members added yet',
  
  // Medication
  'medicine.title': "Today's Medicine",
  'medicine.taken': 'taken',
  'medicine.markTaken': 'Mark as Taken',
  'medicine.bloodPressure': 'Blood Pressure',
  'medicine.vitaminD': 'Vitamin D',
  'medicine.heart': 'Heart Medicine',
  'medicine.pain': 'Pain Relief',
  'medicine.sleep': 'Sleep Aid',
  'medicine.alert': 'Time to take your medicine!',
  'medicine.dismiss': 'Dismiss',
  'medicine.snooze': 'Remind in 10 min',
  'medicine.morning': 'Morning',
  'medicine.afternoon': 'Afternoon',
  'medicine.evening': 'Evening',
  'medicine.night': 'Night',
  
  // Quick Connect
  'connect.title': 'Call Someone',
  'connect.video': 'Video',
  'connect.call': 'Call',
  'connect.emergency': 'Emergency',
  'connect.calling': 'Calling...',
  'connect.endCall': 'End Call',
  
  // Memory Diary
  'diary.title': 'Memory Diary',
  'diary.recent': 'Recent Activities',
  'diary.viewAll': 'View All Memories',
  'diary.addMemory': 'Add Memory',
  'diary.back': 'Back to Home',
  'diary.readAll': 'Read All',
  'diary.whatDidYouDo': 'What did you do?',
  'diary.save': 'Save Memory',
  'diary.noMemories': 'No memories yet',
  'diary.startAdding': 'Start adding your daily moments',
  
  // Mood Tracker
  'mood.title': 'How are you feeling?',
  'mood.happy': 'Happy',
  'mood.calm': 'Calm',
  'mood.okay': 'Okay',
  'mood.sad': 'Sad',
  'mood.worried': 'Worried',
  'mood.confused': 'Confused',
  'mood.anxious': 'Anxious',
  'mood.great': 'Great',
  'mood.good': 'Good',
  'mood.excited': 'Excited',
  'mood.thankyou': '✨ Thank you for sharing. Your caregiver will be notified.',
  
  // Caregiver Dashboard
  'caregiver.title': 'Family Member/ Guadian Dashboard',
  'caregiver.back': 'Back to Patient View',
  'caregiver.password': 'Enter Password',
  'caregiver.login': 'Access Dashboard',
  'caregiver.loginPrompt': 'Enter password to access caregiver settings',
  'caregiver.secureAccess': 'Protected Access',
  
  // Caregiver Cards
  'caregiver.scheduleTitle': 'Schedule Manager',
  'caregiver.scheduleDesc': 'Manage medications, meals, and daily tasks',
  'caregiver.scheduleBtn': 'Manage Schedule',
  
  'caregiver.activityTitle': 'Activity Log',
  'caregiver.activityDesc': 'Review patient activities and interactions',
  'caregiver.activityBtn': 'View Activity',
  
  'caregiver.settingsTitle': 'System Settings',
  'caregiver.settingsDesc': 'Customize app settings and preferences',
  'caregiver.settingsBtn': 'Open Settings',
  
  'caregiver.photoTitle': 'Photo Database',
  'caregiver.photoDesc': 'Manage family photos and information to help with memory and recognition',
  'caregiver.photoBtn': 'Manage Photos',
  
  'caregiver.reportTitle': 'Patient Reports',
  'caregiver.reportDesc': 'Generate comprehensive reports on daily activities and health patterns',
  'caregiver.reportBtn': 'Generate Report',
  
  // Photo Database Manager
  'photoDb.title': 'Photo Database',
  'photoDb.tip': 'Tip:',
  'photoDb.tipText': 'Add photos and information about family members and friends. These will appear in the "Your Loved Ones" section on the patient dashboard to help with recognition and memory.',
  'photoDb.peopleCount': 'people in database',
  'photoDb.person': 'person in database',
  'photoDb.addPerson': 'Add Person',
  'photoDb.editPerson': 'Edit Person',
  'photoDb.addNew': 'Add New Person',
  'photoDb.name': 'Name',
  'photoDb.nameRequired': 'Name *',
  'photoDb.namePlaceholder': 'e.g., Sarah Johnson',
  'photoDb.relationship': 'Relationship',
  'photoDb.relationshipRequired': 'Relationship *',
  'photoDb.selectRelationship': 'Select relationship',
  'photoDb.phoneNumber': 'Phone Number (Optional)',
  'photoDb.phonePlaceholder': 'e.g., (555) 123-4567',
  'photoDb.displayColor': 'Display Color',
  'photoDb.photo': 'Photo (Optional)',
  'photoDb.uploadPhoto': 'Upload Photo',
  'photoDb.changePhoto': 'Change Photo',
  'photoDb.removePhoto': 'Remove Photo',
  'photoDb.notes': 'Notes (Optional)',
  'photoDb.notesPlaceholder': 'Any helpful notes or reminders about this person...',
  'photoDb.save': 'Save',
  'photoDb.update': 'Update',
  'photoDb.edit': 'Edit',
  'photoDb.delete': 'Delete',
  'photoDb.confirmDelete': 'Are you sure you want to remove',
  'photoDb.fromDatabase': 'from the photo database?',
  'photoDb.noPeople': 'No people in database yet',
  'photoDb.clickAdd': 'Click "Add Person" to get started',
  'photoDb.backup': 'Backup & Restore',
  'photoDb.export': 'Export Data',
  'photoDb.import': 'Import Data',
  'photoDb.importConfirm': 'This will replace all current data. Continue?',
  'photoDb.importError': 'Error importing file. Please check the file format.',
  
  // Report Generator
  'report.title': 'Patient Report',
  'report.generated': 'Generated',
  'report.at': 'at',
  'report.last7days': 'Last 7 Days',
  'report.last14days': 'Last 14 Days',
  'report.last30days': 'Last 30 Days',
  'report.allTime': 'All Time',
  'report.print': 'Print',
  'report.export': 'Export',
  'report.totalActivities': 'Total Activities',
  'report.perDay': 'per day',
  'report.medication': 'Medication',
  'report.adherenceRate': 'Adherence rate',
  'report.moodEntries': 'Mood Entries',
  'report.trackedMoods': 'Tracked moods',
  'report.insights': 'Key Insights & Recommendations',
  'report.activityBreakdown': 'Activity Breakdown',
  'report.moodDistribution': 'Mood Distribution',
  'report.dailyTrend': 'Daily Activity Trend',
  'report.hourlyPattern': 'Activity Pattern by Hour',
  'report.medicationDetail': 'Medication Adherence Detail',
  'report.medicationsTaken': 'Medications Taken',
  'report.expected': 'Expected',
  'report.noData': 'No Activity Data Available',
  'report.noDataText': 'There are no activity logs to generate a report. The system will automatically start tracking activities once the patient begins using the application.',
  'report.loadSample': 'Load Sample Data (Demo)',
  'report.note': 'Note:',
  'report.noteText': 'This report is generated automatically from system activity logs. Please consult with healthcare professionals for medical decisions and treatment planning. Use this data as supplementary information for comprehensive patient care.',
  
  // Reminders/Scheduler
  'reminder.medication': 'Time for your medicine!',
  'reminder.task': 'Time for:',
  'reminder.done': 'Done',
  'reminder.snooze': 'Remind in 10 min',
  'task.breakfast': 'Breakfast Time',
  'task.lunch': 'Lunch Time',
  'task.dinner': 'Dinner Time',
  'task.exercise': 'Exercise Time',
  'schedule.saved': 'Schedule updated',
  
  // Common
  'common.of': 'of',
  'common.today': 'Today',
  'common.close': 'Close',
  'common.cancel': 'Cancel',
  'common.confirm': 'Confirm',
  'common.yes': 'Yes',
  'common.no': 'No',
  'common.loading': 'Loading...',
  'common.error': 'Error',
  'common.success': 'Success',
  
  // Settings
  'settings.title': 'Settings',
  'settings.language': 'Language',
  'settings.english': 'English',
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language] = useState<Language>('en');

  const setLanguage = (lang: Language) => {
    // Language is locked to English only
    console.log('Language is set to English only');
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key];
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
