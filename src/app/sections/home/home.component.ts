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
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog.component';
import { ThemeSettingsComponent } from '../../shared/components/theme-settings.component';
import { StorageService } from '../../shared/services/storage.service';


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
    ChartSettingsComponent,
    ConfirmationDialogComponent,
    ThemeSettingsComponent
  ],
  providers: [DashboardService],
  styles: `
    :host {
      display: block;
      padding: 2rem;
      background: linear-gradient(135deg, var(--theme-background, #f8fafc) 0%, #e2e8f0 100%);
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
      grid-auto-rows: minmax(200px, auto);
      gap: 1.5rem;
      margin-top: 1.5rem;
      width: 100%;
      max-width: 100%;
      overflow: hidden;
      animation: dashboardSlideIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      
      &.cdk-drop-list-receiving {
        background: rgba(var(--theme-primary-rgb, 99, 102, 241), 0.05);
        border-radius: var(--radius-lg);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        transform: scale(1.01);
        box-shadow: 0 8px 32px rgba(99, 102, 241, 0.15);
      }
      
      &:has(.empty-drop-zone),
      &:has(.empty-state) {
        display: block;
        grid-template-columns: none;
        grid-auto-rows: none;
        gap: 0;
      }
    }
    
    @keyframes dashboardSlideIn {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
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
      transition: all 0.3s ease;
      animation: pulse 1.5s infinite;
      transform: scale(0.95);
    }
    
    .cdk-drag-preview {
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      transform: rotate(5deg);
      transition: transform 0.2s ease;
      opacity: 0.9;
    }
    
    .cdk-drag-placeholder {
      opacity: 0.3;
      transform: scale(0.9);
      transition: all 0.3s ease;
    }
    
    .cdk-drop-list-receiving {
      transform: scale(1.02);
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
      transition: all 0.3s ease;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.5; transform: scale(0.95); }
      50% { opacity: 0.8; transform: scale(1); }
    }
    
    @keyframes dropZoneGlow {
      0%, 100% { box-shadow: 0 0 10px rgba(99, 102, 241, 0.2); }
      50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.4); }
    }
    
    .drop-zone {
      min-height: 40px;
      opacity: 0.3;
      border: 1px dashed rgba(99, 102, 241, 0.2);
      border-radius: 4px;
      margin: 4px 0;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &.cdk-drop-list-receiving {
        opacity: 1;
        min-height: 80px;
        background: rgba(99, 102, 241, 0.1);
        border: 2px dashed rgba(99, 102, 241, 0.8);
        border-radius: 8px;
        animation: pulse 1s infinite;
      }
    }
    
    .end-drop-zone {
      grid-column: 1 / -1;
      min-height: 80px;
      border: 2px dashed rgba(99, 102, 241, 0.2);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: rgba(99, 102, 241, 0.6);
      background: rgba(99, 102, 241, 0.02);
      transition: all 0.3s ease;
      
      &.cdk-drop-list-receiving {
        border-color: rgba(99, 102, 241, 0.8);
        background: rgba(99, 102, 241, 0.1);
        transform: scale(1.02);
      }
    }
    
    app-widget {
      grid-column: span var(--widget-cols, 1);
      grid-row: span var(--widget-rows, 1);
      animation: widgetFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    
    app-widget:nth-child(1) { animation-delay: 0.1s; }
    app-widget:nth-child(2) { animation-delay: 0.2s; }
    app-widget:nth-child(3) { animation-delay: 0.3s; }
    app-widget:nth-child(4) { animation-delay: 0.4s; }
    app-widget:nth-child(5) { animation-delay: 0.5s; }
    app-widget:nth-child(6) { animation-delay: 0.6s; }
    
    @keyframes widgetFadeIn {
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    app-widget[data-cols="4"] {
      grid-column: 1 / -1;
    }
    
    app-widget[data-rows="4"] {
      grid-row: 1 / -1;
    }
    
    @media (max-width: 1200px) {
      .dashboard-widgets {
        grid-template-columns: repeat(3, 1fr);
      }
      
      app-widget[data-cols="4"] {
        grid-column: 1 / -1 !important;
      }
    }
    
    @media (max-width: 900px) {
      .dashboard-widgets {
        grid-template-columns: repeat(2, 1fr);
      }
      
      app-widget[data-cols="4"],
      app-widget[data-cols="3"] {
        grid-column: 1 / -1 !important;
      }
    }
    
    @media (max-width: 600px) {
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
      background: rgba(var(--theme-background-rgb, 255, 255, 255), 0.8);
      backdrop-filter: var(--blur);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      margin-bottom: 2rem;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      animation: headerSlideDown 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      
      h2 {
        margin: 0;
        font-weight: 700;
        font-size: 1.75rem;
        background: linear-gradient(135deg, var(--theme-primary, #667eea) 0%, var(--theme-secondary, #764ba2) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: titleGlow 3s ease-in-out infinite;
      }
      
      .theme-btn {
        background: rgba(255, 255, 255, 0.1);
        color: var(--theme-primary, #667eea);
        border: 1px solid rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        
        &:hover {
          background: var(--theme-primary, #667eea);
          color: white;
          transform: scale(1.1);
        }
      }
    }
    
    .header-left {
      flex: 1;
      
      h2 {
        margin: 0;
        font-weight: 700;
        font-size: 1.5rem;
        background: linear-gradient(135deg, var(--theme-primary, #6366F1) 0%, var(--theme-text, #6E7583) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
    
    .header-center {
      flex: 0 0 auto;
    }
    
    .header-right {
      flex: 0 0 auto;
      display: flex;
      gap: 8px;
      align-items: center;
    }
    
    .header-action-btn {
      width: 36px;
      height: 36px;
      background: rgba(var(--theme-primary-rgb, 99, 102, 241), 0.08);
      color: var(--theme-primary, #6366F1);
      border: 1px solid rgba(var(--theme-primary-rgb, 99, 102, 241), 0.15);
      border-radius: 10px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
      
      &:hover:not(:disabled) {
        background: var(--theme-primary, #6366F1);
        color: white;
        transform: translateY(-1px) scale(1.05);
        box-shadow: 0 4px 12px rgba(var(--theme-primary-rgb, 99, 102, 241), 0.3);
        border-color: var(--theme-primary, #6366F1);
      }
      
      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }
    
    @keyframes headerSlideDown {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes titleGlow {
      0%, 100% {
        filter: brightness(1);
      }
      50% {
        filter: brightness(1.2);
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
        width: 36px;
        height: 36px;
        border: none;
        background: rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          opacity: 0;
          transition: all 0.3s ease;
          border-radius: 10px;
        }
        
        &:hover:not(.mat-button-toggle-checked) {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        &.mat-button-toggle-checked {
          background: transparent;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
          
          &::before {
            opacity: 1;
          }
        }
        
        .mat-button-toggle-label-content {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          line-height: 1;
          position: relative;
          z-index: 1;
        }
        
        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
          margin: 0;
          transition: all 0.2s ease;
        }
      }
    }

    .empty-drop-zone {
      width: 100%;
      min-height: 400px;
      border: 2px dashed rgba(var(--theme-primary-rgb, 99, 102, 241), 0.3);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: rgba(var(--theme-primary-rgb, 99, 102, 241), 0.6);
      padding: 2rem;
      background: rgba(var(--theme-primary-rgb, 99, 102, 241), 0.05);
      transition: all 0.3s ease;
      margin: 0;
      box-sizing: border-box;
      
      &.cdk-drop-list-receiving,
      &.drag-over {
        border-color: rgba(var(--theme-primary-rgb, 99, 102, 241), 0.8);
        background: rgba(var(--theme-primary-rgb, 99, 102, 241), 0.1);
      }
      
      mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        margin-bottom: 1rem;
        color: var(--theme-primary, #6366F1);
        opacity: 0.5;
      }
      
      span {
        font-size: 1rem;
        font-weight: 500;
      }
    }
    
    .dashboard-widgets {
      position: relative;
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
    
    .floating-mode-trigger-top {
      position: fixed;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 200px;
      height: 60px;
      z-index: 999;
      pointer-events: auto;
    }
    
    .floating-mode-selector {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%) translateY(-10px) scale(0.9);
      z-index: 1000;
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
      
      mat-button-toggle-group {
        background: rgba(var(--theme-background-rgb, 255, 255, 255), 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(var(--theme-primary-rgb, 99, 102, 241), 0.2);
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        padding: 4px;
      }
      
      mat-button-toggle {
        width: 40px;
        height: 36px;
        border: none;
        background: transparent;
        border-radius: 8px;
        transition: all 0.3s ease;
        
        &.mat-button-toggle-checked {
          background: var(--theme-primary, #6366F1);
          color: white;
          box-shadow: 0 2px 8px rgba(var(--theme-primary-rgb, 99, 102, 241), 0.3);
        }
        
        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }
    }
    
    .floating-mode-trigger-top:hover + .floating-mode-selector,
    .floating-mode-selector:hover {
      opacity: 1;
      transform: translateX(-50%) translateY(0) scale(1);
      pointer-events: auto;
    }
    
    .loading-screen {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      padding: 2rem;
    }
    
    .loading-spinner {
      text-align: center;
      
      .spinner {
        width: 48px;
        height: 48px;
        border: 4px solid rgba(var(--theme-primary-rgb, 99, 102, 241), 0.1);
        border-left-color: var(--theme-primary, #6366F1);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1.5rem;
      }
      
      h3 {
        margin: 0 0 0.5rem 0;
        color: var(--theme-text, #6E7583);
        font-size: 1.25rem;
        font-weight: 600;
      }
      
      p {
        margin: 0;
        color: var(--theme-text, #6E7583);
        opacity: 0.7;
        font-size: 0.875rem;
      }
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      padding: 2rem;
      text-align: center;
      color: var(--theme-text, #6E7583);
      opacity: 0.7;
      
      mat-icon {
        font-size: 4rem;
        width: 4rem;
        height: 4rem;
        margin-bottom: 1rem;
        color: var(--theme-primary, #6366F1);
        opacity: 0.5;
      }
      
      h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.25rem;
        font-weight: 600;
      }
      
      p {
        margin: 0;
        font-size: 0.875rem;
        opacity: 0.8;
      }
    }
  `
})
export class HomeComponent implements OnInit, AfterViewInit {
  store = inject(DashboardService);

  dashboard = viewChild<ElementRef>('dashboard');
  chartSettings = viewChild.required<ChartSettingsComponent>('chartSettings');
  themeSettings = viewChild.required<ThemeSettingsComponent>('themeSettings');

  ngOnInit(): void {
    // wrapGrid(this.dashboard().nativeElement, { duration: 300 });
  }
  ngAfterViewInit(): void {
    const dashboardEl = this.dashboard();
    if (dashboardEl) {
      wrapGrid(dashboardEl.nativeElement, { duration: 300 });
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
    
    if (previousContainer !== container) {
      if (data && typeof data === 'number') {
        // Adding new widget from palette
        this.store.insertWidgetAtPosition(data, container.data);
      } else {
        // Moving existing widget
        this.store.updateWidgetPosition(previousContainer.data, container.data);
      }
    }
  }

  drop2(event: CdkDragDrop<any, any>) {
    const { previousContainer, container, item } = event;
    const widgetId = item.data;
    
    console.log('Drop2 called:', { widgetId, previousContainer, container });
    
    if (previousContainer !== container && widgetId) {
      const widget = this.store.widgets().find(w => w.id === widgetId);
      console.log('Found widget:', widget);
      if (widget) {
        this.store.addWidget(widget);
        console.log('Widget added');
      }
    }
    this.isDragOver = false;
  }

  widgetsOpen = signal(false);
  isDragOver = false;

  widgetPutBack(event: CdkDragDrop<number, any>) {
    const { previousContainer } = event;
    this.store.removeWidget(previousContainer.data);
  }

  widgetPutBack2(event: CdkDragDrop<any, any>) {
    const { previousContainer } = event;
    this.store.removeWidget(previousContainer.data);
  }

  private storageService = inject(StorageService);
  
  viewMode = signal<'view' | 'edit'>(this.storageService.config().mode);

  onModeChange(mode: 'view' | 'edit') {
    this.viewMode.set(mode);
    this.storageService.updateMode(mode);
  }
  
  insertAt(event: CdkDragDrop<any, any>, position: number) {
    const { previousContainer, container, item } = event;
    const widgetId = item.data;
    
    console.log('InsertAt called:', { widgetId, position, previousContainer, container });
    
    if (previousContainer !== container && widgetId) {
      const widget = this.store.widgets().find(w => w.id === widgetId);
      console.log('Found widget for insertAt:', widget);
      if (widget) {
        this.store.addWidget(widget);
        console.log('Widget added via insertAt');
      }
    }
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
