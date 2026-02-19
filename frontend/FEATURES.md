# Feature Documentation - Generate Report Page

## Overview

The Generate Report Page is the core feature of the Dementia Assistive System frontend. It allows caregivers and medical professionals to generate comprehensive reports on medication adherence and task completion for dementia patients.

## User Interface Components

### 1. Header Section
**Purpose**: Navigation and branding
**Features**:
- Application logo and title
- User greeting message
- User avatar with initials
- Sticky positioning for always-visible navigation

**Styling**: Blue gradient background (#2196F3 to #1976D2)

---

### 2. Report Filters Section
**Purpose**: Allow users to customize report parameters
**Location**: Left sidebar (sticky)

#### 2.1 Report Type Selector
- **Options**:
  - Comprehensive: All data included
  - Medication Only: Medication adherence only
  - Tasks Only: Task completion only
  - Alerts & Issues: Critical information only
- **Type**: Dropdown select
- **Default**: Comprehensive

#### 2.2 Date Range Filters
- **Start Date**: Date picker (default: 30 days ago)
- **End Date**: Date picker (default: today)
- **Type**: HTML5 date input
- **Validation**: Start date cannot be after end date

#### 2.3 Data Inclusion Checkboxes
- **Include Missed Doses**: Toggle (default: true)
  - When enabled: Shows medications patient missed
- **Include Refusals**: Toggle (default: true)
  - When enabled: Shows medications patient refused
- **Include Side Effects**: Toggle (default: true)
  - When enabled: Shows side effects section in report

#### 2.4 Generate Button
- **Action**: Triggers report generation
- **States**:
  - Normal: "Generate Report" (green, #4CAF50)
  - Loading: "Generating..." (disabled)
  - Hover: Darker green with box shadow
  - Click: Slight elevation effect

---

### 3. Report Preview Section
**Purpose**: Display generated report with analytics
**Shows only after report generation**

#### 3.1 Report Header
- **Report ID**: Unique identifier (format: RPT-YYYY-XXX)
- **Generated Date**: Date and time of generation
- **Period**: Start and end date range

#### 3.2 Key Statistics Cards (4-column grid)
Display critical metrics with visual indicators:

**Card 1: Medication Adherence**
- Primary metric: Percentage (e.g., 94.4%)
- Secondary metric: Ratio (e.g., 85/90)
- Status: Green indicator for good adherence
- Formula: (Taken / Total Scheduled) × 100

**Card 2: Task Completion**
- Primary metric: Percentage (e.g., 91.7%)
- Secondary metric: Ratio (e.g., 110/120)
- Status: Green indicator for high completion
- Formula: (Completed / Total Tasks) × 100

**Card 3: Critical Alerts**
- Primary metric: Count of critical issues
- Status: Red if > 0, green if = 0
- Secondary: "Issues requiring attention"

**Card 4: Total Warnings**
- Primary metric: Count of warnings
- Status: Blue information indicator
- Secondary: "Non-critical alerts"

#### 3.3 Visual Charts

**Medication Adherence Pie Chart**
- **Center value**: Adherence percentage
- **Segments**:
  - Taken (Green, #4CAF50): Medications taken on schedule
  - Missed (Orange, #FFC107): Doses patient forgot
  - Refused (Red, #F44336): Doses patient refused
- **Legend**: Shows count for each segment
- **Size**: Responsive, scales with container

**Task Completion Bar Chart**
- **Total width**: 100% of container
- **Bar segments**:
  - Completed (Green): Percentage of completed tasks
  - Incomplete (Light gray): Remaining incomplete tasks
- **Center percentage**: Completion rate
- **Legend**: Shows actual counts

#### 3.4 Side Effects Table (Conditional)
**Shows only if**: Include Side Effects checkbox is enabled

**Table Columns**:
1. **Date**: When the side effect was reported
2. **Medication**: Which medication caused the effect
3. **Side Effect**: Description of the side effect
4. **Severity**: Visual badge indicating severity
   - Mild (Yellow badge): Minor inconvenience
   - Moderate (Orange badge): Noticeable but manageable
   - Severe (Red badge): Significant concern

**Example Data**:
| Date | Medication | Side Effect | Severity |
|------|------------|-------------|----------|
| Feb 17, 2026 | Donepezil | Nausea | Mild |
| Feb 16, 2026 | Memantine | Dizziness | Moderate |

#### 3.5 Action Buttons
**Position**: Below report in light gray section

**3 Export Options**:

1. **Export as PDF** (Green button)
   - Saves report as downloadable PDF
   - Includes all charts and statistics
   - Formatted for printing
   - Icon: 📄

2. **Export as CSV** (Blue outlined button)
   - Saves tabular data
   - Useful for data analysis in Excel
   - Includes all metrics and side effects
   - Icon: 📊

3. **Print Report** (Blue outlined button)
   - Opens browser print dialog
   - Optimized for printing
   - Includes page breaks
   - Icon: 🖨️

---

## Data Flow

### Report Generation Process

```
User clicks "Generate Report"
    ↓
LoadingState = true
    ↓
API Call / Data Processing
    ↓
Calculate Metrics:
  - Adherence Rate = (Taken / Total) × 100
  - Completion Rate = (Completed / Total) × 100
    ↓
Fetch Side Effects (if enabled)
    ↓
Format Report Data
    ↓
Update reportData state
LoadingState = false
    ↓
Render Report Preview
```

### Filter State Updates

```
User changes filter
    ↓
updateFilter() callback triggered
    ↓
State updated in GenerateReportPage
    ↓
ReportFilters component receives new filters
    ↓
Filter persist in state (ready for next generation)
```

---

## Response Data Structure

### Report Object
```javascript
{
  id: "RPT-2026-001",
  generatedDate: Date,
  period: {
    start: Date,
    end: Date
  },
  medicationAdherence: {
    totalScheduled: 90,
    taken: 85,
    missed: 5,
    refused: 3,
    adherenceRate: 94.4
  },
  taskCompletion: {
    totalTasks: 120,
    completed: 110,
    incompleted: 10,
    completionRate: 91.7
  },
  alerts: {
    critical: 2,
    warning: 5,
    info: 12
  },
  sideEffects: [
    {
      date: Date,
      medication: "Donepezil",
      effect: "Nausea",
      severity: "mild"
    }
  ]
}
```

---

## User Workflows

### Workflow 1: Generate Comprehensive Report
1. User opens app → Default filters show
2. Adjusts date range if needed (or uses default 30 days)
3. Keeps all checkboxes enabled
4. Clicks "Generate Report"
5. Sees loading indicator
6. Report displays with all statistics and charts
7. Can export or print

### Workflow 2: Focus on Problem Areas
1. User wants to investigate missed doses
2. Sets "Include Missed Doses" ✓
3. Disables "Include Refusals" and "Include Side Effects"
4. Selects "Medication Only" report type
5. Sets specific date range
6. Generates report
7. Reviews statistics and identifies patterns

### Workflow 3: Export for Doctor Review
1. Generates desired report
2. Clicks "Export as PDF"
3. Selects file location on computer
4. Can email PDF to healthcare provider

### Workflow 4: Print for Records
1. Generates report
2. Reviews on screen
3. Clicks "Print Report"
4. Browser print dialog opens
5. Selects printer
6. Physical copy created for records

---

## Responsive Behavior

### Desktop (1024px and above)
- 2-column layout: Filters on left (350px), Report on right
- All visual elements fully visible
- Charts displayed side-by-side
- Table fully scrollable

### Tablet (768px - 1024px)
- Filters and Report stack vertically
- 2-column stat cards grid
- Charts still side-by-side if space permits

### Mobile (below 768px)
- Single column layout
- Full-width components
- Stat cards stack vertically (1 column)
- Charts stack vertically
- Action buttons become full-width
- Horizontal scroll for tables

---

## Styling Details

### Color Coding
- **Success Events**: Green (#4CAF50)
- **Warnings**: Orange (#FFC107)
- **Critical Issues**: Red (#F44336)
- **Information**: Cyan (#00BCD4)
- **Neutral/Background**: Light gray (#f5f5f5)

### Typography
- **Logo/Page Title**: 24px, Bold
- **Section Titles**: 16-20px, Semi-bold
- **Card Titles**: 13px, Uppercase, Letter-spaced
- **Body Text**: 14px, Regular
- **Small Text**: 12px, Light gray

### Spacing System
- Button padding: 12px 20px
- Card padding: 20px
- Grid gaps: 20-30px
- Margin: Consistent 20px base unit

### Shadows
- Light shadow: `0 1px 4px rgba(0,0,0,0.05)`
- Medium shadow: `0 2px 8px rgba(0,0,0,0.08)`
- Hover shadow: `0 4px 12px rgba(0,0,0,0.1)`

---

## Accessibility Features

- Semantic HTML tags (main, section, article)
- Proper heading hierarchy (h1-h6)
- Color doesn't convey information alone (icons/text included)
- Form labels clearly associated with inputs
- Button text clearly describes action
- Contrast ratios meet WCAG AA standards
- Focus states visible on interactive elements

---

## Future Enhancements

### Phase 2
- [ ] Real PDF export using html2pdf library
- [ ] Real CSV export with proper formatting
- [ ] Enhanced print styling
- [ ] Report scheduling and email delivery

### Phase 3
- [ ] Compare reports over time
- [ ] Trend analysis with historical data
- [ ] Custom metric definitions
- [ ] Alerts and notifications system
- [ ] User preferences/settings

### Phase 4
- [ ] Multi-patient comparison
- [ ] Advanced filtering and search
- [ ] Custom report templates
- [ ] Predictive analytics
- [ ] Integration with medical records
