
export interface Attachment {
  url: string;
  mimeType: string;
  name?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
  attachments?: Attachment[];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  content: string;
  summary: string;
  timestamp: Date;
}

export interface SubjectGrades {
  frequent: (number | null)[];
  midterm: number | null;
  final: number | null;
}

export interface SubjectInfo {
  name: string;
  proficiency: number;
  gaps: string[];
  strengths: string[];
  grades: SubjectGrades;
  isActive: boolean;
}

export interface StudentProfile {
  name: string;
  dob: string;
  grade: string;
  school: string;
  focusSubject: string;
  avatar?: string;
  subjects: SubjectInfo[];
  recentErrors: {
    topic: string;
    reason: string;
    count: number;
  }[];
}

export interface StudyTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed';
  category: 'lesson' | 'practice' | 'review';
}

export enum AppTab {
  CHAT = 'chat',
  DOCUMENTS = 'documents',
  PROFILE = 'profile',
  PLANNER = 'planner',
  SUMMARY = 'summary'
}
