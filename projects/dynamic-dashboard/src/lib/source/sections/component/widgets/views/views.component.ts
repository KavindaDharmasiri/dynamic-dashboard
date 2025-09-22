import { Component, Input, OnChanges } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SafePipe } from '../../../model/SafePipe';

@Component({
  selector: 'app-views',
  imports: [SafePipe],
  templateUrl: './views.component.html',
  standalone: true,
  styleUrl: './views.component.css'
})
export class ViewsComponent implements OnChanges{
  @Input() sliceId?: number; // ← Dynamic input
  // ✅ Safe URL for [src] binding
  supersetUrl!: SafeResourceUrl;

  // ✅ Raw string URL (for logging, clipboard, etc.)
  chartUrl = '';

  constructor(private sanitizer: DomSanitizer) {
  }


  ngOnChanges(): void {
    console.log('ViewsComponent received sliceId:', this.sliceId);
    if (this.sliceId) {
      const baseUrl = environment.supersetBaseURL;
      const formData = { slice_id: this.sliceId };
      const encoded = encodeURIComponent(JSON.stringify(formData));

      // ✅ Build raw string URL
      this.chartUrl = `${baseUrl}/superset/explore/?form_data=${encoded}&standalone=1`;

      // ✅ Sanitize it for Angular binding
      this.supersetUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.chartUrl);

      // 🔍 Optional: log it
      console.log('Chart URL:', this.chartUrl);
    } else {
      this.chartUrl = '';
      // No URL to show
    }
  }
}
