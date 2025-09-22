import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SupersetService } from '../service/superset.service';
import { embedDashboard } from "@superset-ui/embedded-sdk";

@Component({
  selector: 'app-superset',
  imports: [],
  templateUrl: './superset.component.html',
  styleUrl: './superset.component.css'
})
export class SupersetComponent  implements AfterViewInit{

  @ViewChild('supersetDiv', { static: true }) supersetDiv!: ElementRef;

  constructor(private embedService: SupersetService) {}

  ngAfterViewInit() {
    this.embedService.embedDashboard(this.supersetDiv.nativeElement).subscribe({
      next: () => {/* Dashboard embedded successfully */},
      error: (err) => {/* Handle dashboard embedding error */},
    });
  }
}
