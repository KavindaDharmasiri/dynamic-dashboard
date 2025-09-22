import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { DashboardService } from '../../../service/dashboard.service';
import { CdkDrag, CdkDragPlaceholder } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-widget-panel',
  imports: [MatIcon, CdkDrag, CdkDragPlaceholder],
  templateUrl: './widget-panel.component.html',
  standalone: true,
  styleUrl: './widget-panel.component.css'
})
export class WidgetPanelComponent {
  store = inject(DashboardService);
}
