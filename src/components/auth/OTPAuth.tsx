
import { useState } from "react";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";

interface OTPAuthProps {
  role: 'customer' | 'provider';
  onBack: () => void;
  onOTPVerified: (contact: string, isExistingUser: boolean) => void;
  onSkip: () => void;
}

const OTPAuth = ({ role, onBack, onOTPVerified, onSkip }: OTPAuthProps) => {
  const [step, setStep] = useState<'contact' | 'otp' | 'forgot'>('contact');
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSendOTP = async () => {
    if (!contact.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email or phone number",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // For demo purposes, we'll use email-based OTP
      await authService.generateOTP(contact);
      setStep('otp');
      toast({
        title: "OTP Sent!",
        description: `Check your console for the OTP code (development mode)`,
      });
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await authService.verifyOTP(contact, otp);
      
      // Check if user exists
      const isExistingUser = await authService.checkUserExists(contact);
      onOTPVerified(contact, isExistingUser);
      
      toast({
        title: "Success",
        description: "OTP verified successfully!",
      });
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast({
        title: "Error",
        description: "Invalid or expired OTP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!contact.trim()) {
      setStep('forgot');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(contact);
      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions",
      });
      setStep('contact');
    } catch (error) {
      console.error('Error sending reset email:', error);
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const roleTitle = role === 'customer' ? "Let's Simplify Your Life" : "Grow with Simplifixr";
  const roleSubtext = role === 'customer' 
    ? "Enter your Phone Number or Email to continue" 
    : "Enter your Phone Number or Email";

  if (step === 'forgot') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Button variant="ghost" size="sm" onClick={() => setStep('contact')} className="w-fit p-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
            <CardTitle className="text-2xl text-center">Forgot Your Password?</CardTitle>
            <p className="text-gray-600 text-center">
              No worries — enter your registered Phone or Email<br />
              We'll send you an OTP to reset it securely.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              placeholder="Phone or Email" 
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            <Button 
              onClick={handleForgotPassword} 
              className="w-full bg-gradient-to-r from-[#00B896] to-[#00C9A7]"
              disabled={loading}
            >
              <Mail className="w-4 h-4 mr-2" />
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Button variant="ghost" size="sm" onClick={() => setStep('contact')} className="w-fit p-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <CardTitle className="text-2xl text-center">Enter OTP</CardTitle>
            <p className="text-gray-600 text-center">
              We've sent a 6-digit code to<br />
              <span className="font-medium">{contact}</span>
            </p>
            <p className="text-sm text-blue-600 text-center">
              (Check console for OTP in development mode)
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <InputOTP value={otp} onChange={setOtp} maxLength={6}>
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
              onClick={handleVerifyOTP} 
              className="w-full bg-gradient-to-r from-[#00B896] to-[#00C9A7]"
              disabled={otp.length !== 6 || loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
            <div className="text-center">
              <Button 
                variant="link" 
                onClick={handleSendOTP}
                disabled={loading}
              >
                Resend OTP
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Button variant="ghost" size="sm" onClick={onBack} className="w-fit p-0">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <CardTitle className="text-2xl text-center">{roleTitle}</CardTitle>
          <p className="text-gray-600 text-center">
            {roleSubtext}<br />
            You'll receive a 6-digit OTP for quick login/sign-up.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            placeholder="Phone Number or Email" 
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            type="email"
          />
          <Button 
            onClick={handleSendOTP} 
            className="w-full bg-gradient-to-r from-[#00B896] to-[#00C9A7]"
            disabled={loading}
          >
            <Mail className="w-4 h-4 mr-2" />
            {loading ? "Sending..." : "Send OTP"}
          </Button>
          
          <div className="text-center space-y-2 text-sm">
            <p>
              Already have an account?{" "}
              <Button variant="link" className="p-0 h-auto text-[#00B896]">
                Login
              </Button>
            </p>
            <p>
              Forgot your password?{" "}
              <Button variant="link" onClick={handleForgotPassword} className="p-0 h-auto text-[#00B896]">
                Reset
              </Button>
            </p>
            <p>
              Just browsing?{" "}
              <Button variant="link" onClick={onSkip} className="p-0 h-auto text-[#00B896]">
                Skip & Explore
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPAuth;
