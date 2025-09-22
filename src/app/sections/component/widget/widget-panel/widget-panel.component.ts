import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardService } from '../../../service/dashboard.service';
import { CdkDrag, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-widget-panel',
  imports: [MatIcon, MatButtonModule, CdkDrag, CdkDragPlaceholder],
  templateUrl: './widget-panel.component.html',
  standalone: true,
  styleUrl: './widget-panel.component.css'
})
export class WidgetPanelComponent {
  store = inject(DashboardService);
  
  createNewChart() {
    const baseUrl = environment.supersetBaseURL;
    window.open(`${baseUrl}/chart/add`, '_blank');
  }
}
