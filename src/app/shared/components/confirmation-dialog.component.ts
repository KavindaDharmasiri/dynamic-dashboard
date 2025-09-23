import { Component, inject } from '@angular/core';
import { ConfirmationService } from '../services/confirmation.service';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatButton, MatIcon],
  template: `
    @if (confirmationService.activeDialog(); as dialog) {
      <div class="confirmation-overlay" (click)="confirmationService.dismiss()">
        <div class="confirmation-dialog" [class]="'dialog-' + dialog.type" (click)="$event.stopPropagation()">
          <div class="dialog-decoration"></div>
          
          <div class="dialog-header">
            <div class="dialog-icon-container">
              <div class="icon-background" [class]="'bg-' + dialog.type">
                <mat-icon class="dialog-icon">
                  @switch (dialog.type) {
                    @case ('danger') { delete_forever }
                    @case ('warning') { warning_amber }
                    @default { info }
                  }
                </mat-icon>
              </div>
            </div>
            <h3 class="dialog-title">{{ dialog.title }}</h3>
            <p class="dialog-subtitle">This action cannot be undone</p>
          </div>
          
          <div class="dialog-content">
            <div class="dialog-message">
              <p class="dialog-text">{{ dialog.text }}</p>
              <div class="warning-indicator" *ngIf="dialog.type === 'danger'">
                <mat-icon>shield</mat-icon>
                <span>This will permanently remove the item</span>
              </div>
            </div>
          </div>
          
          <div class="dialog-actions">
            @if (dialog.showCancel) {
              <button mat-stroked-button 
                      class="cancel-btn" 
                      (click)="confirmationService.resolve(false)">
                <mat-icon>close</mat-icon>
                {{ dialog.cancelText }}
              </button>
            }
            <button mat-raised-button 
                    class="confirm-btn" 
                    [class]="dialog.type === 'danger' ? 'danger-btn' : 'primary-btn'"
                    (click)="confirmationService.resolve(true)">
              <mat-icon>
                @switch (dialog.type) {
                  @case ('danger') { delete }
                  @default { check }
                }
              </mat-icon>
              {{ dialog.confirmText }}
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
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%);
      backdrop-filter: blur(8px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease-out;
    }

    .confirmation-dialog {
      background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
      border-radius: 24px;
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2);
      max-width: 420px;
      width: 90%;
      overflow: hidden;
      animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
    }

    .dialog-decoration {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    }

    .dialog-header {
      padding: 32px 32px 24px;
      text-align: center;
      position: relative;
    }

    .dialog-icon-container {
      margin-bottom: 20px;
      display: flex;
      justify-content: center;
    }

    .icon-background {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      animation: iconPulse 2s infinite;
    }

    .icon-background.bg-danger {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
      box-shadow: 0 8px 32px rgba(255, 107, 107, 0.3);
    }

    .icon-background.bg-warning {
      background: linear-gradient(135deg, #feca57 0%, #ff9ff3 100%);
      box-shadow: 0 8px 32px rgba(254, 202, 87, 0.3);
    }

    .icon-background.bg-info {
      background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
      box-shadow: 0 8px 32px rgba(116, 185, 255, 0.3);
    }

    .dialog-icon {
      color: white;
      font-size: 36px;
      width: 36px;
      height: 36px;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    }

    .dialog-title {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 700;
      background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .dialog-subtitle {
      margin: 0;
      color: #718096;
      font-size: 14px;
      font-weight: 500;
    }

    .dialog-content {
      padding: 0 32px 24px;
    }

    .dialog-message {
      text-align: center;
    }

    .dialog-text {
      margin: 0 0 16px 0;
      color: #4a5568;
      font-size: 16px;
      line-height: 1.6;
      font-weight: 500;
    }

    .warning-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 16px;
      background: rgba(255, 107, 107, 0.1);
      border: 1px solid rgba(255, 107, 107, 0.2);
      border-radius: 12px;
      color: #e53e3e;
      font-size: 13px;
      font-weight: 600;
    }

    .warning-indicator mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .dialog-actions {
      padding: 0 32px 32px;
      display: flex;
      gap: 16px;
      justify-content: center;
    }

    .cancel-btn {
      background: rgba(113, 128, 150, 0.1);
      color: #4a5568;
      border: 2px solid rgba(113, 128, 150, 0.2);
      border-radius: 12px;
      padding: 12px 24px;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 120px;
      justify-content: center;
    }

    .cancel-btn:hover {
      background: rgba(113, 128, 150, 0.15);
      border-color: rgba(113, 128, 150, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(113, 128, 150, 0.2);
    }

    .confirm-btn {
      border: none;
      border-radius: 12px;
      padding: 12px 24px;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 120px;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    .confirm-btn.primary-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .confirm-btn.primary-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }

    .confirm-btn.danger-btn {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
    }

    .confirm-btn.danger-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
    }

    .confirm-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    @keyframes fadeIn {
      from { 
        opacity: 0;
        backdrop-filter: blur(0px);
      }
      to { 
        opacity: 1;
        backdrop-filter: blur(8px);
      }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes iconPulse {
      0%, 100% { 
        transform: scale(1);
        box-shadow: 0 8px 32px rgba(255, 107, 107, 0.3);
      }
      50% { 
        transform: scale(1.05);
        box-shadow: 0 12px 40px rgba(255, 107, 107, 0.4);
      }
    }
  `]
})
export class ConfirmationDialogComponent {
  confirmationService = inject(ConfirmationService);
}