# Dementia Assistive System - Generate Report Frontend

A React-based front-end application for generating comprehensive medication and task completion reports for the Dementia Assistive System.

## Features

- **Report Generation**: Create detailed reports on medication adherence and task completion
- **Customizable Filters**: Filter reports by date range and include/exclude specific data types
- **Visual Analytics**: View medication adherence and task completion via interactive charts
- **Side Effects Tracking**: Track and display reported side effects with severity levels
- **Export Options**: Export reports as PDF, CSV, or print directly
- **Responsive Design**: Fully responsive interface optimized for desktop and mobile devices
- **User-Friendly Interface**: Clean, intuitive design based on Figma prototypes

## Components

### Pages
- **GenerateReportPage**: Main page for report generation and preview

### Components
- **Header**: Navigation and branding header
- **ReportFilters**: Filter panel for date range and report customization
- **ReportPreview**: Display generated report with charts and statistics
- **StatCard**: Reusable card component for displaying key metrics
- **MedicationAdherenceChart**: Pie chart showing medication adherence statistics
- **TaskCompletionChart**: Bar chart showing task completion rates
- **SideEffectsTable**: Table display of reported side effects
- **ActionButtons**: Export and print action buttons
- **DatePicker**: Date input component

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

## Available Scripts

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner in interactive watch mode.

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── ReportFilters.js
│   │   ├── ReportPreview.js
│   │   ├── DatePicker.js
│   │   ├── StatCard.js
│   │   ├── MedicationAdherenceChart.js
│   │   ├── TaskCompletionChart.js
│   │   ├── SideEffectsTable.js
│   │   └── ActionButtons.js
│   ├── pages/
│   │   └── GenerateReportPage.js
│   ├── styles/
│   │   ├── index.css
│   │   ├── App.css
│   │   ├── GenerateReportPage.css
│   │   ├── Header.css
│   │   ├── ReportFilters.css
│   │   ├── DatePicker.css
│   │   ├── ReportPreview.css
│   │   ├── StatCard.css
│   │   ├── Charts.css
│   │   ├── SideEffectsTable.css
│   │   └── ActionButtons.css
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## Styling

The application uses CSS Grid and Flexbox for responsive layouts. Design system variables are defined in `src/styles/index.css`:

- Primary Color: #4CAF50 (Green)
- Secondary Color: #2196F3 (Blue)
- Warning Color: #FFC107 (Orange)
- Danger Color: #F44336 (Red)
- Info Color: #00BCD4 (Cyan)

All styles are responsive and mobile-friendly.

## Future Enhancements

- [ ] PDF export functionality
- [ ] CSV export functionality
- [ ] Print functionality refinement
- [ ] API integration for real data
- [ ] User authentication
- [ ] Advanced filtering options
- [ ] Report scheduling and email delivery
- [ ] Data visualization improvements
- [ ] Performance optimization
- [ ] Accessibility improvements (WCAG compliance)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is part of the Memory Companion Assistant App for Dementia Patients.
