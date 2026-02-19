# Architecture & Deployment Guide

## Component Architecture

### Component Tree Structure
```
┌─────────────────────────────────────────────────────────────┐
│                         App.js                              │
│              (Router Setup, Route Management)               │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                GenerateReportPage.js                        │
│         (Main State Management & Logic)                    │
│     • reportData (useState)                                 │
│     • filters (useState)                                    │
│     • isLoading (useState)                                  │
└──┬──────────────────┬─────────────────────────────────────┬─┘
   │                  │                                       │
   ▼                  ▼                                       ▼
┌──────────────┐  ┌──────────────┐       ┌─────────────────────┐
│  Header.js   │  │ReportFilters │       │ ReportPreview.js    │
│              │  │   (Sidebar)  │       │  (Report Display)   │
│ • Logo       │  │              │       │                     │
│ • User Info  │  │ • Type Select│       │ • Report Header     │
│              │  │ • Date Range │       │ • Statistics Cards  │
│              │  │ • Checkboxes │       │ • Charts            │
│              │  │ • Gen Button │       │ • Side Effects      │
│              │  │              │       │ • Action Buttons    │
└──────────────┘  └──────────────┘       └─────────────────────┘
                                               │
                         ┌─────────────────────┼─────────────────────┐
                         │                     │                     │
                         ▼                     ▼                     ▼
                ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
                │   StatCard.js    │  │    Charts.js     │  │SideEffectsTable.js
                │                  │  │                  │  │
                │ • Title          │  │ • Pie Chart      │  │ • Table Headers
                │ • Value          │  │ • Bar Chart      │  │ • Table Rows
                │ • Indicator      │  │ • Legends        │  │ • Severity Badge
                │ • Status Color   │  │                  │  │
                └──────────────────┘  └──────────────────┘  └──────────────────┘

                         │
                         ▼
                ┌──────────────────┐
                │ ActionButtons.js │
                │                  │
                │ • PDF Export     │
                │ • CSV Export     │
                │ • Print          │
                └──────────────────┘
```

## Data Flow Diagram

```
┌─────────────────────┐
│  User Interactions  │
└──────────┬──────────┘
           │
           ├─────────────┬────────────────┬──────────────┐
           ▼             ▼                ▼              ▼
      ┌─────────┐  ┌──────────┐  ┌────────────┐  ┌──────────┐
      │  Change │  │  Change  │  │  Toggle    │  │  Click   │
      │  Dates  │  │   Type   │  │ Checkboxes │  │ Generate │
      └────┬────┘  └────┬─────┘  └──────┬─────┘  └────┬─────┘
           │             │               │              │
           └─────────────┴───────────────┴──────────────┘
                         │
                         ▼
      ┌──────────────────────────────────┐
      │  updateFilter() / onChange()     │
      │  Updates filters state           │
      └──────────────┬───────────────────┘
                     │
                     ├─────────────────────────┐
                     │                         │
        (immediately) ▼              (on click) ▼
      ┌──────────────────────┐  ┌──────────────────────┐
      │ ReportFilters Update │  │ generateReport()     │
      │ (re-renders)         │  │ • setIsLoading(true) │
      └──────────────────────┘  │ • Fetch Data/Calc    │
                                │ • setReportData()    │
                                │ • setIsLoading(false)│
                                └──────────────┬───────┘
                                              │
                                              ▼
                              ┌───────────────────────────┐
                              │ ReportPreview renders     │
                              │ (conditional on report)   │
                              │ Displays all components   │
                              └───────────────────────────┘
```

## File Organization & Purpose

```
frontend/
├── public/
│   └── index.html                    ← HTML entry point
├── src/
│   ├── components/                   ← Reusable UI components
│   │   ├── Header.js                ← Top navigation
│   │   ├── ReportFilters.js         ← Filter controls
│   │   ├── ReportPreview.js         ← Report display container
│   │   ├── DatePicker.js            ← Date input component
│   │   ├── StatCard.js              ← Metric card component
│   │   ├── MedicationAdherenceChart.js
│   │   ├── TaskCompletionChart.js
│   │   ├── SideEffectsTable.js
│   │   └── ActionButtons.js
│   ├── pages/                       ← Page components
│   │   └── GenerateReportPage.js   ← Main page (state mgmt)
│   ├── hooks/                       ← Custom React hooks
│   │   └── index.js                ← useReportFilters, useAsync, etc
│   ├── utils/                       ← Utility functions
│   │   ├── dateUtils.js            ← Date formatting/manipulation
│   │   ├── reportUtils.js          ← Report calculations
│   │   └── apiService.js           ← API/data service
│   ├── styles/                      ← CSS files
│   │   ├── index.css               ← Global styles, CSS variables
│   │   ├── App.css
│   │   ├── GenerateReportPage.css  ← Main layout
│   │   ├── Header.css
│   │   ├── ReportFilters.css
│   │   ├── DatePicker.css
│   │   ├── ReportPreview.css
│   │   ├── StatCard.css
│   │   ├── Charts.css
│   │   ├── SideEffectsTable.css
│   │   └── ActionButtons.css
│   ├── App.js                      ← Root component with routing
│   └── index.js                    ← React DOM render entry
├── .env.example                    ← Environment variables template
├── .gitignore                      ← Git ignore rules
├── package.json                    ← Dependencies & scripts
├── README.md                       ← Project overview
├── SETUP.md                        ← Setup & installation guide
├── FEATURES.md                     ← Feature documentation
└── ARCHITECTURE.md                 ← This file
```

## Development Workflow

### Starting Development
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies (first time only)
npm install

# 3. Start development server
npm start
# App opens at http://localhost:3000
# Hot reload enabled - changes update automatically
```

### Making Changes

**To modify a component:**
```
src/components/ComponentName.js
    ↓
Make changes
    ↓
Save file
    ↓
Browser auto-reloads with changes
```

**To modify styling:**
```
src/styles/Component.css
    ↓
Make changes
    ↓
Save file
    ↓
Styles hot-reload instantly
```

**To add a new component:**
```
1. Create: src/components/NewComponent.js
2. Create: src/styles/NewComponent.css
3. Import in parent component
4. Use as <NewComponent props={value} />
```

## Build & Deployment

### Production Build
```bash
npm run build
```
Creates optimized `build/` folder ready for deployment.

### Deployment Options

#### Option 1: Netlify (Recommended)
```bash
# Installation
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=build
```

#### Option 2: Vercel
```bash
npm install -g vercel
vercel
```

#### Option 3: GitHub Pages
```bash
# Add to package.json:
"homepage": "https://username.github.io/repo",

npm run build
npm install gh-pages --save-dev
```

#### Option 4: Traditional Server
```bash
# Copy build folder to server
# Configure web server to serve index.html for all routes
# Example (nginx):
server {
    location / {
        try_files $uri /index.html;
    }
}
```

## Performance Considerations

### Current Optimizations
✓ Component-based architecture
✓ CSS variables for efficient styling
✓ Responsive images (no unused pixels)
✓ Lazy date calculations
✓ Efficient re-renders with React

### Future Optimizations
- [ ] React.memo() for expensive components
- [ ] Code splitting with React.lazy()
- [ ] Image optimization and compression
- [ ] CSS minification in production
- [ ] Caching strategies for API calls
- [ ] Service Worker for offline support

## Testing Strategy

### Unit Tests (Jest)
```javascript
// Example: StatCard.test.js
test('displays correct percentage format', () => {
  render(<StatCard value="94.4%" />);
  expect(screen.getByText('94.4%')).toBeInTheDocument();
});
```

### Integration Tests (React Testing Library)
```javascript
// Test filter changes trigger report generation
test('generates report with selected filters', () => {
  // Setup, interact, assert
});
```

### E2E Tests (Cypress/Playwright)
```javascript
// Test complete user workflows
describe('Report Generation', () => {
  it('generates report from start to export');
});
```

## Environment Variables

Create `.env` file in `frontend/` (not in git):
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENVIRONMENT=development
```

Accessible in code:
```javascript
const API_URL = process.env.REACT_APP_API_URL;
```

## Troubleshooting Guide

| Problem | Solution |
|---------|----------|
| Port 3000 in use | `npm start -- --port 3001` |
| Node modules corrupted | `rm -r node_modules && npm install` |
| Changes not showing | Clear browser cache, restart dev server |
| Styling not applying | Check CSS file is imported |
| Component not rendering | Check console for errors, verify imports |

## Browser DevTools Tips

### React Developer Tools
- Install extension for React component inspection
- Track state changes in real-time
- Debug component props

### Performance Profiler
- Identify slow components
- Monitor re-render patterns
- Analyze render times

## Monitoring & Logging

For production, consider:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for usage metrics
- Datadog or New Relic for performance monitoring

## Security Considerations

✓ React automatically escapes XSS attacks
✓ No direct DOM manipulation (safe)
✓ Environment variables for sensitive data
⚠ Validate user input before API calls
⚠ Use HTTPS for all connections
⚠ Implement CORS properly on backend
⚠ Sanitize user-generated report data

## API Integration Checklist

- [ ] Backend API endpoints documented
- [ ] Authentication mechanism planned
- [ ] Error handling implemented
- [ ] Loading states defined
- [ ] Rate limiting considered
- [ ] Data caching strategy
- [ ] Retry logic for failed requests
- [ ] Logging for debugging

## Next Development Steps

1. **Phase 1 (Current)**: UI/UX completed
2. **Phase 2**: Backend API integration
3. **Phase 3**: Real data connectivity
4. **Phase 4**: PDF/CSV export implementation
5. **Phase 5**: Testing & QA
6. **Phase 6**: Production deployment
7. **Phase 7**: Monitoring & analytics

---

**Last Updated**: February 19, 2026
