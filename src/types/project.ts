export type ProjectStatus =
  | 'in-sviluppo'
  | 'completato'
  | 'in-manutenzione'
  | 'archiviato';

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  'in-sviluppo': 'In sviluppo',
  completato: 'Completato',
  'in-manutenzione': 'In manutenzione',
  archiviato: 'Archiviato',
};

export interface StoredImage {
  id: string;
  blob: Blob;
  name: string;
  type: string;
  size: number;
  createdAt: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  status: ProjectStatus;
  technologies: string[];
  coverImageId: string | null;
  galleryImageIds: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  websiteUrl?: string;
  documentationUrl?: string;
  published: boolean;
  order: number;
  createdAt: number;
  updatedAt: number;
}

export type ProjectInput = Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'order'>;
