export type UserMode = 'home' | 'student' | 'professional';

export interface Connection {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  notes: string;
  status?: string;
  dateAdded: string;
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  status: string;
  dateApplied: string;
  notes: string;
}

export interface GeneratedPost {
  content: string;
  hashtags: string[];
}

// Voice Assistant Types
export interface VoiceParseResult {
  type: 'job' | 'connection' | 'unknown';
  data?: Partial<JobApplication> | Partial<Connection>;
  message?: string;
}