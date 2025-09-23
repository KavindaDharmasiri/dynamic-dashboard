import { computed, effect, Injectable, signal, OnDestroy, inject } from '@angular/core';
import { Widget } from '../model/dashboard';
import { SubscriberComponent } from '../component/widgets/subscriber/subscriber.component';
import { ViewsComponent } from '../component/widgets/views/views.component';
import { WatchTimeComponent } from '../component/widgets/watch-time/watch-time.component';
import { RevenueComponent } from '../component/widgets/revenue/revenue.component';
import { AnalyticsComponent } from '../component/widgets/anelatics/anelatics.component';
import { SupersetService } from '../../superset/service/superset.service';
import { StorageService } from '../../shared/services/storage.service';
import { TemplateService } from './template.service';
import { Subscription } from 'rxjs';

@Injectable()
export class DashboardService implements OnDestroy {
  private subscription = new Subscription();

  widgets = signal<Widget[]>([]);
  addedWidgets = signal<Widget[]>([]);
  isLoading = signal<boolean>(true);
  isTemplateEditorMode = false;


  widgetsToAdd = computed(() => {
    const addedIds = new Set(this.addedWidgets().map(widget => widget.id));
    return this.widgets().filter(widget => !addedIds.has(widget.id));
  });

  fetchWidgets() {
    const widgetAsString = localStorage.getItem('dashboardWidgets');
    if (widgetAsString) {
      try {
        const widgets = JSON.parse(widgetAsString) as Widget[];
        widgets.forEach(w => {
          const content = this.widgets().find(
            widget => widget.id === w.id
          )?.content;
          if (content) {
            w.content = content;
          }
        });
        this.addedWidgets.set(widgets);
      } catch (error) {
        console.error('Failed to parse widgets:', error);
      }
    }
  }

  addWidget(w: Widget) {
    const existingWidget = this.addedWidgets().find(widget => widget.id === w.id);
    if (existingWidget) {
      console.log('Widget already exists:', w.id);
      return; // Widget already added
    }
    
    console.log('Adding widget:', w);
    this.addedWidgets.set([...this.addedWidgets(), { ...w }]);
  }

  updateWidget(id: number, widget: Partial<Widget>) {
    const index = this.addedWidgets().findIndex(w => w.id === id);
    if (index !== -1) {
      const newWidgets = [...this.addedWidgets()];
      newWidgets[index] = { ...newWidgets[index], ...widget };
      this.addedWidgets.set(newWidgets);
    }
  }

  moveWidgetToRight(id: number) {
    const widgets = this.addedWidgets();
    const index = widgets.findIndex(w => w.id === id);
    if (index === -1 || index === widgets.length - 1) {
      return;
    }

    const newWidgets = [...widgets];
    [newWidgets[index], newWidgets[index + 1]] = [
      { ...newWidgets[index + 1] },
      { ...newWidgets[index] }
    ];
    this.addedWidgets.set(newWidgets);
  }
  moveWidgetToLeft(id: number) {
    const widgets = this.addedWidgets();
    const index = widgets.findIndex(w => w.id === id);
    if (index <= 0) {
      return; // Already at the leftmost position
    }

    const newWidgets = [...widgets];
    [newWidgets[index], newWidgets[index - 1]] = [
      { ...newWidgets[index - 1] },
      { ...newWidgets[index] }
    ];
    this.addedWidgets.set(newWidgets);
  }

  removeWidget(id: number) {
    this.addedWidgets.set(this.addedWidgets().filter(w => w.id !== id));
  }

// dashboard.service.ts
  private isInitialized = signal<boolean>(false);

  private storageService = inject(StorageService);
  
  // Removed saveWidgets effect - templates handle their own storage

  private applyTheme(theme: any) {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.primaryColor);
    root.style.setProperty('--theme-secondary', theme.secondaryColor);
    root.style.setProperty('--theme-background', theme.backgroundColor);
    root.style.setProperty('--theme-text', theme.textColor);
    root.style.setProperty('--theme-accent', theme.accentColor);
    console.log('Applied theme:', theme);
  }

  private applyDefaultTheme() {
    const defaultTheme = {
      primaryColor: '#6366F1',
      secondaryColor: '#C7D2FE',
      backgroundColor: '#F9FAFB',
      textColor: '#6E7583',
      accentColor: '#CCE5FF'
    };
    this.applyTheme(defaultTheme);
    console.log('Applied default theme');
  }

  // constructor() {
  //   this.fetchWidgets();
  // }

  private templateService = inject(TemplateService);

  constructor(private supersetService: SupersetService) {
    this.loadAllChartsAndRestore();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadAllChartsAndRestore(): void {
    this.subscription.add(
      this.supersetService.getAllCharts().subscribe({
      next: (response) => {
        const chartResults = response?.result || [];

        // ✅ 1. Build widgets from Superset charts (filter out charts without last_saved_by)
        const fetchedWidgets = chartResults
          .filter((chart: any) => chart.last_saved_by !== null)
          .map((chart: any) => ({
            id: chart.id,
            label: chart.slice_name || `Chart ${chart.id}`,
            content: ViewsComponent,
            rows: 1,
            cols: 1,
            backgroundColor: '#F7F7F7',
            color: 'black',
            sliceId: chart.id
          }));

        // ✅ 2. Set widgets signal
        this.widgets.set(fetchedWidgets);

        // ✅ 3. Now restore added widgets
        this.restoreAddedWidgets(fetchedWidgets);
        
        // ✅ 4. Set loading to false
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load charts from Superset', err);
        this.widgets.set([
          {
            id: -1,
            label: 'Failed to load charts',
            content: ViewsComponent,
            rows: 1,
            cols: 1,
            backgroundColor: '#d32f2f',
            color: 'white',
            sliceId: 0
          }
        ]);
        // Still try to restore saved ones if any
        this.restoreAddedWidgets([]);
        
        // Set loading to false even on error
        this.isLoading.set(false);
      }
    })
    );
  }

  private restoreAddedWidgets(allWidgets: Widget[]): void {
    // Skip auto-loading if we're in template editor mode
    if (this.isTemplateEditorMode) {
      console.log('Template editor mode - skipping auto-restore');
      this.isInitialized.set(true);
      return;
    }

    // Check if there's a published template to load
    const publishedTemplate = this.templateService.getPublishedTemplate();
    
    if (publishedTemplate) {
      console.log('Loading published template:', publishedTemplate.name);
      // Load from published template
      const templateWidgets = publishedTemplate.widgets
        .map(tw => {
          const baseWidget = allWidgets.find(w => w.id === tw.id);
          if (!baseWidget) return null;
          
          return {
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
        })
        .filter(w => w !== null) as Widget[];
      
      this.addedWidgets.set(templateWidgets);
      
      // Apply published template theme
      if (publishedTemplate.theme) {
        this.applyTheme(publishedTemplate.theme);
      }
      
      this.isInitialized.set(true);
      return;
    }

    console.log('No published template found - dashboard stays empty');
    // Apply default theme when no published template
    this.applyDefaultTheme();
    this.isInitialized.set(true);
  }

  updateWidgetPosition(sourceWidgetId: number, targetWidgetId: number) {
    const sourceIndex = this.addedWidgets().findIndex(
      w => w.id === sourceWidgetId
    );

    if (sourceIndex === -1) {
      return;
    }

    const newWidgets = [...this.addedWidgets()];
    const sourceWidget = newWidgets.splice(sourceIndex, 1)[0];

    const targetIndex = newWidgets.findIndex(w => w.id === targetWidgetId);
    if (targetIndex === -1) {
      return;
    }

    const insertAt = targetIndex === sourceIndex ? targetIndex + 1 : targetIndex;

    newWidgets.splice(insertAt, 0, sourceWidget);
    this.addedWidgets.set(newWidgets);
  }

  insertWidgetAtPosition(sourceWidgetId: number, destWidgetId: number) {
    const widgetToAdd = this.widgets().find(w => w.id === sourceWidgetId);
    if (!widgetToAdd) {
      return;
    }

    // Check if widget already exists
    const existingWidget = this.addedWidgets().find(w => w.id === sourceWidgetId);
    if (existingWidget) {
      return; // Widget already added
    }

    const addedWidgets = [...this.addedWidgets()];
    const indexOfDestWidget = addedWidgets.findIndex(w => w.id === destWidgetId);
    const positionToAdd = indexOfDestWidget === -1 ? addedWidgets.length : indexOfDestWidget;
    addedWidgets.splice(positionToAdd, 0, { ...widgetToAdd });
    this.addedWidgets.set(addedWidgets);
  }

  saveCurrentAsTemplate(name: string, description: string = '') {
    const currentWidgets = this.addedWidgets().map(w => ({
      id: w.id,
      rows: w.rows,
      cols: w.cols,
      backgroundColor: w.backgroundColor,
      color: w.color,
      sliceId: w.sliceId,
      hideTitle: w.hideTitle || false
    }));
    
    return this.templateService.createTemplate(name, description, currentWidgets);
  }
}