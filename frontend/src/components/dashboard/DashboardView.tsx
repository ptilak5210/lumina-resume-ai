import React from 'react';
import { FileText, Zap, Upload, Plus, Download, Trash2, Clock, Sparkles, ArrowUpRight, X, Edit3 } from 'lucide-react';
import ResumePreview from '../ResumePreview';

import { User, ResumeData } from '../types';

interface DashboardProps {
  navigate: (view: string) => void;
  user: User | null;
  resumes: ResumeData[];
  fileRef: React.RefObject<HTMLInputElement>;
  onDownload: (resume: ResumeData) => void;
  onDelete: (id: string) => void;
  isParsing: boolean;
  onEdit: (resume: ResumeData) => void;
}

export const DashboardView: React.FC<DashboardProps> = ({ navigate, user, resumes, fileRef, onDownload, onDelete, isParsing, onEdit }) => {
  const [previewResume, setPreviewResume] = React.useState<ResumeData | null>(null);

  const avgScore = resumes.length
    ? Math.round(resumes.reduce((acc: number, r: any) => acc + (r.score || 0), 0) / resumes.length)
    : 0;

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="h-full overflow-y-auto custom-scrollbar bg-[#f8f9fc]">
      <div className="max-w-6xl mx-auto px-8 py-8 flex flex-col gap-6 min-h-full">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
            </h1>
            <p className="text-slate-400 mt-0.5 text-sm font-medium">
              You have {resumes.length} active resume{resumes.length !== 1 ? 's' : ''} and 5 new suggestions.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 border border-slate-200 rounded-xl px-4 py-2 bg-white font-semibold shadow-sm">
              {today}
            </span>
            <button
              onClick={() => !isParsing && fileRef.current?.click()}
              disabled={isParsing}
              className={`flex items-center gap-2 text-sm font-bold border border-slate-200 rounded-xl px-4 py-2.5 transition-all text-slate-700 shadow-sm ${isParsing ? 'bg-slate-100 opacity-70 cursor-wait' : 'bg-white hover:bg-slate-50 hover:border-slate-300'}`}
            >
              {isParsing ? <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent flex-shrink-0 animate-spin rounded-full" /> : <Upload className="w-4 h-4" />}
              {isParsing ? 'Parsing AI...' : 'Upload Resume'}
            </button>
            <button
              onClick={() => navigate('resume-editor')}
              className="flex items-center gap-2 text-sm font-bold bg-blue-600 text-white rounded-xl px-5 py-2.5 hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
            >
              <Plus className="w-4 h-4" /> New Resume
            </button>
          </div>
        </div>

        {/* ── Stats + Quick Actions Row ───────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-4">
          {/* Total Resumes */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between col-span-1">
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Total Resumes</p>
              <p className="text-5xl font-black text-slate-900 mt-1 leading-none">{resumes.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
          </div>

          {/* ATS Score */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between col-span-1">
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">ATS Score</p>
              <p className="text-5xl font-black text-slate-900 mt-1 leading-none">{avgScore}%</p>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-amber-500" />
            </div>
          </div>

          {/* AI Suggestions CTA */}
          <div
            onClick={() => navigate('ai-suggestions')}
            className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl p-5 shadow-md shadow-indigo-200 cursor-pointer hover:from-violet-500 hover:to-indigo-500 transition-all group col-span-1 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-6 translate-x-6" />
            <Sparkles className="w-6 h-6 text-white/80 mb-3" />
            <p className="text-white font-black text-sm">AI Suggestions</p>
            <p className="text-indigo-200 text-xs mt-0.5">Optimize your resume</p>
            <ArrowUpRight className="w-4 h-4 text-white/60 absolute bottom-4 right-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>

          {/* Templates CTA */}
          <div
            onClick={() => navigate('templates')}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 shadow-md cursor-pointer hover:from-slate-700 hover:to-slate-800 transition-all group col-span-1 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-6 translate-x-6" />
            <FileText className="w-6 h-6 text-white/60 mb-3" />
            <p className="text-white font-black text-sm">Templates</p>
            <p className="text-slate-400 text-xs mt-0.5">Browse premium designs</p>
            <ArrowUpRight className="w-4 h-4 text-white/40 absolute bottom-4 right-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* ── Recent Projects ─────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-slate-900">Recent Projects</h2>
            {resumes.length > 0 && (
              <button
                onClick={() => navigate('my-resumes')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                View all →
              </button>
            )}
          </div>

          {resumes.length === 0 ? (
            <div
              onClick={() => navigate('resume-editor')}
              className="flex-1 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition-all group min-h-[260px]"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:scale-110 transition-all shadow-sm">
                <Plus className="w-7 h-7 text-blue-500" />
              </div>
              <p className="font-bold text-slate-700 text-base">Create your first resume</p>
              <p className="text-sm text-slate-400 mt-1">Start from scratch or import an existing PDF</p>
              <span className="mt-4 text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full group-hover:bg-blue-100 transition-colors">
                Get started →
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumes.map((r: any) => (
                <div
                  key={r.id}
                  onClick={() => setPreviewResume(r)}
                  className="group bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-blue-200 hover:-translate-y-0.5 transition-all cursor-pointer relative overflow-hidden shadow-sm"
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300">
                      <FileText className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex gap-1 opacity-100 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); if(onDownload) onDownload(r); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Download PDF">
                        <Download className="w-4 h-4" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); onDelete(r.id); }} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-black text-slate-900 truncate">{r.title || r.fullName || 'Untitled'}</h3>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5 capitalize">{r.theme || 'Modern'} Template</p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <Clock className="w-3 h-3" /> {r.createdAt || 'Recently'}
                    </div>
                    {r.score ? (
                      <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                        <Zap className="w-3 h-3 inline mr-0.5" />{r.score}%
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}

              <div
                onClick={() => navigate('resume-editor')}
                className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group min-h-[160px]"
              >
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-2 group-hover:bg-blue-100 transition-all">
                  <Plus className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                </div>
                <p className="text-sm font-bold text-slate-400 group-hover:text-blue-600 transition-colors">New Resume</p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ── Preview Modal ─────────────────────────────────────────────────── */}
      {previewResume && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 md:p-8 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-full max-h-[90vh] flex flex-col overflow-hidden relative">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white z-10 shrink-0">
              <div>
                <h3 className="font-black text-xl text-slate-800">{previewResume.title || previewResume.fullName || 'Resume Preview'}</h3>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-0.5">{previewResume.theme || 'Modern'} Template</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const r = previewResume;
                    setPreviewResume(null);
                    if (onEdit) onEdit(r);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-bold transition-all"
                >
                  <Edit3 className="w-5 h-5" /> Edit Resume
                </button>
                <button
                  onClick={() => { if (onDownload) onDownload(previewResume); }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold transition-all shadow-md shadow-blue-200"
                >
                  <Download className="w-5 h-5" /> Download PDF
                </button>
                <div className="w-px h-8 bg-slate-200 mx-2"></div>
                <button 
                  onClick={() => setPreviewResume(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Scrollable Preview Area */}
            <div className="flex-1 overflow-y-auto bg-slate-100/50 p-4 md:p-8 flex justify-center custom-scrollbar">
              <div className="bg-white shadow-xl max-w-[800px] w-full min-h-[1056px] print:shadow-none print:w-full">
                 <ResumePreview data={previewResume} />
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
