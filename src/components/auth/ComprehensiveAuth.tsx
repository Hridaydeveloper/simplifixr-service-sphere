import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Phone, Eye, EyeOff, User, Briefcase, CheckCircle, Smartphone, AtSign } from "lucide-react";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

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
  const [showPassword, setShowPassword] = useState(false);
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
        await authService.signIn({
          email: formData.email,
          password: formData.password,
        });
        
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

        const result = await authService.signUp({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          location: formData.location,
          role: selectedRole,
        });
        
        if (result.user && !result.user.email_confirmed_at) {
          // Email confirmation required
          setCurrentStep('email-sent');
          toast({
            title: "Confirmation Email Sent",
            description: "Please check your email to confirm your account.",
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
        // Phone or Email OTP flow
        await authService.sendOTP(contact, authMethod, selectedRole);
        setCurrentStep('otp');
        toast({
          title: "OTP Sent",
          description: `We've sent a verification code to your ${authMethod}.`,
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
      const result = await authService.verifyOTP(contactValue, authMethod, otp);
      
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

  const renderEmailSentConfirmation = () => (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
        <p className="text-gray-600 mb-4">
          We've sent a confirmation email to <strong>{formData.email}</strong>
        </p>
        <p className="text-sm text-gray-500">
          Please check your email and click the confirmation link to activate your account.
        </p>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Don't see the email?</strong> Check your spam folder or wait a few minutes for delivery.
        </p>
      </div>

      <Button
        onClick={() => setCurrentStep('credentials')}
        variant="outline"
        className="w-full"
      >
        Try Different Email
      </Button>

      <Button
        onClick={() => onAuthComplete('guest')}
        variant="link"
        className="w-full text-gray-600"
      >
        Continue as Guest
      </Button>
    </div>
  );

  const renderMethodSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#00B896] to-[#00C9A7] bg-clip-text text-transparent mb-3">
          Welcome to Simplifixr
        </h2>
        <p className="text-gray-600">Choose how you'd like to continue</p>
      </div>

      {!role && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-700 text-center">I am a:</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedRole('customer')}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                selectedRole === 'customer'
                  ? 'border-[#00B896] bg-gradient-to-br from-[#00B896]/10 to-[#00C9A7]/10 text-[#00B896] shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <User className="w-8 h-8 mx-auto mb-2" />
              <div className="font-semibold">Customer</div>
              <div className="text-xs text-gray-500 mt-1">Looking for services</div>
            </button>
            <button
              onClick={() => setSelectedRole('provider')}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                selectedRole === 'provider'
                  ? 'border-[#00B896] bg-gradient-to-br from-[#00B896]/10 to-[#00C9A7]/10 text-[#00B896] shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <Briefcase className="w-8 h-8 mx-auto mb-2" />
              <div className="font-semibold">Provider</div>
              <div className="text-xs text-gray-500 mt-1">Offering services</div>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700 text-center">Choose your login method:</p>
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => handleMethodSelect('email')}
            variant="outline"
            className="h-20 flex-col space-y-2 border-2 hover:border-[#00B896] hover:text-[#00B896] hover:bg-[#00B896]/5 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-[#00B896]/10 flex items-center justify-center transition-colors">
              <AtSign className="w-5 h-5" />
            </div>
            <span className="font-semibold">Email</span>
          </Button>
          <Button
            onClick={() => handleMethodSelect('phone')}
            variant="outline"
            className="h-20 flex-col space-y-2 border-2 hover:border-[#00B896] hover:text-[#00B896] hover:bg-[#00B896]/5 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-[#00B896]/10 flex items-center justify-center transition-colors">
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="font-semibold">Phone</span>
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or</span>
        </div>
      </div>

      <Button
        onClick={() => onAuthComplete('guest')}
        variant="ghost"
        className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-50"
      >
        Continue as Guest
      </Button>
    </div>
  );

  const renderCredentialsForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          {authMethod === 'email' ? (
            <AtSign className="w-4 h-4" />
          ) : (
            <Smartphone className="w-4 h-4" />
          )}
          <span>
            {authMethod === 'email' ? 'Email' : 'Phone'} {authMode === 'login' ? 'Login' : 'Signup'}
          </span>
        </div>
      </div>

      <form onSubmit={handleCredentialsSubmit} className="space-y-4">
        {authMode === 'signup' && (
          <>
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="mt-1 border-gray-300 focus:border-[#00B896] focus:ring-[#00B896]"
                required
              />
            </div>
            <div>
              <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location</Label>
              <Input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="City, State"
                className="mt-1 border-gray-300 focus:border-[#00B896] focus:ring-[#00B896]"
              />
            </div>
          </>
        )}

        <div>
          <Label htmlFor="contact" className="text-sm font-medium text-gray-700">
            {authMethod === 'email' ? 'Email Address' : 'Phone Number'}
          </Label>
          <Input
            id="contact"
            type={authMethod === 'email' ? 'email' : 'tel'}
            value={authMethod === 'email' ? formData.email : formData.phone}
            onChange={(e) => handleInputChange(authMethod, e.target.value)}
            placeholder={authMethod === 'email' ? 'Enter your email' : 'Enter 10-digit phone number'}
            className="mt-1 border-gray-300 focus:border-[#00B896] focus:ring-[#00B896]"
            required
          />
        </div>

        {authMethod === 'email' && (
          <>
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="border-gray-300 focus:border-[#00B896] focus:ring-[#00B896] pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-8 w-8"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {authMode === 'signup' && (
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="mt-1 border-gray-300 focus:border-[#00B896] focus:ring-[#00B896]"
                  required
                />
              </div>
            )}
          </>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#00B896] to-[#00C9A7] hover:from-[#00A085] hover:to-[#00B896] text-white font-semibold py-3 transition-all duration-300"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{authMode === 'login' ? 'Signing In...' : 'Creating Account...'}</span>
            </div>
          ) : (
            authMethod === 'email' ? (authMode === 'login' ? 'Sign In' : 'Create Account') : 'Send OTP'
          )}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-gray-600">
          {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
            className="text-[#00B896] hover:text-[#00A085] font-semibold underline-offset-4 hover:underline transition-all"
          >
            {authMode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );

  const renderOTPVerification = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-[#00B896]/10 to-[#00C9A7]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          {authMethod === 'email' ? (
            <Mail className="w-8 h-8 text-[#00B896]" />
          ) : (
            <Phone className="w-8 h-8 text-[#00B896]" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your {authMethod === 'email' ? 'Email' : 'Phone'}</h2>
        <p className="text-gray-600">
          Enter the 6-digit code sent to <span className="font-semibold text-[#00B896]">{contactValue}</span>
        </p>
      </div>

      <form onSubmit={handleOTPVerify} className="space-y-6">
        <div className="flex justify-center">
          <InputOTP
            value={otp}
            onChange={setOtp}
            maxLength={6}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="border-gray-300 focus:border-[#00B896]" />
              <InputOTPSlot index={1} className="border-gray-300 focus:border-[#00B896]" />
              <InputOTPSlot index={2} className="border-gray-300 focus:border-[#00B896]" />
              <InputOTPSlot index={3} className="border-gray-300 focus:border-[#00B896]" />
              <InputOTPSlot index={4} className="border-gray-300 focus:border-[#00B896]" />
              <InputOTPSlot index={5} className="border-gray-300 focus:border-[#00B896]" />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full bg-gradient-to-r from-[#00B896] to-[#00C9A7] hover:from-[#00A085] hover:to-[#00B896] text-white font-semibold py-3 transition-all duration-300 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Verifying...</span>
            </div>
          ) : (
            'Verify OTP'
          )}
        </Button>
      </form>

      <div className="text-center">
        <Button
          variant="link"
          onClick={() => setCurrentStep('credentials')}
          className="text-gray-600 hover:text-[#00B896]"
        >
          Change {authMethod === 'email' ? 'email' : 'phone number'}
        </Button>
      </div>
    </div>
  );

  const renderDetailsForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-[#00B896]/10 to-[#00C9A7]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-[#00B896]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
        <p className="text-gray-600">Just a few more details to get started</p>
      </div>

      <form onSubmit={handleCompleteSignup} className="space-y-4">
        <div>
          <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className="mt-1 border-gray-300 focus:border-[#00B896] focus:ring-[#00B896]"
            required
          />
        </div>
        <div>
          <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location</Label>
          <Input
            id="location"
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="City, State"
            className="mt-1 border-gray-300 focus:border-[#00B896] focus:ring-[#00B896]"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#00B896] to-[#00C9A7] hover:from-[#00A085] hover:to-[#00B896] text-white font-semibold py-3 transition-all duration-300"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Creating Account...</span>
            </div>
          ) : (
            'Complete Signup'
          )}
        </Button>
      </form>
    </div>
  );

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
                onClick={currentStep === 'method' ? onBack : () => {
                  if (currentStep === 'credentials') setCurrentStep('method');
                  else if (currentStep === 'otp') setCurrentStep('credentials');
                  else if (currentStep === 'details') setCurrentStep('otp');
                  else if (currentStep === 'email-sent') setCurrentStep('credentials');
                }}
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
          {currentStep === 'method' && renderMethodSelection()}
          {currentStep === 'credentials' && renderCredentialsForm()}
          {currentStep === 'otp' && renderOTPVerification()}
          {currentStep === 'details' && renderDetailsForm()}
          {currentStep === 'email-sent' && renderEmailSentConfirmation()}
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveAuth;
