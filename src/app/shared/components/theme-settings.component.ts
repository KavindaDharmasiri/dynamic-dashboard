import { Component, inject, signal } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-theme-settings',
  standalone: true,
  imports: [MatButton, MatIcon, FormsModule],
  template: `
    @if (isOpen()) {
      <div class="theme-overlay" (click)="close()">
        <div class="theme-panel" (click)="$event.stopPropagation()">
          <div class="theme-header">
            <h3>Theme Settings</h3>
            <button mat-icon-button class="close-btn" (click)="close()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          
          <div class="theme-content">
            <div class="preset-themes">
              <h4>Preset Themes</h4>
              <div class="preset-grid">
                @for (preset of themeService.getPresetThemes(); track preset.name) {
                  <button class="preset-card" (click)="applyPreset(preset.theme)">
                    <div class="preset-colors">
                      <div class="color-dot" [style.background]="preset.theme.primaryColor"></div>
                      <div class="color-dot" [style.background]="preset.theme.secondaryColor"></div>
                      <div class="color-dot" [style.background]="preset.theme.accentColor"></div>
                    </div>
                    <span>{{ preset.name }}</span>
                  </button>
                }
              </div>
            </div>
            
            <div class="custom-colors">
              <h4>Custom Colors</h4>
              <div class="color-inputs">
                <div class="color-input">
                  <label>Primary Color</label>
                  <input type="color" 
                         [value]="themeService.currentTheme().primaryColor"
                         (input)="updateColor('primaryColor', $event)">
                </div>
                <div class="color-input">
                  <label>Secondary Color</label>
                  <input type="color" 
                         [value]="themeService.currentTheme().secondaryColor"
                         (input)="updateColor('secondaryColor', $event)">
                </div>
                <div class="color-input">
                  <label>Background Color</label>
                  <input type="color" 
                         [value]="themeService.currentTheme().backgroundColor"
                         (input)="updateColor('backgroundColor', $event)">
                </div>
                <div class="color-input">
                  <label>Text Color</label>
                  <input type="color" 
                         [value]="themeService.currentTheme().textColor"
                         (input)="updateColor('textColor', $event)">
                </div>
                <div class="color-input">
                  <label>Accent Color</label>
                  <input type="color" 
                         [value]="themeService.currentTheme().accentColor"
                         (input)="updateColor('accentColor', $event)">
                </div>
              </div>
            </div>
            
            <div class="theme-actions">
              <button mat-stroked-button (click)="themeService.resetToDefault()">
                <mat-icon>refresh</mat-icon>
                Reset to Default
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .theme-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      z-index: 10001;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease;
    }

    .theme-panel {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow: hidden;
      animation: slideUp 0.3s ease;
    }

    .theme-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #e5e7eb;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .theme-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .theme-header .close-btn {
      color: rgba(255, 255, 255, 0.8);
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.2);
      
      &:hover {
        color: white;
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.4);
        transform: scale(1.1) rotate(90deg);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
      
      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    .theme-content {
      padding: 24px;
      overflow-y: auto;
      max-height: calc(80vh - 80px);
    }

    .preset-themes h4,
    .custom-colors h4 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
      color: #374151;
    }

    .preset-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 12px;
      margin-bottom: 32px;
    }

    .preset-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 16px 12px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 12px;
      font-weight: 500;
    }

    .preset-card:hover {
      border-color: #667eea;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    }

    .preset-colors {
      display: flex;
      gap: 4px;
    }

    .color-dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }

    .color-inputs {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 16px;
    }

    .color-input {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .color-input label {
      font-size: 12px;
      font-weight: 500;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .color-input input[type="color"] {
      width: 100%;
      height: 40px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      transition: border-color 0.2s ease;
    }

    .color-input input[type="color"]:hover {
      border-color: #667eea;
    }

    .theme-actions {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: center;
    }

    .theme-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #6b7280;
      border-color: #d1d5db;
    }

    .theme-actions button:hover {
      color: #667eea;
      border-color: #667eea;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `]
})
export class ThemeSettingsComponent {
  themeService = inject(ThemeService);
  isOpen = signal(false);

  open() {
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }

  applyPreset(theme: any) {
    this.themeService.updateTheme(theme);
  }

  updateColor(property: string, event: any) {
    const color = event.target.value;
    const updates = { [property]: color } as Partial<any>;
    this.themeService.updateTheme(updates);
  }
}