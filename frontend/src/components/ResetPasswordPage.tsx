import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { ArrowRight, Lock, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface Props {
    onSuccess: () => void;
}

const ResetPasswordPage: React.FC<Props> = ({ onSuccess }) => {
    const [token, setToken] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const tokenParam = query.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        } else {
            setError("Invalid or missing reset token.");
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await authService.resetPassword(password);
            setSuccess(true);
            // Optional: Auto redirect after few seconds, but button is safer
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to reset password. Token may be expired.");
        } finally {
            setLoading(false);
        }
    };

    if (!token && !error) return null; // Wait for mount

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white border border-slate-100 rounded-[2rem] shadow-2xl p-10 relative overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500" />

                <div className="text-center mb-8 pt-4">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        {success ? <CheckCircle2 className="text-green-500 w-7 h-7" /> : <Lock className="text-indigo-600 w-7 h-7" />}
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">{success ? 'Password Reset!' : 'Reset Password'}</h2>
                    <p className="text-slate-500 mt-2">{success ? 'Your password has been successfully updated.' : 'Create a new secure password.'}</p>
                </div>

                {success ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <button
                            onClick={onSuccess}
                            className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl"
                        >
                            Sign In with New Password <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-xl flex items-center gap-2 font-medium justify-center">
                                <AlertCircle className="w-4 h-4" /> {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Min 6 characters"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Repeat password"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !token}
                            className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98] shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : "Reset Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;
