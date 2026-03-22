/**
 * Sample Data Generator for Testing Patient Reports
 * This utility generates sample activity log data for demonstration purposes
 */

interface ActivityLogEntry {
  id: string;
  timestamp: string;
  type: string;
  action: string;
  details?: string;
  mood?: string;
}

const moods = ['Great', 'Good', 'Okay', 'Anxious', 'Confused', 'Happy', 'Calm'];
const medications = ['Morning Medication', 'Afternoon Medication', 'Evening Medication'];
const musicTypes = ['Classical Music', 'Jazz', 'Oldies', 'Nature Sounds'];
const familyMembers = ['Sarah (Daughter)', 'Michael (Son)', 'Emily (Granddaughter)', 'Lisa (Friend)'];

export function generateSampleActivityData(daysBack: number = 30): ActivityLogEntry[] {
  const activities: ActivityLogEntry[] = [];
  const now = new Date();

  for (let day = 0; day < daysBack; day++) {
    const date = new Date(now);
    date.setDate(date.getDate() - day);

    // Morning activities (7-11 AM)
    const morningHour = 7 + Math.floor(Math.random() * 4);
    activities.push({
      id: `${date.getTime()}-morning-med`,
      timestamp: new Date(date.setHours(morningHour, Math.floor(Math.random() * 60))).toISOString(),
      type: 'medication',
      action: 'Medication taken',
      details: medications[0],
    });

    if (Math.random() > 0.3) {
      activities.push({
        id: `${date.getTime()}-morning-mood`,
        timestamp: new Date(date.setHours(morningHour + 1, Math.floor(Math.random() * 60))).toISOString(),
        type: 'mood',
        action: 'Mood recorded',
        mood: moods[Math.floor(Math.random() * moods.length)],
      });
    }

    // Afternoon activities (12-4 PM)
    const afternoonHour = 12 + Math.floor(Math.random() * 4);
    
    if (Math.random() > 0.2) {
      activities.push({
        id: `${date.getTime()}-afternoon-med`,
        timestamp: new Date(date.setHours(afternoonHour, Math.floor(Math.random() * 60))).toISOString(),
        type: 'medication',
        action: 'Medication taken',
        details: medications[1],
      });
    }

    if (Math.random() > 0.4) {
      activities.push({
        id: `${date.getTime()}-afternoon-music`,
        timestamp: new Date(date.setHours(afternoonHour + 1, Math.floor(Math.random() * 60))).toISOString(),
        type: 'music',
        action: 'Music therapy session',
        details: musicTypes[Math.floor(Math.random() * musicTypes.length)],
      });
    }

    if (Math.random() > 0.5) {
      activities.push({
        id: `${date.getTime()}-afternoon-call`,
        timestamp: new Date(date.setHours(afternoonHour + 2, Math.floor(Math.random() * 60))).toISOString(),
        type: 'call',
        action: 'Video call',
        details: `Call with ${familyMembers[Math.floor(Math.random() * familyMembers.length)]}`,
      });
    }

    // Evening activities (5-9 PM)
    const eveningHour = 17 + Math.floor(Math.random() * 4);
    
    if (Math.random() > 0.15) {
      activities.push({
        id: `${date.getTime()}-evening-med`,
        timestamp: new Date(date.setHours(eveningHour, Math.floor(Math.random() * 60))).toISOString(),
        type: 'medication',
        action: 'Medication taken',
        details: medications[2],
      });
    }

    if (Math.random() > 0.5) {
      activities.push({
        id: `${date.getTime()}-evening-mood`,
        timestamp: new Date(date.setHours(eveningHour + 1, Math.floor(Math.random() * 60))).toISOString(),
        type: 'mood',
        action: 'Mood recorded',
        mood: moods[Math.floor(Math.random() * moods.length)],
      });
    }

    // Random additional activities
    if (Math.random() > 0.6) {
      activities.push({
        id: `${date.getTime()}-random-activity`,
        timestamp: new Date(date.setHours(10 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60))).toISOString(),
        type: 'general',
        action: 'System interaction',
        details: 'Checked reminders',
      });
    }
  }

  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/**
 * Load sample data into localStorage for testing
 */
export function loadSampleData() {
  const sampleData = generateSampleActivityData(30);
  localStorage.setItem('dementia-care-activity-log', JSON.stringify(sampleData));
  console.log(`✅ Loaded ${sampleData.length} sample activity entries`);
  return sampleData;
}

/**
 * Clear all sample data
 */
export function clearSampleData() {
  localStorage.removeItem('dementia-care-activity-log');
  console.log('🗑️ Cleared sample data');
}
