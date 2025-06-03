
import { supabase } from '@/integrations/supabase/client';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  location?: string;
  role?: 'customer' | 'provider';
}

export interface SignInData {
  email: string;
  password: string;
}

export const authService = {
  async signUp(data: SignUpData) {
    try {
      console.log('Starting signup process for:', data.email);
      
      // Create the user with email confirmation disabled for easier testing
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            location: data.location,
            role: data.role,
          }
        }
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        throw signUpError;
      }

      console.log('Signup successful:', authData);
      return authData;
    } catch (error) {
      console.error('SignUp error:', error);
      throw error;
    }
  },

  async signIn(data: SignInData) {
    try {
      console.log('Signing in user:', data.email);
      
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error('SignIn error:', error);
        throw error;
      }

      console.log('SignIn successful:', authData.user?.email);
      return authData;
    } catch (error) {
      console.error('SignIn error:', error);
      throw error;
    }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async resetPassword(email: string) {
    const redirectUrl = `${window.location.origin}/auth/reset-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });
    if (error) throw error;
  },

  async sendOTP(contact: string, role: 'customer' | 'provider') {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const { error } = await supabase
      .from('otp_verifications')
      .insert({
        email: contact,
        otp_code: otp,
        expires_at: expiresAt.toISOString(),
      });

    if (error) throw error;
    
    // For development, log the OTP to console
    console.log(`🔐 OTP for ${contact}: ${otp}`);
    console.log(`⏰ Expires at: ${expiresAt.toLocaleString()}`);
    
    return otp;
  },

  async verifyOTP(contact: string, otp: string) {
    const { data, error } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('email', contact)
      .eq('otp_code', otp)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !data) {
      throw new Error('Invalid or expired OTP');
    }

    // Mark OTP as verified
    await supabase
      .from('otp_verifications')
      .update({ verified: true })
      .eq('id', data.id);

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', contact)
      .single();

    return !!existingUser;
  },

  async checkUserExists(email: string) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', email)
      .single();

    return !!profile;
  },

  async signInWithOTP(email: string) {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: redirectUrl
      }
    });

    if (error) throw error;
  },

  async refreshSession() {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return data;
  }
};
