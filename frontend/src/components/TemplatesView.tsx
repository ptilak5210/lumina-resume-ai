
import React from 'react';
import { Zap, TrendingUp, Database, Users, Briefcase, GraduationCap, Utensils, Coins, Camera, Headphones, Gavel, Stethoscope, ChevronRight } from 'lucide-react';
import { ResumeData } from '../types';
import { SAMPLE_RESUMES } from '../constants';

interface Props {
    onSelect: (resume: ResumeData) => void;
}

const TemplatesView: React.FC<Props> = ({ onSelect }) => {

    const getIcon = (id: string) => {
        if (id.includes('tech')) return <Zap className="w-5 h-5 text-amber-500" />;
        if (id.includes('marketing')) return <TrendingUp className="w-5 h-5 text-blue-500" />;
        if (id.includes('data')) return <Database className="w-5 h-5 text-emerald-500" />;
        if (id.includes('hr')) return <Users className="w-5 h-5 text-indigo-500" />;
        if (id.includes('sales')) return <Coins className="w-5 h-5 text-amber-600" />;
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
        <div className="p-8 h-full overflow-y-auto custom-scrollbar animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">
                        Resume Templates
                    </h1>
                    <p className="text-slate-500 max-w-xl leading-relaxed font-medium">
                        Choose a professionally crafted template to start your journey. <br className="hidden md:inline" />
                        Click any design to customize it in the editor.
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
    );
};

export default TemplatesView;
