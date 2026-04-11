
import React from 'react';
import { X, Zap, TrendingUp, Database, Users, Briefcase, GraduationCap, Utensils, Coins, Camera, Headphones, Gavel, Stethoscope, ChevronRight } from 'lucide-react';
import { ResumeData } from '../types';
import { SAMPLE_RESUMES } from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (resume: ResumeData) => void;
}

const SamplesModal: React.FC<Props> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  const getIcon = (id: string) => {
    if (id.includes('tech')) return <Zap className="w-5 h-5 text-amber-500" />;
    if (id.includes('marketing')) return <TrendingUp className="w-5 h-5 text-blue-500" />;
    if (id.includes('data')) return <Database className="w-5 h-5 text-emerald-500" />;
    if (id.includes('hr')) return <Users className="w-5 h-5 text-indigo-500" />;
    if (id.includes('sales')) return <Coins className="w-5 h-5 text-amber-600" />; // Changed to coins for sales/finance look
    if (id.includes('finance')) return <Coins className="w-5 h-5 text-amber-600" />;
    if (id.includes('edu')) return <GraduationCap className="w-5 h-5 text-slate-500" />;
    if (id.includes('hospitality')) return <Utensils className="w-5 h-5 text-orange-500" />;
    if (id.includes('creative')) return <Camera className="w-5 h-5 text-purple-500" />;
    if (id.includes('legal')) return <Gavel className="w-5 h-5 text-slate-700" />;
    if (id.includes('healthcare')) return <Stethoscope className="w-5 h-5 text-rose-500" />;
    return <Briefcase className="w-5 h-5 text-slate-500" />;
  };

  const getBadge = (id: string) => {
    if (id.includes('tech')) return 'TECHNICAL';
    if (id.includes('marketing')) return 'GROWTH';
    if (id.includes('data')) return 'ANALYTICS';
    if (id.includes('finance')) return 'FINANCE';
    if (id.includes('creative')) return 'CREATIVE';
    if (id.includes('legal')) return 'LEGAL';
    if (id.includes('healthcare')) return 'MEDICAL';
    if (id.includes('sales')) return 'SALES';
    if (id.includes('edu')) return 'EDUCATION';
    return 'PROFESSIONAL';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-6xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col">
        {/* Top Gradient Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-10 overflow-y-auto custom-scrollbar">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">
              Explore Masterpieces
            </h2>
            <p className="text-slate-500 max-w-xl leading-relaxed text-sm">
              Discover how industry leaders structure their professional narratives. <br className="hidden md:inline" />
              Click any sample to load it into the editor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
            {SAMPLE_RESUMES.map((resume) => (
              <div
                key={resume.id}
                onClick={() => onSelect(resume)}
                className="group bg-white border border-slate-100 rounded-[1.5rem] p-8 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                {/* Header: Icon + Badge */}
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    {getIcon(resume.id)}
                  </div>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1 group-hover:text-slate-400 transition-colors">
                    {getBadge(resume.id)}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-slate-900 mb-1">{resume.fullName}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                  {resume.title}
                </p>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                  {resume.summary}
                </p>

                {/* Hover Action */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-slate-900 text-white p-2 rounded-full shadow-lg">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SamplesModal;
