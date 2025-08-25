export interface SCORMPackage {
  id: string;
  title: string;
  description?: string;
  filename: string;
  filepath: string;
  thumbnail?: string;
  size: number;
  uploadedAt: Date;
  updatedAt: Date;
  userId?: string;
  duration?: number;
  completionStatus?: 'not_started' | 'in_progress' | 'completed';
  lastAccessed?: Date;
}

export interface SCORMEvent {
  type: 'start' | 'complete' | 'progress' | 'exit';
  packageId: string;
  timestamp: Date;
  data?: any;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}