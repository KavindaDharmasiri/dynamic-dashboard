import { Component, Input } from '@angular/core';
import { SafePipe } from '../../../model/SafePipe';
import { NgIf } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-chart-settings',
  imports: [SafePipe, NgIf],
  templateUrl: './chart-settings.component.html',
  standalone: true,
  styleUrl: './chart-settings.component.css'
})
export class ChartSettingsComponent {
  @Input() sliceId?: number;
  visible = false;
  chartUrl!: string;

  show() {
    // Encode slice_id as URL parameter
    if (this.sliceId) {
      const formData = encodeURIComponent(
        JSON.stringify({ slice_id: this.sliceId })
      );


      const baseUrl = environment.supersetBaseURL;
      this.chartUrl = `${baseUrl}/superset/explore/?form_data=${formData}`;
      this.visible = true;
    }
  }

  close() {
    this.visible = false;
  }
}
