import { AfterViewInit, Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { WidgetComponent } from '../component/widget/widget.component';
import { DashboardService } from '../service/dashboard.service';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { wrapGrid } from 'animate-css-grid';
import { environment } from '../../../environments/environment';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  DragDropModule
} from '@angular/cdk/drag-drop';
import { WidgetPanelComponent } from '../component/widget/widget-panel/widget-panel.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ChartSettingsComponent } from '../component/settings/chart-settings/chart-settings.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    WidgetComponent,
    MatButton,
    MatIcon,
    MatButtonToggleModule,
    MatMenuModule,
    CdkDropListGroup,
    DragDropModule,
    CdkDropList,
    WidgetPanelComponent,
    CdkDrag,
    ChartSettingsComponent
  ],
  providers: [DashboardService],
  styles: `
    :host {
      display: block;
      padding: 2rem;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      min-height: 100vh;
      position: relative;
      
      &::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.1) 0%, transparent 50%);
        pointer-events: none;
        z-index: -1;
      }
    }

    .dashboard-widgets {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(4, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-top: 1.5rem;
      min-height: calc(100vh - 200px);
      will-change: contents;
      
      &.cdk-drop-list-receiving {
        background: rgba(99, 102, 241, 0.05);
        border-radius: var(--radius-lg);
        transition: var(--transition-fast);
      }
    }
    
    app-widget {
      grid-column: span var(--widget-cols, 1);
      grid-row: span var(--widget-rows, 1);
    }
    
    app-widget[data-cols="4"] {
      grid-column: 1 / -1;
    }
    
    app-widget[data-rows="4"] {
      grid-row: 1 / -1;
    }
    
    @media (max-width: 1024px) {
      .dashboard-widgets {
        grid-template-columns: repeat(2, 1fr);
      }
      
      app-widget[data-cols="4"],
      app-widget[data-cols="3"] {
        grid-column: 1 / -1;
      }
    }
    
    @media (max-width: 768px) {
      .dashboard-widgets {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      app-widget {
        grid-column: 1 / -1 !important;
      }
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 2rem;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: var(--blur);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      margin-bottom: 2rem;
      transition: var(--transition);
      
      h2 {
        margin: 0;
        font-weight: 700;
        font-size: 1.75rem;
        background: var(--gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      &:hover {
        box-shadow: var(--shadow-xl);
        transform: translateY(-2px);
      }
    }
    
    .view-toggle {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: var(--blur);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: var(--radius);
      padding: 0.125rem;
      box-shadow: var(--shadow-lg);
      transition: var(--transition);
      
      &:hover {
        transform: scale(1.05);
        box-shadow: var(--shadow-xl);
      }
      
      mat-button-toggle-group {
        border: none;
        background: transparent;
      }
      
      mat-button-toggle {
        width: 28px;
        height: 28px;
        border: none;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &.mat-button-toggle-checked {
          background: var(--primary);
          color: white;
        }
        
        .mat-button-toggle-label-content {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          line-height: 1;
        }
        
        mat-icon {
          font-size: 14px;
          width: 14px;
          height: 14px;
          margin: 0;
        }
      }
    }

    .empty-drop-zone {
      min-height: 200px;
      border: 2px dashed var(--outline);
      border-radius: var(--radius);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--on-surface-variant);
      padding: 2rem;
      background: var(--surface);
      transition: var(--transition);
      
      &:hover {
        border-color: var(--primary);
        background: var(--surface-variant);
      }
    }

    .empty-drop-zone mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      margin-bottom: 1rem;
      color: var(--primary);
    }

    .empty-drop-zone span {
      font-size: 1rem;
      font-weight: 500;
    }
  `
})
export class HomeComponent implements OnInit, AfterViewInit {
  store = inject(DashboardService);

  dashboard = viewChild.required<ElementRef>('dashboard');
  chartSettings = viewChild.required<ChartSettingsComponent>('chartSettings');

  ngOnInit(): void {
    // wrapGrid(this.dashboard().nativeElement, { duration: 300 });
  }
  ngAfterViewInit(): void {
    if (this.dashboard()) {
      wrapGrid(this.dashboard().nativeElement, { duration: 300 });
    }
    
    window.addEventListener('openChartSettings', (event: any) => {
      this.chartSettings().sliceId = event.detail.sliceId;
      this.chartSettings().show();
    });
    
    window.addEventListener('chartSettingsChanged', (event: any) => {
      // Refresh widget data from Superset API
      this.refreshWidgetData(event.detail.sliceId);
    });
  }
  drop(event: CdkDragDrop<number, any>) {
    const {
      previousContainer,
      container,
      item: { data }
    } = event;
    if (data) {
      this.store.insertWidgetAtPosition(data, container.data);
      return;
    }
    this.store.updateWidgetPosition(previousContainer.data, container.data);
  }

  drop2(event: CdkDragDrop<any, any>) {
    const {
      previousContainer,
      container,
      item: { data }
    } = event;
    if (data) {
      this.store.insertWidgetAtPosition(data, container.data);
      return;
    }
    this.store.updateWidgetPosition(previousContainer.data, container.data);
  }

  widgetsOpen = signal(false);

  widgetPutBack(event: CdkDragDrop<number, any>) {
    const { previousContainer } = event;
    this.store.removeWidget(previousContainer.data);
  }

  widgetPutBack2(event: CdkDragDrop<any, any>) {
    const { previousContainer } = event;
    this.store.removeWidget(previousContainer.data);
  }

  // Add this signal
  viewMode = signal<'view' | 'edit'>(this.getStoredMode());

// Optional: React to mode changes
  onModeChange(mode: 'view' | 'edit') {
    this.viewMode.set(mode);
    localStorage.setItem('dashboardMode', mode);
  }
  
  private getStoredMode(): 'view' | 'edit' {
    const stored = localStorage.getItem('dashboardMode');
    return (stored === 'view' || stored === 'edit') ? stored : 'edit';
  }
  
  refreshWidgetData(sliceId: number) {
    // Find and update widget with new data from Superset
    const widget = this.store.addedWidgets().find(w => w.sliceId === sliceId);
    if (widget) {
      // Fetch updated chart info from Superset API
      fetch(`${environment.supersetBaseURL}/api/v1/chart/${sliceId}`)
        .then(response => response.json())
        .then(data => {
          if (data.result) {
            this.store.updateWidget(widget.id, {
              label: data.result.slice_name || data.result.viz_type
            });
          }
        })
        .catch(console.error);
    }
  }

}
