
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
      
      const otp = generateOTP();
      const expiresAt = getOTPExpiry();

      // Clear any existing OTP for this contact
      const deleteCondition = contactType === 'email' ? { email: contact } : { phone: contact };
      await supabase.from('otp_verifications').delete().match(deleteCondition);

      // Store OTP in database
      const insertData = contactType === 'email' 
        ? { email: contact, phone: null, otp_code: otp, expires_at: expiresAt.toISOString(), verified: false }
        : { email: null, phone: contact, otp_code: otp, expires_at: expiresAt.toISOString(), verified: false };

      const { error: insertError } = await supabase.from('otp_verifications').insert(insertData);
      if (insertError) throw insertError;

      if (contactType === 'email') {
        const { error: emailError } = await supabase.functions.invoke('send-otp-email', {
          body: { email: contact, otp: otp, type: 'login' }
        });
        if (emailError) throw emailError;
      } else {
        console.log(`📱 SMS OTP for ${contact}: ${otp}`);
        console.log(`⏰ Expires at: ${expiresAt.toLocaleString()}`);
      }

      return { success: true, otp };
    } catch (error) {
      console.error('Error in sendOTP:', error);
      throw error;
    }
  },

  async verifyOTP(contact: string, contactType: 'email' | 'phone', otp: string): Promise<VerifyOTPResult> {
    try {
      console.log(`Verifying OTP for ${contactType}: ${contact}, OTP: ${otp}`);

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
        throw new Error('Invalid or expired OTP. Please request a new one.');
      }

      const { error: updateError } = await supabase
        .from('otp_verifications')
        .update({ verified: true })
        .eq('id', otpRecord.id);

      if (updateError) throw updateError;

      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', contactType === 'email' ? contact : `phone:${contact}`)
        .single();

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
        const { error } = await supabase.auth.signInWithOtp({
          email: contact,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: fullName, location: location }
          }
        });
        if (error) throw error;
      } else {
        const tempPassword = Math.random().toString(36).substring(2, 15);
        const { error } = await supabase.auth.signUp({
          email: `${contact.replace(/\D/g, '')}@tempphone.local`,
          password: tempPassword,
          options: {
            data: { full_name: fullName, phone: contact, location: location }
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

  async signInWithOTP(contact: string): Promise<CompleteAuthResult> {
    try {
      console.log('Signing in with OTP for contact:', contact);
      
      if (contact.includes('@')) {
        const { error } = await supabase.auth.signInWithOtp({
          email: contact,
          options: { emailRedirectTo: `${window.location.origin}/` }
        });
        if (error) throw error;
      } else {
        console.log('Phone sign-in completed for:', contact);
      }

      return { success: true };
    } catch (error) {
      console.error('Error in signInWithOTP:', error);
      throw error;
    }
  }
};
