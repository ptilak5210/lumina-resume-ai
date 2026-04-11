
import React from 'react';
import { AnalysisResult } from '../types';
import { Target, AlertCircle, CheckCircle2, TrendingUp, Search, BarChart } from 'lucide-react';

interface Props {
  analysis: AnalysisResult | null;
  loading: boolean;
}

const StrengthMeter: React.FC<Props> = ({ analysis, loading }) => {
  if (loading) {
    return (
      <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm animate-pulse">
        <div className="flex justify-between items-center mb-10">
          <div className="h-6 bg-slate-100 rounded w-1/4"></div>
          <div className="h-10 w-10 bg-slate-100 rounded-full"></div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="h-32 bg-slate-50 rounded-2xl"></div>
            <div className="h-32 bg-slate-50 rounded-2xl"></div>
            <div className="h-32 bg-slate-50 rounded-2xl"></div>
        </div>
        <div className="space-y-4">
          <div className="h-4 bg-slate-100 rounded w-full"></div>
          <div className="h-4 bg-slate-100 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white border border-dashed border-slate-200 rounded-[2rem] p-12 text-center group hover:bg-slate-50/50 transition-colors">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
          <TrendingUp className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Analyze Your Resume</h3>
        <p className="text-sm text-slate-500 max-w-xs mx-auto">Click the AI wand to run a deep scan for ATS optimization and keyword alignment.</p>
      </div>
    );
  }

  // Generate fake readable scores if not present
  const scores = analysis.chartData || {
    technical: Math.min(100, analysis.score + 5),
    soft: Math.min(100, analysis.score - 10),
    readability: Math.min(100, analysis.score + 2)
  };

  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-10 shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/30 blur-3xl -z-10 rounded-full" />
      
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <BarChart className="w-6 h-6 text-indigo-500" />
          Resume Intelligence
        </h3>
        <div className="flex flex-col items-end">
          <span className="text-4xl font-black text-slate-900 leading-none">{analysis.score}%</span>
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Lumina Score</span>
        </div>
      </div>

      {/* Main Score Progress */}
      <div className="w-full bg-slate-50 h-4 rounded-full mb-12 overflow-hidden shadow-inner border border-slate-100">
        <div 
          className={`h-full transition-all duration-1000 bg-gradient-to-r ${
            analysis.score > 80 ? 'from-emerald-400 to-emerald-600' : analysis.score > 50 ? 'from-amber-400 to-amber-600' : 'from-rose-400 to-rose-600'
          }`}
          style={{ width: `${analysis.score}%` }}
        />
      </div>

      {/* Sub-metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <MetricCard label="Technical Depth" value={scores.technical} color="indigo" />
        <MetricCard label="Soft Skills" value={scores.soft} color="purple" />
        <MetricCard label="Readability" value={scores.readability} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div>
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Impactful Keywords
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.keywordsMatch.map((k, i) => (
                <span key={i} className="bg-white border border-slate-100 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm hover:border-emerald-100 transition-colors">
                  {k}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-500" />
              Missing Opportunities
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.missingKeywords.map((k, i) => (
                <span key={i} className="bg-indigo-50/30 text-indigo-700 border border-indigo-100/50 px-3 py-1.5 rounded-xl text-xs font-semibold">
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            AI Recommendations
          </h4>
          <div className="space-y-3">
            {analysis.suggestions.map((s, i) => (
              <div key={i} className="text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-3 group hover:bg-white transition-colors">
                <div className="w-2 h-2 rounded-full bg-indigo-200 mt-1.5 shrink-0 group-hover:bg-indigo-500 transition-colors" />
                <p>{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ label: string, value: number, color: 'indigo' | 'purple' | 'blue' }> = ({ label, value, color }) => {
  const colorMap = {
    indigo: 'text-indigo-600 bg-indigo-50',
    purple: 'text-purple-600 bg-purple-50',
    blue: 'text-blue-600 bg-blue-50'
  };
  
  return (
    <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center">
      <div className="relative w-16 h-16 flex items-center justify-center mb-3">
        <svg className="w-16 h-16 -rotate-90">
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
          <circle 
            cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" 
            className={colorMap[color].split(' ')[0]}
            strokeDasharray={2 * Math.PI * 28}
            strokeDashoffset={2 * Math.PI * 28 * (1 - value / 100)}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-xs font-black">{value}%</span>
      </div>
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  );
};

export default StrengthMeter;
