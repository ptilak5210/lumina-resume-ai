
import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Zap, TrendingUp, CheckCircle2, AlertTriangle,
  RefreshCw, Plus, ChevronRight, Star, Target, BarChart3,
  Loader2, ArrowUpRight, Shield, BookOpen, Briefcase, Award
} from 'lucide-react';
import { ResumeData, ATSResult, ATSSuggestion } from '../types';
import { performATSAnalysis } from '../services/geminiService';
import ResumePreview from './ResumePreview';

interface AiSuggestionsProps {
  resume?: ResumeData;
  onUpdate?: (data: ResumeData) => void;
}

// Circular score ring component
const ScoreRing: React.FC<{ score: number; size?: number }> = ({ score, size = 160 }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const step = score / 60;
      const interval = setInterval(() => {
        current = Math.min(current + step, score);
        setAnimatedScore(Math.round(current));
        if (current >= score) clearInterval(interval);
      }, 16);
      return () => clearInterval(interval);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={12} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={12}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.05s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black text-slate-900">{animatedScore}</span>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">/ 100</span>
      </div>
    </div>
  );
};

// Section score bar
const SectionBar: React.FC<{ label: string; score: number; icon: React.ReactNode; delay?: number }> = ({ label, score, icon, delay = 0 }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 400 + delay);
    return () => clearTimeout(t);
  }, [score, delay]);

  const color = score >= 75 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-400' : 'bg-red-400';
  const textColor = score >= 75 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-red-500';

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 w-4 h-4">{icon}</span>
          <span className="text-sm font-semibold text-slate-700">{label}</span>
        </div>
        <span className={`text-sm font-black ${textColor}`}>{score}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

// Impact badge
const ImpactBadge: React.FC<{ impact: 'high' | 'medium' | 'low' }> = ({ impact }) => {
  const styles = {
    high: 'bg-red-50 text-red-600 border-red-100',
    medium: 'bg-amber-50 text-amber-600 border-amber-100',
    low: 'bg-blue-50 text-blue-600 border-blue-100',
  };
  const labels = { high: '🔥 High Impact', medium: '⚡ Medium', low: '💡 Low' };
  return (
    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-wider ${styles[impact]}`}>
      {labels[impact]}
    </span>
  );
};

const AiSuggestions: React.FC<AiSuggestionsProps> = ({ resume, onUpdate }) => {
  const [atsResult, setAtsResult] = useState<ATSResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [addedKeywords, setAddedKeywords] = useState<Set<string>>(new Set());
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<number>>(new Set());
  const hasResume = !!(resume?.fullName || resume?.summary || (resume?.experience?.length && resume.experience.length > 0));

  useEffect(() => {
    // Run analysis whenever a resume with real content is present
    if (hasResume) runAnalysis();
  }, [resume?.id, resume?.fullName]);

  const runAnalysis = async () => {
    if (!resume || !hasResume) return;
    setLoading(true);
    setAtsResult(null);
    setAddedKeywords(new Set());
    setAppliedSuggestions(new Set());
    try {
      const result = await performATSAnalysis(resume);
      setAtsResult(result);
    } catch (err) {
      console.error('ATS analysis failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddKeyword = (keyword: string) => {
    if (!resume || !onUpdate || addedKeywords.has(keyword)) return;
    const updated = { ...resume, skills: [...(resume.skills || []), keyword] };
    onUpdate(updated);
    setAddedKeywords(prev => new Set([...prev, keyword]));
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (score >= 65) return { label: 'Good', color: 'text-amber-600', bg: 'bg-amber-50' };
    if (score >= 45) return { label: 'Needs Work', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { label: 'Critical', color: 'text-red-600', bg: 'bg-red-50' };
  };

  if (!resume || !hasResume) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">No Resume Found</h2>
          <p className="text-slate-500 mb-4">Please upload a resume or create one to run ATS analysis.</p>
          <p className="text-xs text-slate-400">Go to Dashboard → Upload Resume</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden bg-slate-50">
      {/* ── Left Panel ── */}
      <div className="flex-1 overflow-y-auto p-8" style={{ scrollbarWidth: 'thin' }}>
        <div className="max-w-2xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-violet-600" />
                </div>
                <h1 className="text-2xl font-black text-slate-900">ATS Analysis</h1>
              </div>
              <p className="text-slate-500 text-sm ml-11">AI-powered resume intelligence for <span className="font-semibold text-slate-700">{resume.fullName || 'your resume'}</span></p>
            </div>
            <button
              onClick={runAnalysis}
              disabled={loading}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-md shadow-violet-200"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Re-analyze
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 flex flex-col items-center justify-center gap-4 shadow-sm">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-violet-100 border-t-violet-600 animate-spin" />
                <Sparkles className="w-6 h-6 text-violet-600 absolute inset-0 m-auto" />
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-800">Analyzing your resume...</p>
                <p className="text-sm text-slate-500 mt-1">Checking ATS compatibility, keywords & more</p>
              </div>
            </div>
          )}

          {atsResult && !loading && (
            <>
              {/* Score Card */}
              <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                <div className="flex items-center gap-8">
                  <ScoreRing score={atsResult.overallScore} />
                  <div className="flex-1">
                    {(() => {
                      const { label, color, bg } = getScoreLabel(atsResult.overallScore);
                      return (
                        <>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3 ${bg} ${color}`}>
                            {label}
                          </span>
                          <h2 className="text-xl font-black text-slate-900 mb-2">Overall ATS Score</h2>
                          <p className="text-slate-500 text-sm leading-relaxed">
                            {atsResult.overallScore >= 75
                              ? 'Your resume is in great shape! Most ATS systems will let it through.'
                              : atsResult.overallScore >= 50
                              ? 'Good foundation — a few targeted fixes can push you into the top tier.'
                              : 'Your resume needs some work to pass ATS filters. Let\'s fix that together!'}
                          </p>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Section Scores */}
                <div className="mt-8 space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Section Breakdown</h3>
                  <SectionBar label="Contact Completeness" score={atsResult.sectionScores.completeness} icon={<Shield className="w-4 h-4" />} delay={0} />
                  <SectionBar label="Summary Quality" score={atsResult.sectionScores.summary} icon={<BookOpen className="w-4 h-4" />} delay={100} />
                  <SectionBar label="Experience" score={atsResult.sectionScores.experience} icon={<Briefcase className="w-4 h-4" />} delay={200} />
                  <SectionBar label="Skills & Keywords" score={atsResult.sectionScores.skills} icon={<Zap className="w-4 h-4" />} delay={300} />
                  <SectionBar label="Education" score={atsResult.sectionScores.education} icon={<Award className="w-4 h-4" />} delay={400} />
                </div>
              </div>

              {/* Strengths */}
              {atsResult.strengths && atsResult.strengths.length > 0 && (
                <div className="bg-emerald-50 rounded-3xl border border-emerald-100 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-emerald-600 fill-emerald-600" />
                    <h3 className="font-black text-emerald-900">What You're Doing Well</h3>
                  </div>
                  <ul className="space-y-3">
                    {atsResult.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-emerald-800 text-sm leading-relaxed">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {atsResult.suggestions && atsResult.suggestions.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <h3 className="font-black text-slate-900">What to Fix</h3>
                  </div>
                  {atsResult.suggestions.map((s, i) => (
                    <div
                      key={i}
                      className={`bg-white rounded-2xl border p-6 shadow-sm transition-all ${
                        appliedSuggestions.has(i) ? 'opacity-50 border-slate-100' : 'border-slate-100 hover:border-slate-200 hover:shadow-md'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-black text-slate-800 pr-4">{s.title}</h4>
                        <ImpactBadge impact={s.impact as 'high' | 'medium' | 'low'} />
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed mb-4">{s.detail}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-medium capitalize bg-slate-50 px-2 py-1 rounded-lg">
                          📍 {s.section}
                        </span>
                        {appliedSuggestions.has(i) ? (
                          <span className="text-emerald-600 text-xs font-black flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Noted!
                          </span>
                        ) : (
                          <button
                            onClick={() => setAppliedSuggestions(prev => new Set([...prev, i]))}
                            className="text-violet-600 font-black text-xs flex items-center gap-1 hover:gap-2 transition-all"
                          >
                            Mark Done <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Missing Keywords */}
              {atsResult.missingKeywords && atsResult.missingKeywords.length > 0 && (
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-violet-600" />
                    <h3 className="font-black text-slate-900">Missing Keywords</h3>
                  </div>
                  <p className="text-slate-500 text-sm mb-6">
                    Click any keyword to instantly add it to your skills section 👇
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {atsResult.missingKeywords.map((kw, i) => (
                      <button
                        key={i}
                        onClick={() => handleAddKeyword(kw)}
                        disabled={addedKeywords.has(kw)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all ${
                          addedKeywords.has(kw)
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 cursor-default'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200'
                        }`}
                      >
                        {addedKeywords.has(kw) ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Plus className="w-3.5 h-3.5" />
                        )}
                        {kw}
                      </button>
                    ))}
                  </div>
                  {addedKeywords.size > 0 && (
                    <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <p className="text-emerald-700 text-xs font-semibold">
                        {addedKeywords.size} keyword{addedKeywords.size > 1 ? 's' : ''} added to your skills! Save your resume to keep them.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Present Keywords */}
              {atsResult.presentKeywords && atsResult.presentKeywords.length > 0 && (
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-slate-500" />
                    <h3 className="font-black text-slate-900">Keywords Already Present</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {atsResult.presentKeywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-600 text-sm font-medium rounded-xl border border-slate-100">
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Right Panel — Live Preview ── */}
      <div className="hidden xl:flex flex-col w-[380px] border-l border-slate-200 bg-white">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Live Preview</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: 'thin' }}>
          <div className="scale-[0.55] origin-top-left" style={{ width: '181.8%', transformOrigin: 'top left' }}>
            <ResumePreview data={resume} theme={resume.theme || 'minimalist'} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiSuggestions;
