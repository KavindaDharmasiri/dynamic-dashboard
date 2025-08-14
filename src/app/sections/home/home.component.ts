import { AfterViewInit, Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { WidgetComponent } from '../component/widget/widget.component';
import { DashboardService } from '../service/dashboard.service';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { wrapGrid } from 'animate-css-grid';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  DragDropModule
} from '@angular/cdk/drag-drop';
import { WidgetPanelComponent } from '../component/widget/widget-panel/widget-panel.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';


@Component({
  selector: 'app-general',
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
    CdkDrag
  ],
  providers: [DashboardService],
  styles: `
    .dashboard-widgets {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cu1rsor: move;
    }

    .cdk-drop-list-dragging {
      opacity: 0.5;
      border-left: 5px solid #000;
      padding-left: 8px;
    }

    .empty-drop-zone {
      min-height: 100px;
      border: 2px dashed #ccc;
      border-radius: 4px;
      display: flex;
      flex-direction: column; /* Align icon and text vertically */
      align-items: center;
      justify-content: center;
      color: #888;
      padding: 16px;
      box-sizing: border-box;
      text-align: center;
    }

    .empty-drop-zone mat-icon {
      font-size: 48px; /* Make the icon larger */
      width: 48px;
      height: 48px;
      margin-bottom: 8px; /* Add some space below the icon */
    }

    .empty-drop-zone span {
      font-size: 16px;
    }
  `
})
export class HomeComponent implements OnInit, AfterViewInit {
  store = inject(DashboardService);

  dashboard = viewChild.required<ElementRef>('dashboard');

  ngOnInit(): void {
    // wrapGrid(this.dashboard().nativeElement, { duration: 300 });
  }
  ngAfterViewInit(): void {
    if (this.dashboard()) {
      wrapGrid(this.dashboard().nativeElement, { duration: 300 });
    }
  }
  drop(event: CdkDragDrop<number, any>) {
    console.log('iiii');
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

    console.log('iiii');
    console.log(event);
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
    console.log(event);
    const { previousContainer } = event;
    this.store.removeWidget(previousContainer.data);
  }

  // Add this signal
  viewMode = signal<'view' | 'edit'>('edit');

// Optional: React to mode changes
  onModeChange(mode: 'view' | 'edit') {
    this.viewMode.set(mode);
  }

}
