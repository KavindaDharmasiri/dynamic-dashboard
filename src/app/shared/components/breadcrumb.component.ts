import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

export interface BreadcrumbItem {
  label: string;
  route?: string;
  icon?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <nav class="breadcrumb">
      @for (item of items; track item.label; let isLast = $last) {
        <div class="breadcrumb-item">
          @if (item.route && !isLast) {
            <a [routerLink]="item.route" class="breadcrumb-link">
              @if (item.icon) {
                <mat-icon>{{ item.icon }}</mat-icon>
              }
              {{ item.label }}
            </a>
          } @else {
            <span class="breadcrumb-current">
              @if (item.icon) {
                <mat-icon>{{ item.icon }}</mat-icon>
              }
              {{ item.label }}
            </span>
          }
          @if (!isLast) {
            <mat-icon class="breadcrumb-separator">chevron_right</mat-icon>
          }
        </div>
      }
    </nav>
  `,
  styles: [`
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      margin: 2rem 2rem 1rem 2rem;
    }

    .breadcrumb-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .breadcrumb-link {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: var(--theme-primary, #6366f1);
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s ease;
      
      &:hover {
        color: var(--theme-accent, #4f46e5);
        text-decoration: underline;
      }
      
      mat-icon {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
      }
    }

    .breadcrumb-current {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: var(--theme-text, #333);
      font-weight: 600;
      
      mat-icon {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
      }
    }

    .breadcrumb-separator {
      color: var(--theme-text, #666);
      opacity: 0.5;
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }
  `]
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
}