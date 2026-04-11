
import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowUpRight, Zap, TrendingUp, BarChart3, RotateCw, Loader2 } from 'lucide-react';
import { ResumeData } from '../types';
import { getQuantificationSuggestions, analyzeResumeStrength, generateAuditReport } from '../services/geminiService';
import { generateAuditPDF } from '../utils/pdfGenerator';

interface AiSuggestionsProps {
    resume?: ResumeData;
    onUpdate?: (data: ResumeData) => void;
}

const AiSuggestions: React.FC<AiSuggestionsProps> = ({ resume, onUpdate }) => {
    const [quantifySuggestion, setQuantifySuggestion] = useState<string>("");
    const [keywordMissing, setKeywordMissing] = useState<string[]>([]);
    const [score, setScore] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [auditLoading, setAuditLoading] = useState(false);
    const [appliedQuantify, setAppliedQuantify] = useState(false);
    const [appliedKeywords, setAppliedKeywords] = useState(false);

    useEffect(() => {
        if (resume) {
            loadInsights();
        }
    }, [resume]);

    const loadInsights = async () => {
        if (!resume) return;
        setLoading(true);
        try {
            // Paralellize fetch
            const [analysis, quantify] = await Promise.all([
                analyzeResumeStrength(resume),
                getQuantificationSuggestions(resume.experience)
            ]);

            setScore(analysis.score);
            setKeywordMissing(analysis.missingKeywords);

            if (quantify && quantify.length > 0) {
                setQuantifySuggestion(quantify[0]);
            } else {
                setQuantifySuggestion("Your experience section looks well quantified! Great job.");
            }

        } catch (error) {
            console.error("Failed to load insights", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApplyQuantify = () => {
        if (!resume || !onUpdate || !quantifySuggestion) return;

        // Naive implementation: Append to the first experience entry
        // Ideally, we would ask AI which entry this belongs to, or let user select.
        // For now, we assume it improves the most recent role.
        if (resume.experience && resume.experience.length > 0) {
            const newExperience = [...resume.experience];
            newExperience[0] = {
                ...newExperience[0],
                description: newExperience[0].description + "\n\n• " + quantifySuggestion
            };

            onUpdate({ ...resume, experience: newExperience });
            setAppliedQuantify(true);
            setTimeout(() => setAppliedQuantify(false), 3000);
        }
    };

    const handleApplyKeywords = () => {
        if (!resume || !onUpdate || keywordMissing.length === 0) return;

        const currentSkills = new Set(resume.skills || []);
        let addedCount = 0;
        keywordMissing.forEach(k => {
            if (!currentSkills.has(k)) {
                currentSkills.add(k);
                addedCount++;
            }
        });

        if (addedCount > 0) {
            onUpdate({ ...resume, skills: Array.from(currentSkills) });
            setAppliedKeywords(true);
            setTimeout(() => setAppliedKeywords(false), 3000);
        }
    };

    const handleAuditReport = async () => {
        if (!resume) return;
        setAuditLoading(true);
        try {
            const report = await generateAuditReport(resume);
            generateAuditPDF(report, score, resume.fullName);
        } catch (error) {
            console.error("Audit report failed", error);
            alert("Failed to generate audit report.");
        } finally {
            setAuditLoading(false);
        }
    };

    if (!resume) {
        return (
            <div className="p-12 text-center">
                <h2 className="text-xl font-bold text-slate-700">No Resume Selected</h2>
                <p className="text-slate-500">Please create or select a resume to view insights.</p>
            </div>
        );
    }

    return (
        <div className="p-8 h-full overflow-y-auto custom-scrollbar animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">AI Insights & suggestions</h1>
                    </div>
                    <p className="text-slate-500 font-medium ml-11">We've analyzed your resume against current market trends and recruiter behavior.</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <span className="ml-3 text-slate-500 font-medium">Analyzing your profile...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        {/* Left Column - Insights */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Insight Card 1 */}
                            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <span className="bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">High Impact</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Quantify Your Achievements</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-lg">
                                    {quantifySuggestion || "Analyze logic checking..."}
                                </p>
                                <button
                                    onClick={handleApplyQuantify}
                                    disabled={appliedQuantify}
                                    className={`text-indigo-600 font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all uppercase tracking-wider ${appliedQuantify ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {appliedQuantify ? "Applied!" : "Apply Suggestion"} <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Insight Card 2 */}
                            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Critical</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Keyword Optimization</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-lg">
                                    {keywordMissing.length > 0 ? (
                                        <>We found missing keywords relevant to your profile: <span className="font-bold text-slate-700">{keywordMissing.slice(0, 3).join(", ")}</span>.</>
                                    ) : (
                                        "Your keyword optimization looks strong! We didn't find major missing keywords."
                                    )}
                                </p>
                                <button
                                    onClick={handleApplyKeywords}
                                    disabled={appliedKeywords}
                                    className={`text-blue-600 font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all uppercase tracking-wider ${appliedKeywords ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {appliedKeywords ? "Applied!" : "Apply Suggestion"} <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Right Column - ATS Score */}
                        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-[2rem] p-8 text-white flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                            <div>
                                <div className="flex justify-between items-start mb-8">
                                    <span className="text-[10px] font-black opacity-60 uppercase tracking-widest">ATS Optimizer Score</span>
                                    <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
                                        <BarChart3 className="w-5 h-5 text-white" />
                                    </div>
                                </div>

                                <div className="flex items-baseline gap-2 mb-6">
                                    <span className="text-7xl font-black tracking-tighter">{score}</span>
                                    <span className="text-xl font-medium opacity-60">/ 100</span>
                                </div>

                                <div className="w-full bg-white/10 rounded-full h-1.5 mb-6 overflow-hidden">
                                    <div className="bg-white h-full rounded-full transition-all duration-1000" ref={(el) => { if (el) el.style.width = `${score}%`; }} />
                                </div>

                                <p className="text-sm font-medium leading-relaxed opacity-80 mb-8">
                                    Your profile is outperforming <span className="text-white font-bold">{score}%</span> of applicants.
                                </p>
                            </div>

                            <button
                                onClick={handleAuditReport}
                                disabled={auditLoading}
                                className="w-full bg-white text-blue-900 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-lg shadow-black/20 flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {auditLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate Full Audit Report"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Visual Recommendations */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <RotateCw className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-slate-900">Visual Recommendations</h2>
                        </div>
                        <p className="text-slate-500 text-sm mb-6">Templates that best showcase your unique professional story.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-slate-900">Modern Executive</h3>
                                    <span className="text-emerald-500 text-xs font-black bg-emerald-50 px-2 py-1 rounded">98% MATCH</span>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed mb-6 flex-1">
                                    Based on your extensive management experience, this layout emphasizes your leadership hierarchy.
                                </p>
                                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-blue-700 transition-all">
                                    Selected Design
                                </button>
                            </div>

                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col opacity-60 hover:opacity-100 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-slate-900">Software Engineer</h3>
                                    <span className="text-emerald-500 text-xs font-black bg-emerald-50 px-2 py-1 rounded">94% MATCH</span>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed mb-6 flex-1">
                                    Detected high-density technical skills. This template optimizes for ATS keyword scanning.
                                </p>
                                <button className="w-full bg-slate-50 text-slate-600 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition-all">
                                    Switch to This
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Industry Trends */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-slate-900">Industry Trends</h2>
                        </div>
                        <p className="text-slate-500 text-sm mb-6">Real-time skills demand analysis.</p>

                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-slate-900 text-sm">Generative AI</span>
                                    <span className="text-blue-600 text-xs font-bold">+42%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5">
                                    <div className="bg-blue-600 h-full rounded-full w-[80%]" />
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">Highly requested in Tech Roles</p>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-slate-900 text-sm">Cloud Architecture</span>
                                    <span className="text-emerald-500 text-xs font-bold">+28%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5">
                                    <div className="bg-emerald-500 h-full rounded-full w-[65%]" />
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">Growing demand in Enterprise</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visual Recs & Trends left as static mock for now as per instructions to focus on top 3 features */}

            </div>
        </div>
    );
};

export default AiSuggestions;
