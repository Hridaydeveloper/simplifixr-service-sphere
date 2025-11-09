
import { supabase } from '@/integrations/supabase/client';
import type { SignUpData, SignInData } from './types';

export const emailPasswordAuth = {
  // Traditional email/password sign in
  async signIn(data: SignInData) {
    try {
      console.log('Signing in with email:', data.email);
      
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      return authData;
    } catch (error) {
      console.error('Error in signIn:', error);
      throw error;
    }
  },

  // Traditional email/password sign up (no email verification required)
  async signUp(data: SignUpData) {
    try {
      console.log('Signing up with email:', data.email);
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          data: {
            full_name: data.fullName,
            location: data.location,
            role: data.role || 'customer'
          }
        }
      });

      if (error) {
        // Check for duplicate email error
        if (error.message.includes('already') || error.message.includes('registered') || error.status === 422) {
          throw new Error('Email already exists, try a new one.');
        }
        throw error;
      }

      // Auto sign-in after successful signup
      if (authData.user) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        
        if (signInError) {
          console.error('Auto sign-in error:', signInError);
        }
      }

      return authData;
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
    }
  }
};
