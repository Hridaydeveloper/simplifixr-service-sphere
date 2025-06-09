
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

  // Traditional email/password sign up
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
            role: data.role
          }
        }
      });

      if (error) throw error;

      // If user is created but not confirmed, send custom confirmation email
      if (authData.user && !authData.user.email_confirmed_at) {
        try {
          console.log('Sending custom confirmation email...');
          
          // Use the proper confirmation URL format that Supabase expects
          const confirmationUrl = `${window.location.origin}/auth/confirm`;
          
          await supabase.functions.invoke('send-confirmation-email', {
            body: {
              email: data.email,
              confirmationUrl: confirmationUrl,
              fullName: data.fullName
            }
          });
          
          console.log('Custom confirmation email sent successfully');
        } catch (emailError) {
          console.error('Error sending custom confirmation email:', emailError);
          // Don't throw here - the user was still created successfully
        }
      }

      return authData;
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
    }
  }
};
