import { Routes } from '@angular/router';
import { HomeComponent } from './sections/home/home.component';
import { SupersetComponent } from './superset/superset/superset.component';
import { TemplatesComponent } from './sections/templates/templates.component';
import { TemplateEditorComponent } from './sections/templates/template-editor.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'templates', component: TemplatesComponent },
  { path: 'templates/edit/:id', component: TemplateEditorComponent },
  { path: 'superset', component: SupersetComponent },
  { path: '**', redirectTo: '' }
];
