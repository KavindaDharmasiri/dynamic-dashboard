import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="'toast-' + toast.type">
          <mat-icon class="toast-icon">
            @switch (toast.type) {
              @case ('success') { check_circle }
              @case ('error') { error }
              @case ('warning') { warning }
              @default { info }
            }
          </mat-icon>
          <span class="toast-message">{{ toast.message }}</span>
          <button mat-icon-button class="toast-close" (click)="toastService.remove(toast.id)">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      backdrop-filter: blur(10px);
      min-width: 300px;
      max-width: 400px;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .toast-success {
      background: rgba(34, 197, 94, 0.9);
      color: white;
      border-left: 4px solid #16a34a;
    }

    .toast-error {
      background: rgba(239, 68, 68, 0.9);
      color: white;
      border-left: 4px solid #dc2626;
    }

    .toast-warning {
      background: rgba(245, 158, 11, 0.9);
      color: white;
      border-left: 4px solid #d97706;
    }

    .toast-info {
      background: rgba(59, 130, 246, 0.9);
      color: white;
      border-left: 4px solid #2563eb;
    }

    .toast-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .toast-message {
      flex: 1;
      font-weight: 500;
    }

    .toast-close {
      width: 2rem;
      height: 2rem;
      color: inherit;
      
      mat-icon {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
      }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}