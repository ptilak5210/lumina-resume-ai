
import React, { useState } from 'react';
import { User } from '../types';
import { Sparkles, Mail, Lock, User as UserIcon, ArrowRight, Github, X, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/authService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  initialView?: 'signin' | 'signup';
}

const Auth: React.FC<Props> = ({ isOpen, onClose, onLogin, initialView = 'signin' }) => {
  const [view, setView] = useState<'signin' | 'signup' | 'forgot' | 'verify-otp'>( initialView);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (view === 'forgot') {
        await authService.forgotPassword(email);
        setSuccess('✅ Password reset link sent! Check your email.');
        return;
      }

      if (view === 'verify-otp') {
        const user = await authService.verifyOtp(email, otp);
        setSuccess('✅ Account verified successfully!');
        onLogin(user);
        onClose();
        return;
      }

      if (view === 'signup') {
        await authService.signup(name, email, password);
        setView('verify-otp');
        setSuccess('✅ OTP sent! Check your email and enter the 6-digit code below.');
        setIsLoading(false);
        return;
      } else {
        const user = await authService.login(email, password);
        onLogin(user);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    setError(null);
    try {
      if (provider === 'google') {
        await authService.loginWithGoogle();
      } else {
        await authService.loginWithGithub();
      }
      // OAuth redirects the page — no onLogin needed here
    } catch (err: any) {
      setError(err.message || 'Social login failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500" />

        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-10 pt-12">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200">
              <Sparkles className="text-white w-7 h-7" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              {view === 'signin' ? 'Welcome Back' : view === 'verify-otp' ? 'Verify Email' : view === 'signup' ? 'Join HireRight' : 'Reset Password'}
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              {view === 'signin'
                ? 'Sign in to access your professional dashboard'
                : view === 'verify-otp'
                ? 'A one-time password has been sent to your email.'
                : view === 'signup'
                ? 'Start building your AI-powered resume today'
                : 'Enter your email to receive a recovery link'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-rose-500 text-sm font-medium text-center bg-rose-50 p-3 rounded-xl border border-rose-100">
                {error}
              </p>
            )}
            {success && (
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                {success}
              </div>
            )}

            {view === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tilak Patel"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            {view === 'verify-otp' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Enter 6-Digit OTP</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="123456"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-center tracking-[0.5em] font-mono text-lg font-bold"
                  />
                </div>
              </div>
            )}

            {view !== 'verify-otp' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            {view !== 'forgot' && view !== 'verify-otp' && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                  {view === 'signin' && (
                    <button
                      type="button"
                      onClick={() => { setView('forgot'); setError(null); setSuccess(null); }}
                      className="text-xs font-medium text-indigo-500 hover:text-indigo-600"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98] mt-6 shadow-xl shadow-slate-100 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <><Sparkles className="w-4 h-4 animate-spin" /> Please wait...</>
              ) : (
                <>
                  {view === 'signin' ? 'Sign In' : view === 'signup' ? 'Create Account' : view === 'verify-otp' ? 'Verify OTP' : 'Send Reset Link'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {view !== 'forgot' && view !== 'verify-otp' && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-widest">
                  <span className="bg-white px-3 text-slate-400 font-bold">Or continue with</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                  className="relative w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('github')}
                  disabled={isLoading}
                  className="relative w-full flex items-center justify-center gap-3 py-3 px-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(15,23,42,0.15)]"
                >
                  <Github className="w-5 h-5 text-white" />
                  <span>Continue with GitHub</span>
                </button>
              </div>
            </>
          )}

          <div className="mt-8 text-center text-sm text-slate-500">
            {view === 'forgot' || view === 'verify-otp' ? (
              <button onClick={() => { setView('signin'); setError(null); setSuccess(null); }} className="text-indigo-600 font-bold hover:underline underline-offset-4">
                ← Back to Sign In
              </button>
            ) : (
              <>
                {view === 'signin' ? "New to HireRight?" : "Already a member?"}{' '}
                <button
                  onClick={() => { setView(view === 'signin' ? 'signup' : 'signin'); setError(null); }}
                  className="text-indigo-600 font-bold hover:underline underline-offset-4"
                >
                  {view === 'signin' ? 'Create new account' : 'Sign in'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
