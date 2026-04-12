import React, { useState } from 'react';
import {
    LayoutDashboard,
    PlusCircle,
    FileText,
    Sparkles,
    LayoutTemplate,
    Settings,
    LogOut,
    ChevronRight,
    Crown,
    Power,
    MoreVertical,
    User as UserIcon,
    Shield
} from 'lucide-react';
import { User, AppView } from '../types';

interface SidebarProps {
    user: User;
    activeTab: AppView;
    onNavigate: (view: AppView) => void;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, activeTab, onNavigate, onLogout }) => {
    const isPro = user.subscription_tier === 'pro';
    const [showUserMenu, setShowUserMenu] = useState(false);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'resume-editor', label: 'Create Resume', icon: PlusCircle },
        { id: 'my-resumes', label: 'My Resumes', icon: FileText },
        { id: 'ai-suggestions', label: 'AI Suggestions', icon: Sparkles },
        { id: 'templates', label: 'Templates', icon: LayoutTemplate },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="w-64 h-screen bg-white border-r border-slate-100 flex flex-col fixed left-0 top-0 z-50 select-none">
            {/* ── Branding Section ────────────────────────────────────────── */}
            <div 
                onClick={() => onNavigate('dashboard')}
                className="p-8 pb-10 flex items-center gap-4 cursor-pointer group"
            >
                <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-xl shadow-blue-500/20 group-hover:rotate-6 transition-transform duration-500">
                        <Sparkles className="text-white w-5 h-5 animate-pulse" />
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="font-black text-2xl text-slate-900 tracking-tighter leading-none flex items-center gap-1">
                        Lumina
                        <span className="text-blue-600">AI</span>
                    </span>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em]">Premium</span>
                        {isPro && (
                            <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-100">
                                <Crown className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                                <span className="text-[8px] font-black text-amber-600 uppercase tracking-wider">Pro</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Navigation Menu ─────────────────────────────────────────── */}
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                <p className="px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 mt-2">Workspace</p>
                {menuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id as AppView)}
                            className={`w-full flex items-center justify-between px-6 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm group relative overflow-hidden ${
                                isActive 
                                    ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/20' 
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            <div className="flex items-center gap-3.5 relative z-10">
                                <item.icon className={`w-5 h-5 transition-transform duration-500 ${isActive ? 'text-white scale-110' : 'text-slate-400 group-hover:text-slate-900 group-hover:scale-110'}`} />
                                <span className="tracking-tight">{item.label}</span>
                            </div>
                            {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            )}
                            {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
                        </button>
                    )
                })}
            </nav>

            {/* ── Premium User Identity Card ──────────────────────────────── */}
            <div className="p-4 mt-auto">
                <div 
                    className="relative bg-slate-50/50 border border-slate-100 rounded-[2rem] p-3 transition-all duration-500 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 group"
                >
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <img
                                src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                                alt="Profile"
                                className="w-11 h-11 rounded-full border-2 border-white shadow-md object-cover bg-white"
                            />
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${isPro ? 'bg-amber-400 shadow-[0_0_10px_rgb(251,191,36,0.5)]' : 'bg-emerald-400'}`} />
                        </div>

                        {/* Text Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-slate-900 truncate tracking-tight uppercase">{user.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-widest mt-0.5">
                                {user.title || 'Classic Member'}
                            </p>
                        </div>

                        {/* Unified Prime Logout Button */}
                        <div className="flex items-center px-1">
                            <button 
                                onClick={(e) => { e.stopPropagation(); onLogout(); }}
                                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-rose-600 hover:border-rose-100 hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-300 active:scale-90 group/logout"
                                title="Sign Out"
                            >
                                <Power className="w-5 h-5 group-hover/logout:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>
                    
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-700" />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;


