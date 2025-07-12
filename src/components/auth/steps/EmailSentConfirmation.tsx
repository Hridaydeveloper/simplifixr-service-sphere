import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, Clock, RefreshCw, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
interface EmailSentConfirmationProps {
  email: string;
  onChangeEmail: () => void;
}
export const EmailSentConfirmation = ({
  email,
  onChangeEmail
}: EmailSentConfirmationProps) => {
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
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
  const handleResend = () => {
    // Reset timer when resending
    setResendTimer(60);
    setCanResend(false);
    // TODO: Implement resend logic
  };
  return <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">
            ✓
          </div>
          <span className="ml-2 text-sm font-medium text-green-600">Choose</span>
        </div>
        <div className="w-8 h-0.5 bg-green-500"></div>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">
            ✓
          </div>
          <span className="ml-2 text-sm font-medium text-green-600">Details</span>
        </div>
        <div className="w-8 h-0.5 bg-green-500"></div>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
            3
          </div>
          <span className="ml-2 text-sm font-medium text-primary">Verify</span>
        </div>
      </div>

      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">Check Your Email</h3>
        <p className="text-gray-600 text-sm mb-2">Verification link has been sent to</p>
        <p className="font-semibold text-gray-800 bg-gray-50 px-3 py-2 rounded-lg inline-block">
          {email}
        </p>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-center mb-2">
          <Mail className="w-5 h-5 text-blue-600 mr-2" />
          <span className="text-sm font-medium text-blue-800">What's Next?</span>
        </div>
        <div className="text-xs text-blue-800 space-y-1">
          <p>1. Check your email inbox (and spam folder)</p>
          <p>2. Click the verification link</p>
          <p>3. Your account will be activated automatically</p>
        </div>
      </div>

      <div className="space-y-3">
        {canResend ? <Button onClick={handleResend} variant="outline" className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Resend Verification Email
          </Button> : <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
            <Clock className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">
              Resend available in {resendTimer}s
            </span>
          </div>}

        <Button onClick={onChangeEmail} variant="outline" className="w-full">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Use Different Email
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Having trouble? Check your spam folder or contact support
        </p>
      </div>
    </div>;
};