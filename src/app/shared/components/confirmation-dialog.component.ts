import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmationService } from '../services/confirmation.service';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    @if (confirmationService.activeDialog()) {
      <div class="confirmation-overlay" (click)="confirmationService.dismiss()">
        <div class="confirmation-dialog" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <mat-icon [class]="'icon-' + confirmationService.activeDialog()!.type">
              @switch (confirmationService.activeDialog()!.type) {
                @case ('danger') { warning }
                @case ('warning') { warning }
                @default { info }
              }
            </mat-icon>
            <h3>{{ confirmationService.activeDialog()!.title }}</h3>
          </div>
          
          <div class="dialog-content">
            <p>{{ confirmationService.activeDialog()!.text }}</p>
          </div>
          
          <div class="dialog-actions">
            @if (confirmationService.activeDialog()!.showCancel) {
              <button mat-button (click)="confirmationService.resolve(false)">
                {{ confirmationService.activeDialog()!.cancelText }}
              </button>
            }
            <button 
              mat-raised-button 
              [class]="'btn-' + confirmationService.activeDialog()!.type"
              (click)="confirmationService.resolve(true)">
              {{ confirmationService.activeDialog()!.confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .confirmation-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }

    .confirmation-dialog {
      background: white;
      border-radius: 12px;
      padding: 0;
      min-width: 400px;
      max-width: 500px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: scale(0.9) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem 1.5rem 1rem;
      border-bottom: 1px solid #e5e7eb;

      mat-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
        
        &.icon-danger {
          color: #ef4444;
        }
        
        &.icon-warning {
          color: #f59e0b;
        }
        
        &.icon-info {
          color: #3b82f6;
        }
      }

      h3 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: #1f2937;
      }
    }

    .dialog-content {
      padding: 1rem 1.5rem;

      p {
        margin: 0;
        color: #6b7280;
        line-height: 1.5;
      }
    }

    .dialog-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
      padding: 1rem 1.5rem 1.5rem;

      .btn-danger {
        background-color: #ef4444 !important;
        color: white !important;
        
        &:hover {
          background-color: #dc2626 !important;
        }
      }

      .btn-warning {
        background-color: #f59e0b !important;
        color: white !important;
        
        &:hover {
          background-color: #d97706 !important;
        }
      }

      .btn-info {
        background-color: #3b82f6 !important;
        color: white !important;
        
        &:hover {
          background-color: #2563eb !important;
        }
      }
    }
  `]
})
export class ConfirmationDialogComponent {
  confirmationService = inject(ConfirmationService);
}