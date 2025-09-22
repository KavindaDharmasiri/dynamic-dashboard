# How to Use Dynamic Dashboard Library

## Build the Library

```bash
ng build dynamic-dashboard
```

## Install in Another Project

### Option 1: Local Installation
```bash
# In your target project
npm install /path/to/angular-gridster2-master/dist/dynamic-dashboard
```

### Option 2: Pack and Install
```bash
# In the library project
cd dist/dynamic-dashboard
npm pack

# In your target project
npm install /path/to/dynamic-dashboard-1.0.0.tgz
```

## Usage in Your Project

### 1. Install Required Dependencies
```bash
npm install @angular/material @angular/cdk angular-gridster2 @superset-ui/embedded-sdk animate-css-grid
```

### 2. Import in Your Component
```typescript
import { Component } from '@angular/core';
import { DynamicDashboard } from 'dynamic-dashboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DynamicDashboard],
  template: '<lib-dynamic-dashboard></lib-dynamic-dashboard>'
})
export class AppComponent {}
```

### 3. Individual Component Usage
```typescript
import { HomeComponent } from 'dynamic-dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HomeComponent],
  template: '<app-general></app-general>'
})
export class DashboardComponent {}
```

## Available Components

- `DynamicDashboard` - Main dashboard wrapper
- `HomeComponent` - Dashboard with drag-drop widgets
- `WidgetComponent` - Individual widget container
- `ViewsComponent` - Superset chart widget
- `AnalyticsComponent` - Analytics widget
- `RevenueComponent` - Revenue widget
- `SubscriberComponent` - Subscriber widget
- `WatchTimeComponent` - Watch time widget

## Services

- `DashboardService` - Widget management
- `SupersetService` - Superset integration

## Configuration

Update your environment files with Superset configuration:

```typescript
export const environment = {
  production: false,
  supersetBaseURL: 'http://your-superset-url',
  supersetUsername: 'your-username',
  supersetPassword: 'your-password'
};
```