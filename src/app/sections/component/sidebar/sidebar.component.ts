import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatListModule, MatIconModule, MatButtonModule],
  template: `
    <div class="sidebar">
      <div class="sidebar-header">
        <h3>Dashboard</h3>
      </div>
      
      <nav class="sidebar-nav">
        <a mat-list-item routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
          <mat-icon matListItemIcon>dashboard</mat-icon>
          <span matListItemTitle>Dashboard</span>
        </a>
        
        <a mat-list-item routerLink="/templates" routerLinkActive="active">
          <mat-icon matListItemIcon>view_module</mat-icon>
          <span matListItemTitle>Templates</span>
        </a>
      </nav>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      height: 100vh;
      background: var(--theme-background, #ffffff);
      border-right: 1px solid rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
    }

    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      
      h3 {
        margin: 0;
        font-weight: 600;
        color: var(--theme-text, #333);
      }
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
      
      a {
        margin: 0 1rem 0.5rem 1rem;
        border-radius: 8px;
        transition: all 0.2s ease;
        
        &:hover {
          background: rgba(var(--theme-primary-rgb, 99, 102, 241), 0.1);
        }
        
        &.active {
          background: var(--theme-primary, #6366F1);
          color: white;
          
          mat-icon {
            color: white;
          }
        }
      }
    }
  `]
})
export class SidebarComponent {
  private router = inject(Router);
}