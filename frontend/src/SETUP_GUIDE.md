# 🚀 Dementia Care System - VS Code Setup Guide

## Quick Setup Instructions

### 1. Create New React Project
```bash
npm create vite@latest dementia-care-system -- --template react-ts
cd dementia-care-system
```

### 2. Install Dependencies
```bash
npm install
npm install tailwindcss@next @tailwindcss/vite@next
npm install lucide-react
npm install clsx tailwind-merge class-variance-authority
```

### 3. Configure Vite

Edit `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

### 4. Update main.tsx

Edit `src/main.tsx`:
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### 5. Copy Project Files

**Folder Structure to Create:**
```
src/
├── App.tsx
├── main.tsx
├── components/
│   ├── WelcomeScreen.tsx
│   ├── EnhancedDashboard.tsx
│   ├── PatientDashboard.tsx
│   ├── CaregiverSettings.tsx
│   ├── VoiceIndicator.tsx
│   ├── PhotoMemoryWall.tsx
│   ├── MedicationTracker.tsx
│   ├── QuickConnect.tsx
│   ├── MusicPlayer.tsx
│   ├── MoodTracker.tsx
│   ├── FaceRecognitionScreen.tsx
│   ├── HomeScreen.tsx
│   ├── MemoryDiaryScreen.tsx
│   ├── RemindersScreen.tsx
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── (other UI components)
└── styles/
    └── globals.css
```

### 6. Install shadcn/ui Components

```bash
# Initialize shadcn/ui (if needed)
npx shadcn-ui@latest init

# Add required components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
```

### 7. Run the Project
```bash
npm run dev
```

Open `http://localhost:5173` in your browser!

---

## 📋 File Copy Checklist

Copy these files from Figma Make to your VS Code project:

### Core Files
- [ ] `/App.tsx` → `src/App.tsx`
- [ ] `/styles/globals.css` → `src/styles/globals.css`

### Main Components (8 files)
- [ ] `/components/WelcomeScreen.tsx`
- [ ] `/components/EnhancedDashboard.tsx`
- [ ] `/components/PatientDashboard.tsx`
- [ ] `/components/CaregiverSettings.tsx`
- [ ] `/components/VoiceIndicator.tsx`
- [ ] `/components/PhotoMemoryWall.tsx`
- [ ] `/components/MedicationTracker.tsx`
- [ ] `/components/QuickConnect.tsx`
- [ ] `/components/MusicPlayer.tsx`
- [ ] `/components/MoodTracker.tsx`

### Optional (Legacy) Components
- [ ] `/components/FaceRecognitionScreen.tsx`
- [ ] `/components/HomeScreen.tsx`
- [ ] `/components/MemoryDiaryScreen.tsx`
- [ ] `/components/RemindersScreen.tsx`

### UI Components (Copy from components/ui/)
- [ ] `button.tsx`
- [ ] `card.tsx`
- [ ] `input.tsx`
- [ ] `label.tsx`
- [ ] And others as needed...

---

## 🐛 Troubleshooting

### Issue: "Cannot find module" errors
**Solution:** Make sure all import paths use `./` or `../`:
```typescript
import { Button } from './components/ui/button'
import { WelcomeScreen } from './components/WelcomeScreen'
```

### Issue: Tailwind styles not working
**Solution:** 
1. Make sure `globals.css` is imported in `main.tsx`
2. Verify `@tailwindcss/vite` is in your `vite.config.ts`

### Issue: Component not rendering
**Solution:** Check the browser console for errors. Most common issues:
- Missing dependencies (run `npm install`)
- Incorrect import paths
- Missing UI components from shadcn

---

## 🎨 Customization Guide

### Change Family Members
Edit `src/components/PhotoMemoryWall.tsx` (lines 10-17)

### Update Medications
Edit `src/components/MedicationTracker.tsx` (lines 16-22)

### Modify Music Playlist
Edit `src/components/MusicPlayer.tsx` (lines 15-20)

### Change Emergency Contacts
Edit `src/components/QuickConnect.tsx` (lines 13-31)

---

## 📱 Next Steps

### Add Real Features:
1. **Web Speech API** - Add real voice output
2. **LocalStorage** - Save medication checkmarks
3. **Camera Access** - Real face recognition
4. **Push Notifications** - Medication reminders
5. **Backend** - Connect to Supabase for data sync

### Deployment:
```bash
# Build for production
npm run build

# Deploy to Vercel/Netlify
npm install -g vercel
vercel
```

---

## 📞 Need Help?

Common commands:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm install` - Install all dependencies

Happy coding! 🎉
