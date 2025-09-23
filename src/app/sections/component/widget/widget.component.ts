import { Component, Input, input, signal, inject } from '@angular/core';
import { Widget } from '../../model/dashboard';
import { NgComponentOutlet, NgIf } from '@angular/common';
import { WidgetOptionsComponent } from './widget-options/widget-options.component';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { CdkDrag, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { ChartSettingsComponent } from '../settings/chart-settings/chart-settings.component';
import { DashboardService } from '../../service/dashboard.service';
import { ConfirmationService } from '../../../shared/services/confirmation.service';

@Component({
  selector: 'app-widget',
  imports: [
    NgComponentOutlet,
    WidgetOptionsComponent,
    MatIcon,
    MatIconButton,
    CdkDrag,
    CdkDragPlaceholder,
    NgIf,
    ChartSettingsComponent
  ],
  templateUrl: './widget.component.html',
  standalone: true,
  styleUrl: './widget.component.css',
  host: {
    '[attr.data-cols]': 'data().cols || 1',
    '[attr.data-rows]': 'data().rows || 1',
    '[style.grid-column]': '"span " + Math.min(data().cols || 1, 4)',
    '[style.grid-row]': '"span " + (data().rows || 1)'
  }
})
export class WidgetComponent {
  data = input.required<Widget>();
  Math = Math;
  store = inject(DashboardService);
  confirmationService = inject(ConfirmationService);

  showOptions = signal(false);
  @Input() mode!: 'view' | 'edit';
  
  async confirmDelete() {
    const confirmed = await this.confirmationService.confirmDelete('widget');
    if (confirmed) {
      this.store.removeWidget(this.data().id);
    }
  }
  
  openChartSettings() {
    // Emit event to parent to open chart settings
    window.dispatchEvent(new CustomEvent('openChartSettings', { 
      detail: { sliceId: this.data().sliceId } 
    }));
  }
}
