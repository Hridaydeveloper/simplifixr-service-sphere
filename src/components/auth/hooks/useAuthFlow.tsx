import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { otpAuth } from "@/services/auth/otpAuth";

type AuthMethod = 'email' | 'phone';
type AuthStep = 'method' | 'credentials' | 'verification' | 'details';

interface FormData {
  email: string;
  phone: string;
  password: string;
  fullName: string;
  location: string;
}

export const useAuthFlow = (onSuccess: (role: 'customer' | 'provider') => void) => {
  const [step, setStep] = useState<AuthStep>('method');
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    phone: '',
    password: '',
    fullName: '',
    location: ''
  });

  const { signIn } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMethodSelect = (method: AuthMethod) => {
    setAuthMethod(method);
    setStep('credentials');
  };

  const handleEmailAuth = async () => {
    try {
      if (isSignUp) {
        try {
          await signIn({
            email: formData.email,
            password: formData.password
          });

          toast({
            title: "Welcome back!",
            description: "You have successfully signed in."
          });
          onSuccess('customer');
        } catch (signInError: any) {
          if (signInError.message?.includes('Invalid login credentials')) {
            setStep('details');
            return;
          }
          throw signInError;
        }
      } else {
        await signIn({
          email: formData.email,
          password: formData.password
        });

        toast({
          title: "Welcome back!",
          description: "You have successfully signed in."
        });
        onSuccess('customer');
      }
    } catch (error: any) {
      console.error('Email auth error:', error);
      toast({
        title: "Authentication Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive"
      });
    }
  };

  const handleSignUp = async () => {
    try {
      await authService.signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        location: formData.location,
        role: 'customer'
      });

      setVerificationSent(true);
      toast({
        title: "Please check your email",
        description: `We've sent a confirmation link to ${formData.email}`,
      });
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      if (error.message?.includes('already registered')) {
        toast({
          title: "Account exists",
          description: "This email is already registered. Try signing in instead.",
          variant: "destructive"
        });
        setIsSignUp(false);
        setStep('credentials');
        return;
      }
      
      toast({
        title: "Sign Up Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePhoneAuth = async () => {
    try {
      await otpAuth.sendOTP(formData.phone, 'phone', 'customer');
      setVerificationSent(true);
      setStep('verification');
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${formData.phone}`,
      });
    } catch (error: any) {
      console.error('Phone auth error:', error);
      toast({
        title: "Failed to send OTP",
        description: error.message || "Please check your phone number and try again.",
        variant: "destructive"
      });
    }
  };

  const handleOTPVerification = async () => {
    try {
      const contact = authMethod === 'email' ? formData.email : formData.phone;
      const result = await otpAuth.verifyOTP(contact, authMethod, otp);
      
      if (result.verified) {
        if (result.userExists) {
          await otpAuth.signInWithOTP(contact);
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in."
          });
          onSuccess('customer');
        } else {
          setStep('details');
        }
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid or expired OTP code.",
        variant: "destructive"
      });
    }
  };

  const handleCompleteSignUp = async () => {
    try {
      const contact = authMethod === 'email' ? formData.email : formData.phone;
      await otpAuth.completeOTPAuth(contact, authMethod, formData.fullName, formData.location);
      
      toast({
        title: "Account created successfully!",
        description: "Welcome to Simplifixr!"
      });
      onSuccess('customer');
    } catch (error: any) {
      console.error('Complete sign up error:', error);
      toast({
        title: "Account Creation Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (step === 'credentials') {
        if (authMethod === 'email') {
          await handleEmailAuth();
        } else {
          await handlePhoneAuth();
        }
      } else if (step === 'verification') {
        await handleOTPVerification();
      } else if (step === 'details') {
        if (authMethod === 'email') {
          await handleSignUp();
        } else {
          await handleCompleteSignUp();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    setStep,
    authMethod,
    isSignUp,
    setIsSignUp,
    loading,
    verificationSent,
    setVerificationSent,
    otp,
    setOtp,
    formData,
    handleInputChange,
    handleMethodSelect,
    handlePhoneAuth,
    handleSubmit
  };
};