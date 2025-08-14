import { Routes } from '@angular/router';
import { HomeComponent } from './sections/home/home.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '' }
];
