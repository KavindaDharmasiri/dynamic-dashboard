import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFabButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { TemplateService } from '../service/template.service';
import { DashboardService } from '../service/dashboard.service';
import { CreateTemplateDialogComponent } from './create-template-dialog.component';
import { ToastService } from '../../shared/services/toast.service';
import { ToastComponent } from '../../shared/components/toast.component';
import { ConfirmationService } from '../../shared/services/confirmation.service';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog.component';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/components/breadcrumb.component';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatFabButton, MatIconModule, MatCardModule, MatDialogModule, MatMenuModule, ToastComponent, ConfirmationDialogComponent, BreadcrumbComponent],
  providers: [DashboardService],
  template: `
    <app-breadcrumb [items]="breadcrumbItems"></app-breadcrumb>
    <div class="templates-container">
      <div class="templates-header">
        <h2>Dashboard Templates</h2>
        @if (templateService.getTemplates()().length > 5) {
          <button mat-fab color="primary" (click)="createNewTemplate()" class="floating-add-btn">
            <mat-icon>add</mat-icon>
          </button>
        }
      </div>

      <div class="templates-layout">
        @if (templateService.getTemplates()().length <= 4) {
          <div class="overview-sidebar">
            <img src="assets/img/dashboard/template.svg" alt="Templates Overview" class="overview-image">
            <div class="overview-content">
              <h3>Dashboard Templates</h3>
              <p>Create and manage reusable dashboard layouts</p>
              <button mat-raised-button color="primary" (click)="createNewTemplate()">
                <mat-icon>add</mat-icon>
                Create Template
              </button>
            </div>
          </div>
        }

        <div class="templates-grid">
        @for (template of templateService.getTemplates()(); track template.id) {
          <mat-card class="template-card" [class.published]="template.isPublished">
            <mat-card-header>
              <mat-card-title>{{ template.name }}</mat-card-title>
              <mat-card-subtitle>{{ template.description }}</mat-card-subtitle>
              <div class="card-actions">
                <button mat-icon-button [matMenuTriggerFor]="menu">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  <button mat-menu-item (click)="editTemplate(template.id)">
                    <mat-icon>edit</mat-icon>
                    <span>Edit</span>
                  </button>
                  <button mat-menu-item (click)="publishTemplate(template.id)" [disabled]="template.isPublished">
                    <mat-icon>publish</mat-icon>
                    <span>Publish</span>
                  </button>
                  <button mat-menu-item (click)="deleteTemplate(template.id)" [disabled]="template.isPublished">
                    <mat-icon>delete</mat-icon>
                    <span>Delete</span>
                  </button>
                </mat-menu>
              </div>
            </mat-card-header>

            <mat-card-content>
              <div class="card-center">
                <img src="assets/img/dashboard/template.png" alt="Template" class="card-image">
              </div>
              <div class="template-info">
                <span class="widget-count">{{ template.widgets.length }} widgets</span>
                @if (template.isPublished) {
                  <span class="published-badge">Published</span>
                } @else {
                  <span class="draft-badge">Draft</span>
                }
              </div>
              <div class="template-dates">
                <small>Created: {{ template.createdAt | date:'short' }}</small>
                <small>Updated: {{ template.updatedAt | date:'short' }}</small>
              </div>
            </mat-card-content>
          </mat-card>
        } @empty {
          <div class="empty-state">
            <mat-icon>view_module</mat-icon>
            <h3>No templates yet</h3>
            <p>Create your first dashboard template</p>
            <button mat-raised-button color="primary" (click)="createNewTemplate()">
              <mat-icon>add</mat-icon>
              Create Template
            </button>
          </div>
        }
        </div>
      </div>

      <app-toast></app-toast>
      <app-confirmation-dialog></app-confirmation-dialog>
    </div>
  `,
  styles: [`
    .templates-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .templates-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      position: relative;

      h2 {
        margin: 0;
        font-weight: 600;
        color: var(--theme-text, #333);
      }
    }

    .floating-add-btn {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 1000;
    }

    .overview-image {
      width: 120px;
      height: 120px;
      object-fit: contain;
      margin-bottom: 1rem;
    }

    .overview-content {
      h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--theme-text, #333);
      }

      p {
        margin: 0 0 1.5rem 0;
        color: var(--theme-text, #666);
        font-size: 0.9rem;
      }
    }

    .templates-layout {
      display: flex;
      gap: 2rem;
    }

    .overview-sidebar {
      width: 300px;
      padding: 2rem;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .templates-grid {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      padding: 1.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      background: #ffffff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .template-card {
      transition: all 0.2s ease;
      position: relative;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      &.published {
        border: 2px solid var(--theme-primary, #6366F1);
      }
    }

    .card-actions {
      margin-left: auto;
    }

    .card-center {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1rem 0;
    }

    .card-image {
      width: 80px;
      height: 80px;
      object-fit: contain;
      opacity: 0.7;
    }

    .template-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .widget-count {
      font-weight: 500;
      color: var(--theme-text, #666);
    }

    .published-badge {
      background: var(--theme-primary, #6366F1);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .draft-badge {
      background: #6b7280;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .template-dates {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      small {
        color: var(--theme-text, #999);
      }
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 3rem;
      color: var(--theme-text, #666);

      mat-icon {
        font-size: 4rem;
        width: 4rem;
        height: 4rem;
        margin-bottom: 1rem;
        opacity: 0.5;
      }

      h3 {
        margin: 0 0 0.5rem 0;
        font-weight: 600;
      }

      p {
        margin: 0 0 1.5rem 0;
        opacity: 0.8;
      }
    }
  `]
})
export class TemplatesComponent {
  templateService = inject(TemplateService);
  private dashboardService = inject(DashboardService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private confirmationService = inject(ConfirmationService);

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Dashboard', route: '/', icon: 'home' },
    { label: 'Templates', icon: 'view_module' }
  ];

  createNewTemplate() {
    const dialogRef = this.dialog.open(CreateTemplateDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Create empty template first
        const newTemplate = this.templateService.createTemplate(result.name, result.description, []);
        // Navigate to edit the new template
        this.router.navigate(['/templates/edit', newTemplate.id]);
      }
    });
  }

  editTemplate(id: string) {
    this.router.navigate(['/templates/edit', id]);
  }

  createTemplate() {
    const dialogRef = this.dialog.open(CreateTemplateDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const currentWidgets = this.dashboardService.addedWidgets().map(w => ({
          id: w.id,
          rows: w.rows,
          cols: w.cols,
          backgroundColor: w.backgroundColor,
          color: w.color,
          sliceId: w.sliceId,
          hideTitle: w.hideTitle || false
        }));

        this.templateService.createTemplate(result.name, result.description, currentWidgets);
      }
    });
  }

  publishTemplate(id: string) {
    const result = this.templateService.publishTemplate(id);

    if (result.success) {
      this.toastService.success(`Template '${result.templateName}' published successfully!`);
      // Load the published template into dashboard
      const template = this.templateService.getTemplates()().find(t => t.id === id);
      if (template) {
        this.loadTemplateIntoDashboard(template.widgets);
      }
    } else {
      this.toastService.error(result.message);
    }
  }

  saveCurrentAsTemplate(id: string) {
    const currentWidgets = this.dashboardService.addedWidgets().map(w => ({
      id: w.id,
      label: w.label || '',
      rows: w.rows,
      cols: w.cols,
      x: w.x || 0,
      y: w.y || 0,
      backgroundColor: w.backgroundColor,
      color: w.color,
      sliceId: w.sliceId,
      hideTitle: w.hideTitle || false
    }));

    this.templateService.updateTemplate(id, { widgets: currentWidgets });
  }

  async deleteTemplate(id: string) {
    const template = this.templateService.getTemplates()().find(t => t.id === id);
    if (template) {
      const confirmed = await this.confirmationService.confirm({
        title: 'Delete Template',
        text: `Are you sure you want to delete "${template.name}"? This action cannot be undone.`,
        type: 'danger',
        confirmText: 'Yes, delete it!',
        cancelText: 'Cancel'
      });

      if (confirmed) {
        this.templateService.deleteTemplate(id);
        this.toastService.success(`Template '${template.name}' deleted successfully!`);
      }
    }
  }

  private loadTemplateIntoDashboard(widgets: any[]) {
    // Clear current dashboard
    this.dashboardService.addedWidgets.set([]);

    // Load template widgets with their complete configurations
    const availableWidgets = this.dashboardService.widgets();
    const templateWidgets = widgets
      .map(tw => {
        const baseWidget = availableWidgets.find(w => w.id === tw.id);
        if (!baseWidget) return null;

        return {
          ...baseWidget,
          label: tw.label || baseWidget.label,
          rows: tw.rows,
          cols: tw.cols,
          x: tw.x || 0,
          y: tw.y || 0,
          backgroundColor: tw.backgroundColor,
          color: tw.color,
          hideTitle: tw.hideTitle || false
        };
      })
      .filter(w => w !== null);

    this.dashboardService.addedWidgets.set(templateWidgets);
  }
}
