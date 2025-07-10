import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface EmailSentConfirmationProps {
  email: string;
  onChangeEmail: () => void;
}

export const EmailSentConfirmation = ({ email, onChangeEmail }: EmailSentConfirmationProps) => {
  return (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
        <Mail className="w-8 h-8 text-blue-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Check your email</h3>
        <p className="text-gray-600 text-sm">
          We've sent a confirmation link to <strong>{email}</strong>
        </p>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs text-blue-800">
          Click the link in your email to verify your account and complete the registration.
        </p>
      </div>

      <Button
        onClick={onChangeEmail}
        variant="outline"
        className="w-full"
      >
        Change Email Address
      </Button>
    </div>
  );
};