import { Injectable, signal } from '@angular/core';

export interface ConfirmationConfig {
  title: string;
  text: string;
  type?: 'warning' | 'danger' | 'info';
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

export interface ConfirmationDialog extends ConfirmationConfig {
  id: string;
  resolve: (result: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  activeDialog = signal<ConfirmationDialog | null>(null);

  confirm(config: ConfirmationConfig): Promise<boolean> {
    return new Promise((resolve) => {
      const dialog: ConfirmationDialog = {
        id: Math.random().toString(36).substr(2, 9),
        title: config.title,
        text: config.text,
        type: config.type || 'warning',
        confirmText: config.confirmText || 'Yes, confirm!',
        cancelText: config.cancelText || 'Cancel',
        showCancel: config.showCancel !== false,
        resolve
      };

      this.activeDialog.set(dialog);
    });
  }

  confirmDelete(itemType: string = 'item'): Promise<boolean> {
    return this.confirm({
      title: 'Are you sure?',
      text: `Do you want to remove this ${itemType}?`,
      type: 'danger',
      confirmText: 'Yes, remove!',
      cancelText: 'Cancel'
    });
  }

  resolve(result: boolean) {
    const dialog = this.activeDialog();
    if (dialog) {
      dialog.resolve(result);
      this.activeDialog.set(null);
    }
  }

  dismiss() {
    this.resolve(false);
  }
}