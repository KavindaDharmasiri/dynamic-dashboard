// src/main.elements.ts
import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { HomeComponent } from './app/sections/home/home.component'; // Adjust path if needed
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CdkDropListGroup, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { DashboardService } from './app/sections/service/dashboard.service';

// Import all necessary modules for HomeComponent if it's not truly standalone
// or if its direct imports rely on these being available in the element's context.
// Ensure all components used within HomeComponent are also imported.

(async () => {
  // Create a minimal Angular application context for the element
  const appRef = await createApplication({
    providers: [
      DashboardService, // Provide your service here
      // Add any other global services your dashboard needs
    ],
  });

  // Define your custom element
  const DashboardElement = createCustomElement(HomeComponent, { injector: appRef.injector });
  customElements.define('my-dashboard-element', DashboardElement);

  console.log('my-dashboard-element defined!');
})();
