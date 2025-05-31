
import { useState } from "react";
import { ArrowLeft, Mail, MessageSquare, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/services/authService";
import { toast } from "@/hooks/use-toast";

interface OTPAuthProps {
  role: 'customer' | 'provider';
  onBack: () => void;
  onOTPVerified: (contact: string, isExisting: boolean) => void;
  onSkip: () => void;
}

const OTPAuth = ({ role, onBack, onOTPVerified, onSkip }: OTPAuthProps) => {
  const [step, setStep] = useState<'contact' | 'otp'>('contact');
  const [contactType, setContactType] = useState<'email' | 'phone'>('email');
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!contact.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await authService.generateOTP(contact);
      setStep('otp');
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${contact}. Check console for development OTP.`,
      });
    } catch (error) {
      console.error('OTP generation error:', error);
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      toast({
        title: "Error",
        description: "Please enter the verification code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await authService.verifyOTP(contact, otp);
      const isExisting = await authService.checkUserExists(contact);
      onOTPVerified(contact, isExisting);
    } catch (error) {
      console.error('OTP verification error:', error);
      toast({
        title: "Error",
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkipClick = () => {
    console.log('Skip button clicked');
    onSkip();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <CardTitle className="text-xl">
                Verify Your {contactType === 'email' ? 'Email' : 'Phone'}
              </CardTitle>
            </div>
            <p className="text-sm text-gray-600">
              {step === 'contact' 
                ? `Enter your ${contactType} to continue as a ${role}`
                : `Enter the verification code sent to ${contact}`
              }
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {step === 'contact' ? (
              <>
                <div className="flex space-x-2 mb-4">
                  <Button
                    variant={contactType === 'email' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setContactType('email')}
                    className="flex-1"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    variant={contactType === 'phone' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setContactType('phone')}
                    className="flex-1"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Phone
                  </Button>
                </div>

                <Input
                  type={contactType === 'email' ? 'email' : 'tel'}
                  placeholder={contactType === 'email' ? 'your@email.com' : '+1 (555) 123-4567'}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendOTP()}
                />

                <Button 
                  onClick={handleSendOTP} 
                  disabled={loading || !contact.trim()}
                  className="w-full bg-[#00B896] hover:bg-[#009985]"
                >
                  {loading ? 'Sending...' : 'Send Verification Code'}
                </Button>
              </>
            ) : (
              <>
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleVerifyOTP()}
                  maxLength={6}
                />

                <Button 
                  onClick={handleVerifyOTP} 
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-[#00B896] hover:bg-[#009985]"
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </Button>

                <Button 
                  variant="outline" 
                  onClick={() => setStep('contact')}
                  className="w-full"
                >
                  Change {contactType === 'email' ? 'Email' : 'Phone Number'}
                </Button>
              </>
            )}

            <div className="border-t pt-4">
              <Button 
                variant="outline" 
                onClick={handleSkipClick}
                className="w-full border-gray-300 hover:bg-gray-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                Skip for now → Browse as Guest
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OTPAuth;
