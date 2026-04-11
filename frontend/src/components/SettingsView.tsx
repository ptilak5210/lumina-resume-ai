
import React, { useState } from 'react';
import { Palette, Sparkles, CheckCircle2, User as UserIcon, Shield, CreditCard, Bell, Camera } from 'lucide-react';
import { User } from '../types';

interface SettingsViewProps {
    user: User;
    onUpdateUser: (user: User) => void;
}

type SettingsTab = 'profile' | 'account' | 'billing' | 'notifications';

const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpdateUser }) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        title: 'Product Designer', // Mock default for demo
        location: 'San Francisco, CA', // Mock default
        bio: ''
    });

    const handleSave = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            onUpdateUser({ ...user, name: formData.name, email: formData.email });
            setLoading(false);
            // You might want to show a toast here in a real app
        }, 800);
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: UserIcon },
        { id: 'account', label: 'Account', icon: Shield },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    return (
        <div className="h-full overflow-y-auto custom-scrollbar p-8 animate-in fade-in duration-500">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Account Settings</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl border border-slate-100 p-2 shadow-sm space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as SettingsTab)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 min-h-[600px]">

                            {activeTab === 'profile' && (
                                <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {/* Profile Photo */}
                                    <div className="flex items-center gap-6 mb-12">
                                        <div className="relative group">
                                            <img
                                                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                                alt="Profile"
                                                className="w-24 h-24 rounded-full border-4 border-slate-50 shadow-inner bg-slate-50"
                                            />
                                            <div className="absolute inset-0 bg-slate-900/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                                <Camera className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2">Profile Photo</h3>
                                            <div className="flex gap-3">
                                                <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors">
                                                    Upload New
                                                </button>
                                                <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label htmlFor="settings-display-name" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Display Name</label>
                                                <input
                                                    id="settings-display-name"
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="settings-professional-title" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Professional Title</label>
                                                <input
                                                    id="settings-professional-title"
                                                    type="text"
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="settings-location" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</label>
                                            <input
                                                id="settings-location"
                                                type="text"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bio</label>
                                            <textarea
                                                rows={4}
                                                value={formData.bio}
                                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                placeholder="Write a short bio..."
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                                            />
                                        </div>

                                        <div className="pt-8 flex justify-end">
                                            <button
                                                onClick={handleSave}
                                                disabled={loading}
                                                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab !== 'profile' && (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                                        {activeTab === 'account' && <Shield className="w-8 h-8" />}
                                        {activeTab === 'billing' && <CreditCard className="w-8 h-8" />}
                                        {activeTab === 'notifications' && <Bell className="w-8 h-8" />}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2 capitalize">{activeTab} Settings</h3>
                                    <p className="text-sm">This section is coming soon.</p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;
