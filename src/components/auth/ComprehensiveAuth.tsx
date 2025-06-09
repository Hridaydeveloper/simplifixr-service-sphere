
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Briefcase } from "lucide-react";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import MethodSelection from "./MethodSelection";
import CredentialsForm from "./CredentialsForm";
import OTPVerification from "./OTPVerification";
import DetailsForm from "./DetailsForm";
import EmailSentConfirmation from "./EmailSentConfirmation";

interface ComprehensiveAuthProps {
  role?: 'customer' | 'provider';
  onBack?: () => void;
  onAuthComplete: (role: 'customer' | 'provider' | 'guest') => void;
  fromBooking?: boolean;
}

type AuthMethod = 'email' | 'phone';
type AuthMode = 'login' | 'signup';
type AuthStep = 'method' | 'credentials' | 'otp' | 'details' | 'email-sent';

const ComprehensiveAuth = ({ role, onBack, onAuthComplete, fromBooking }: ComprehensiveAuthProps) => {
  const [selectedRole, setSelectedRole] = useState<'customer' | 'provider'>(role || 'customer');
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [currentStep, setCurrentStep] = useState<AuthStep>('method');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [contactValue, setContactValue] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    fullName: '',
    location: '',
    confirmPassword: ''
  });

  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'email' || field === 'phone') {
      setContactValue(value);
    }
  };

  const validateInput = () => {
    if (authMethod === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast({
          variant: "destructive",
          title: "Invalid Email",
          description: "Please enter a valid email address.",
        });
        return false;
      }
    } else {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(formData.phone)) {
        toast({
          variant: "destructive",
          title: "Invalid Phone",
          description: "Please enter a valid 10-digit phone number.",
        });
        return false;
      }
    }
    return true;
  };

  const handleMethodSelect = (method: AuthMethod) => {
    setAuthMethod(method);
    setCurrentStep('credentials');
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInput()) return;

    setLoading(true);
    const contact = authMethod === 'email' ? formData.email : formData.phone;
    setContactValue(contact);

    try {
      if (authMethod === 'email' && authMode === 'login') {
        // Email login with password
        const result = await authService.signIn({
          email: formData.email,
          password: formData.password,
        });
        
        console.log('Email login result:', result);
        
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        
        onAuthComplete(selectedRole);
      } else if (authMethod === 'email' && authMode === 'signup') {
        // Email signup with password
        if (formData.password !== formData.confirmPassword) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Passwords do not match.",
          });
          return;
        }

        if (formData.password.length < 6) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Password must be at least 6 characters long.",
          });
          return;
        }

        console.log('Starting email signup process...');
        
        const result = await authService.signUp({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          location: formData.location,
          role: selectedRole,
        });
        
        console.log('Email signup result:', result);
        
        if (result.user && !result.user.email_confirmed_at) {
          // Email confirmation required
          setCurrentStep('email-sent');
          toast({
            title: "Confirmation Email Sent",
            description: `Please check your email (${formData.email}) to confirm your account.`,
          });
        } else {
          // Account created and confirmed
          toast({
            title: "Account Created",
            description: "Welcome to Simplifixr!",
          });
          onAuthComplete(selectedRole);
        }
      } else {
        // Phone OTP flow
        console.log('Starting phone OTP flow...');
        const result = await authService.sendOTP(contact, authMethod, selectedRole);
        console.log('OTP sent result:', result);
        
        setCurrentStep('otp');
        toast({
          title: "OTP Sent",
          description: `We've sent a verification code to your ${authMethod}. ${authMethod === 'phone' ? 'Check the console for the OTP code.' : ''}`,
        });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred during authentication.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit code.",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Verifying OTP...');
      const result = await authService.verifyOTP(contactValue, authMethod, otp);
      console.log('OTP verification result:', result);
      
      if (result.userExists) {
        // User exists, log them in
        await authService.completeOTPAuth(contactValue, authMethod);
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        
        onAuthComplete(selectedRole);
      } else {
        // New user, need more details
        setCurrentStep('details');
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error.message || "Invalid or expired OTP. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Completing signup...');
      await authService.completeOTPAuth(contactValue, authMethod, formData.fullName, formData.location);
      toast({
        title: "Account Created",
        description: "Welcome to Simplifixr!",
      });
      
      onAuthComplete(selectedRole);
    } catch (error: any) {
      console.error('Signup completion error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to complete signup.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackNavigation = () => {
    if (currentStep === 'method') {
      onBack?.();
    } else if (currentStep === 'credentials') {
      setCurrentStep('method');
    } else if (currentStep === 'otp') {
      setCurrentStep('credentials');
    } else if (currentStep === 'details') {
      setCurrentStep('otp');
    } else if (currentStep === 'email-sent') {
      setCurrentStep('credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00B896]/5 via-white to-[#00C9A7]/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          {/* Header with back button */}
          <div className="flex items-center mb-6">
            {(onBack || currentStep !== 'method') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackNavigation}
                className="mr-3 p-1 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                selectedRole === 'customer' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-orange-100 text-orange-600'
              }`}>
                {selectedRole === 'customer' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Briefcase className="w-4 h-4" />
                )}
              </div>
              <span className="text-lg font-semibold text-gray-900 capitalize">
                {selectedRole}
              </span>
            </div>
          </div>

          {/* Content based on current step */}
          {currentStep === 'method' && (
            <MethodSelection
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
              onMethodSelect={handleMethodSelect}
              onAuthComplete={onAuthComplete}
              role={role}
            />
          )}
          
          {currentStep === 'credentials' && (
            <CredentialsForm
              authMethod={authMethod}
              authMode={authMode}
              formData={formData}
              loading={loading}
              onInputChange={handleInputChange}
              onSubmit={handleCredentialsSubmit}
              onModeChange={setAuthMode}
            />
          )}
          
          {currentStep === 'otp' && (
            <OTPVerification
              authMethod={authMethod}
              contactValue={contactValue}
              otp={otp}
              loading={loading}
              onOTPChange={setOtp}
              onSubmit={handleOTPVerify}
              onChangeContact={() => setCurrentStep('credentials')}
            />
          )}
          
          {currentStep === 'details' && (
            <DetailsForm
              formData={formData}
              loading={loading}
              onInputChange={handleInputChange}
              onSubmit={handleCompleteSignup}
            />
          )}
          
          {currentStep === 'email-sent' && (
            <EmailSentConfirmation
              email={formData.email}
              onTryDifferentEmail={() => setCurrentStep('credentials')}
              onContinueAsGuest={() => onAuthComplete('guest')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveAuth;
