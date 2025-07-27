export interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  education: string;
  skills?: string[];
  resumeUrl?: string;
  coverLetterUrl?: string;
  status: 'pending' | 'reviewed' | 'interviewed' | 'hired' | 'rejected';
  appliedDate: Date;
  notes?: string;
  interviewDate?: Date;
  salary?: string;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: 'hr' | 'admin';
}