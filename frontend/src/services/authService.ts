import { supabase } from './supabase';
import { User } from '../types';

/** Convert Supabase user → our app User type */
function toAppUser(sbUser: any, dbUser?: any): User {
  return {
    id: sbUser.id,
    name: dbUser?.name || sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'User',
    email: sbUser.email || '',
    avatar_url: dbUser?.avatar_url || sbUser.user_metadata?.avatar_url,
    title: dbUser?.title,
    location: dbUser?.location,
    bio: dbUser?.bio,
    subscription_tier: dbUser?.subscription_tier,
    email_notifications: dbUser?.email_notifications,
    marketing_emails: dbUser?.marketing_emails,
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

    // Fetch database fields
    try {
      const token = await this.getAccessToken();
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const dbUser = await res.json();
        return toAppUser(user, dbUser);
      }
    } catch {
      console.warn("Failed to fetch extended DB user profiles");
    }

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
    return supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
         // Attempt to fetch fresh DB details on state change
         try {
           const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';
           const res = await fetch(`${API_URL}/auth/me`, {
             headers: { Authorization: `Bearer ${session.access_token}` }
           });
           if (res.ok) {
             const dbUser = await res.json();
             callback(toAppUser(session.user, dbUser));
             return;
           }
         } catch(e) {}
         callback(toAppUser(session.user));
      } else {
         callback(null);
      }
    });
  },

  // ── CUSTOM BACKEND SETTINGS Endpoints ─────────────────────────────────────
  async _authFetch(endpoint: string, method: string, payload?: any) {
    const token = await this.getAccessToken();
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';
    const res = await fetch(`${API_URL}/auth${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: payload ? JSON.stringify(payload) : undefined
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Operation failed');
    }
    return res.json();
  },

  async updateProfile(data: Partial<User>) {
    return this._authFetch('/profile', 'PUT', data);
  },

  async updatePassword(current_password: string, new_password: string) {
     // NOTE: Supabase users should use auth.updateUser({ password }) directly
     const { error } = await supabase.auth.updateUser({ password: new_password });
     if (error) throw new Error(error.message);
  },

  async deleteAccount() {
     // Supabase handles deletions best from backend admin API, but we'll try ours
     return this._authFetch('/account', 'DELETE');
     // Note: Realistically, you want to delete them from Supabase Auth as well via Admin API
  },

  async updateNotifications(email_notifications: boolean, marketing_emails: boolean) {
     return this._authFetch('/notifications', 'PUT', { email_notifications, marketing_emails });
  },

  async upgradeSubscription() {
     return this._authFetch('/subscribe', 'POST');
  }
};
