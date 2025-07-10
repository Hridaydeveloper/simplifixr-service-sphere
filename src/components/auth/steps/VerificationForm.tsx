import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Shield, CheckCircle, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

interface VerificationFormProps {
  phone: string;
  otp: string;
  loading: boolean;
  onOtpChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onResend: () => void;
}

export const VerificationForm = ({
  phone,
  otp,
  loading,
  onOtpChange,
  onSubmit,
  onResend
}: VerificationFormProps) => {
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
    onResend();
    setResendTimer(60);
    setCanResend(false);
  };

  return (
    <div className="space-y-6">
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
          <Shield className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">Verify Your Phone</h3>
        <p className="text-gray-600 text-sm mb-2">
          We sent a 6-digit verification code to
        </p>
        <p className="font-semibold text-gray-800">
          {phone}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp" className="flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span>Verification Code</span>
          </Label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => onOtpChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            required
            className="text-center text-2xl font-mono tracking-widest"
          />
          <p className="text-xs text-gray-500 text-center">
            Enter the code exactly as received
          </p>
        </div>

        <Button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full h-12 text-base font-semibold"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Verifying...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Verify Code</span>
            </div>
          )}
        </Button>

        <div className="text-center">
          {canResend ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleResend}
              disabled={loading}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Resend Code
            </Button>
          ) : (
            <div className="text-sm text-gray-500">
              Resend code in {resendTimer}s
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800 text-center">
            💡 <strong>Tip:</strong> Check your messages for the verification code. 
            It may take up to 2 minutes to arrive.
          </p>
        </div>
      </form>
    </div>
  );
};