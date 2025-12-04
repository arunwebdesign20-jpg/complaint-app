export enum Branch {
  ME = 'Mechanical Engineering',
  CE = 'Civil Engineering',
  CSE = 'Computer Science Engineering',
  IOT = 'Internet of Things Engineering',
  ECE = 'Electronics and Communication Engineering',
  AIDS = 'Artificial Intelligence and Data Science Engineering',
  AIML = 'Artificial Intelligence and Machine Learning Engineering',
}

export interface Complaint {
  id: string;
  studentName: string;
  branch: Branch;
  semester: number;
  description: string;
  photoDataUrl?: string; // Base64 string for the image
  status: 'pending' | 'solved';
  timestamp: number;
  aiAnalysis?: string; // Optional field for AI summary
}

export interface Teacher {
  name: string;
  email: string;
  password: string; // In a real app, this would be hashed
}

export type ViewState = 'START' | 'STUDENT' | 'TEACHER';
