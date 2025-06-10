
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, Clock, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";

interface EmailSentConfirmationProps {
  email: string;
  onTryDifferentEmail: () => void;
  onContinueAsGuest: () => void;
  fullName?: string;
  location?: string;
  role?: 'customer' | 'provider';
}

const EmailSentConfirmation = ({ 
  email, 
  onTryDifferentEmail, 
  onContinueAsGuest,
  fullName,
  location,
  role = 'customer'
}: EmailSentConfirmationProps) => {
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      // Resend the confirmation email
      await authService.signUp({
        email,
        password: Math.random().toString(36).substring(2, 15), // Generate a temporary password
        fullName: fullName || '',
        location: location || '',
        role
      });

      toast({
        title: "Email Resent",
        description: "We've sent another confirmation email to your inbox.",
      });

      // Reset timer
      setResendTimer(60);
      setCanResend(false);
    } catch (error: any) {
      console.error('Error resending email:', error);
      toast({
        variant: "destructive",
        title: "Failed to Resend",
        description: "There was an error sending the email. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
        <p className="text-gray-600 mb-4">
          We've sent a confirmation email to <strong>{email}</strong>
        </p>
        <p className="text-sm text-gray-500">
          Please check your email and click the confirmation link to activate your account.
        </p>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-center mb-2">
          <Mail className="w-5 h-5 text-blue-600 mr-2" />
          <span className="text-sm font-medium text-blue-800">Email Status</span>
        </div>
        <p className="text-sm text-blue-800">
          <strong>Don't see the email?</strong> Check your spam folder or wait a few minutes for delivery.
        </p>
      </div>

      <div className="space-y-3">
        {canResend ? (
          <Button
            onClick={handleResendEmail}
            disabled={isResending}
            className="w-full bg-[#00B896] hover:bg-[#00A085] text-white"
          >
            {isResending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Resending...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Resend Email
              </>
            )}
          </Button>
        ) : (
          <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
            <Clock className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">
              Resend available in {resendTimer} seconds
            </span>
          </div>
        )}

        <Button
          onClick={onTryDifferentEmail}
          variant="outline"
          className="w-full"
        >
          Try Different Email
        </Button>

        <Button
          onClick={onContinueAsGuest}
          variant="link"
          className="w-full text-gray-600"
        >
          Continue as Guest
        </Button>
      </div>
    </div>
  );
};

export default EmailSentConfirmation;
