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

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  description: string;
  requirements: string[];
  benefits: string[];
  salaryRange?: string;
  status: 'active' | 'paused' | 'closed';
  createdDate: Date;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: 'hr' | 'admin';
}