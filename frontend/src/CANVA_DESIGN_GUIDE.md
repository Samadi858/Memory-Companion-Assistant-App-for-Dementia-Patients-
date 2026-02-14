# Complete Design Guide for Dementia Assistive System - Canva Edition

## 🎨 Global Design System

### Color Palette
**Primary Colors:**
- Primary Blue: `#2563EB` (main interactive elements)
- Background Gradient: `#F0F4FF` → `#E8F3F1` → `#FFF5E8` (135° diagonal)
- White Cards: `#FFFFFF` with transparency at 90%
- Text Primary: `#1A1A2E` (dark navy)
- Text Muted: `#64748B` (gray)

**Accent Colors:**
- Success Green: `#10B981`
- Rose/Pink: `#F43F5E` (for heart/love icons)
- Purple: `#A855F7` (for music)
- Blue variants: `#3B82F6` (for medical)
- Orange: `#FB923C` (for morning/warmth)

**Time-Based Gradients:**
- Morning: Orange `#FED7AA` → Yellow `#FEF9C3` → Blue `#DBEAFE`
- Afternoon: Blue `#BFDBFE` → Cyan `#CFFAFE` → Yellow `#FEF9C3`
- Evening: Purple `#E9D5FF` → Pink `#FBCFE8` → Orange `#FED7AA`
- Night: Indigo `#C7D2FE` → Purple `#E9D5FF` → Blue `#BFDBFE`

### Typography System
**Font Sizes (all measurements assume base 20px):**
- Mega Title: `6rem` (120px) - Welcome screen greeting
- Large Title: `5rem` (100px) - Page headers
- Section Header: `3.5rem` (70px) - Time display
- Card Title: `2.5rem` (50px) - Component headers
- Large Text: `2rem` (40px) - Important info
- Body Large: `1.8rem` (36px) - List items
- Body Medium: `1.5rem` (30px) - Secondary text
- Body Normal: `1.3rem` (26px) - Tertiary text
- Small Text: `1.2rem` (24px) - Labels
- Tiny Text: `1rem` (20px) - Metadata

**Font Weights:**
- Headers: 700 (Bold)
- Normal Text: 500 (Medium)
- Buttons: 700 (Bold)

**Line Height:** 1.5 for all text

### Spacing & Layout
- Card Padding: 32px - 48px
- Component Gaps: 24px - 32px
- Border Radius: 20px (cards), 16px (buttons), 24px (rounded elements)
- Shadow: Soft, layered shadows for depth
- Max Content Width: 1800px

### Icons
- Use Lucide React icons style (simple line icons)
- Small Icons: 24px - 32px
- Medium Icons: 40px - 48px
- Large Icons: 64px - 128px
- Emoji Icons: 56px - 70px for expressions

---

## 📱 Screen 1: Welcome Screen (3-Second Splash)

### Layout
- **Full screen gradient background** (time-dependent)
- **Centered vertically and horizontally**
- **No navigation or buttons** (auto-advances after 3 seconds)

### Elements
1. **Time Icon** (centered, top third)
   - Size: 128px × 128px
   - Icons based on time:
     - Morning (5am-12pm): Sunrise icon (orange `#FB923C`)
     - Afternoon (12pm-5pm): Sun icon (yellow `#EAB308`)
     - Evening (5pm-8pm): Cloud icon (purple `#A855F7`)
     - Night (8pm-5am): Moon icon (indigo `#818CF8`)
   
2. **Greeting Text** (center)
   - Font Size: 6rem (120px)
   - Text: "Good Morning" / "Good Afternoon" / "Good Evening" / "Good Night"
   - Gradient Text: Gray `#1F2937` → Gray `#4B5563`
   - Font Weight: 700
   - Line Height: 1
   
3. **Loading Indicator** (below text, 40px spacing)
   - 3 dots, 16px × 16px each
   - Color: Gray `#9CA3AF`
   - Spacing between dots: 12px
   - Animation: Pulsing (sequential delays 0ms, 200ms, 400ms)

### Background Gradients
- Morning: `#FED7AA` → `#FEF9C3` → `#DBEAFE`
- Afternoon: `#BFDBFE` → `#CFFAFE` → `#FEF9C3`
- Evening: `#E9D5FF` → `#FBCFE8` → `#FED7AA`
- Night: `#C7D2FE` → `#E9D5FF` → `#BFDBFE`

---

## 📊 Screen 2: Patient Dashboard (Main Interface)

### Header Section (Sticky Top Bar)
**Background:** Gradient matching time of day + subtle transparency
**Height:** ~120px
**Border:** 4px bottom border, Primary `#2563EB` at 20% opacity

**Left Side:**
1. **Time Icon** (48px)
2. **Time Display** (next to icon)
   - Time: 3.5rem (70px), gradient text
   - Date: 1.5rem (30px), muted text
   - Format: "3:45 PM" / "Monday, October 19, 2025"

**Right Side:**
1. **Weather Card** (white background 80% opacity)
   - Thermometer icon: 32px (orange)
   - Temperature: 2rem (40px)
   - Condition: 1rem (20px)
   
2. **Settings Icon** (gear)
   - Size: 32px
   - Gray color
   - Circular button 64px × 64px
   - Subtle hover effect

### Content Area
**Background:** Ambient gradient (matches global)
**Max Width:** 1800px
**Padding:** 24px sides, 32px top

**Greeting Section:**
- Title: "Good Morning!" (3rem / 60px)
- Subtitle: "Here's your day at a glance" (1.8rem / 36px, muted)
- Spacing: 24px below

### Component Grid Layout
**Grid:** Responsive 3-column layout
- Mobile: 1 column
- Tablet: 2 columns  
- Desktop: 3 columns
- Gap: 24px

---

### Component 1: Photo Memory Wall
**Span:** 2 columns on large screens
**Background:** White 90% opacity, soft shadow
**Padding:** 32px
**Border Radius:** 20px

**Header:**
- Heart icon (40px) + "Your Loved Ones" (2.5rem)
- Color: Rose `#F43F5E`

**Photo Grid:** 3 columns × 2 rows
**Each Photo Card:**
- Aspect Ratio: 1:1 (square)
- Size: ~180px per side
- Border Radius: 16px
- Shadow: Medium depth
- Hover: Scale 1.05, shadow increases

**Photo Placeholder:**
- Gradient backgrounds (unique per person):
  1. Pink `#F472B6` → Rose `#FB7185`
  2. Purple `#C084FC` → Pink `#F472B6`
  3. Blue `#60A5FA` → Cyan `#22D3EE`
  4. Yellow `#FACC15` → Orange `#FB923C`
  5. Green `#4ADE80` → Emerald `#34D399`
  6. Teal `#2DD4BF` → Cyan `#22D3EE`
- User icon: 64px, white color, centered

**Name Labels (below each photo):**
- Name: 1.5rem (30px), bold
- Relation: 1.1rem (22px), muted
- Center aligned

**Family Members:**
1. Priya - "Your Wife"
2. Anu - "Your Daughter"
3. Ravi - "Your Son"
4. Maya - "Your Granddaughter"
5. Arjun - "Your Grandson"
6. Dr. Kumar - "Your Doctor"

---

### Component 2: Quick Connect (Call Someone)
**Span:** 1 column
**Background:** White 90% opacity
**Padding:** 32px

**Header:**
- Phone icon (40px, green `#16A34A`) + "Call Someone" (2.5rem)

**Contact Cards:** 3 cards stacked vertically
**Each Contact Card:**
- Gradient background (full card)
- Border Radius: 16px
- Padding: 24px
- Shadow: Large
- Spacing: 16px between cards

**Contact 1 - Anu (Daughter):**
- Gradient: Pink `#EC4899` → Rose `#F43F5E`
- Emoji: 👧 (3rem / 48px)
- Name: 2rem (40px), white
- Relation: 1.3rem (26px), white 90% opacity

**Contact 2 - Ravi (Son):**
- Gradient: Blue `#3B82F6` → Cyan `#06B6D4`
- Emoji: 👨
- Same text sizes

**Contact 3 - Emergency (911):**
- Gradient: Red `#DC2626` → Orange `#EA580C`
- Emoji: 🚨
- Name: "Emergency", Relation: "911"

**Button Row (2 buttons per contact):**
- Width: 50% each
- Height: 56px
- Background: White 20% opacity
- Border: 2px white 50% opacity
- Text: 1.3rem (26px), white
- Icons: 24px (Video/Phone)

---

### Component 3: Today's Medicine (Medication Tracker)
**Span:** 2 columns
**Background:** White 90% opacity
**Padding:** 32px

**Header Section:**
- Left: Pill icon (40px, blue `#2563EB`) + "Today's Medicine" (2.5rem)
- Right: "2 of 5 / taken" (2rem / 1.2rem)

**Medication List:** 5 items, stacked
**Each Medication Row:**
- Height: ~100px
- Border Radius: 16px
- Padding: 16px
- Border: 2px
- Spacing: 16px between rows

**States:**
- **Not Taken:** Gray background `#F9FAFB`, gray border `#E5E7EB`
- **Taken:** Green background `#F0FDF4`, green border `#86EFAC`, strikethrough text

**Row Contents:**
1. **Pill Circle** (left)
   - Size: 64px circle
   - Colors per medication:
     - Blood Pressure: Red `#F87171`
     - Vitamin D: Yellow `#FACC15`
     - Heart Medicine: Blue `#60A5FA`
     - Pain Relief: Green `#4ADE80`
     - Sleep Aid: Purple `#C084FC`
   - Pill icon: 32px white
   - Shadow

2. **Medicine Info** (center)
   - Name: 1.8rem (36px)
   - Time with clock icon: 1.3rem (26px), muted
   - Clock icon: 20px

3. **Checkbox** (right)
   - Size: 48px
   - Not taken: Empty circle, gray `#D1D5DB`
   - Taken: Green checkmark `#16A34A`, 48px

**Medications:**
1. Blood Pressure - 8:00 AM (✓ taken)
2. Vitamin D - 8:00 AM (✓ taken)
3. Heart Medicine - 2:00 PM (not taken)
4. Pain Relief - 6:00 PM (not taken)
5. Sleep Aid - 9:00 PM (not taken)

---

### Component 4: Your Music (Music Player)
**Span:** 1 column
**Background:** White 90% opacity
**Padding:** 32px

**Header:**
- Music icon (40px, purple `#A855F7`) + "Your Music" (2.5rem)

**Album Display:**
- Gradient card (matches current song)
- Border Radius: 24px
- Padding: 32px
- Shadow: Extra large
- Margin Bottom: 24px

**Current Song Card:**
- Gradient: Cyan `#22D3EE` → Blue `#3B82F6` (for "Peaceful Morning")
- Album icon circle: 128px, white 20% background, centered
- Music icon inside: 64px white
- Pulse animation when playing
- Title: 2rem (40px), white, centered
- Artist: 1.3rem (26px), white 90%, centered

**Control Buttons (Row):**
- Spacing: 16px between
- Center aligned

1. **Previous Button:**
   - Size: 80px circle
   - White background, outlined
   - Skip-back icon: 32px

2. **Play/Pause Button:**
   - Size: 96px circle
   - Gradient: Purple `#9333EA` → Pink `#EC4899`
   - Icon: 40px white
   - Shadow: Large

3. **Next Button:**
   - Size: 80px circle
   - White background, outlined
   - Skip-forward icon: 32px

**Volume Control (below buttons):**
- Background: Gray `#F9FAFB`
- Border Radius: 16px
- Padding: 16px
- Volume icon: 24px left side
- Progress bar: Height 12px
  - Background: Gray `#E5E7EB`
  - Fill: Purple-Pink gradient (75% filled)
  - Border Radius: Full

**Playlist:**
1. "Peaceful Morning" - Nature Sounds (Cyan → Blue)
2. "Classical Favorites" - Mozart & Bach (Purple → Pink)
3. "Old Memories" - Your Favorites from the 60s (Orange → Red)
4. "Calming Waves" - Ocean Sounds (Teal → Emerald)

---

### Component 5: Memory Diary Widget
**Span:** Full width (3 columns)
**Background:** Gradient Purple `#F5F3FF` → Blue `#EFF6FF`
**Border:** 2px Purple `#E9D5FF`
**Padding:** 24px

**Header:**
- Book icon (40px, purple `#9333EA`) + "Memory Diary" (2rem)

**Recent Activities:** 2 items in row
**Each Activity:**
- Background: White 70% opacity
- Border Radius: 12px
- Padding: 16px
- Emoji: 56px
- Text: 1.3rem (26px)
- Time: 1rem (20px), muted

**Activities shown:**
1. 🍽️ "Had lunch" - 12:00 PM
2. 📞 "Called family" - 3:30 PM

**Button:**
- Full width
- Height: 72px
- Background: Purple `#9333EA`
- Text: 1.3rem (26px) + arrow icon
- Border Radius: 12px

---

### Component 6: How Are You Feeling? (Mood Tracker)
**Span:** Full width (3 columns)
**Background:** Gradient Pink `#FDF2F8` → Purple `#FAF5FF`
**Border:** 2px Pink `#FBCFE8`
**Padding:** 32px

**Header:**
- Heart icon (48px, rose `#F43F5E`) + "How are you feeling?" (2.5rem)
- Spacing: 32px below

**Mood Grid:**
- Desktop: 5 columns
- Tablet: 3 columns
- Mobile: 2 columns
- Gap: 24px

**Each Mood Button:**
- Size: ~180px square
- Border Radius: 16px
- Padding: 24px
- Shadow: Large
- Background: White (unselected)
- Hover: Scale 1.05

**Unselected State:**
- Background: White
- Border: None
- Shadow: Medium

**Selected State:**
- Gradient background (mood-specific)
- Ring: 4px Primary blue with 2px offset
- Shadow: Extra large
- Checkmark badge: 40px circle, green `#22C55E`, top-right corner (-12px offset)
- White checkmark: 20px

**Mood Options:**

1. **😊 Happy**
   - Emoji: 56px
   - Gradient: Yellow `#FACC15` → Orange `#FB923C`
   - Label: 1.2rem (24px), white when selected

2. **😌 Calm**
   - Gradient: Blue `#60A5FA` → Cyan `#22D3EE`

3. **😐 Okay**
   - Gradient: Gray `#9CA3AF` → Gray `#6B7280`

4. **😔 Sad**
   - Gradient: Blue `#3B82F6` → Purple `#A855F7`

5. **😟 Worried**
   - Gradient: Orange `#F97316` → Red `#EF4444`

**Confirmation Message (appears when mood selected):**
- Background: White 80% opacity
- Border: 2px Green `#86EFAC`
- Border Radius: 16px
- Padding: 24px
- Text: 1.5rem (30px), green `#15803D`, centered
- Content: "✨ Thank you for sharing. Your caregiver will be notified."
- Margin Top: 32px

---

## 📖 Screen 3: Memory Diary (Full Screen)

### Header Bar
**Background:** Standard background gradient
**Padding:** 24px
**Flex layout:** Space between

**Left Button:**
- "Back to Home" button
- Arrow-left icon (32px) + Text (1.5rem / 21px)
- Padding: 24px
- White background, outlined

**Right Buttons (2 buttons, flex row):**
1. **"Read All" Button:**
   - Volume icon (32px) + Text
   - Primary blue background
   - Padding: 24px

2. **"Add Memory" Button:**
   - Plus icon (32px) + Text (or X if panel open)
   - Padding: 24px
   - Primary when closed, gray when open

### Page Header
**Max Width:** 1280px
**Center aligned**
**Spacing:** 32px below header bar

- Book icon (48px, primary) + "Memory Diary" (5rem / 100px)
- Spacing: 32px below

### Date Card
**Background:** Accent `#EFF6FF`
**Border Radius:** 16px
**Padding:** 24px

- Clock icon (32px, primary) + "Today - Saturday, October 19, 2025" (2rem)

### Add Activity Panel (shown when "Add Memory" clicked)
**Background:** Gradient Blue `#EFF6FF` → Purple `#FAF5FF`
**Border:** 2px Primary
**Border Radius:** 16px
**Padding:** 24px
**Margin:** 24px vertical

**Title:** "What did you do?" (3rem / 60px)
**Spacing:** 24px below

**Activity Grid:** 4 columns on desktop, 2 on mobile
**Gap:** 16px

**Each Activity Button:**
- Background: White 80%
- Border: 1px gray
- Border Radius: 16px
- Padding: 24px vertical, 16px horizontal
- Height: Auto
- Hover: Scale 1.05, white background

**Button Contents:**
- Emoji: 56px (top)
- Text: 1.3rem (26px) (below)
- Center aligned
- Flex column

**Activity Options:**
1. 🍽️ "Had a meal"
2. 📺 "Watched TV"
3. 📞 "Talked to family"
4. 🚶 "Went for a walk"
5. 🎵 "Listened to music"
6. 📖 "Read a book"
7. 💊 "Took medicine"
8. 😴 "Had a nap"

### Timeline Section
**Layout:** Vertical timeline with left padding
**Left Padding:** 32px (for timeline line)

**Timeline Line:**
- Position: Absolute left 19px
- Width: 4px
- Color: Primary 30% opacity
- Full height

**Each Timeline Entry:**
**Spacing:** 16px between entries

**Timeline Dot:**
- Position: Absolute left -31px
- Size: 40px circle
- Background: Primary blue `#2563EB`
- Inner dot: 16px white circle, centered

**Entry Card:**
- Background: White
- Border Radius: 16px
- Padding: 24px
- Shadow: Medium
- Hover: Shadow increases
- Margin Left: 16px (from timeline)

**Card Layout (Flex row):**
1. **Emoji** (left)
   - Size: 56px
   - Flex shrink: 0

2. **Content** (center, flex-1)
   - Time: 2rem (40px), primary color
   - Activity: 2rem (40px), default color
   - Spacing: 8px vertical

3. **Voice Button** (right)
   - Size: 72px × 72px
   - Background: White, outlined
   - Volume icon: 32px
   - Flex shrink: 0

**Timeline Entries (sample data):**
1. 💊 8:00 AM - "You took your morning medicine"
2. 🍳 9:00 AM - "You had breakfast with scrambled eggs"
3. 📺 10:30 AM - "You watched your favorite TV show"
4. 🍽️ 12:00 PM - "You had lunch with chicken curry"
5. 💊 2:00 PM - "You took your afternoon medicine"
6. 📞 3:30 PM - "Your daughter Anu called you"

---

## 🔒 Screen 4: Caregiver Dashboard

### Login Screen (Before Authentication)

**Layout:** Full screen, centered card

**Back Button (top left):**
- Arrow-left icon + "Back to Patient View"
- Size: 1.5rem (21px)
- Padding: 24px
- White background, outlined

**Login Card (centered):**
- Max Width: 800px
- Background: White
- Border Radius: 20px
- Padding: 48px
- Shadow: Extra large

**Card Contents:**
1. **Lock Icon**
   - Size: 96px
   - Color: Primary blue
   - Centered

2. **Title**
   - Text: "Caregiver Login"
   - Size: 4rem (80px)
   - Center aligned
   - Spacing: 16px below icon

3. **Subtitle**
   - Text: "This area is password protected"
   - Size: 2rem (40px)
   - Color: Muted
   - Center aligned
   - Spacing: 32px below

4. **Password Input**
   - Label: "Enter Password" (2rem)
   - Input height: 72px
   - Font size: 2rem (40px)
   - Padding: 24px horizontal
   - Border Radius: 12px
   - Background: Light gray `#F8FAFC`
   - Placeholder: "Password"
   - Type: Password (masked dots)
   - Spacing: 24px below

5. **Login Button**
   - Width: 100%
   - Height: 80px
   - Background: Primary blue
   - Text: "Enter Settings" (2rem)
   - Key icon: 32px (left of text)
   - Border Radius: 12px
   - Spacing: 24px below

6. **Demo Note**
   - Text: 'Demo password: "caregiver"'
   - Size: 1.3rem (26px)
   - Color: Muted
   - Italic style
   - Center aligned

---

### Authenticated Caregiver Dashboard

**Header Bar:**
- Left: "Back to Patient View" button (same style)
- Right: "Logout" button (Lock icon + text, outlined)
- Spacing: 32px below

**Page Title:**
- "Caregiver Dashboard" (5rem / 100px)
- Spacing: 32px below

### Settings Card Grid
**Layout:** 2 columns
**Gap:** 24px
**Max Width:** 1280px

**Each Card:**
- Background: White
- Border Radius: 16px
- Padding: 32px
- Shadow: Large
- Hover: Shadow increases

**Card Structure:**
1. **Icon + Title (row)**
   - Icon: 64px
   - Title: 3rem (60px)
   - Gap: 16px

2. **Description**
   - Text: 1.3rem (26px)
   - Color: Muted
   - Spacing: 24px below

3. **Action Button**
   - Width: 100%
   - Height: 72px
   - Text: 1.3rem (26px)
   - Primary background
   - Border Radius: 12px

**Cards:**

1. **Manage Faces**
   - Icon: Users (64px, primary)
   - Description: "Add or remove known people for face recognition"
   - Button: "Edit Face Database"

2. **Manage Reminders**
   - Icon: Bell (64px, primary)
   - Description: "Set up medication times, meals, and daily routines"
   - Button: "Edit Reminders"

3. **Activity Logs**
   - Icon: Book (64px, primary)
   - Description: "Review patient's daily activities and system usage"
   - Button: "View Full Logs"

4. **System Settings**
   - Icon: Lock (64px, primary)
   - Description: "Configure voice settings, display preferences, and security"
   - Button: "Open Settings"

### Summary Card (below grid)
**Background:** Accent `#EFF6FF`
**Border Radius:** 16px
**Padding:** 32px
**Full Width**
**Margin Top:** 32px

**Title:** "Today's Summary" (3rem / 60px)
**Spacing:** 24px below

**Stats Grid:** 3 columns
**Each Stat:**
- Label: 1.3rem (26px), muted
- Value: 4rem (80px), primary color
- Spacing: 8px vertical

**Stats:**
1. "Reminders Today" - 6
2. "Activities Logged" - 6
3. "People Recognized" - 3

---

## 🔊 Voice Indicator (Overlay Component)

**Position:** Fixed, bottom center
**Z-Index:** Top layer (above all content)

**Container:**
- Background: White
- Border: 2px Primary
- Border Radius: 20px
- Padding: 24px horizontal, 20px vertical
- Shadow: Extra large
- Animation: Slide up from bottom

**Contents (Flex row):**
1. **Volume Icon**
   - Size: 32px
   - Color: Primary
   - Animated: Pulse/wave animation

2. **Text Display**
   - Size: 1.5rem (30px)
   - Color: Primary
   - Font Weight: 600
   - Max Width: 600px

**Animation:** 
- Appears when voice feedback triggers
- Auto-dismisses after 3-4 seconds
- Smooth fade in/out

---

## 🎯 Interactive States & Animations

### Hover States
- **Buttons:** Scale 1.02, shadow increases
- **Cards:** Shadow increases, slight lift
- **Photo wall items:** Scale 1.05
- **Music controls:** Brightness increases

### Active/Selected States
- **Medications:** Green background when taken
- **Moods:** Gradient background + ring + checkmark
- **Music:** Pulse animation on album art when playing

### Transitions
- All: 300ms ease-in-out
- Scales: transform
- Colors: background-color, border-color
- Shadows: box-shadow

### Animations
- **Welcome screen:** Fade in + zoom in (700ms)
- **Loading dots:** Sequential pulse
- **Music playing:** Pulse on album art
- **Voice indicator:** Slide up + fade
- **Mood selected:** Zoom in on checkmark

---

## 📐 Layout Specifications

### Responsive Breakpoints
- **Mobile:** < 768px (1 column)
- **Tablet:** 768px - 1280px (2 columns)
- **Desktop:** > 1280px (3 columns)

### Grid Behavior
- **Photo Wall:** Always 3 columns (photos scale down)
- **Medication:** Always full width in its grid space
- **Music:** Always single column
- **Quick Connect:** Always single column
- **Memory Diary Widget:** Always full width
- **Mood Tracker:** Always full width, moods responsive (2→3→5 columns)

### Spacing System
- **Extra Small:** 4px
- **Small:** 8px
- **Medium:** 16px
- **Large:** 24px
- **Extra Large:** 32px
- **XXL:** 48px

---

## 🎨 Shadow System

### Shadow Levels
```
Small: 0 1px 3px rgba(0,0,0,0.1)
Medium: 0 4px 6px rgba(0,0,0,0.1)
Large: 0 10px 15px rgba(0,0,0,0.1)
Extra Large: 0 20px 25px rgba(0,0,0,0.1)
```

### When to Use
- **Small:** Subtle elevation (input fields)
- **Medium:** Cards at rest
- **Large:** Cards on hover, elevated panels
- **Extra Large:** Modals, important overlays

---

## 📱 Accessibility Features

### High Contrast
- All text minimum 4.5:1 contrast ratio
- Icon + text combinations for clarity
- Focus states clearly visible

### Large Touch Targets
- Minimum 44px × 44px (iOS guideline)
- Most buttons 72px+ height
- Generous padding around interactive elements

### Clear Hierarchy
- Size differences distinguish importance
- Consistent use of icons
- Ample white space

### Simple Language
- Short, clear labels
- Active voice ("Take medicine" not "Medicine to be taken")
- Positive reinforcement messages

---

## 🖼️ Asset Requirements for Canva

### Icons Needed (Lucide style - simple line icons)
- Sunrise, Sun, Cloud, Moon
- Clock, Calendar
- Thermometer
- Settings (gear)
- Heart
- User (person silhouette)
- Phone, Video, Message
- Pill
- CheckCircle, Circle (empty)
- Music, Play, Pause, SkipForward, SkipBack, Volume
- BookOpen
- Plus, X, ArrowLeft, ArrowRight
- Lock, Key, Users, Bell

### Emojis Needed
- 👧 👨 🚨 (contacts)
- 😊 😌 😐 😔 😟 (moods)
- 💊 🍳 📺 🍽️ 📞 🚶 🎵 📖 😴 (activities)

### Color Swatches to Create
Save these as color palette in Canva:
- `#2563EB` Primary Blue
- `#F43F5E` Rose
- `#A855F7` Purple
- `#10B981` Success Green
- `#1A1A2E` Text Dark
- `#64748B` Text Muted
- `#FFFFFF` White
- Gradient stops for all time-based gradients

---

## 💡 Tips for Canva Recreation

1. **Use Frames:** Create artboards for each screen at 1920×1080px
2. **Create Components:** Make reusable elements (buttons, cards) as groups
3. **Text Styles:** Set up text styles for each size (Mega, Large, Body, etc.)
4. **Color Palette:** Save all colors to your palette first
5. **Grids:** Use Canva's grid tool to align elements precisely
6. **Spacing:** Use ruler guides at consistent intervals
7. **Layers:** Name layers clearly (e.g., "Header", "Card - Medicine", "Button - Primary")
8. **Export:** Export at 2x for high-DPI displays

---

## 📋 Component Checklist

### Screen 1 - Welcome ✓
- [ ] Time-based gradient background
- [ ] Large icon (sunrise/sun/cloud/moon)
- [ ] Mega greeting text with gradient
- [ ] Three pulsing dots

### Screen 2 - Dashboard ✓
- [ ] Sticky header with time/weather/settings
- [ ] Photo memory wall (6 people)
- [ ] Quick connect (3 contacts with 2 buttons each)
- [ ] Medication tracker (5 medicines)
- [ ] Music player (with controls)
- [ ] Memory diary widget (2 recent activities)
- [ ] Mood tracker (5 moods)

### Screen 3 - Memory Diary ✓
- [ ] Header with back/read/add buttons
- [ ] Date card
- [ ] Add activity panel (8 options)
- [ ] Timeline with 6 entries
- [ ] Timeline line and dots

### Screen 4 - Caregiver ✓
- [ ] Login screen (centered card)
- [ ] Authenticated view (4 setting cards)
- [ ] Summary card (3 stats)
- [ ] Header with back/logout

### Overlay Components ✓
- [ ] Voice indicator (bottom center)

---

This guide should provide everything you need to recreate the design pixel-perfect in Canva! Let me know if you need any clarification on specific measurements or design details.
