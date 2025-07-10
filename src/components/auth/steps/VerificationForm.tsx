import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone } from "lucide-react";

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
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Enter verification code</h3>
        <p className="text-gray-600 text-sm">
          We sent a code to {phone}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Verification Code</Label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => onOtpChange(e.target.value)}
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
          onClick={onResend}
          disabled={loading}
          className="w-full"
        >
          Resend Code
        </Button>
      </form>
    </div>
  );
};