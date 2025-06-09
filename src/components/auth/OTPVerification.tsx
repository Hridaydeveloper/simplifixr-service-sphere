
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Mail, Phone } from "lucide-react";

interface OTPVerificationProps {
  authMethod: 'email' | 'phone';
  contactValue: string;
  otp: string;
  loading: boolean;
  onOTPChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onChangeContact: () => void;
}

const OTPVerification = ({
  authMethod,
  contactValue,
  otp,
  loading,
  onOTPChange,
  onSubmit,
  onChangeContact
}: OTPVerificationProps) => {
  return (
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

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="flex justify-center">
          <InputOTP
            value={otp}
            onChange={onOTPChange}
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
          onClick={onChangeContact}
          className="text-gray-600 hover:text-[#00B896]"
        >
          Change {authMethod === 'email' ? 'email' : 'phone number'}
        </Button>
      </div>
    </div>
  );
};

export default OTPVerification;
