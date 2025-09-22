import { computed, effect, Injectable, signal, OnDestroy } from '@angular/core';
import { Widget } from '../model/dashboard';
import { SubscriberComponent } from '../component/widgets/subscriber/subscriber.component';
import { ViewsComponent } from '../component/widgets/views/views.component';
import { WatchTimeComponent } from '../component/widgets/watch-time/watch-time.component';
import { RevenueComponent } from '../component/widgets/revenue/revenue.component';
import { AnalyticsComponent } from '../component/widgets/anelatics/anelatics.component';
import { SupersetService } from '../../superset/service/superset.service';
import { Subscription } from 'rxjs';

@Injectable()
export class DashboardService implements OnDestroy {
  private subscription = new Subscription();

  widgets = signal<Widget[]>([]);
  addedWidgets = signal<Widget[]>([]);


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

  saveWidgets = effect(() => {
    if (!this.isInitialized()) {
      return;
    }

    const widgets = this.addedWidgets();
    if (widgets.length === 0) {
      return;
    }

    try {
      const widgetsToSave = widgets.map(w => ({
        id: w.id,
        rows: w.rows,
        cols: w.cols,
        backgroundColor: w.backgroundColor,
        color: w.color,
        sliceId: w.sliceId
      }));
      localStorage.setItem(
        'dashboardWidgets',
        JSON.stringify(widgetsToSave)
      );
      console.log('Saved widgets:', widgetsToSave);
    } catch (error) {
      console.error('Failed to save widgets:', error);
    }
  });

  // constructor() {
  //   this.fetchWidgets();
  // }

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
      }
    })
    );
  }

  private restoreAddedWidgets(allWidgets: Widget[]): void {
    const savedWidgetsJsonString = localStorage.getItem('dashboardWidgets') || '[]';

    if (savedWidgetsJsonString === '[]') {
      console.log('No saved widgets found');
      this.isInitialized.set(true);
      return;
    }

    try {
      const savedWidgets: Partial<Widget>[] = JSON.parse(savedWidgetsJsonString);
      console.log('Saved widgets from localStorage:', savedWidgets);

      const restored = savedWidgets
        .map(saved => {
          // 1. Find base widget (from Superset) to get content, label, etc.
          const template = allWidgets.find(w => w.id === saved.id);
          if (!template) return undefined;

          // 2. ✅ Merge: use saved layout, but keep content from template
          return {
            ...template,           // content, label, sliceId, etc.
            rows: saved.rows ?? template.rows,      // ✅ Preserve saved size
            cols: saved.cols ?? (saved as any).columns ?? template.cols,  // Handle both old and new property names
            backgroundColor: saved.backgroundColor ?? template.backgroundColor,
            color: saved.color ?? template.color
          };
        })
        .filter((w): w is Widget => !!w);

      console.log('Restored widgets:', restored);
      // @ts-ignore
      this.addedWidgets.set(restored);
    } catch (e) {
      console.error('Failed to parse saved widgets', e);
    }

    // ✅ Now safe to save
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

    const addedWidgets = this.addedWidgets();
    const indexOfDestWidget = addedWidgets.findIndex(w => w.id === destWidgetId);
    const positionToAdd = indexOfDestWidget === -1 ? addedWidgets.length : indexOfDestWidget;
    addedWidgets.splice(positionToAdd, 0, widgetToAdd);
    this.addedWidgets.set(addedWidgets);
  }
}