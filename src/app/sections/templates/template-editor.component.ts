import { Component, inject, OnInit, signal, viewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { WidgetComponent } from '../component/widget/widget.component';
import { WidgetPanelComponent } from '../component/widget/widget-panel/widget-panel.component';
import { DashboardService } from '../service/dashboard.service';
import { TemplateService } from '../service/template.service';
import { DashboardTemplate } from '../model/template';
import { CreateTemplateDialogComponent } from './create-template-dialog.component';
import { ThemeSettingsComponent } from '../../shared/components/theme-settings.component';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog.component';
import { ToastComponent } from '../../shared/components/toast.component';
import { ToastService } from '../../shared/services/toast.service';
import { wrapGrid } from 'animate-css-grid';

@Component({
  selector: 'app-template-editor',
  standalone: true,
  imports: [
    CommonModule, MatButtonModule, MatIconModule, MatInputModule, 
    MatFormFieldModule, FormsModule, DragDropModule, WidgetComponent, WidgetPanelComponent, ThemeSettingsComponent, ConfirmationDialogComponent, ToastComponent
  ],
  providers: [DashboardService],
  template: `
    <div class="template-editor">
      <div class="editor-header">
        <div class="template-info">
          <div class="template-display">
            <h2>{{ templateName || 'Untitled Template' }}</h2>
            <p>{{ templateDescription || 'No description' }}</p>
          </div>
          <button mat-icon-button (click)="editTemplateInfo()" title="Edit Template Info">
            <mat-icon>edit</mat-icon>
          </button>
        </div>
        
        <div class="editor-actions">
          <button mat-icon-button (click)="widgetsOpen.set(!widgetsOpen())" title="Add Widget">
            @if(widgetsOpen()) {
              <mat-icon>close</mat-icon>
            } @else {
              <mat-icon>add_circle</mat-icon>
            }
          </button>
          <button mat-icon-button (click)="themeSettings.open()" title="Theme Settings">
            <mat-icon>palette</mat-icon>
          </button>
          <button mat-raised-button color="primary" (click)="saveTemplate()">
            <mat-icon>save</mat-icon>
            Save Template
          </button>
          <button mat-button (click)="cancel()">Cancel</button>
        </div>
      </div>

      <div cdkDropListGroup class="editor-content">
        @if (store.addedWidgets().length > 0) {
          <div #dashboard class="dashboard-widgets">
            @for (w of store.addedWidgets(); track w.id) {
              <app-widget cdkDropList [data]="w" mode="edit" (cdkDropListDropped)="drop($event)" [cdkDropListData]="w.id" cdkDropListSortingDisabled>
                <div *cdkDragPlaceholder class="drop-placeholder">
                  <mat-icon>swap_horiz</mat-icon>
                  <span>Drop here to replace</span>
                </div>
              </app-widget>
            }
          </div>
        } @else {
          <div #dashboard class="dashboard-widgets" cdkDropList [cdkDropListData]="-1" (cdkDropListDropped)="drop2($event)">
            <div class="empty-drop-zone">
              <mat-icon>add_box</mat-icon>
              <span>Drag a widget here</span>
            </div>
          </div>
        }

        @if (widgetsOpen()) {
          <app-widget-panel cdkDropList cdkDrag (cdkDropListDropped)="widgetPutBack($event)" />
        }
      </div>
      
      <app-theme-settings #themeSettings></app-theme-settings>
      <app-confirmation-dialog></app-confirmation-dialog>
      <app-toast></app-toast>
    </div>
  `,
  styles: [`
    .template-editor {
      height: 100vh;
      display: flex;
      flex-direction: column;
      background: linear-gradient(135deg, var(--theme-background, #f8fafc) 0%, #e2e8f0 100%);
    }

    .editor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 2rem;
      background: var(--theme-background, #f9fafb);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--theme-primary, #6366f1);
      gap: 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .template-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
      
      .template-display {
        flex: 1;
        
        h2 {
          margin: 0 0 0.25rem 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--theme-text, #333);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        p {
          margin: 0;
          font-size: 0.875rem;
          color: var(--theme-text, #666);
          opacity: 0.8;
        }
      }
    }

    .editor-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
      
      button {
        transition: all 0.2s ease;
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      }
      
      .mat-mdc-raised-button {
        background: var(--theme-primary, #6366f1) !important;
        color: white !important;
        
        &:hover {
          background: var(--theme-accent, #4f46e5) !important;
        }
      }
    }

    .editor-content {
      flex: 1;
      padding: 2rem;
      overflow: auto;
    }

    .dashboard-widgets {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-auto-rows: minmax(200px, auto);
      gap: 1.5rem;
      width: 100%;
      
      &.cdk-drop-list-receiving {
        background: var(--theme-secondary, #c7d2fe);
        border-radius: 12px;
        transform: scale(1.01);
        box-shadow: 0 8px 32px var(--theme-primary, #6366f1);
        opacity: 0.3;
      }
    }

    .empty-drop-zone {
      grid-column: 1 / -1;
      min-height: 400px;
      border: 2px dashed var(--theme-primary, #6366f1);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--theme-primary, #6366f1);
      background: rgba(255, 255, 255, 0.1);
      opacity: 0.4;
      transition: all 0.3s ease;
      
      &.cdk-drop-list-receiving {
        border-color: var(--theme-primary, #6366f1);
        background: rgba(255, 255, 255, 0.2);
        opacity: 0.6;
        transform: scale(1.02);
      }
      
      mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        margin-bottom: 1rem;
      }
    }

    .drop-placeholder {
      background: rgba(99, 102, 241, 0.1);
      border: 2px dashed rgba(99, 102, 241, 0.5);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(99, 102, 241, 0.7);
      font-weight: 500;
    }

    app-widget {
      grid-column: span var(--widget-cols, 1);
      grid-row: span var(--widget-rows, 1);
    }

    @media (max-width: 1200px) {
      .dashboard-widgets {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 900px) {
      .dashboard-widgets {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 600px) {
      .dashboard-widgets {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TemplateEditorComponent implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  store = inject(DashboardService);
  private templateService = inject(TemplateService);
  private dialog = inject(MatDialog);
  private toastService = inject(ToastService);
  
  constructor() {
    // Set template editor mode to prevent auto-loading
    this.store.isTemplateEditorMode = true;
  }
  
  dashboard = viewChild<ElementRef>('dashboard');
  themeSettings = viewChild.required<ThemeSettingsComponent>('themeSettings');
  widgetsOpen = signal(false);
  
  templateId: string | null = null;
  templateName = '';
  templateDescription = '';
  isNewTemplate = true;

  ngOnInit() {
    this.templateId = this.route.snapshot.paramMap.get('id');
    console.log('Template ID from route:', this.templateId);
    
    // ALWAYS clear dashboard first - templates are independent
    this.store.addedWidgets.set([]);
    console.log('Dashboard cleared for template editor');
    
    // Force reload templates from localStorage
    this.templateService.loadTemplates();
    
    if (this.templateId) {
      const template = this.templateService.getTemplates()().find(t => t.id === this.templateId);
      
      if (template) {
        this.templateName = template.name;
        this.templateDescription = template.description || '';
        
        if (template.widgets.length === 0) {
          // This is a new empty template - keep dashboard empty
          this.isNewTemplate = true;
          console.log('New empty template - dashboard stays empty');
        } else {
          // This is an existing template with widgets - wait for widgets to load
          this.isNewTemplate = false;
          console.log('Existing template with widgets - waiting to load');
          this.waitForWidgetsAndLoadTemplate();
        }
      }
    } else {
      this.isNewTemplate = true;
      this.templateName = '';
      this.templateDescription = '';
    }
  }

  private waitForWidgetsAndLoadTemplate() {
    const checkWidgets = () => {
      if (this.store.widgets().length > 0) {
        console.log('Widgets available, loading template');
        this.loadTemplate();
      } else {
        console.log('Widgets not ready, waiting...');
        setTimeout(checkWidgets, 200);
      }
    };
    checkWidgets();
  }

  ngAfterViewInit() {
    const dashboardEl = this.dashboard();
    if (dashboardEl) {
      wrapGrid(dashboardEl.nativeElement, { duration: 300 });
    }
  }

  private loadTemplate() {
    // Force reload templates to get latest data
    this.templateService.loadTemplates();
    
    const templates = this.templateService.getTemplates()();
    const template = templates.find(t => t.id === this.templateId);
    console.log('Loading template:', template);
    
    if (template) {
      this.templateName = template.name;
      this.templateDescription = template.description || '';
      
      console.log('Template widgets to load:', template.widgets);
      
      if (template.widgets && template.widgets.length > 0) {
        // Load template widgets with their saved configurations
        const availableWidgets = this.store.widgets();
        const templateWidgets = template.widgets
          .map(tw => {
            const baseWidget = availableWidgets.find(w => w.id === tw.id);
            if (!baseWidget) {
              console.warn('Base widget not found for ID:', tw.id);
              return null;
            }
            
            // Merge base widget with template-specific configuration
            const mergedWidget = {
              ...baseWidget,
              label: tw.label || baseWidget.label,
              rows: tw.rows,
              cols: tw.cols,
              x: tw.x || 0,
              y: tw.y || 0,
              backgroundColor: tw.backgroundColor,
              color: tw.color,
              hideTitle: tw.hideTitle || false
            };
            console.log('Merged widget:', mergedWidget);
            return mergedWidget;
          })
          .filter(w => w !== null);
        
        console.log('Final template widgets to set:', templateWidgets);
        this.store.addedWidgets.set(templateWidgets);
      } else {
        console.log('Template has no widgets - keeping empty');
        this.store.addedWidgets.set([]);
      }
      
      // Apply template theme if it exists
      if (template.theme) {
        this.applyTemplateTheme(template.theme);
      }
    } else {
      console.error('Template not found:', this.templateId);
    }
  }

  drop(event: CdkDragDrop<number, any>) {
    const { previousContainer, container, item: { data } } = event;
    
    if (previousContainer !== container) {
      if (data && typeof data === 'number') {
        this.store.insertWidgetAtPosition(data, container.data);
      } else {
        this.store.updateWidgetPosition(previousContainer.data, container.data);
      }
    }
  }

  drop2(event: CdkDragDrop<any, any>) {
    const { previousContainer, container, item } = event;
    const widgetId = item.data;
    
    if (previousContainer !== container && widgetId) {
      const widget = this.store.widgets().find(w => w.id === widgetId);
      if (widget) {
        this.store.addWidget(widget);
      }
    }
  }

  widgetPutBack(event: CdkDragDrop<number, any>) {
    const { previousContainer } = event;
    this.store.removeWidget(previousContainer.data);
  }

  saveTemplate() {
    if (!this.templateName.trim()) {
      this.toastService.warning('Please enter a template name');
      return;
    }

    if (this.store.addedWidgets().length === 0) {
      this.toastService.warning('Please add at least one widget to the template');
      return;
    }

    const currentWidgets = this.store.addedWidgets().map(w => ({
      id: w.id,
      label: w.label || '',
      rows: w.rows,
      cols: w.cols,
      x: w.x || 0,
      y: w.y || 0,
      backgroundColor: w.backgroundColor,
      color: w.color,
      sliceId: w.sliceId,
      hideTitle: w.hideTitle || false
    }));

    try {
      if (this.templateId) {
        // Get current theme from CSS variables
        const currentTheme = {
          primaryColor: getComputedStyle(document.documentElement).getPropertyValue('--theme-primary').trim() || '#6366F1',
          secondaryColor: getComputedStyle(document.documentElement).getPropertyValue('--theme-secondary').trim() || '#C7D2FE',
          backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--theme-background').trim() || '#F9FAFB',
          textColor: getComputedStyle(document.documentElement).getPropertyValue('--theme-text').trim() || '#6E7583',
          accentColor: getComputedStyle(document.documentElement).getPropertyValue('--theme-accent').trim() || '#CCE5FF'
        };
        
        // Update existing template with new widget data and theme
        const widgetsCopy = currentWidgets.map(w => ({ ...w }));
        this.templateService.updateTemplate(this.templateId, {
          name: this.templateName.trim(),
          description: this.templateDescription.trim(),
          widgets: widgetsCopy,
          theme: currentTheme
        });
        console.log('Updated template:', this.templateId);
      }
      
      this.toastService.success('Template saved successfully!');
      this.restorePublishedTheme();
      // Delay navigation to show toast
      setTimeout(() => {
        this.router.navigate(['/templates']);
      }, 1500);
    } catch (error) {
      console.error('Error saving template:', error);
      this.toastService.error('Failed to save template. Please try again.');
    }
  }

  cancel() {
    this.restorePublishedTheme();
    this.router.navigate(['/templates']);
  }

  editTemplateInfo() {
    const dialogRef = this.dialog.open(CreateTemplateDialogComponent, {
      width: '400px',
      data: {
        name: this.templateName,
        description: this.templateDescription,
        title: 'Edit Template Info'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.templateName = result.name;
        this.templateDescription = result.description;
      }
    });
  }

  private applyTemplateTheme(theme: any) {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.primaryColor);
    root.style.setProperty('--theme-secondary', theme.secondaryColor);
    root.style.setProperty('--theme-background', theme.backgroundColor);
    root.style.setProperty('--theme-text', theme.textColor);
    root.style.setProperty('--theme-accent', theme.accentColor);
    console.log('Applied template theme:', theme);
  }

  private restorePublishedTheme() {
    const publishedTemplate = this.templateService.getPublishedTemplate();
    if (publishedTemplate && publishedTemplate.theme) {
      this.applyTemplateTheme(publishedTemplate.theme);
      console.log('Restored published template theme');
    } else {
      // Apply default theme if no published template
      const defaultTheme = {
        primaryColor: '#6366F1',
        secondaryColor: '#C7D2FE',
        backgroundColor: '#F9FAFB',
        textColor: '#6E7583',
        accentColor: '#CCE5FF'
      };
      this.applyTemplateTheme(defaultTheme);
      console.log('Restored default theme');
    }
  }
}