
import React, { useState, useRef, useEffect } from 'react';
import {
  Plus, Upload, FileText, Trash2, Download, Wand2, Layout, ChevronRight, X, History,
  Sparkles, LogOut, Settings, BarChart3, Briefcase, ChevronDown, Edit3, Palette,
  Target, PieChart, Bell, CheckCircle2, Globe, ArrowRight, Github, Twitter, Linkedin,
  FileJson, MoreHorizontal, Copy
} from 'lucide-react';
import { ResumeData, AnalysisResult, User, AppView, ResumeTheme } from './types';
import { INITIAL_RESUME_DATA, SAMPLE_RESUMES } from './constants';
import ResumePreview from './components/ResumePreview';
import StrengthMeter from './components/StrengthMeter';
import Auth from './components/Auth';
import SamplesModal from './components/SamplesModal';
import SaveModal from './components/SaveModal';
import Sidebar from './components/Sidebar';
import StatsCard from './components/StatsCard';
import ResumeBuilder from './components/ResumeBuilder';
import MyResumes from './components/MyResumes';
import AiSuggestions from './components/AiSuggestions';
import TemplatesView from './components/TemplatesView';
import SettingsView from './components/SettingsView';
import { Users, MousePointerClick, Zap } from 'lucide-react';
import { analyzeResumeStrength, generateSummary } from './services/geminiService';
import { resumeService } from './services/resumeService';
import { authService } from './services/authService';
import { LandingPage } from './components/landing/LandingPage';
import { SectionLabel, InputGroup, AiFeatureCard } from './components/ui/UIElements';
import { DashboardView } from './components/dashboard/DashboardView';

// --- Helpers ---







// --- Main Component ---

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<AppView>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSamplesModalOpen, setIsSamplesModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [savedResumes, setSavedResumes] = useState<ResumeData[]>([]);

  const [isParsing, setIsParsing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Supabase onAuthStateChange handles initial session + OAuth redirects
    const { data: { subscription } } = authService.onAuthStateChange(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const resumes = await resumeService.getAll();
          setSavedResumes(resumes);
        } catch (e) {
          console.error('Failed to load resumes', e);
        }
      } else {
        setSavedResumes([]);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user && activeTab === 'home') navigate('dashboard');
  }, [user]);

  const navigate = (view: AppView) => {
    setActiveTab(view);
    window.scrollTo(0, 0);
    window.history.pushState({}, '', '/');
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    navigate('home');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isAllowed = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.docx');
    if (!isAllowed) {
      alert('Please upload a PDF or Modern Word Document (.docx) only.');
      return;
    }

    setIsParsing(true);
    try {
      // Backend parses the PDF using pdfminer.six
      const parsedData = await resumeService.parsePDF(file);

      const newResume: ResumeData = {
        ...parsedData,
        theme: 'minimalist',
        id: Date.now().toString(), // temp ID until saved
        createdAt: new Date().toLocaleDateString(),
        title: parsedData.fullName || file.name.replace(/\.pdf$/i, '')
      };

      // Save to backend DB and get proper ID
      const saved = await resumeService.create(newResume);

      setSavedResumes(prev => [saved, ...prev]);
      setResumeData(saved);
      navigate('ai-suggestions');  // Take user straight to ATS analysis

    } catch (err: any) {
      console.error('PDF parse/save error:', err);
      alert('Failed to parse PDF: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };


  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeResumeStrength(resumeData);
      setAnalysis(result);
      setResumeData(prev => ({ ...prev, score: result.score }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const summary = await generateSummary(resumeData);
      if (!summary) throw new Error("Failed to generate summary");
      setResumeData({ ...resumeData, summary });
    } catch (error) {
      console.error(error);
      alert("Failed to generate summary. Please check your API key in .env.local");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const downloadJson = (data: ResumeData) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.fullName.replace(/\s+/g, '_')}_Resume.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = (data: ResumeData) => {
    import('./utils/pdfGenerator').then(module => {
      module.generateResumePDF(data);
    });
  };

  const handleDeleteResume = async (id: string) => {
    try {
      await resumeService.delete(id);
      setSavedResumes(savedResumes.filter(r => r.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      // Still remove from UI even if backend fails
      setSavedResumes(savedResumes.filter(r => r.id !== id));
    }
  };

  const renderView = () => {
    switch (activeTab) {
      case 'home': return <LandingPage onLoginClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }} />;
      case 'dashboard': return <DashboardView navigate={navigate} user={user!} resumes={savedResumes} fileRef={fileInputRef} onDownload={handleDownloadPdf} onEdit={(resume) => { setResumeData(resume); navigate('resume-editor'); }} onDelete={handleDeleteResume} isParsing={isParsing} />;
      case 'resume-editor': return <ResumeBuilder data={resumeData} setData={setResumeData} onSave={() => setIsSaveModalOpen(true)} onDownloadJson={() => downloadJson(resumeData)} isGeneratingSummary={isGeneratingSummary} onGenerateSummary={handleGenerateSummary} />;
      case 'settings': return <SettingsView user={user!} onUpdateUser={setUser} />;
      case 'my-resumes': return (
        <MyResumes
          resumes={savedResumes}
          onCreateNew={() => navigate('resume-editor')}
          onEdit={(resume) => { setResumeData(resume); navigate('resume-editor'); }}
          onDelete={handleDeleteResume}
          onDownload={handleDownloadPdf}
        />
      );
      case 'ai-suggestions': {
        const resumeForAnalysis = (resumeData?.fullName || resumeData?.summary)
          ? resumeData
          : savedResumes[0] ?? resumeData;
        return (
          <AiSuggestions
            resume={resumeForAnalysis}
            allResumes={savedResumes}
            onSelectResume={(selected) => setResumeData(selected)}
            onUpdate={(updated) => {
              setResumeData(updated);
              setSavedResumes(prev => prev.map(r => r.id === updated.id ? updated : r));
            }}
          />
        );
      }
      case 'templates': return (
        <TemplatesView 
          resumes={savedResumes}
          onApplyTemplate={(theme, resumeId) => {
            if (resumeId) {
              const existing = savedResumes.find(r => r.id === resumeId);
              if (existing) {
                setResumeData({ ...existing, theme });
              }
            } else {
              setResumeData({
                id: crypto.randomUUID(),
                title: 'New Resume',
                fullName: '',
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                website: '',
                summary: '',
                experience: [],
                education: [],
                skills: [],
                projects: [],
                certifications: [],
                theme: theme,
                createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              });
            }
            navigate('resume-editor');
          }}
        />
      );
      default: return <LandingPage onLoginClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }} />;
    }
  };

  // Landing / Auth Layout
  if (!user || activeTab === 'home') {
    return (
      <>
        <LandingPage onLoginClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }} />
        <Auth isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLogin={setUser} initialView={authMode} />
        <SamplesModal isOpen={isSamplesModalOpen} onClose={() => setIsSamplesModalOpen(false)} onSelect={(s) => { setResumeData(s); navigate('resume-editor'); }} />
      </>
    );
  }

  // Dashboard / App Layout
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar user={user} activeTab={activeTab} onNavigate={navigate} onLogout={handleLogout} />
      <main className="flex-1 ml-64 h-screen overflow-hidden bg-slate-50">
        {renderView()}
      </main>

      <Auth isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLogin={setUser} initialView={authMode} />
      <SamplesModal isOpen={isSamplesModalOpen} onClose={() => setIsSamplesModalOpen(false)} onSelect={(s) => { setResumeData(s); navigate('resume-editor'); }} />
      <SaveModal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} onSave={(t) => { setSavedResumes([...savedResumes, { ...resumeData, title: t }]); setIsSaveModalOpen(false); }} />
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="application/pdf,.docx" title="Upload Resume" placeholder="Upload Resume" />
    </div>
  );
};

export default App;
