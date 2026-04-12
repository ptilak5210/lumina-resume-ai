import api from './api';
import { supabase } from './supabase';
import { ResumeData } from '../types';
import type { ATSResult } from '../types';

/** Get current Supabase access token */
async function getToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

export const resumeService = {
  /** Upload PDF → backend parses using pdfminer.six → returns structured data */
  async parsePDF(file: File): Promise<ResumeData> {
    const token = await getToken();
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<{ data: ResumeData }>('/resumes/parse', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });
    return res.data.data;
  },

  /** Run ATS analysis via backend (uses gemini-2.5-flash — no quota issues) */
  async analyzeATS(resume: ResumeData): Promise<ATSResult> {
    const res = await api.post<ATSResult>('/resumes/analyze-ats', resume);
    return res.data;
  },

  /** Get all resumes for the logged-in user */
  async getAll(): Promise<ResumeData[]> {
    const res = await api.get<ResumeData[]>('/resumes/');
    return res.data;
  },

  /** Save a new resume to the DB */
  async create(resume: ResumeData): Promise<ResumeData> {
    const res = await api.post<ResumeData>('/resumes/', resume);
    return res.data;
  },

  /** Update an existing resume */
  async update(id: string, resume: ResumeData): Promise<ResumeData> {
    const res = await api.put<ResumeData>(`/resumes/${id}`, resume);
    return res.data;
  },

  /** Delete a resume */
  async delete(id: string): Promise<void> {
    await api.delete(`/resumes/${id}`);
  },
};

