import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Auto-import components (you can refine this)
// import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    // AppComponent
    // Add your components here
  ],
  imports: [
    CommonModule
    // Add required modules
  ],
  exports: [
    // AppComponent
    // Export reusable components
  ]
})
export class DynamicDashboardModule {}
