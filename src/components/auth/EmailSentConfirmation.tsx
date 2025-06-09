
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface EmailSentConfirmationProps {
  email: string;
  onTryDifferentEmail: () => void;
  onContinueAsGuest: () => void;
}

const EmailSentConfirmation = ({ email, onTryDifferentEmail, onContinueAsGuest }: EmailSentConfirmationProps) => {
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
        <p className="text-sm text-blue-800">
          <strong>Don't see the email?</strong> Check your spam folder or wait a few minutes for delivery.
        </p>
      </div>

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
  );
};

export default EmailSentConfirmation;
