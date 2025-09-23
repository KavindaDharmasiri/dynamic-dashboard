import { Injectable, signal, effect, inject } from '@angular/core';
import { StorageService } from './storage.service';

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private storageService = inject(StorageService);
  
  currentTheme = signal<ThemeConfig>(this.storageService.config().theme);

  constructor() {
    // Migrate old storage on first load
    this.storageService.migrateOldStorage();
    
    // Apply theme when it changes
    effect(() => {
      this.applyTheme(this.currentTheme());
    });
    
    // Listen to storage changes
    effect(() => {
      this.currentTheme.set(this.storageService.config().theme);
    });
  }



  private applyTheme(theme: ThemeConfig) {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.primaryColor);
    root.style.setProperty('--theme-secondary', theme.secondaryColor);
    root.style.setProperty('--theme-background', theme.backgroundColor);
    root.style.setProperty('--theme-text', theme.textColor);
    root.style.setProperty('--theme-accent', theme.accentColor);
    
    // Convert hex to RGB for rgba usage
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };
    
    const primaryRgb = hexToRgb(theme.primaryColor);
    const secondaryRgb = hexToRgb(theme.secondaryColor);
    const backgroundRgb = hexToRgb(theme.backgroundColor);
    const textRgb = hexToRgb(theme.textColor);
    const accentRgb = hexToRgb(theme.accentColor);
    
    if (primaryRgb) root.style.setProperty('--theme-primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
    if (secondaryRgb) root.style.setProperty('--theme-secondary-rgb', `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`);
    if (backgroundRgb) root.style.setProperty('--theme-background-rgb', `${backgroundRgb.r}, ${backgroundRgb.g}, ${backgroundRgb.b}`);
    if (textRgb) root.style.setProperty('--theme-text-rgb', `${textRgb.r}, ${textRgb.g}, ${textRgb.b}`);
    if (accentRgb) root.style.setProperty('--theme-accent-rgb', `${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}`);
  }

  updateTheme(updates: Partial<ThemeConfig>) {
    const newTheme = { ...this.currentTheme(), ...updates };
    this.currentTheme.set(newTheme);
    this.storageService.updateTheme(newTheme);
  }

  resetToDefault() {
    const defaultTheme = {
      primaryColor: '#6366F1',
      secondaryColor: '#C7D2FE',
      backgroundColor: '#F9FAFB',
      textColor: '#6E7583',
      accentColor: '#CCE5FF'
    };
    this.currentTheme.set(defaultTheme);
    this.storageService.updateTheme(defaultTheme);
  }

  getPresetThemes(): { name: string; theme: ThemeConfig }[] {
    return [
      {
        name: 'Default',
        theme: {
          primaryColor: '#6366F1',
          secondaryColor: '#C7D2FE',
          backgroundColor: '#F9FAFB',
          textColor: '#6E7583',
          accentColor: '#CCE5FF'
        }
      },
      {
        name: 'Ocean Blue',
        theme: {
          primaryColor: '#0ea5e9',
          secondaryColor: '#0284c7',
          backgroundColor: '#f0f9ff',
          textColor: '#0c4a6e',
          accentColor: '#38bdf8'
        }
      },
      {
        name: 'Forest Green',
        theme: {
          primaryColor: '#059669',
          secondaryColor: '#047857',
          backgroundColor: '#f0fdf4',
          textColor: '#064e3b',
          accentColor: '#34d399'
        }
      },
      {
        name: 'Sunset Orange',
        theme: {
          primaryColor: '#ea580c',
          secondaryColor: '#dc2626',
          backgroundColor: '#fff7ed',
          textColor: '#9a3412',
          accentColor: '#fb923c'
        }
      },
      {
        name: 'Royal Purple',
        theme: {
          primaryColor: '#7c3aed',
          secondaryColor: '#6d28d9',
          backgroundColor: '#faf5ff',
          textColor: '#581c87',
          accentColor: '#a78bfa'
        }
      }
    ];
  }
}