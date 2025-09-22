import { Component, ElementRef, OnInit, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-anelatics',
  imports: [MatButtonModule, NgIf, MatMenu, MatMenuTrigger, NgClass, NgForOf],
  templateUrl: './anelatics.component.html',
  standalone: true,
  styleUrl: './anelatics.component.scss'
})
export class AnelaticsComponent  {
  // chart = viewChild.required<ElementRef>('chart');
  isSaveWFButton=true;
  masterTemplateList: any[];
  masterFormList: any[] = [];
  isMasterFormLoading= false;
  registerdUsers = 0;
  maxUsers = 1000;
  availableUsers = 1000;
  isTenantAdmin = true;
  isSaveButton = true;

  constructor() {
    // Register needed chart.js components
    // Chart.register(
    //   LineController,
    //   LineElement,
    //   PointElement,
    //   CategoryScale,
    //   LinearScale,
    //   Title,
    //   Tooltip,
    //   Legend,
    //   Filler
    // );
  }

  // ngOnInit() {
  //   new Chart(this.chart().nativeElement, {
  //     type: 'line',
  //     data: {
  //       labels: [
  //         'January',
  //         'February',
  //         'March',
  //         'April',
  //         'May',
  //         'June',
  //         'July'
  //       ],
  //       datasets: [
  //         {
  //           label: 'My First Dataset',
  //           data: [65, 59, 80, 81, 56, 55, 40],
  //           borderColor: 'rgb(255, 99, 132)',
  //           backgroundColor: 'rgba(255, 99, 132, 0.5)',
  //           fill: 'start'
  //         }
  //       ]
  //     },
  //     options: {
  //       maintainAspectRatio: false,
  //       elements: {
  //         line: {
  //           tension: 0.4
  //         }
  //       }
  //     }
  //   });
  // }

  createNewWorkflowDialog() {

  }

  openTemplateDialog(type) {

  }

  pickup(masterForm: any) {

  }

  getNavigate(s: string) {

  }
}
