import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Phone, Eye, EyeOff, User, Briefcase, CheckCircle } from "lucide-react";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  
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
        const authData = await authService.signIn({
          email: formData.email,
          password: formData.password,
        });
        
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });

        // Redirect based on user role
        const userRole = authData.user?.user_metadata?.role || selectedRole;
        setTimeout(() => {
          if (userRole === 'provider') {
            navigate('/become-provider');
          } else {
            navigate('/services');
          }
        }, 1000);
        
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

        const authData = await authService.signUp({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          location: formData.location,
          role: selectedRole,
        });
        
        setCurrentStep('email-sent');
        toast({
          title: "Account Created",
          description: "Please check your email to verify your account.",
        });
      } else {
        // Phone or Email OTP flow
        await authService.sendOTP(contact, selectedRole);
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
      const userExists = await authService.verifyOTP(contactValue, otp);
      
      if (userExists) {
        // User exists, log them in
        await authService.signInWithOTP(contactValue);
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        
        // Redirect based on role
        setTimeout(() => {
          if (selectedRole === 'provider') {
            navigate('/become-provider');
          } else {
            navigate('/services');
          }
        }, 1000);
        
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
      await authService.signInWithOTP(contactValue);
      toast({
        title: "Account Created",
        description: "Welcome to Simplifixr!",
      });
      
      // Redirect based on role
      setTimeout(() => {
        if (selectedRole === 'provider') {
          navigate('/become-provider');
        } else {
          navigate('/services');
        }
      }, 1000);
      
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
        <CheckCircle className="w-16 h-16 text-green-500" />
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Simplifixr</h2>
        <p className="text-gray-600">Choose your authentication method</p>
      </div>

      {!role && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">I am a:</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedRole('customer')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedRole === 'customer'
                  ? 'border-[#00B896] bg-[#00B896]/5 text-[#00B896]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <User className="w-6 h-6 mx-auto mb-2" />
              <div className="font-medium">Customer</div>
              <div className="text-xs text-gray-500">Looking for services</div>
            </button>
            <button
              onClick={() => setSelectedRole('provider')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedRole === 'provider'
                  ? 'border-[#00B896] bg-[#00B896]/5 text-[#00B896]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Briefcase className="w-6 h-6 mx-auto mb-2" />
              <div className="font-medium">Provider</div>
              <div className="text-xs text-gray-500">Offering services</div>
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => handleMethodSelect('email')}
          variant="outline"
          className="h-16 flex-col space-y-2 border-2 hover:border-[#00B896] hover:text-[#00B896]"
        >
          <Mail className="w-6 h-6" />
          <span className="font-medium">Email</span>
        </Button>
        <Button
          onClick={() => handleMethodSelect('phone')}
          variant="outline"
          className="h-16 flex-col space-y-2 border-2 hover:border-[#00B896] hover:text-[#00B896]"
        >
          <Phone className="w-6 h-6" />
          <span className="font-medium">Phone</span>
        </Button>
      </div>

      <Button
        onClick={() => onAuthComplete('guest')}
        variant="link"
        className="w-full text-gray-600"
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
        <p className="text-gray-600">
          {authMethod === 'email' ? 'Email' : 'Phone'} {authMode === 'login' ? 'Login' : 'Signup'}
        </p>
      </div>

      <form onSubmit={handleCredentialsSubmit} className="space-y-4">
        {authMode === 'signup' && (
          <>
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="City, State"
              />
            </div>
          </>
        )}

        <div>
          <Label htmlFor="contact">
            {authMethod === 'email' ? 'Email Address' : 'Phone Number'}
          </Label>
          <Input
            id="contact"
            type={authMethod === 'email' ? 'email' : 'tel'}
            value={authMethod === 'email' ? formData.email : formData.phone}
            onChange={(e) => handleInputChange(authMethod, e.target.value)}
            placeholder={authMethod === 'email' ? 'Enter your email' : 'Enter 10-digit phone number'}
            required
          />
        </div>

        {authMethod === 'email' && (
          <>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {authMode === 'signup' && (
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                />
              </div>
            )}
          </>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#00B896] hover:bg-[#00A085] text-white"
        >
          {loading ? (
            authMode === 'login' ? 'Signing In...' : 'Creating Account...'
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
            className="text-[#00B896] hover:underline font-medium"
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your {authMethod === 'email' ? 'Email' : 'Phone'}</h2>
        <p className="text-gray-600">
          Enter the 6-digit code sent to {contactValue}
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
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full bg-[#00B896] hover:bg-[#00A085] text-white"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Button>
      </form>

      <div className="text-center">
        <Button
          variant="link"
          onClick={() => setCurrentStep('credentials')}
          className="text-gray-600"
        >
          Change {authMethod === 'email' ? 'email' : 'phone number'}
        </Button>
      </div>
    </div>
  );

  const renderDetailsForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
        <p className="text-gray-600">Just a few more details to get started</p>
      </div>

      <form onSubmit={handleCompleteSignup} className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="City, State"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#00B896] hover:bg-[#00A085] text-white"
        >
          {loading ? 'Creating Account...' : 'Complete Signup'}
        </Button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00B896]/5 to-[#00C9A7]/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
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
                className="mr-3 p-1"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div className="flex items-center">
              {selectedRole === 'customer' ? (
                <User className="w-6 h-6 text-[#00B896] mr-2" />
              ) : (
                <Briefcase className="w-6 h-6 text-[#00B896] mr-2" />
              )}
              <span className="text-lg font-semibold text-gray-900">
                {selectedRole === 'customer' ? 'Customer' : 'Provider'}
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
