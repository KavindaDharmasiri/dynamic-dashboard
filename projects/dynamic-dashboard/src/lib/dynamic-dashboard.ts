import { Component } from '@angular/core';
import { AppComponent } from './source/app.component';

@Component({
  selector: 'lib-dynamic-dashboard',
  imports: [AppComponent],
  template: ` <app-root></app-root> `,
  standalone: true,
  styles: ``
})
export class DynamicDashboard {}
