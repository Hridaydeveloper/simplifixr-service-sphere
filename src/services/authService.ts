
import { supabase } from '@/integrations/supabase/client';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  location?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface OTPData {
  email: string;
  otp: string;
}

export const authService = {
  async signUp(data: SignUpData) {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          location: data.location,
        }
      }
    });

    if (error) throw error;
    return authData;
  },

  async signIn(data: SignInData) {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) throw error;
    return authData;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  async generateOTP(email: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const { error } = await (supabase as any)
      .from('otp_verifications')
      .insert({
        email,
        otp_code: otp,
        expires_at: expiresAt.toISOString(),
      });

    if (error) throw error;
    
    // In a real app, you would send this OTP via email
    console.log(`OTP for ${email}: ${otp}`);
    return otp;
  },

  async verifyOTP(email: string, otp: string) {
    const { data, error } = await (supabase as any)
      .from('otp_verifications')
      .select('*')
      .eq('email', email)
      .eq('otp_code', otp)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !data) {
      throw new Error('Invalid or expired OTP');
    }

    // Mark OTP as verified
    await (supabase as any)
      .from('otp_verifications')
      .update({ verified: true })
      .eq('id', data.id);

    return true;
  }
};
