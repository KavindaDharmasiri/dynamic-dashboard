import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(message: string, type: Toast['type'] = 'info', duration = 3000) {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, message, type, duration };
    
    this.toasts.update(toasts => [...toasts, toast]);
    
    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
    
    return id;
  }

  success(message: string, duration?: number) {
    return this.show(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    return this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number) {
    return this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number) {
    return this.show(message, 'info', duration);
  }

  remove(id: string) {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  clear() {
    this.toasts.set([]);
  }
}