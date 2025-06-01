
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, User, Briefcase } from "lucide-react";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

interface OTPAuthProps {
  role: 'customer' | 'provider';
  onBack?: () => void;
  onOTPVerified: (contact: string, isExisting: boolean) => void;
  onSkip?: () => void;
}

const OTPAuth = ({ role, onBack, onOTPVerified, onSkip }: OTPAuthProps) => {
  const [step, setStep] = useState<'contact' | 'otp'>('contact');
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async () => {
    setLoading(true);
    try {
      await authService.sendOTP(contact, role);
      setStep('otp');
      setCountdown(60); // Set countdown timer to 60 seconds
      toast({
        title: "OTP Sent",
        description: `OTP sent to ${contact}. Please check your messages.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send OTP.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const isExistingUser = await authService.verifyOTP(contact, otp);
      toast({
        title: "OTP Verified",
        description: "Your OTP has been successfully verified.",
      });
      onOTPVerified(contact, isExistingUser);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to verify OTP.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    if (step === 'otp') {
      setStep('contact');
      setOtp('');
    } else if (onBack) {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00B896]/5 to-[#00C9A7]/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header with back button */}
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackClick}
              className="mr-3 p-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center">
              {role === 'customer' ? (
                <User className="w-6 h-6 text-[#00B896] mr-2" />
              ) : (
                <Briefcase className="w-6 h-6 text-[#00B896] mr-2" />
              )}
              <h2 className="text-2xl font-bold text-gray-900">
                {role === 'customer' ? 'Customer' : 'Provider'} {step === 'contact' ? 'Login' : 'Verification'}
              </h2>
            </div>
          </div>

          {step === 'contact' ? (
            <>
              <p className="text-gray-600 mb-6">
                Enter your phone number to receive an OTP for verification.
              </p>
              <Input
                type="tel"
                placeholder="Phone Number"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="mb-4"
              />
              <Button
                onClick={handleSendOTP}
                disabled={loading || !contact}
                className="w-full bg-[#00B896] hover:bg-[#00A085] text-white"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
              {onSkip && (
                <Button
                  variant="link"
                  onClick={onSkip}
                  className="w-full mt-2"
                >
                  Skip to Guest Mode
                </Button>
              )}
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                Enter the OTP sent to {contact} to verify your account.
                {countdown > 0 && (
                  <span className="ml-2 text-sm text-gray-500">
                    Resend OTP in {countdown}s
                  </span>
                )}
              </p>
              <Input
                type="text"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mb-4"
              />
              <Button
                onClick={handleVerifyOTP}
                disabled={loading || !otp}
                className="w-full bg-[#00B896] hover:bg-[#00A085] text-white"
              >
                {loading ? 'Verifying OTP...' : 'Verify OTP'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPAuth;
