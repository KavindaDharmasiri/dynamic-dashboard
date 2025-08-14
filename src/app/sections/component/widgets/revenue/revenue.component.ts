import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-revenue',
  imports: [NgIf],
  templateUrl: './revenue.component.html',
  standalone: true,
  styleUrl: './revenue.component.scss'
})
export class RevenueComponent {
  isApproval = true;
  approveCount = 8;
  isInprogress = true;
  inProgressCount = 5;
  isCompleted = true;
  completedCount = 12;
  isRejected = true;
  rejectedCount = 3;
}
