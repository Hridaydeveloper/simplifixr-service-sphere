
import { supabase } from '@/integrations/supabase/client';
import { otpAuth } from './auth/otpAuth';
import { emailPasswordAuth } from './auth/emailPasswordAuth';
import type { SignUpData, SignInData } from './auth/types';

export const authService = {
  // Clean up any existing auth state
  async cleanupAuthState() {
    // Clear localStorage auth keys
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear sessionStorage auth keys
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  },

  // Traditional email/password authentication
  async signIn(data: SignInData) {
    return emailPasswordAuth.signIn(data);
  },

  async signUp(data: SignUpData) {
    return emailPasswordAuth.signUp(data);
  },

  // OTP authentication methods
  async sendOTP(contact: string, contactType: 'email' | 'phone', role: 'customer' | 'provider') {
    return otpAuth.sendOTP(contact, contactType, role);
  },

  async verifyOTP(contact: string, contactType: 'email' | 'phone', otp: string) {
    return otpAuth.verifyOTP(contact, contactType, otp);
  },

  async completeOTPAuth(contact: string, contactType: 'email' | 'phone', fullName?: string, location?: string) {
    // Clean up auth state first
    await this.cleanupAuthState();
    return otpAuth.completeOTPAuth(contact, contactType, fullName, location);
  },

  async signInWithOTP(contact: string) {
    return otpAuth.signInWithOTP(contact);
  },

  async signOut() {
    try {
      // Clean up auth state
      await this.cleanupAuthState();
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error('Sign out error:', error);
      }
      
      // Clear guest mode
      localStorage.removeItem('guestMode');
      
      // Force page reload for clean state
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  },

  async refreshSession() {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error refreshing session:', error);
      throw error;
    }
  }
};

// Re-export types for backward compatibility
export type { SignUpData, SignInData };
