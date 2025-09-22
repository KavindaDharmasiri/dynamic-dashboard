import { Component, Input, OnInit } from '@angular/core';
import { SafePipe } from '../../../model/SafePipe';
import { NgIf } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-chart-settings',
  imports: [SafePipe, NgIf, MatButtonModule],
  templateUrl: './chart-settings.component.html',
  standalone: true,
  styleUrl: './chart-settings.component.css'
})
export class ChartSettingsComponent implements OnInit {
  @Input() sliceId?: number;
  visible = false;
  chartUrl!: string;
  
  ngOnInit() {
    window.addEventListener('message', () => {
      setTimeout(() => this.close(), 1000);
    });
  }

  show() {
    if (this.sliceId && environment.supersetBaseURL) {
      const formData = encodeURIComponent(
        JSON.stringify({ slice_id: this.sliceId })
      );
      const baseUrl = environment.supersetBaseURL;
      this.chartUrl = `${baseUrl}/superset/explore/?slice_id=${this.sliceId}`;
      this.visible = true;
    } else {
      console.warn('Cannot show chart: missing sliceId or supersetBaseURL');
    }
  }

  close() {
    this.visible = false;
    // Emit event to reload chart
    window.dispatchEvent(new CustomEvent('chartSettingsChanged', {
      detail: { sliceId: this.sliceId }
    }));
  }
}
