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

// Added TeamMember interface required by TeamModal
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
}

// Voice Assistant Types
export interface VoiceParseResult {
  type: 'job' | 'connection' | 'unknown';
  data?: Partial<JobApplication> | Partial<Connection>;
  message?: string;
}