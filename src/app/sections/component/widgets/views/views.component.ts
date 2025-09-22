import { Component, Input, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SafePipe } from '../../../model/SafePipe';

@Component({
  selector: 'app-views',
  imports: [SafePipe],
  templateUrl: './views.component.html',
  standalone: true,
  styleUrl: './views.component.css'
})
export class ViewsComponent implements OnChanges, OnInit, OnDestroy {
  @Input() sliceId?: number; // ← Dynamic input
  // ✅ Safe URL for [src] binding
  supersetUrl!: SafeResourceUrl;

  // ✅ Raw string URL (for logging, clipboard, etc.)
  chartUrl = '';

  constructor(private sanitizer: DomSanitizer) {}
  
  ngOnInit() {
    window.addEventListener('chartSettingsChanged', this.handleChartSettingsChanged.bind(this));
  }
  
  ngOnDestroy() {
    window.removeEventListener('chartSettingsChanged', this.handleChartSettingsChanged.bind(this));
  }
  
  private handleChartSettingsChanged = (event: any) => {
    if (event.detail.sliceId === this.sliceId) {
      this.reloadChart();
    }
  }
  
  private reloadChart() {
    // Force reload by adding timestamp
    if (this.sliceId && environment.supersetBaseURL) {
      const baseUrl = environment.supersetBaseURL;
      const formData = { slice_id: this.sliceId };
      const encoded = encodeURIComponent(JSON.stringify(formData));
      const timestamp = Date.now();
      
      this.chartUrl = `${baseUrl}/superset/explore/?form_data=${encoded}&standalone=1&t=${timestamp}`;
      this.supersetUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.chartUrl);
    }
  }

  ngOnChanges(): void {
    if (this.sliceId && environment.supersetBaseURL) {
      const baseUrl = environment.supersetBaseURL;
      const formData = { slice_id: this.sliceId };
      const encoded = encodeURIComponent(JSON.stringify(formData));

      this.chartUrl = `${baseUrl}/superset/explore/?form_data=${encoded}&standalone=1`;
      this.supersetUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.chartUrl);
    } else {
      this.chartUrl = '';
    }
  }
}
