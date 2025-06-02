
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
      // First, sign up the user
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

      if (signUpError) throw signUpError;

      // If signup is successful, send custom confirmation email
      if (authData.user && !authData.user.email_confirmed_at) {
        try {
          const confirmationUrl = `${window.location.origin}/auth/confirm?token=${authData.user.id}`;
          
          const { data: emailResult, error: emailError } = await supabase.functions.invoke('send-confirmation-email', {
            body: {
              email: data.email,
              confirmationUrl: confirmationUrl,
              fullName: data.fullName
            }
          });

          if (emailError) {
            console.error('Failed to send confirmation email:', emailError);
            // Don't throw error here, user is still created
          } else {
            console.log('Confirmation email sent successfully');
          }
        } catch (emailError) {
          console.error('Error sending confirmation email:', emailError);
          // Don't throw error here, user is still created
        }
      }

      return authData;
    } catch (error) {
      throw error;
    }
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
  }
};
