import { Component, Input, input, signal } from '@angular/core';
import { Widget } from '../../model/dashboard';
import { NgComponentOutlet, NgIf } from '@angular/common';
import { WidgetOptionsComponent } from './widget-options/widget-options.component';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { CdkDrag, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { ChartSettingsComponent } from '../settings/chart-settings/chart-settings.component';

@Component({
  selector: 'app-widget',
  imports: [
    NgComponentOutlet,
    WidgetOptionsComponent,
    MatIcon,
    MatIconButton,
    CdkDrag,
    CdkDragPlaceholder,
    NgIf,
    ChartSettingsComponent
  ],
  templateUrl: './widget.component.html',
  standalone: true,
  styleUrl: './widget.component.css',
  host: {
    '[style.grid-area]':
      '"span " + (data().rows || 1) + " / span " + (data().cols || 1)'
  }
})
export class WidgetComponent {
  data = input.required<Widget>();

  showOptions = signal(false);
  @Input() mode!: 'view' | 'edit';
}
