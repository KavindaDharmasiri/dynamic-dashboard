export interface DashboardTemplate {
  id: string;
  name: string;
  description?: string;
  widgets: TemplateWidget[];
  theme?: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
  };
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateWidget {
  id: number;
  label?: string;
  rows: number;
  cols: number;
  x?: number;
  y?: number;
  backgroundColor: string;
  color: string;
  sliceId: number;
  hideTitle?: boolean;
}