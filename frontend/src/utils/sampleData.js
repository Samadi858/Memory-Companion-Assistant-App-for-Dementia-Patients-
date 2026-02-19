// Sample activity data generator for demo purposes
const moods = ["Great", "Good", "Okay", "Anxious", "Confused", "Happy", "Calm"];
const medications = ["Morning Medication", "Afternoon Medication", "Evening Medication"];
// Music types available: Classical Music, Jazz, Oldies, Nature Sounds
const contacts = ["Sarah (Daughter)", "Michael (Son)", "Emily (Granddaughter)", "Lisa (Friend)"];

function generateSampleData(days = 30) {
  const entries = [];
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Medication entries (3 per day, some missed)
    medications.forEach((med, idx) => {
      if (Math.random() > 0.15) {
        const ts = new Date(date);
        ts.setHours(8 + idx * 6, Math.floor(Math.random() * 30));
        entries.push({
          id: `med-${i}-${idx}`,
          type: "medication",
          description: med,
          timestamp: ts.toISOString(),
        });
      }
    });

    // Mood entries (1-2 per day)
    const moodCount = Math.random() > 0.5 ? 2 : 1;
    for (let j = 0; j < moodCount; j++) {
      const ts = new Date(date);
      ts.setHours(9 + j * 5, Math.floor(Math.random() * 60));
      entries.push({
        id: `mood-${i}-${j}`,
        type: "mood",
        mood: moods[Math.floor(Math.random() * moods.length)],
        description: `Feeling ${moods[Math.floor(Math.random() * moods.length)].toLowerCase()}`,
        timestamp: ts.toISOString(),
      });
    }

    // Call entries (some days)
    if (Math.random() > 0.6) {
      const ts = new Date(date);
      ts.setHours(10 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60));
      entries.push({
        id: `call-${i}`,
        type: "call",
        description: `Call with ${contacts[Math.floor(Math.random() * contacts.length)]}`,
        timestamp: ts.toISOString(),
      });
    }

    // Auto/gesture entries (random)
    if (Math.random() > 0.7) {
      const ts = new Date(date);
      ts.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
      entries.push({
        id: `auto-${i}`,
        type: Math.random() > 0.5 ? "gesture" : "auto",
        description: "System detected activity",
        timestamp: ts.toISOString(),
      });
    }
  }

  return entries.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

export function loadSampleData() {
  const data = generateSampleData(30);
  localStorage.setItem("dementia-care-activity-log", JSON.stringify(data));
  return data.map(d => ({ ...d, timestamp: new Date(d.timestamp) }));
}

export function loadActivityData() {
  const stored = localStorage.getItem("dementia-care-activity-log");
  if (stored) {
    try {
      return JSON.parse(stored).map(d => ({ ...d, timestamp: new Date(d.timestamp) }));
    } catch {
      return [];
    }
  }
  return [];
}

export function getPatientName() {
  const stored = localStorage.getItem("dementia-care-settings");
  if (stored) {
    try {
      const settings = JSON.parse(stored);
      return settings.patientName || "Patient";
    } catch {
      return "Patient";
    }
  }
  return "Patient";
}

export function exportReport(data) {
  const content = `
DEMENTIA CARE PATIENT REPORT
Generated: ${new Date().toLocaleString()}

=== SUMMARY ===
Total Activities: ${data.totalActivities}
Average Activities/Day: ${data.avgActivitiesPerDay}

=== ACTIVITY BREAKDOWN ===
Medication Events: ${data.medicationCount}
Emergency Calls: ${data.callCount}
Mood Entries: ${data.moodCount}

=== MEDICATION ADHERENCE ===
Medications Taken: ${data.medication.taken}
Expected: ${data.medication.expected}
Adherence Rate: ${data.medication.rate}%

=== MOOD PATTERNS ===
${data.moods.map(m => `${m.mood}: ${m.count} entries`).join('\n')}

=== RECOMMENDATIONS ===
- Continue monitoring medication adherence patterns
- Ensure patient knows how to use emergency call feature
- Maintain consistent daily routines
- Track mood patterns for healthcare provider discussions

---
This report is generated automatically from system activity logs.
Please consult with healthcare professionals for medical decisions.
  `;
  
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `patient-report-${new Date().toISOString().split("T")[0]}.txt`;
  a.click();
}
