import React, { useState, useEffect } from 'react';
import { Palette, Sparkles, CheckCircle2, User as UserIcon, Shield, CreditCard, Bell, Camera, AlertTriangle, Key, Trash2, ArrowRight } from 'lucide-react';
import { User } from '../types';
import { authService } from '../services/authService';

interface SettingsViewProps {
    user: User;
    onUpdateUser: (user: User) => void;
}

type SettingsTab = 'profile' | 'account' | 'billing' | 'notifications';

const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpdateUser }) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    // Profile State
    const [profileData, setProfileData] = useState({
        name: user.name || '',
        title: user.title || '',
        location: user.location || '',
        bio: user.bio || '',
    });

    // Account State
    const [passwordData, setPasswordData] = useState({ current: '', new: '' });
    
    // Notifications State
    const [notifData, setNotifData] = useState({
        email_notifications: user.email_notifications ?? true,
        marketing_emails: user.marketing_emails ?? false,
    });

    // Reset message when tab changes
    useEffect(() => {
        setMessage(null);
    }, [activeTab]);

    const showMessage = (text: string, type: 'success' | 'error') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            const res = await authService.updateProfile(profileData);
            onUpdateUser({ ...user, ...res.user });
            showMessage('Profile updated successfully!', 'success');
        } catch (error: any) {
            showMessage(error.message || 'Failed to update profile', 'error');
        }
        setLoading(false);
    };

    const handleSavePassword = async () => {
        if (!passwordData.current || !passwordData.new) {
            showMessage('Please enter both current and new passwords.', 'error');
            return;
        }
        setLoading(true);
        try {
            await authService.updatePassword(passwordData.current, passwordData.new);
            showMessage('Password changed effectively.', 'success');
            setPasswordData({ current: '', new: '' });
        } catch (error: any) {
            showMessage(error.message || 'Failed to change password', 'error');
        }
        setLoading(false);
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("Are you ABSOLUTELY sure? This action cannot be undone and will delete all your resumes.");
        if (!confirmDelete) return;
        
        setLoading(true);
        try {
            await authService.deleteAccount();
            authService.logout();
            window.location.reload();
        } catch (error: any) {
            showMessage(error.message || 'Failed to delete account', 'error');
            setLoading(false);
        }
    };

    const handleSaveNotifications = async () => {
        setLoading(true);
        try {
            const res = await authService.updateNotifications(notifData.email_notifications, notifData.marketing_emails);
            onUpdateUser({ ...user, ...res.user });
            showMessage('Preferences updated.', 'success');
        } catch (error: any) {
            showMessage(error.message || 'Failed to update preferences', 'error');
        }
        setLoading(false);
    };

    const handleUpgradeSubscription = async () => {
        setLoading(true);
        try {
            const res = await authService.upgradeSubscription();
            onUpdateUser({ ...user, ...res.user });
            showMessage('Welcome to Pro! Plan upgraded successfully.', 'success');
        } catch (error: any) {
            showMessage(error.message || 'Upgrade failed', 'error');
        }
        setLoading(false);
    };

    const tabs = [
        { id: 'profile', label: 'Public Profile', icon: UserIcon },
        { id: 'account', label: 'Security & Account', icon: Shield },
        { id: 'billing', label: 'Plan & Billing', icon: CreditCard },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    return (
        <div className="h-full overflow-y-auto custom-scrollbar p-6 lg:p-10 animate-in fade-in duration-500 bg-slate-50">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Account Settings</h1>
                    <p className="text-slate-500 mt-2 text-lg">Manage your identity, billing, and system preferences.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    
                    {/* Modern Sidebar */}
                    <div className="lg:w-72 flex-shrink-0">
                        <div className="space-y-2">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.id;
                                return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as SettingsTab)}
                                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 relative group
                                        ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'bg-transparent text-slate-500 hover:bg-white hover:shadow-md hover:text-indigo-600'}
                                    `}
                                >
                                    <tab.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                    {tab.label}
                                    {isActive && (
                                        <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    )}
                                </button>
                            )})}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 lg:p-12 min-h-[600px] relative overflow-hidden">
                            
                            {/* Decorative Blur */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none -translate-y-1/2 translate-x-1/4" />

                            {/* Toast Notification */}
                            {message && (
                                <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 text-sm font-bold shadow-sm border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
                                    {message.text}
                                </div>
                            )}

                            {/* ── PROFILE TAB ────────────────────────────────────────── */}
                            {activeTab === 'profile' && (
                                <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                                        <div className="relative group">
                                            <img
                                                src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                                                alt="Profile"
                                                className="w-24 h-24 rounded-2xl border border-slate-200 shadow-inner bg-white object-cover"
                                            />
                                            <div className="absolute inset-0 bg-indigo-900/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm">
                                                <Camera className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-1">Profile Photo</h3>
                                            <p className="text-sm text-slate-500 mb-4">Recommended formatting: 1:1 aspect ratio, under 2MB.</p>
                                            <div className="flex gap-3">
                                                <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
                                                    Upload New
                                                </button>
                                                <button className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 hover:text-rose-600 transition-colors">
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1.5 group">
                                                <label className="text-xs font-black text-indigo-900/50 uppercase tracking-widest pl-1">Display Name</label>
                                                <input
                                                    type="text"
                                                    value={profileData.name}
                                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                    className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all hover:border-slate-300"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-black text-indigo-900/50 uppercase tracking-widest pl-1">Professional Title</label>
                                                <input
                                                    type="text"
                                                    value={profileData.title}
                                                    onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                                                    placeholder="e.g. Senior Software Engineer"
                                                    className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all hover:border-slate-300"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-indigo-900/50 uppercase tracking-widest pl-1">Location</label>
                                            <input
                                                type="text"
                                                value={profileData.location}
                                                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                                placeholder="e.g. San Francisco, CA"
                                                className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all hover:border-slate-300"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-indigo-900/50 uppercase tracking-widest pl-1">Bio</label>
                                            <textarea
                                                rows={4}
                                                value={profileData.bio}
                                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                                placeholder="Write a short bio about your professional journey..."
                                                className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all resize-none hover:border-slate-300 leading-relaxed"
                                            />
                                        </div>

                                        <div className="pt-6">
                                            <button
                                                onClick={handleSaveProfile}
                                                disabled={loading}
                                                className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto"
                                            >
                                                {loading ? <Sparkles className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                                                Save Profile Changes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── ACCOUNT / SECURITY TAB ────────────────────────────────────────── */}
                            {activeTab === 'account' && (
                                <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                                    <h2 className="text-2xl font-black text-slate-900 mb-8">Security & Access</h2>
                                    
                                    <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-12 shadow-sm">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                                                <Key className="w-6 h-6 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-lg">Change Password</h3>
                                                <p className="text-sm text-slate-500">Ensure your account is using a long, random password to stay secure.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <input
                                                type="password"
                                                placeholder="Current Password"
                                                value={passwordData.current}
                                                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                                className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                            />
                                            <input
                                                type="password"
                                                placeholder="New Password"
                                                value={passwordData.new}
                                                onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                                className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                            />
                                            <button
                                                onClick={handleSavePassword}
                                                disabled={loading}
                                                className="mt-4 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-70"
                                            >
                                                {loading ? 'Updating...' : 'Update Password'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="border-2 border-rose-100 bg-rose-50/50 rounded-2xl p-8">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                                                <Trash2 className="w-6 h-6 text-rose-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-lg">Danger Zone</h3>
                                                <p className="text-sm text-slate-500">Permanently delete your account and all associated resumes.</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-rose-700/80 mb-6 font-medium leading-relaxed">
                                            Once you delete your account, there is no going back. Please be certain. All data, analysis historical records, and drafted templates will be purged immediately.
                                        </p>
                                        <button
                                            onClick={handleDeleteAccount}
                                            disabled={loading}
                                            className="bg-rose-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-rose-700 transition-all active:scale-[0.98] shadow-md shadow-rose-200"
                                        >
                                            Delete My Account
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ── PLAN & BILLING TAB ────────────────────────────────────────── */}
                            {activeTab === 'billing' && (
                                <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                                    <h2 className="text-2xl font-black text-slate-900 mb-8">Subscription Plan</h2>
                                    
                                    <div className={`border-2 rounded-[2rem] p-8 md:p-10 relative overflow-hidden transition-all duration-500 ${user.subscription_tier === 'pro' ? 'bg-gradient-to-br from-indigo-900 to-slate-900 border-indigo-500 text-white shadow-2xl shadow-indigo-900/30' : 'bg-white border-slate-200 shadow-sm'}`}>
                                        
                                        {user.subscription_tier === 'pro' && (
                                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                                        )}

                                        <div className="flex justify-between items-start mb-8 relative z-10">
                                            <div>
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 ${user.subscription_tier === 'pro' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                    <Sparkles className="w-3 h-3" />
                                                    {user.subscription_tier === 'pro' ? 'Pro Plan Active' : 'Free Tier'}
                                                </div>
                                                <h3 className={`text-4xl font-black tracking-tight ${user.subscription_tier === 'pro' ? 'text-white' : 'text-slate-900'}`}>
                                                    {user.subscription_tier === 'pro' ? 'Lumina Pro' : 'Lumina Basic'}
                                                </h3>
                                                <p className={`mt-2 font-medium ${user.subscription_tier === 'pro' ? 'text-indigo-200' : 'text-slate-500'}`}>
                                                    {user.subscription_tier === 'pro' ? 'You have unlimited access to ATS analysis and premium templates.' : 'Upgrade to unlock advanced ATS intelligence and premium themes.'}
                                                </p>
                                            </div>
                                            {user.subscription_tier !== 'pro' && (
                                                <div className="text-right">
                                                    <div className="flex flex-col items-end">
                                                        <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-md mb-1 uppercase tracking-wider">Most Popular</span>
                                                        <div>
                                                            <span className="text-3xl font-black text-slate-900 font-sans">₹1,499</span>
                                                            <span className="text-slate-500 font-medium text-sm">/year</span>
                                                        </div>
                                                        <span className="text-[10px] text-slate-400 font-bold mt-1">Saves ₹1,489 vs Monthly</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-4 mb-8 relative z-10">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">Prime Features:</span>
                                            </div>
                                            {['Unlimited AI Resume Tailoring', '14-Day Free Trial (Yearly Only)', 'Advanced ATS Keyword Gap Analysis', 'All Premium Export Templates', 'Cover Letter AI Builder'].map((feature, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <CheckCircle2 className={`w-5 h-5 ${user.subscription_tier === 'pro' ? 'text-indigo-400' : 'text-emerald-500'}`} />
                                                    <span className={`font-semibold text-sm ${user.subscription_tier === 'pro' ? 'text-indigo-100' : 'text-slate-700'}`}>{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {user.subscription_tier !== 'pro' && (
                                            <button
                                                onClick={handleUpgradeSubscription}
                                                disabled={loading}
                                                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-lg hover:bg-indigo-700 transition-all active:scale-[0.98] shadow-xl shadow-indigo-200 flex items-center justify-center gap-2"
                                            >
                                                {loading ? 'Processing...' : 'Upgrade to Pro Simulator'}
                                                {!loading && <ArrowRight className="w-5 h-5" />}
                                            </button>
                                        )}
                                        {user.subscription_tier === 'pro' && (
                                            <button className="w-full bg-white/10 text-white border border-white/20 py-4 rounded-xl font-bold hover:bg-white/20 transition-all active:scale-[0.98]">
                                                Manage Billing on Stripe
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ── NOTIFICATIONS TAB ────────────────────────────────────────── */}
                            {activeTab === 'notifications' && (
                                <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                                    <h2 className="text-2xl font-black text-slate-900 mb-8">Notification Preferences</h2>
                                    
                                    <div className="bg-white border border-slate-200 rounded-2xl p-2 sm:p-8 space-y-8">
                                        
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg">Email Notifications</h4>
                                                <p className="text-sm text-slate-500 font-medium mt-1">Receive critical updates regarding your account and billing.</p>
                                            </div>
                                            <button 
                                                onClick={() => setNotifData(prev => ({ ...prev, email_notifications: !prev.email_notifications }))}
                                                className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${notifData.email_notifications ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                            >
                                                <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${notifData.email_notifications ? 'translate-x-7' : 'translate-x-0'}`} />
                                            </button>
                                        </div>

                                        <div className="h-px bg-slate-100" />

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg">Marketing & Offer Emails</h4>
                                                <p className="text-sm text-slate-500 font-medium mt-1">Receive tips, offers, and weekly digest emails from Lumina.</p>
                                            </div>
                                            <button 
                                                onClick={() => setNotifData(prev => ({ ...prev, marketing_emails: !prev.marketing_emails }))}
                                                className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${notifData.marketing_emails ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                            >
                                                <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${notifData.marketing_emails ? 'translate-x-7' : 'translate-x-0'}`} />
                                            </button>
                                        </div>

                                        <div className="pt-6 border-t border-slate-100">
                                            <button
                                                onClick={handleSaveNotifications}
                                                disabled={loading}
                                                className="bg-slate-900 text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-70"
                                            >
                                                {loading ? 'Saving...' : 'Save Preferences'}
                                            </button>
                                        </div>
                                    </div>
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
