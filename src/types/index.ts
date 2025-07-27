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
  documents?: {
    resume?: {
      name: string;
      url: string;
      uploadedAt: Date;
    };
    coverLetter?: {
      name: string;
      url: string;
      uploadedAt: Date;
    };
    portfolio?: {
      name: string;
      url: string;
      uploadedAt: Date;
    };
  };
  status: 'pending' | 'reviewed' | 'interviewed' | 'hired' | 'rejected';
  appliedDate: Date;
  notes?: string;
  interviewDate?: Date;
  salary?: string;
  applicantId?: string;
  coverLetter?: string;
  statusHistory?: {
    status: Application['status'];
    changedAt: Date;
    changedBy: string;
    notes?: string;
  }[];
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
  applicationCount?: number;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: 'hr' | 'admin' | 'applicant';
  firstName?: string;
  lastName?: string;
  phone?: string;
  profilePicture?: string;
  createdAt?: Date;
}