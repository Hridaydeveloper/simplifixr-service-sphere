import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Phone, Eye, EyeOff, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { otpAuth } from "@/services/auth/otpAuth";

interface UnifiedAuthProps {
  onBack?: () => void;
  onSuccess: (role: 'customer' | 'provider') => void;
}

type AuthMethod = 'email' | 'phone';
type AuthStep = 'method' | 'credentials' | 'verification' | 'details';

const UnifiedAuth = ({ onBack, onSuccess }: UnifiedAuthProps) => {
  const [step, setStep] = useState<AuthStep>('method');
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({
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

          // User exists and signed in successfully
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in."
          });
          onSuccess('customer');
        } catch (signInError: any) {
          if (signInError.message?.includes('Invalid login credentials')) {
            // User doesn't exist, proceed with sign up
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
          // Complete sign in
          await otpAuth.signInWithOTP(contact);
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in."
          });
          onSuccess('customer');
        } else {
          // New user, go to details step
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

  const renderMethodSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Choose verification method</h3>
        <p className="text-gray-600 text-sm">How would you like to sign in?</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <Button
          onClick={() => handleMethodSelect('email')}
          variant="outline"
          className="h-16 flex-col space-y-2 border-2 hover:border-primary hover:text-primary"
        >
          <Mail className="w-6 h-6" />
          <span className="font-semibold">Email Address</span>
        </Button>
        
        <Button
          onClick={() => handleMethodSelect('phone')}
          variant="outline"
          className="h-16 flex-col space-y-2 border-2 hover:border-primary hover:text-primary"
        >
          <Phone className="w-6 h-6" />
          <span className="font-semibold">Phone Number</span>
        </Button>
      </div>
    </div>
  );

  const renderCredentialsForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={authMethod}>
          {authMethod === 'email' ? 'Email Address' : 'Phone Number'} *
        </Label>
        <Input
          id={authMethod}
          type={authMethod === 'email' ? 'email' : 'tel'}
          placeholder={authMethod === 'email' ? 'Enter your email' : 'Enter your phone number'}
          value={authMethod === 'email' ? formData.email : formData.phone}
          onChange={(e) => handleInputChange(authMethod, e.target.value)}
          required
        />
      </div>

      {authMethod === 'email' && (
        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              minLength={6}
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
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Processing...' : (authMethod === 'email' ? 'Continue' : 'Send OTP')}
      </Button>

      <div className="text-center">
        <Button
          type="button"
          variant="link"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-primary hover:text-primary/80"
        >
          {isSignUp 
            ? "Already have an account? Sign in" 
            : "Don't have an account? Sign up"
          }
        </Button>
      </div>
    </form>
  );

  const renderVerificationForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Enter verification code</h3>
        <p className="text-gray-600 text-sm">
          We sent a code to {formData.phone}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Verification Code</Label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full"
        >
          {loading ? 'Verifying...' : 'Verify Code'}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => handlePhoneAuth()}
          disabled={loading}
          className="w-full"
        >
          Resend Code
        </Button>
      </form>
    </div>
  );

  const renderDetailsForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Complete your profile</h3>
        <p className="text-gray-600 text-sm">
          {authMethod === 'email' ? 'Email verified!' : 'Phone verified!'} Tell us a bit about yourself.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            type="text"
            placeholder="City, State"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Creating Account...' : 'Complete Registration'}
        </Button>
      </form>
    </div>
  );

  const renderEmailSent = () => (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
        <Mail className="w-8 h-8 text-blue-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Check your email</h3>
        <p className="text-gray-600 text-sm">
          We've sent a confirmation link to <strong>{formData.email}</strong>
        </p>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs text-blue-800">
          Click the link in your email to verify your account and complete the registration.
        </p>
      </div>

      <Button
        onClick={() => setVerificationSent(false)}
        variant="outline"
        className="w-full"
      >
        Change Email Address
      </Button>
    </div>
  );

  const getTitle = () => {
    switch (step) {
      case 'method': return 'Sign In';
      case 'credentials': return isSignUp ? 'Create Account' : 'Welcome Back';
      case 'verification': return 'Verify Phone';
      case 'details': return 'Complete Profile';
      default: return 'Sign In';
    }
  };

  const canGoBack = () => {
    return step !== 'method' || !!onBack;
  };

  const handleBackClick = () => {
    if (step === 'credentials') {
      setStep('method');
    } else if (step === 'verification') {
      setStep('credentials');
    } else if (step === 'details') {
      if (authMethod === 'phone') {
        setStep('verification');
      } else {
        setStep('credentials');
      }
    } else if (onBack) {
      onBack();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            {getTitle()}
          </CardTitle>
          {canGoBack() && (
            <Button variant="ghost" size="sm" onClick={handleBackClick}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {verificationSent && authMethod === 'email' ? renderEmailSent() :
         step === 'method' ? renderMethodSelection() :
         step === 'credentials' ? renderCredentialsForm() :
         step === 'verification' ? renderVerificationForm() :
         step === 'details' ? renderDetailsForm() :
         null}
      </CardContent>
    </Card>
  );
};

export default UnifiedAuth;