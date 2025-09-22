import { Routes } from '@angular/router';
import { HomeComponent } from './sections/home/home.component';
import { SupersetComponent } from './superset/superset/superset.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'superset', component: SupersetComponent },
  { path: '**', redirectTo: '' }
];
