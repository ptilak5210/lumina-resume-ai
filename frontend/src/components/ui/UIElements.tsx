import React from 'react';
import { Sparkles } from 'lucide-react';

export const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-4">{children}</label>
);

export const InputGroup = ({ label, value, onChange, placeholder, type = "text" }: any) => (
  <div className="space-y-1.5 w-full">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      title={label}
      placeholder={placeholder || label}
      className="w-full p-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all text-sm font-semibold shadow-sm placeholder:text-slate-300"
    />
  </div>
);

export const AiFeatureCard = ({ icon, title, desc, onClick, loading }: any) => (
  <div
    onClick={loading ? undefined : onClick}
    className={`p-6 bg-white border border-slate-100 rounded-2xl shadow-sm transition-all text-left cursor-pointer group ${loading ? 'opacity-70 grayscale pointer-events-none' : 'hover:border-indigo-200 hover:shadow-md active:scale-95'}`}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${loading ? 'bg-slate-100 text-slate-300' : 'bg-indigo-50 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white'}`}>
      {loading ? <Sparkles className="w-5 h-5 animate-spin" /> : icon}
    </div>
    <h4 className="font-bold text-sm text-slate-900 mb-1">{title}</h4>
    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
  </div>
);
