import { computed, effect, Injectable, signal } from '@angular/core';
import { Widget } from '../model/dashboard';
import { SubscriberComponent } from '../component/widgets/subscriber/subscriber.component';
import { ViewsComponent } from '../component/widgets/views/views.component';
import { WatchTimeComponent } from '../component/widgets/watch-time/watch-time.component';
import { RevenueComponent } from '../component/widgets/revenue/revenue.component';
import { AnelaticsComponent } from '../component/widgets/anelatics/anelatics.component';

@Injectable()
export class DashboardService {

  widgets = signal<Widget[]>([
    {
      id: 1,
      label: 'Dynamic Dashboard',
      content: SubscriberComponent,
      rows: 1,
      columns: 1,
      backgroundColor: '#003f5c',
      color: 'whitesmoke'
    },
    {
      id: 2,
      label: 'Dynamic Dashboard2',
      content: ViewsComponent,
      rows: 1,
      columns: 1,
      backgroundColor: '#003f5c',
      color: 'whitesmoke'
    },
    {
      id: 3,
      label: 'Dynamic Dashboard',
      content: WatchTimeComponent,
      rows: 1,
      columns: 1,
      backgroundColor: '#003f5c',
      color: 'whitesmoke'
    },
    {
      id: 4,
      label: 'Approve',
      content: RevenueComponent,
      rows: 1,
      columns: 1,
      backgroundColor: '#f9fafb ',
      color: 'black'
    },
    {
      id: 5,
      label: 'pick up',
      content: AnelaticsComponent,
      rows: 2,
      columns: 2,
      backgroundColor: '#f9fafb ',
      color: 'black'
    }
  ]);

  addedWidgets = signal<Widget[]>([]);

  widgetsToAdd = computed(() => {
    const addedIds = this.addedWidgets().map(widget => widget.id);
    return this.widgets().filter(widget => !addedIds.includes(widget.id));
  });

  fetchWidgets() {
    const widgetAsString = localStorage.getItem('dashboardWidgets');
    if (widgetAsString) {
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
    const index = this.addedWidgets().findIndex(w => w.id === id);
    console.log(index);
    console.log(this.addedWidgets().length);
    if (index === this.addedWidgets().length - 1) {
      return; // Already at the rightmost position
    }

    const newWidgets = [...this.addedWidgets()];
    [newWidgets[index], newWidgets[index + 1]] = [
      { ...newWidgets[index + 1] },
      { ...newWidgets[index] }
    ];
    this.addedWidgets.set(newWidgets);
  }
  moveWidgetToLeft(id: number) {
    const index = this.addedWidgets().findIndex(w => w.id === id);
    if (index === 0) {
      return; // Already at the rightmost position
    }

    const newWidgets = [...this.addedWidgets()];
    [newWidgets[index], newWidgets[index - 1]] = [
      { ...newWidgets[index - 1] },
      { ...newWidgets[index] }
    ];
    this.addedWidgets.set(newWidgets);
  }

  removeWidget(id: number) {
    this.addedWidgets.set(this.addedWidgets().filter(w => w.id !== id));
  }

  saveWidgets = effect(() => {
    const widgetsWithoutContent: Partial<Widget>[] = this.addedWidgets().map(
      w => ({ ...w })
    );
    widgetsWithoutContent.forEach(widget => {
      delete widget.content; // Remove content to avoid circular references
    });
    localStorage.setItem(
      'dashboardWidgets',
      JSON.stringify(widgetsWithoutContent)
    );
  });

  constructor() {
    this.fetchWidgets();
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

    const insetAt = targetIndex === sourceIndex ? targetIndex + 1 : targetIndex;

    newWidgets.splice(insetAt, 0, sourceWidget);
    this.addedWidgets.set(newWidgets);
  }

  insertWidgetAtPosition(sourceWidgetId: number, destWidgetId: number) {
    const widgetToAdd = this.widgets().find(w => w.id === sourceWidgetId);
    if (!widgetToAdd) {
      return;
    }

    const indexOfDestWidget = this.addedWidgets().findIndex(w => w.id === destWidgetId);
    const positionToAdd = indexOfDestWidget === -1 ? this.addedWidgets().length : indexOfDestWidget;
    const newWidgets = [...this.addedWidgets()];
    newWidgets.splice(positionToAdd, 0, widgetToAdd);
    this.addedWidgets.set(newWidgets);
  }
}
