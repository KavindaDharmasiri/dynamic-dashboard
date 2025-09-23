import { Injectable, signal, effect } from '@angular/core';
import { ThemeConfig } from './theme.service';

export interface DashboardConfig {
  theme: ThemeConfig;
  mode: 'view' | 'edit';
  widgets: any[];
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'dashboardConfig';
  
  private defaultConfig: DashboardConfig = {
    theme: {
      primaryColor: '#6366F1',
      secondaryColor: '#C7D2FE',
      backgroundColor: '#F9FAFB',
      textColor: '#6E7583',
      accentColor: '#CCE5FF'
    },
    mode: 'edit',
    widgets: []
  };

  config = signal<DashboardConfig>(this.loadConfig());

  constructor() {
    // Auto-save when config changes
    effect(() => {
      this.saveConfig(this.config());
    });
  }

  private loadConfig(): DashboardConfig {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          theme: { ...this.defaultConfig.theme, ...parsed.theme },
          mode: parsed.mode || this.defaultConfig.mode,
          widgets: parsed.widgets || this.defaultConfig.widgets
        };
      }
    } catch (error) {
      console.error('Failed to load dashboard config:', error);
    }
    return { ...this.defaultConfig };
  }

  private saveConfig(config: DashboardConfig) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
      console.log('Dashboard config saved:', config);
    } catch (error) {
      console.error('Failed to save dashboard config:', error);
    }
  }

  updateTheme(theme: Partial<ThemeConfig>) {
    this.config.update(current => ({
      ...current,
      theme: { ...current.theme, ...theme }
    }));
  }

  updateMode(mode: 'view' | 'edit') {
    this.config.update(current => ({
      ...current,
      mode
    }));
  }

  updateWidgets(widgets: any[]) {
    this.config.update(current => ({
      ...current,
      widgets: [...widgets]
    }));
  }

  // Migration method to consolidate old storage
  migrateOldStorage() {
    const oldTheme = localStorage.getItem('dashboardTheme');
    const oldMode = localStorage.getItem('dashboardMode');
    const oldWidgets = localStorage.getItem('dashboardWidgets');

    if (oldTheme || oldMode || oldWidgets) {
      const migratedConfig: DashboardConfig = {
        theme: oldTheme ? JSON.parse(oldTheme) : this.defaultConfig.theme,
        mode: (oldMode as 'view' | 'edit') || this.defaultConfig.mode,
        widgets: oldWidgets ? JSON.parse(oldWidgets) : this.defaultConfig.widgets
      };

      this.config.set(migratedConfig);

      // Clean up old storage
      localStorage.removeItem('dashboardTheme');
      localStorage.removeItem('dashboardMode');
      localStorage.removeItem('dashboardWidgets');

      console.log('Migrated old storage to unified config');
    }
  }
}