# 🧠 Dementia Care System - Memory Helper

A beautiful, comprehensive assistive care system designed specifically for dementia patients. Features large buttons, warm colors, voice feedback, and therapeutic interactions.

![Dementia Care System](https://img.shields.io/badge/React-18.2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

## ✨ Features

### 🏠 Patient Dashboard
- **Photo Memory Wall** - Interactive family photo gallery with names and relationships
- **Medication Tracker** - Visual pill tracker with color-coded medications
- **Quick Connect** - One-tap video/phone calls to family members
- **Music Player** - Therapeutic music playlists with large controls
- **Mood Tracker** - Emotional check-in with emoji-based interface
- **Time-Aware Greetings** - Dynamic welcome messages based on time of day
- **Always-Visible Clock** - Large, clear time and date display

### 🔐 Caregiver Portal
- Password-protected settings (password: "caregiver")
- Manage family members and contacts
- Configure medication schedules
- View activity and mood logs
- System settings and preferences

### 🎨 Design Highlights
- **High Contrast Colors** - Easy to read for visually impaired users
- **Extra Large Text** - 2rem-5rem font sizes for maximum readability
- **Beautiful Gradients** - Calming, nature-inspired color schemes
- **Smooth Animations** - 1-2 second transitions, no sudden changes
- **Voice Indicators** - Visual feedback for all spoken messages
- **Touch-Friendly** - Large buttons and interactive elements

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Run development server**
```bash
npm run dev
```

3. **Open in browser**
```
http://localhost:5173
```

## 📁 Project Structure

```
dementia-care-system/
├── src/
│   ├── components/
│   │   ├── WelcomeScreen.tsx          # Time-based greeting screen
│   │   ├── EnhancedDashboard.tsx      # Main patient dashboard
│   │   ├── PhotoMemoryWall.tsx        # Family photo gallery
│   │   ├── MedicationTracker.tsx      # Medicine checklist
│   │   ├── QuickConnect.tsx           # Video call interface
│   │   ├── MusicPlayer.tsx            # Music therapy player
│   │   ├── MoodTracker.tsx            # Emotional check-in
│   │   ├── CaregiverSettings.tsx      # Admin portal
│   │   ├── VoiceIndicator.tsx         # Voice feedback UI
│   │   └── ui/                        # Reusable UI components
│   ├── styles/
│   │   └── globals.css                # Tailwind configuration
│   ├── App.tsx                        # Main app component
│   └── main.tsx                       # React entry point
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 🎯 Usage Guide

### Patient View
1. **Welcome Screen** - Shows time-appropriate greeting (auto-advances in 3 seconds)
2. **Main Dashboard** - Access all features from one screen
   - Click family photos to hear names
   - Check off medications as taken
   - Call family with one tap
   - Play calming music
   - Record your mood

### Caregiver Access
1. Click the **Settings icon** (top right)
2. Enter password: `caregiver`
3. Manage all system settings

## 🛠️ Customization

### Update Family Members
Edit `src/components/PhotoMemoryWall.tsx`:
```typescript
const familyMembers: FamilyMember[] = [
  { id: '1', name: 'Your Name', relation: 'Wife', color: 'from-pink-400 to-rose-400' },
  // Add more family members
];
```

### Modify Medications
Edit `src/components/MedicationTracker.tsx`:
```typescript
const [medications, setMedications] = useState<Medication[]>([
  { id: '1', name: 'Your Medicine', time: '8:00 AM', taken: false, color: 'bg-red-400' },
]);
```

### Change Music Playlist
Edit `src/components/MusicPlayer.tsx`:
```typescript
const playlist: Song[] = [
  { id: '1', title: 'Your Song', artist: 'Artist', color: 'from-cyan-400 to-blue-500' },
];
```

### Update Emergency Contacts
Edit `src/components/QuickConnect.tsx` - modify the `contacts` array

## 📦 Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

The build output will be in the `dist/` folder, ready for deployment.

## 🚀 Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
1. Build: `npm run build`
2. Publish directory: `dist`

## 🔮 Future Enhancements

- [ ] Real face recognition with camera integration
- [ ] Web Speech API for actual voice output
- [ ] Push notifications for medication reminders
- [ ] LocalStorage persistence for settings
- [ ] Backend integration with Supabase
- [ ] Video call integration (Twilio/Zoom)
- [ ] Activity timeline with photos
- [ ] GPS location tracking for wandering alerts
- [ ] Multi-language support

## 🎨 Tech Stack

- **React 18.2** - UI framework
- **TypeScript 5.2** - Type safety
- **Vite 5.0** - Build tool
- **Tailwind CSS 4.0** - Styling
- **Lucide React** - Icons
- **shadcn/ui** - Component library

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize for your own needs!

## 💡 Design Principles

1. **Simplicity over features** - Cognitive overload causes anxiety
2. **High contrast** - Bold colors for easy reading
3. **Large elements** - Readable from 6-10 feet away
4. **Minimal text** - Icons + single words
5. **Predictable layout** - Same layout every time
6. **No sudden changes** - Smooth transitions only

## 📞 Support

For questions or issues with this project, please open an issue on GitHub.

---

Made with ❤️ for dementia patients and their caregivers
