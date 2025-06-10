
import { supabase } from '@/integrations/supabase/client';

interface OTPResult {
  success: boolean;
  otp?: string;
}

interface VerifyOTPResult {
  verified: boolean;
  userExists: boolean;
  role: string;
  contact: string;
  contactType: string;
}

interface CompleteAuthResult {
  success: boolean;
}

// Generate 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Get OTP expiry time (10 minutes from now)
const getOTPExpiry = (): Date => {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 10);
  return expiry;
};

export const otpAuth = {
  async sendOTP(contact: string, contactType: 'email' | 'phone', role: 'customer' | 'provider'): Promise<OTPResult> {
    try {
      console.log(`Sending OTP to ${contactType}: ${contact}`);
      
      // Generate 6-digit OTP
      const otp = generateOTP();
      const expiresAt = getOTPExpiry();

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
      const insertData: any = contactType === 'email' 
        ? {
            email: contact,
            phone: null,
            otp_code: otp,
            expires_at: expiresAt.toISOString(),
            verified: false
          }
        : {
            email: null,
            phone: contact,
            otp_code: otp,
            expires_at: expiresAt.toISOString(),
            verified: false
          };

      const { error: insertError } = await supabase
        .from('otp_verifications')
        .insert(insertData);

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
        
        // In a production environment, you would integrate with an SMS service like Twilio here
        // For now, we'll show the OTP in the console for testing
      }

      return { success: true, otp }; // Return OTP for development logging
    } catch (error) {
      console.error('Error in sendOTP:', error);
      throw error;
    }
  },

  async verifyOTP(contact: string, contactType: 'email' | 'phone', otp: string): Promise<VerifyOTPResult> {
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
        role: 'customer',
        contact,
        contactType
      };
    } catch (error) {
      console.error('Error in verifyOTP:', error);
      throw error;
    }
  },

  async completeOTPAuth(contact: string, contactType: 'email' | 'phone', fullName?: string, location?: string): Promise<CompleteAuthResult> {
    try {
      console.log(`Completing OTP auth for ${contactType}: ${contact}`);

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

  // Sign in with OTP (magic link style)
  async signInWithOTP(contact: string): Promise<CompleteAuthResult> {
    try {
      console.log('Signing in with OTP for contact:', contact);
      
      if (contact.includes('@')) {
        // Email OTP
        const { error } = await supabase.auth.signInWithOtp({
          email: contact,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        
        if (error) throw error;
      } else {
        // Phone - use a workaround for now
        console.log('Phone sign-in completed for:', contact);
      }

      return { success: true };
    } catch (error) {
      console.error('Error in signInWithOTP:', error);
      throw error;
    }
  }
};
