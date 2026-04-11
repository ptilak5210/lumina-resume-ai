import React, { useState } from 'react';
import { authService } from '../services/authService';
import { ArrowLeft, Mail, Sparkles } from 'lucide-react';

interface Props {
    onBack: () => void;
}

const ForgotPasswordPage: React.FC<Props> = ({ onBack }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await authService.forgotPassword(email);
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to send reset link. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white border border-slate-100 rounded-[2rem] shadow-2xl p-10 relative overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500" />

                <button onClick={onBack} aria-label="Go back" className="absolute top-6 left-6 p-2 text-slate-400 hover:text-slate-900 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="text-center mb-8 pt-4">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="text-indigo-600 w-7 h-7" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">Forgot Password?</h2>
                    <p className="text-slate-500 mt-2">Enter your email to receive a recovery link.</p>
                </div>

                {success ? (
                    <div className="text-center space-y-6 animate-in fade-in duration-300">
                        <div className="p-4 bg-green-50 text-green-700 rounded-xl text-sm font-medium">
                            If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
                        </div>
                        <button
                            onClick={onBack}
                            className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl"
                        >
                            Back to Sign In
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-xl text-center font-medium">{error}</div>}

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-medium"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98] shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
