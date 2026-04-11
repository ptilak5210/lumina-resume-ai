import React from 'react';
import {
    LayoutDashboard,
    PlusCircle,
    FileText,
    Sparkles,
    LayoutTemplate,
    Settings,
    LogOut,
    ChevronRight
} from 'lucide-react';
import { User, AppView } from '../types';

interface SidebarProps {
    user: User;
    activeTab: AppView;
    onNavigate: (view: AppView) => void;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, activeTab, onNavigate, onLogout }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'resume-editor', label: 'Create Resume', icon: PlusCircle },
        { id: 'my-resumes', label: 'My Resumes', icon: FileText },
        { id: 'ai-suggestions', label: 'AI Suggestions', icon: Sparkles },
        { id: 'templates', label: 'Templates', icon: LayoutTemplate },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="w-64 h-screen bg-white border-r border-slate-100 flex flex-col fixed left-0 top-0 z-50">
            <div className="p-8 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">R</span>
                </div>
                <span className="font-bold text-xl text-slate-900 tracking-tight">AI Resume</span>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                <div className="space-y-1">
                    <p className="px-6 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 mt-4">Main</p>
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id as AppView)}
                            className={`w-full flex items-center justify-between px-6 py-3 rounded-xl transition-all font-medium text-sm group ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                <span>{item.label}</span>
                            </div>
                            {activeTab === item.id && <ChevronRight className="w-4 h-4 text-white" />}
                        </button>
                    ))}
                </div>
            </nav>

            <div className="p-4 border-t border-slate-100">
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                    <img
                        src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                        <button onClick={onLogout} className="text-xs text-rose-500 font-medium hover:underline flex items-center gap-1">
                            <LogOut className="w-3 h-3" /> Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
