import React, { useState } from 'react';
import { X, FileText, Plus, ArrowRight } from 'lucide-react';
import { ResumeData, ResumeTheme } from '../types';
import { SAMPLE_RESUMES } from '../constants';
import ResumePreview from './ResumePreview';

interface Props {
  resumes: ResumeData[];
  onApplyTemplate: (theme: ResumeTheme, resumeId?: string) => void;
}

const THEMES: { id: ResumeTheme; name: string; description: string }[] = [
  { id: 'minimalist', name: 'Minimalist', description: 'Clean, elegant, and highly readable layout.' },
  { id: 'modern', name: 'Modern', description: 'Bold dark header and distinct sections for maximum impact.' },
  { id: 'classic', name: 'Classic', description: 'Traditional academic or formal serif-based layout.' },
  { id: 'bold', name: 'Bold', description: 'Stand out with creative structural accents and colors.' },
  { id: 'executive', name: 'Executive', description: 'Premium, authoritative, and professional spacing.' },
];

const TemplatesView: React.FC<Props> = ({ resumes, onApplyTemplate }) => {
  const [selectedTheme, setSelectedTheme] = useState<ResumeTheme | null>(null);

  // Use a beautifully structured sample for previews
  const previewData = { ...SAMPLE_RESUMES[0], title: 'Senior Software Engineer' };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 custom-scrollbar relative">
      <div className="max-w-7xl mx-auto px-8 py-10 pb-20">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-3">
            Premium Templates
          </h1>
          <p className="text-slate-500 max-w-xl text-lg leading-relaxed">
            Choose a professionally crafted design. Visuals adapt automatically to your ATS-friendly content.
          </p>
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {THEMES.map((theme) => (
            <div
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className="group flex flex-col bg-slate-100 rounded-[2rem] p-6 cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300"
            >
              {/* Miniature Preview Container */}
              {/* We calculate scale based on a container of ~25%. 
                  A4 width approx 816px. 0.35 scale = 285px.
                  Let's use a standard wrapper approach. */}
              <div className="w-full aspect-[1/1.2] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative flex items-start flex-shrink-0 group-hover:border-indigo-300 group-hover:shadow-indigo-100 transition-colors">
                
                {/* Scale wrapper */}
                <div 
                  className="origin-top-left absolute left-0 top-0 pointer-events-none"
                  style={{ transform: 'scale(0.35)', width: '816px', height: '1056px' }}
                >
                  <ResumePreview data={{ ...previewData, theme: theme.id }} />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/5 transition-colors duration-300 flex items-center justify-center">
                   <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-indigo-600 font-bold px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
                     Select Template <ArrowRight className="w-4 h-4" />
                   </div>
                </div>
              </div>

              {/* Theme Info */}
              <div className="mt-6 px-2">
                <h3 className="text-xl font-black text-slate-900 mb-1 capitalize">{theme.name}</h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">{theme.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Selection Modal ──────────────────────────────────────────────── */}
      {selectedTheme && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in slide-in-from-bottom-4 duration-300">
            
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-black text-xl text-slate-900">Apply Template</h3>
                <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider mt-0.5">{selectedTheme}</p>
              </div>
              <button 
                onClick={() => setSelectedTheme(null)}
                className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-slate-600 font-medium text-sm mb-4">Choose where to apply this design:</p>
              
              <div className="space-y-3 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                
                {/* Option: New Resume */}
                <button
                  onClick={() => onApplyTemplate(selectedTheme, undefined)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Plus className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Start from Scratch</h4>
                    <p className="text-xs text-slate-500 font-medium">Create a new empty resume</p>
                  </div>
                </button>

                {/* Options: Existing Resumes */}
                {resumes.map(r => (
                  <button
                    key={r.id}
                    onClick={() => onApplyTemplate(selectedTheme, r.id)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md hover:shadow-blue-100 transition-all text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-slate-900 truncate">{r.title || r.fullName || 'Untitled'}</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider truncate mt-0.5">Current Theme: {r.theme || 'Unknown'}</p>
                    </div>
                  </button>
                ))}

              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesView;
