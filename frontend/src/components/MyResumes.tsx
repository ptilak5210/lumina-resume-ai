
import React from 'react';
import { Plus, FileText, MoreVertical, Edit2, Download, Trash2, Calendar, Clock } from 'lucide-react';
import { ResumeData } from '../types';

interface MyResumesProps {
    resumes: ResumeData[];
    onCreateNew: () => void;
    onEdit: (resume: ResumeData) => void;
    onDelete: (id: string) => void;
    onDownload: (resume: ResumeData) => void;
}

const MyResumes: React.FC<MyResumesProps> = ({ resumes, onCreateNew, onEdit, onDelete, onDownload }) => {
    return (
        <div className="p-8 h-full overflow-y-auto custom-scrollbar animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">My Resume History</h1>
                        <p className="text-slate-500 font-medium">Manage and optimize your saved career documents.</p>
                    </div>
                    <button
                        onClick={onCreateNew}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-200/50 transition-all active:scale-95"
                    >
                        <Plus className="w-5 h-5" /> CREATE NEW
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {resumes.map((resume) => {
                        const atsScore = resume.score || 0;

                        return (
                            <div key={resume.id} className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all group relative">
                                <div className="absolute top-8 right-8">
                                    <button aria-label="More options" className="text-slate-300 hover:text-slate-600 transition-colors">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                    <FileText className="w-6 h-6" />
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-2 truncate pr-6">{resume.title || resume.fullName || 'Untitled Resume'}</h3>

                                <div className="flex gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-8">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3" />
                                        {resume.createdAt || 'Unknown Date'}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3 h-3" />
                                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>

                                {/* ATS Score Bar */}
                                <div className="bg-slate-50 rounded-2xl p-4 mb-8 border border-slate-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ATS Score</span>
                                        <span className="text-sm font-bold text-blue-600">{atsScore}/100</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className="bg-blue-600 h-full rounded-full"
                                            ref={(el) => { if (el) el.style.width = `${atsScore}%`; }}
                                            role="img"
                                            aria-label={`ATS Score: ${atsScore} out of 100`}
                                        ></div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <button
                                        onClick={() => onEdit(resume)}
                                        className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-200 transition-all"
                                    >
                                        <Edit2 className="w-3 h-3" /> EDIT
                                    </button>
                                    <button
                                        onClick={() => onDownload(resume)}
                                        className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-200 transition-all"
                                    >
                                        <Download className="w-3 h-3" /> PDF
                                    </button>
                                </div>

                                <button
                                    onClick={() => onDelete(resume.id)}
                                    className="w-full text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest hover:text-rose-500 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-3 h-3" /> Remove from history
                                </button>

                            </div>
                        );
                    })}

                    {/* Add New Placeholder when empty */}
                    {resumes.length === 0 && (
                        <div
                            onClick={onCreateNew}
                            className="bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all min-h-[400px]"
                        >
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm text-slate-300 group-hover:text-blue-500">
                                <Plus className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Create New Resume</h3>
                            <p className="text-slate-400 text-sm max-w-[200px]">Start building your professional profile from scratch.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyResumes;
