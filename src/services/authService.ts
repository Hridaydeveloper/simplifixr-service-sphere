
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

export interface OTPVerificationData {
  contact: string;
  contactType: 'email' | 'phone';
  role: 'customer' | 'provider';
}

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

  async sendOTP(contact: string, contactType: 'email' | 'phone', role: 'customer' | 'provider') {
    try {
      console.log(`Sending OTP to ${contactType}: ${contact}`);
      
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Clear any existing OTP for this contact
      if (contactType === 'email') {
        await supabase
          .from('otp_verifications')
          .delete()
          .eq('email', contact);
      } else {
        await supabase
          .from('otp_verifications')
          .delete()
          .eq('phone', contact);
      }

      // Store OTP in database
      const { error: insertError } = await supabase
        .from('otp_verifications')
        .insert({
          [contactType]: contact,
          otp_code: otp,
          expires_at: expiresAt.toISOString(),
          user_role: role,
          verified: false
        });

      if (insertError) {
        console.error('Error storing OTP:', insertError);
        throw insertError;
      }

      if (contactType === 'email') {
        // Send email OTP using Resend
        const { error: emailError } = await supabase.functions.invoke('send-otp-email', {
          body: {
            email: contact,
            otp: otp,
            type: 'login'
          }
        });

        if (emailError) {
          console.error('Error sending email OTP:', emailError);
          throw emailError;
        }
      } else {
        // For phone OTP, log to console for development
        console.log(`📱 SMS OTP for ${contact}: ${otp}`);
        console.log(`⏰ Expires at: ${expiresAt.toLocaleString()}`);
      }

      return { success: true, otp }; // Return OTP for development logging
    } catch (error) {
      console.error('Error in sendOTP:', error);
      throw error;
    }
  },

  async verifyOTP(contact: string, contactType: 'email' | 'phone', otp: string) {
    try {
      console.log(`Verifying OTP for ${contactType}: ${contact}, OTP: ${otp}`);

      // Find valid OTP
      const { data: otpRecord, error: findError } = await supabase
        .from('otp_verifications')
        .select('*')
        .eq(contactType, contact)
        .eq('otp_code', otp)
        .eq('verified', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (findError || !otpRecord) {
        console.error('Invalid or expired OTP:', findError);
        throw new Error('Invalid or expired OTP. Please request a new one.');
      }

      // Mark OTP as verified
      const { error: updateError } = await supabase
        .from('otp_verifications')
        .update({ verified: true })
        .eq('id', otpRecord.id);

      if (updateError) {
        console.error('Error updating OTP:', updateError);
        throw updateError;
      }

      // Check if user already exists in profiles
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', contactType === 'email' ? contact : `phone:${contact}`)
        .single();

      console.log('OTP verified successfully. User exists:', !!existingProfile);
      return {
        verified: true,
        userExists: !!existingProfile,
        role: otpRecord.user_role,
        contact,
        contactType
      };
    } catch (error) {
      console.error('Error in verifyOTP:', error);
      throw error;
    }
  },

  async completeOTPAuth(contact: string, contactType: 'email' | 'phone', fullName?: string, location?: string) {
    try {
      console.log(`Completing OTP auth for ${contactType}: ${contact}`);

      // Clean up auth state first
      await this.cleanupAuthState();

      if (contactType === 'email') {
        // For email, use magic link
        const { error } = await supabase.auth.signInWithOtp({
          email: contact,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: fullName,
              location: location
            }
          }
        });

        if (error) throw error;
      } else {
        // For phone, create a temporary user (you might want to implement proper phone auth)
        const tempPassword = Math.random().toString(36).substring(2, 15);
        const { data, error } = await supabase.auth.signUp({
          email: `${contact.replace(/\D/g, '')}@tempphone.local`,
          password: tempPassword,
          options: {
            data: {
              full_name: fullName,
              phone: contact,
              location: location
            }
          }
        });

        if (error) throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error in completeOTPAuth:', error);
      throw error;
    }
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
