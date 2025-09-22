# Dynamic Dashboard Library

A powerful Angular library for creating dynamic dashboards with drag-and-drop widgets, built on top of angular-gridster2.

## Features

- 🎯 Drag-and-drop widget management
- 📊 Superset chart integration
- 🎨 Customizable widget themes
- 📱 Responsive grid layout
- 💾 Persistent dashboard state
- 🔧 Widget configuration panel

## Installation

```bash
npm install dynamic-dashboard
```

## Usage

```typescript
import { DynamicDashboard } from 'dynamic-dashboard';

@Component({
  selector: 'app-root',
  imports: [DynamicDashboard],
  template: '<lib-dynamic-dashboard></lib-dynamic-dashboard>'
})
export class AppComponent {}
```

## Building

To build the library, run:

```bash
ng build dynamic-dashboard
```

This command will compile your project, and the build artifacts will be placed in the `dist/` directory.

### Publishing the Library

Once the project is built, you can publish your library by following these steps:

1. Navigate to the `dist` directory:
   ```bash
   cd dist/dynamic-dashboard
   ```

2. Run the `npm publish` command to publish your library to the npm registry:
   ```bash
   npm publish
   ```

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
