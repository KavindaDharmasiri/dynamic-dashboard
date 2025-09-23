import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-template-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data?.title || 'Create New Template' }}</h2>
    
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Template Name</mat-label>
        <input matInput [(ngModel)]="name" placeholder="Enter template name" required>
      </mat-form-field>
      
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Description</mat-label>
        <textarea matInput [(ngModel)]="description" placeholder="Enter template description" rows="3"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="create()" [disabled]="!name.trim()">
        Create
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }
    
    mat-dialog-content {
      min-width: 350px;
      padding: 1rem 0;
    }
  `]
})
export class CreateTemplateDialogComponent {
  private dialogRef = inject(MatDialogRef<CreateTemplateDialogComponent>);
  
  name = '';
  description = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.name = data.name || '';
      this.description = data.description || '';
    }
  }

  create() {
    if (this.name.trim()) {
      this.dialogRef.close({
        name: this.name.trim(),
        description: this.description.trim()
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}