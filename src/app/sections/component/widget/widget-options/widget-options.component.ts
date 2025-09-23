import { Component, inject, Input, model } from '@angular/core';
import { Widget } from '../../../model/dashboard';
import { DashboardService } from '../../../service/dashboard.service';
import { ConfirmationService } from '../../../../shared/services/confirmation.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-widget-options',
  imports: [MatButtonToggleModule, MatIcon, MatButtonModule, MatSlideToggleModule],
  templateUrl: './widget-options.component.html',
  standalone: true,
  styleUrl: './widget-options.component.css'
})
export class WidgetOptionsComponent {
  showOptions = model<boolean>(false);
  @Input() data!: Widget;

  store = inject(DashboardService);
  confirmationService = inject(ConfirmationService);
  
  updateCols(value: number) {
    console.log('Updating cols to:', value, 'for widget:', this.data.id);
    this.store.updateWidget(this.data.id, { cols: value });
  }
  
  updateRows(value: number) {
    console.log('Updating rows to:', value, 'for widget:', this.data.id);
    this.store.updateWidget(this.data.id, { rows: value });
  }
  
  async confirmDelete() {
    const confirmed = await this.confirmationService.confirmDelete('widget');
    if (confirmed) {
      this.store.removeWidget(this.data.id);
      this.showOptions.set(false);
    }
  }
}
