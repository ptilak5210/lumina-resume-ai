import { supabase } from './supabase';
import { User } from '../types';

/** Convert Supabase user → our app User type */
function toAppUser(sbUser: any): User {
  return {
    id: sbUser.id,
    name: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'User',
    email: sbUser.email || '',
    created_at: sbUser.created_at || new Date().toISOString(),
  };
}

export const authService = {
  // ── Email Signup ────────────────────────────────────────────────────────────
  async signup(name: string, email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) throw new Error(error.message);
  },

  // ── Verify OTP ──────────────────────────────────────────────────────────────
  async verifyOtp(email: string, otp: string): Promise<User> {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'signup',
    });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Verification failed. No user returned.');
    return toAppUser(data.user);
  },

  // ── Email Login ─────────────────────────────────────────────────────────────
  async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return toAppUser(data.user);
  },

  // ── Logout ──────────────────────────────────────────────────────────────────
  async logout(): Promise<void> {
    await supabase.auth.signOut();
    // Clear any cached token
    localStorage.removeItem('token');
  },

  // ── Current User ────────────────────────────────────────────────────────────
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    return toAppUser(user);
  },

  // ── Get Access Token (for backend requests) ─────────────────────────────────
  async getAccessToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  },

  // ── Google OAuth ────────────────────────────────────────────────────────────
  async loginWithGoogle(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) throw new Error(error.message);
  },

  // ── GitHub OAuth ────────────────────────────────────────────────────────────
  async loginWithGithub(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) throw new Error(error.message);
  },

  // ── Forgot Password ─────────────────────────────────────────────────────────
  async forgotPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw new Error(error.message);
  },

  // ── Reset Password ──────────────────────────────────────────────────────────
  async resetPassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(error.message);
  },

  // ── Listen for auth state changes ──────────────────────────────────────────
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ? toAppUser(session.user) : null);
    });
  },
};
