import { Injectable, signal, effect } from '@angular/core';

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
  private defaultTheme: ThemeConfig = {
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    accentColor: '#f093fb'
  };

  currentTheme = signal<ThemeConfig>(this.loadTheme());

  constructor() {
    // Apply theme when it changes
    effect(() => {
      this.applyTheme(this.currentTheme());
      this.saveTheme(this.currentTheme());
    });
  }

  private loadTheme(): ThemeConfig {
    const saved = localStorage.getItem('dashboardTheme');
    if (saved) {
      try {
        const parsedTheme = JSON.parse(saved);
        // Only use saved values if they exist, otherwise use defaults
        return {
          primaryColor: parsedTheme.primaryColor || this.defaultTheme.primaryColor,
          secondaryColor: parsedTheme.secondaryColor || this.defaultTheme.secondaryColor,
          backgroundColor: parsedTheme.backgroundColor || this.defaultTheme.backgroundColor,
          textColor: parsedTheme.textColor || this.defaultTheme.textColor,
          accentColor: parsedTheme.accentColor || this.defaultTheme.accentColor
        };
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    }
    return this.defaultTheme;
  }

  private saveTheme(theme: ThemeConfig) {
    try {
      localStorage.setItem('dashboardTheme', JSON.stringify(theme));
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  }

  private applyTheme(theme: ThemeConfig) {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.primaryColor);
    root.style.setProperty('--theme-secondary', theme.secondaryColor);
    root.style.setProperty('--theme-background', theme.backgroundColor);
    root.style.setProperty('--theme-text', theme.textColor);
    root.style.setProperty('--theme-accent', theme.accentColor);
  }

  updateTheme(updates: Partial<ThemeConfig>) {
    this.currentTheme.update(current => ({ ...current, ...updates }));
  }

  resetToDefault() {
    this.currentTheme.set({ ...this.defaultTheme });
  }

  getPresetThemes(): { name: string; theme: ThemeConfig }[] {
    return [
      {
        name: 'Default',
        theme: this.defaultTheme
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