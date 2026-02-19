# React Frontend Setup & Installation Guide

## Quick Start

### 1. Install Dependencies
Open PowerShell and navigate to the frontend folder:
```powershell
cd frontend
npm install
```

### 2. Start Development Server
```powershell
npm start
```

The application will automatically open in your browser at `http://localhost:3000`.

## Project Overview

This React application provides a user-friendly interface for generating comprehensive medication and task completion reports based on your Figma design.

### Key Features Implemented

#### 📊 Report Generation Page
- Interactive filter panel for date range selection
- Report type selection (Comprehensive, Medication Only, Tasks Only, Alerts)
- Customizable checkboxes for including missed doses, refusals, and side effects
- Real-time report generation with loading state

#### 📈 Visual Analytics
- **Medication Adherence Chart**: Pie chart showing medication compliance
- **Task Completion Chart**: Bar chart displaying task completion rates
- **Key Statistics Cards**: Quick overview of critical metrics

#### 📋 Data Visualization
- **Side Effects Table**: Detailed table of reported side effects with severity levels
- **Status Indicators**: Color-coded alerts and warnings
- **Interactive Charts**: Hover effects and responsive design

#### 💾 Export Options
- PDF Export (placeholder for implementation)
- CSV Export (placeholder for implementation)
- Print functionality

## File Structure

```
frontend/
├── public/
│   └── index.html                 # HTML entry point
├── src/
│   ├── components/                # Reusable React components
│   │   ├── Header.js             # Top navigation header
│   │   ├── ReportFilters.js      # Filter panel component
│   │   ├── ReportPreview.js      # Report display component
│   │   ├── DatePicker.js         # Date input component
│   │   ├── StatCard.js           # Statistics card component
│   │   ├── MedicationAdherenceChart.js    # Pie chart component
│   │   ├── TaskCompletionChart.js         # Bar chart component
│   │   ├── SideEffectsTable.js   # Data table component
│   │   └── ActionButtons.js      # Action buttons component
│   ├── pages/
│   │   └── GenerateReportPage.js # Main page component (state management)
│   ├── hooks/
│   │   └── index.js              # Custom React hooks
│   ├── utils/
│   │   ├── dateUtils.js          # Date utility functions
│   │   ├── reportUtils.js        # Report calculation utilities
│   │   └── apiService.js         # API/data service layer
│   ├── styles/
│   │   ├── index.css             # Global styles (variables, reset)
│   │   ├── App.css               # App wrapper styles
│   │   ├── GenerateReportPage.css # Page layout styles
│   │   ├── Header.css            # Header styles
│   │   ├── ReportFilters.css     # Filter panel styles
│   │   ├── DatePicker.css        # Date picker styles
│   │   ├── ReportPreview.css     # Report preview styles
│   │   ├── StatCard.css          # Statistics card styles
│   │   ├── Charts.css            # Chart styles (pie & bar)
│   │   ├── SideEffectsTable.css  # Table styles
│   │   └── ActionButtons.css     # Button styles
│   ├── App.js                    # Main app component with routing
│   └── index.js                  # React DOM render entry point
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies and scripts
└── README.md                     # Project documentation
```

## Component Hierarchy

```
App
└── GenerateReportPage
    ├── Header
    ├── ReportFilters
    │   ├── DatePicker (×2)
    │   └── Checkboxes & Select
    └── ReportPreview (conditional)
        ├── StatCard (×4)
        ├── MedicationAdherenceChart
        ├── TaskCompletionChart
        ├── SideEffectsTable
        └── ActionButtons
```

## State Management

The application uses React's built-in `useState` hook for state management:

- **reportData**: Stores generated report data
- **filters**: Stores user-selected filter values
  - startDate
  - endDate
  - reportType
  - includeRefusals
  - includeMissedDoses
  - includeSideEffects
- **isLoading**: Boolean for loading state during report generation

Future enhancement: Consider integrating Redux or Context API if state complexity grows.

## Styling System

The project uses a custom CSS system with CSS variables for consistency:

### Color Palette
- **Primary**: #4CAF50 (Green) - Success states
- **Secondary**: #2196F3 (Blue) - Primary actions
- **Warning**: #FFC107 (Orange) - Warnings
- **Danger**: #F44336 (Red) - Critical alerts
- **Info**: #00BCD4 (Cyan) - Information

### Responsive Design
- Desktop: Full layout with sidebar filters
- Tablet: Adjusted grid (max-width: 1024px)
- Mobile: Single column layout (max-width: 768px)

## npm Scripts

```bash
npm start      # Start development server (port 3000)
npm build      # Create optimized production build
npm test       # Run test suite
npm eject      # Expose configuration (irreversible)
```

## Development Workflow

### To modify a component:
1. Edit the component file in `src/components/`
2. Update corresponding CSS in `src/styles/`
3. Changes will hot-reload automatically

### To add a new page:
1. Create a new file in `src/pages/`
2. Add a new route in `src/App.js` (Routes section)
3. Import necessary components

### To add a new component:
1. Create a new file in `src/components/`
2. Create corresponding CSS file in `src/styles/`
3. Import and use in parent components

## API Integration (Future)

The `src/utils/apiService.js` file contains placeholder for backend integration:

```javascript
// Current: Mock data (for testing)
import mockApiService from './utils/apiService';

// Future: Real API
import apiService from './utils/apiService';
const response = await apiService.generateReport(filters);
```

## Performance Optimization Tips

1. **Code Splitting**: Use React.lazy() for route-based splitting
2. **Memoization**: Use React.memo() for expensive components
3. **useState Optimization**: Use useCallback for event handlers
4. **CSS Optimization**: Minify and combine CSS files in production

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Port 3000 already in use
```powershell
npm start -- --port 3001
```

### Clear npm cache
```bash
npm cache clean --force
npm install
```

### Remove node_modules and reinstall
```bash
Remove-Item -Recurse -Force node_modules
npm install
```

## Next Steps

1. **API Integration**: Connect to backend for real data
2. **PDF Export**: Implement using libraries like `pdfkit` or `html2pdf`
3. **CSV Export**: Implement using `papaparse` or custom CSV generation
4. **Testing**: Add Jest and React Testing Library tests
5. **State Management**: Consider Redux for complex state
6. **Authentication**: Add user login and session management
7. **Data Visualization**: Enhance charts with Chart.js or Recharts

## Additional Resources

- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Figma to React Best Practices](https://www.figma.com/resources/toolkits/dev-mode/)

## Support & Questions

For issues or questions about the implementation, refer to the Figma design at:
`upbeat-plus-72826143.figma.site`

---

**Last Updated**: February 19, 2026
