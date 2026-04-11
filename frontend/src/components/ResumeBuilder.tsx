
import React, { useState } from 'react';
import {
    ChevronRight, ChevronLeft, Save, Download, Sparkles, Plus, Trash2,
    User, Briefcase, GraduationCap, Code, FolderOpen, Maximize2, Award
} from 'lucide-react';
import { ResumeData, Experience, Education, Project, Certification } from '../types';
import ResumePreview from './ResumePreview';
import { generateSummary } from '../services/geminiService';
import { SectionLabel, InputGroup } from './ui/UIElements';

interface ResumeBuilderProps {
    data: ResumeData;
    setData: (data: ResumeData) => void;
    onSave: () => void;
    onDownloadJson: () => void;
    isGeneratingSummary?: boolean;
    onGenerateSummary?: () => void;
}


const CustomSelect = ({ options, value, onChange, placeholder }: any) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="relative w-1/2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-semibold shadow-sm flex justify-between items-center text-left"
            >
                <span className={value ? "text-slate-900" : "text-slate-300"}>
                    {value || placeholder}
                </span>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto custom-scrollbar">
                        {options.map((opt: string) => (
                            <button
                                key={opt}
                                onClick={() => {
                                    onChange(opt);
                                    setIsOpen(false);
                                }}
                                className="w-full text-left px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors first:rounded-t-xl last:rounded-b-xl"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const DateSelector = ({ label, value, onChange, enablePresent = false, presentLabel = "I currently work here", presentValue = "Present" }: any) => {
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());

    const isPresent = value === presentValue;

    let selectedMonth = '';
    let selectedYear = '';

    if (!isPresent && value) {
        if (value.includes(' ')) {
            const parts = value.split(' ');
            selectedMonth = parts[0];
            selectedYear = parts[1];
        } else if (value.includes('-')) {
            const date = new Date(value + '-01');
            if (!isNaN(date.getTime())) {
                selectedMonth = months[date.getMonth()];
                selectedYear = date.getFullYear().toString();
            }
        }
    }

    const handleMonthChange = (m: string) => {
        const y = selectedYear || currentYear.toString();
        onChange(`${m} ${y}`);
    };

    const handleYearChange = (y: string) => {
        const m = selectedMonth || months[0];
        onChange(`${m} ${y}`);
    };

    return (
        <div className="space-y-1.5 w-full">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
            <div className="flex gap-2">
                {!isPresent && (
                    <>
                        <CustomSelect
                            options={months}
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            placeholder="Month"
                        />
                        <CustomSelect
                            options={years}
                            value={selectedYear}
                            onChange={handleYearChange}
                            placeholder="Year"
                        />
                    </>
                )}
                {isPresent && (
                    <div className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-500 flex items-center justify-center select-none">
                        {presentValue === 'Present' ? 'Currently working here' : presentValue}
                    </div>
                )}
            </div>
            {enablePresent && (
                <div className="flex items-center gap-2 mt-2 ml-1">
                    <input
                        type="checkbox"
                        id={`present-${label}-${Math.random()}`}
                        checked={isPresent}
                        onChange={(e) => onChange(e.target.checked ? presentValue : '')}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor={`present-${label}`} className="text-xs font-medium text-slate-500 cursor-pointer select-none" onClick={() => onChange(!isPresent ? presentValue : '')}>
                        {presentLabel}
                    </label>
                </div>
            )}
        </div>
    );
};


const ResumeBuilder: React.FC<ResumeBuilderProps> = ({
    data, setData, onSave, onDownloadJson, isGeneratingSummary, onGenerateSummary
}) => {
    const [activeStep, setActiveStep] = useState(1);
    const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);

    const steps = [
        { id: 1, label: 'Personal', icon: User },
        { id: 2, label: 'Experience', icon: Briefcase },
        { id: 3, label: 'Education', icon: GraduationCap },
        { id: 4, label: 'Skills', icon: Code },
        { id: 5, label: 'Projects', icon: FolderOpen },
        { id: 6, label: 'Certifications', icon: Award },
    ];

    const handleNext = () => {
        if (activeStep < steps.length) setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        if (activeStep > 1) setActiveStep(activeStep - 1);
    };

    const addItem = (section: 'experience' | 'education' | 'projects' | 'certifications') => {
        const newId = Date.now().toString();
        if (section === 'experience') {
            const newItem: Experience = {
                id: newId, company: '', position: '', startDate: '', endDate: '', description: ''
            };
            setData({ ...data, experience: [...data.experience, newItem] });
        } else if (section === 'education') {
            const newItem: Education = {
                id: newId, institution: '', degree: '', field: '', graduationDate: ''
            };
            setData({ ...data, education: [...data.education, newItem] });
        } else if (section === 'projects') {
            const newItem: Project = {
                id: newId, title: '', description: '', link: ''
            };
            setData({ ...data, projects: [...data.projects, newItem] });
        } else if (section === 'certifications') {
            const newItem: Certification = {
                id: newId, name: '', issuer: '', date: ''
            };
            setData({ ...data, certifications: [...data.certifications, newItem] });
        }
    };

    const updateItem = (section: 'experience' | 'education' | 'projects' | 'certifications', id: string, field: string, value: string) => {
        if (section === 'experience') {
            setData({
                ...data,
                experience: data.experience.map(item => item.id === id ? { ...item, [field]: value } : item)
            });
        } else if (section === 'education') {
            setData({
                ...data,
                education: data.education.map(item => item.id === id ? { ...item, [field]: value } : item)
            });
        } else if (section === 'projects') {
            setData({
                ...data,
                projects: data.projects.map(item => item.id === id ? { ...item, [field]: value } : item)
            });
        } else if (section === 'certifications') {
            setData({
                ...data,
                certifications: data.certifications.map(item => item.id === id ? { ...item, [field]: value } : item)
            });
        }
    };

    const removeItem = (section: 'experience' | 'education' | 'projects' | 'certifications', id: string) => {
        if (section === 'experience') {
            setData({ ...data, experience: data.experience.filter(item => item.id !== id) });
        } else if (section === 'education') {
            setData({ ...data, education: data.education.filter(item => item.id !== id) });
        } else if (section === 'projects') {
            setData({ ...data, projects: data.projects.filter(item => item.id !== id) });
        } else if (section === 'certifications') {
            setData({ ...data, certifications: data.certifications.filter(item => item.id !== id) });
        }
    };

    const renderFormContent = () => {
        switch (activeStep) {
            case 1: // Personal
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div>
                            <SectionLabel>Personal Information</SectionLabel>
                            <p className="text-slate-400 text-sm mb-6">Basic info & summary</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <InputGroup label="Full Name" value={data.fullName} onChange={(v: string) => setData({ ...data, fullName: v })} placeholder="e.g. Alex Thompson" />
                                <InputGroup label="Email Address" value={data.email} onChange={(v: string) => setData({ ...data, email: v })} placeholder="alex@example.com" />
                                <InputGroup label="Phone Number" value={data.phone} onChange={(v: string) => setData({ ...data, phone: v.replace(/\D/g, '') })} placeholder="1234567890" type="tel" />
                                <InputGroup label="Location" value={data.location} onChange={(v: string) => setData({ ...data, location: v })} placeholder="San Francisco, CA" />
                                <InputGroup label="LinkedIn" value={data.linkedin} onChange={(v: string) => setData({ ...data, linkedin: v })} placeholder="linkedin.com/in/..." />
                                <InputGroup label="GitHub Profile" value={data.website} onChange={(v: string) => setData({ ...data, website: v })} placeholder="github.com/username" />
                            </div>

                            <div className="relative">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Professional Summary</label>
                                    <button
                                        onClick={onGenerateSummary}
                                        disabled={isGeneratingSummary}
                                        className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-blue-100 transition-all disabled:opacity-50"
                                    >
                                        <Sparkles className={`w-3 h-3 ${isGeneratingSummary ? 'animate-spin' : ''}`} />
                                        AI Refine
                                    </button>
                                </div>
                                <textarea
                                    className="w-full p-4 bg-white border border-slate-100 rounded-2xl text-sm leading-relaxed focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all min-h-[150px] shadow-sm placeholder:text-slate-300 resize-none"
                                    value={data.summary}
                                    onChange={e => setData({ ...data, summary: e.target.value })}
                                    placeholder="Detail your career goals and top skills..."
                                />
                            </div>
                        </div>
                    </div>
                );

            case 2: // Experience
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex justify-between items-end">
                            <div>
                                <SectionLabel>Work Experience</SectionLabel>
                                <p className="text-slate-400 text-sm">Add your relevant work history</p>
                            </div>
                            <button
                                onClick={() => addItem('experience')}
                                className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
                            >
                                <Plus className="w-4 h-4" /> Add Position
                            </button>
                        </div>

                        <div className="space-y-6">
                            {data.experience.length === 0 && (
                                <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
                                    <p className="text-slate-400 text-sm">No experience added yet.</p>
                                </div>
                            )}
                            {data.experience.map((exp, index) => (
                                <div key={exp.id} className="p-6 bg-white border border-slate-100 rounded-2xl relative group hover:border-blue-100 transition-all shadow-sm">
                                    <div className="absolute top-4 right-4">
                                        <button
                                            onClick={() => removeItem('experience', exp.id)}
                                            aria-label="Remove experience entry"
                                            className="text-slate-300 hover:text-rose-500 transition-colors p-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 bg-slate-50 inline-block px-3 py-1 rounded-lg mb-6">Position #{index + 1}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <InputGroup label="Company" value={exp.company} onChange={(v: string) => updateItem('experience', exp.id, 'company', v)} placeholder="Company Name" />
                                        <InputGroup label="Job Title" value={exp.position} onChange={(v: string) => updateItem('experience', exp.id, 'position', v)} placeholder="Product Designer" />
                                        <DateSelector label="Start Date" value={exp.startDate} onChange={(v: string) => updateItem('experience', exp.id, 'startDate', v)} />
                                        <DateSelector label="End Date" value={exp.endDate} onChange={(v: string) => updateItem('experience', exp.id, 'endDate', v)} enablePresent={true} />
                                    </div>
                                    <div className="mt-4">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Description</label>
                                        <textarea
                                            className="w-full p-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all min-h-[100px] resize-none"
                                            value={exp.description}
                                            onChange={e => updateItem('experience', exp.id, 'description', e.target.value)}
                                            placeholder="Describe your responsibilities and achievements..."
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 3: // Education
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex justify-between items-end">
                            <div>
                                <SectionLabel>Education</SectionLabel>
                                <p className="text-slate-400 text-sm">Degrees and certifications</p>
                            </div>
                            <button
                                onClick={() => addItem('education')}
                                className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
                            >
                                <Plus className="w-4 h-4" /> Add Education
                            </button>
                        </div>

                        <div className="space-y-6">
                            {data.education.length === 0 && (
                                <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
                                    <p className="text-slate-400 text-sm">No education added yet.</p>
                                </div>
                            )}
                            {data.education.map((edu, index) => (
                                <div key={edu.id} className="p-6 bg-white border border-slate-100 rounded-2xl relative group hover:border-blue-100 transition-all shadow-sm">
                                    <div className="absolute top-4 right-4">
                                        <button
                                            onClick={() => removeItem('education', edu.id)}
                                            aria-label="Remove education entry"
                                            className="text-slate-300 hover:text-rose-500 transition-colors p-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 mb-4">
                                        <InputGroup label="Institution" value={edu.institution} onChange={(v: string) => updateItem('education', edu.id, 'institution', v)} placeholder="University Name" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputGroup label="Degree" value={edu.degree} onChange={(v: string) => updateItem('education', edu.id, 'degree', v)} placeholder="B.S. Computer Science" />
                                            <DateSelector
                                                label="Graduation Date"
                                                value={edu.graduationDate}
                                                onChange={(v: string) => updateItem('education', edu.id, 'graduationDate', v)}
                                                enablePresent={true}
                                                presentLabel="I am currently pursuing this"
                                                presentValue="Pursuing"
                                            />
                                        </div>
                                        <InputGroup label="Field of Study" value={edu.field} onChange={(v: string) => updateItem('education', edu.id, 'field', v)} placeholder="Engineering" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 4: // Skills
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div>
                            <SectionLabel>Skills</SectionLabel>
                            <p className="text-slate-400 text-sm mb-6">Technologies, languages, and soft skills</p>

                            <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Skills List (Comma Separated)</label>
                                <textarea
                                    className="w-full p-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all min-h-[150px] resize-none leading-loose"
                                    value={data.skills.join(', ')}
                                    onChange={e => setData({ ...data, skills: e.target.value.split(',').map(s => s.trim()) })}
                                    placeholder="React, TypeScript, Node.js, Project Management, Communication..."
                                />
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {data.skills.filter(s => s).map((skill, idx) => (
                                        <span key={idx} className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 5: // Projects
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex justify-between items-end">
                            <div>
                                <SectionLabel>Projects</SectionLabel>
                                <p className="text-slate-400 text-sm">Showcase your portfolio work</p>
                            </div>
                            <button
                                onClick={() => addItem('projects')}
                                className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
                            >
                                <Plus className="w-4 h-4" /> Add Project
                            </button>
                        </div>

                        <div className="space-y-6">
                            {data.projects.length === 0 && (
                                <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
                                    <p className="text-slate-400 text-sm">No projects added yet.</p>
                                </div>
                            )}
                            {data.projects.map((proj, index) => (
                                <div key={proj.id} className="p-6 bg-white border border-slate-100 rounded-2xl relative group hover:border-blue-100 transition-all shadow-sm">
                                    <div className="absolute top-4 right-4">
                                        <button
                                            onClick={() => removeItem('projects', proj.id)}
                                            aria-label="Remove project entry"
                                            className="text-slate-300 hover:text-rose-500 transition-colors p-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 mb-4">
                                        <InputGroup label="Project Name" value={proj.title} onChange={(v: string) => updateItem('projects', proj.id, 'title', v)} placeholder="e.g. E-commerce App" />
                                        <InputGroup label="Project Link (Optional)" value={proj.link} onChange={(v: string) => updateItem('projects', proj.id, 'link', v)} placeholder="github.com/..." />
                                    </div>
                                    <div className="mt-4">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Description</label>
                                        <textarea
                                            className="w-full p-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all min-h-[100px] resize-none"
                                            value={proj.description}
                                            onChange={e => updateItem('projects', proj.id, 'description', e.target.value)}
                                            placeholder="Describe what you built and the technologies used..."
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 6: // Certifications
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex justify-between items-end">
                            <div>
                                <SectionLabel>Certifications</SectionLabel>
                                <p className="text-slate-400 text-sm">Add licenses and certifications</p>
                            </div>
                            <button
                                onClick={() => addItem('certifications')}
                                className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
                            >
                                <Plus className="w-4 h-4" /> Add Certification
                            </button>
                        </div>

                        <div className="space-y-6">
                            {data.certifications.length === 0 && (
                                <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
                                    <p className="text-slate-400 text-sm">No certifications added yet.</p>
                                </div>
                            )}
                            {data.certifications.map((cert, index) => (
                                <div key={cert.id} className="p-6 bg-white border border-slate-100 rounded-2xl relative group hover:border-blue-100 transition-all shadow-sm">
                                    <div className="absolute top-4 right-4">
                                        <button
                                            onClick={() => removeItem('certifications', cert.id)}
                                            aria-label="Remove certification entry"
                                            className="text-slate-300 hover:text-rose-500 transition-colors p-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <InputGroup label="Certification Name" value={cert.name} onChange={(v: string) => updateItem('certifications', cert.id, 'name', v)} placeholder="e.g. AWS Certified Solutions Architect" />
                                        <InputGroup label="Issuer" value={cert.issuer} onChange={(v: string) => updateItem('certifications', cert.id, 'issuer', v)} placeholder="Amazon Web Services" />
                                        <DateSelector label="Date" value={cert.date} onChange={(v: string) => updateItem('certifications', cert.id, 'date', v)} />
                                        <InputGroup label="Credential Link (Optional)" value={cert.link} onChange={(v: string) => updateItem('certifications', cert.id, 'link', v)} placeholder="credential.net/..." />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            default:
                return <div>Select a step</div>;
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-full overflow-hidden bg-white">
            {/* Left Panel - Form */}
            <div className={`flex-1 flex flex-col h-full border-r border-slate-100 transition-all duration-300 ${isPreviewExpanded ? 'lg:w-0 lg:opacity-0 lg:overflow-hidden' : 'lg:w-[60%]'}`}>

                {/* Stepper Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar mask-gradient">
                        {steps.map((step, idx) => {
                            const Icon = step.icon;
                            const isActive = activeStep === step.id;
                            const isCompleted = activeStep > step.id;

                            return (
                                <div key={step.id} className="flex items-center">
                                    <button
                                        onClick={() => setActiveStep(step.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${isActive
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                            : isCompleted
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'text-slate-400 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isActive ? 'bg-white/20' : isCompleted ? 'bg-blue-100' : 'bg-slate-100'}`}>
                                            {isCompleted ? <span className="text-[10px]">✓</span> : <span className="text-[10px]">{step.id}</span>}
                                        </div>
                                        {step.label}
                                    </button>
                                    {idx < steps.length - 1 && (
                                        <div className={`w-6 h-0.5 mx-1 ${isCompleted ? 'bg-blue-100' : 'bg-slate-100'}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Scrollable Form Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12">
                    <div className="max-w-3xl mx-auto">
                        {renderFormContent()}
                    </div>
                </div>

                {/* Form Footer Actions */}
                <div className="p-6 border-t border-slate-100 bg-white flex justify-between items-center">
                    <button
                        onClick={onSave}
                        className="flex items-center gap-2 text-slate-500 font-bold text-xs hover:text-slate-900 px-4 py-2"
                    >
                        <Save className="w-4 h-4" /> Save Draft
                    </button>

                    <div className="flex gap-3">
                        {activeStep > 1 && (
                            <button
                                onClick={handleBack}
                                className="px-6 py-3 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all"
                            >
                                Back
                            </button>
                        )}
                        <button
                            onClick={activeStep === steps.length ? onSave : handleNext}
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 shadow-xl shadow-blue-200/50 flex items-center gap-2 transition-all active:scale-95"
                        >
                            {activeStep === steps.length ? 'Finish & Download' : 'Next Step'}
                            {activeStep < steps.length && <ChevronRight className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Panel - Preview */}
            <div className={`bg-slate-100 flex flex-col transition-all duration-300 ${isPreviewExpanded ? 'lg:w-full' : 'hidden lg:flex lg:w-[45%]'}`}>

                {/* Preview Toolbar */}
                <div className="p-4 flex justify-between items-center bg-white/50 backdrop-blur border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Real-time Preview
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={() => setIsPreviewExpanded(!isPreviewExpanded)} aria-label={isPreviewExpanded ? 'Collapse preview' : 'Expand preview'} className="p-2 text-slate-400 hover:text-slate-900 bg-white rounded-lg shadow-sm border border-slate-100">
                            <Maximize2 className="w-4 h-4" />
                        </button>
                        <button onClick={onDownloadJson} aria-label="Download resume" className="p-2 text-slate-400 hover:text-slate-900 bg-white rounded-lg shadow-sm border border-slate-100">
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Preview Canvas */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 flex justify-center items-start">
                    <div className={`transform transition-all origin-top ${isPreviewExpanded ? 'scale-100' : 'scale-[0.65]'} w-full max-w-[850px]`}>
                        <ResumePreview data={data} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;
