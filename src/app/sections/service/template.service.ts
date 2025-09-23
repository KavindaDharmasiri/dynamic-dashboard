import { Injectable, signal } from '@angular/core';
import { DashboardTemplate, TemplateWidget } from '../model/template';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private templates = signal<DashboardTemplate[]>([]);

  constructor() {
    this.loadTemplatesPrivate();
  }

  getTemplates() {
    return this.templates.asReadonly();
  }

  getPublishedTemplate() {
    return this.templates().find(t => t.isPublished) || null;
  }

  createTemplate(name: string, description: string = '', widgets: TemplateWidget[] = []): DashboardTemplate {
    const template: DashboardTemplate = {
      id: this.generateId(),
      name,
      description,
      widgets: [...widgets], // Create a copy to avoid reference issues
      isPublished: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentTemplates = this.templates();
    this.templates.set([...currentTemplates, template]);
    this.saveTemplates();
    console.log('Created new template:', template);
    return template;
  }

  updateTemplate(id: string, updates: Partial<DashboardTemplate>): void {
    const currentTemplates = this.templates();
    const templateIndex = currentTemplates.findIndex(t => t.id === id);
    
    if (templateIndex !== -1) {
      const updatedTemplates = [...currentTemplates];
      updatedTemplates[templateIndex] = { 
        ...updatedTemplates[templateIndex], 
        ...updates, 
        updatedAt: new Date() 
      };
      this.templates.set(updatedTemplates);
      this.saveTemplates();
      console.log('Template updated:', updatedTemplates[templateIndex]);
    } else {
      console.error('Template not found for update:', id);
    }
  }

  deleteTemplate(id: string): void {
    this.templates.update(templates => templates.filter(t => t.id !== id));
    this.saveTemplates();
  }

  publishTemplate(id: string): void {
    this.templates.update(templates => 
      templates.map(t => ({ ...t, isPublished: t.id === id }))
    );
    this.saveTemplates();
    
    // Apply the published template's theme immediately
    const publishedTemplate = this.getPublishedTemplate();
    if (publishedTemplate && publishedTemplate.theme) {
      this.applyTheme(publishedTemplate.theme);
      console.log('Applied published template theme immediately');
    }
  }

  saveCurrentDashboardAsTemplate(name: string, description: string, widgets: TemplateWidget[]): DashboardTemplate {
    return this.createTemplate(name, description, widgets);
  }

  loadTemplates(): void {
    const stored = localStorage.getItem('dashboardTemplates');
    
    console.log('Loading templates from localStorage:', stored);
    
    if (stored) {
      try {
        const templates = JSON.parse(stored).map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt)
        }));
        this.templates.set(templates);
        console.log('Templates loaded:', templates);
      } catch (error) {
        console.error('Failed to load templates:', error);
      }
    }
  }

  private loadTemplatesPrivate(): void {
    this.loadTemplates();
  }

  private applyTheme(theme: any) {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.primaryColor);
    root.style.setProperty('--theme-secondary', theme.secondaryColor);
    root.style.setProperty('--theme-background', theme.backgroundColor);
    root.style.setProperty('--theme-text', theme.textColor);
    root.style.setProperty('--theme-accent', theme.accentColor);
  }

  private saveTemplates(): void {
    const templatesToSave = this.templates();
    console.log('Saving templates to localStorage:', templatesToSave);
    localStorage.setItem('dashboardTemplates', JSON.stringify(templatesToSave));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}