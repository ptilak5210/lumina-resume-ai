
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export type AppView =
  | 'home'
  | 'dashboard'
  | 'resume-editor'
  | 'my-resumes'
  | 'ai-suggestions'
  | 'templates'
  | 'analytics'
  | 'settings'
  | 'forgot-password'
  | 'reset-password';

export type ResumeTheme = 'minimalist' | 'classic' | 'modern' | 'bold' | 'executive';

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  link?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface ResumeData {
  id: string;
  title?: string;
  theme?: ResumeTheme;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  score?: number;
  createdAt?: string;
}

export interface AnalysisResult {
  score: number;
  suggestions: string[];
  keywordsMatch: string[];
  missingKeywords: string[];
  chartData?: {
    technical: number;
    soft: number;
    readability: number;
  };
}

export interface ATSSuggestion {
  title: string;
  detail: string;
  impact: 'high' | 'medium' | 'low';
  section: string;
}

export interface ATSResult {
  overallScore: number;
  sectionScores: {
    summary: number;
    experience: number;
    skills: number;
    education: number;
    completeness: number;
  };
  missingKeywords: string[];
  presentKeywords: string[];
  suggestions: ATSSuggestion[];
  strengths: string[];
}
