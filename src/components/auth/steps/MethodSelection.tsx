import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";

type AuthMethod = 'email' | 'phone';

interface MethodSelectionProps {
  onMethodSelect: (method: AuthMethod) => void;
}

export const MethodSelection = ({ onMethodSelect }: MethodSelectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Choose verification method</h3>
        <p className="text-gray-600 text-sm">How would you like to sign in?</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <Button
          onClick={() => onMethodSelect('email')}
          variant="outline"
          className="h-16 flex-col space-y-2 border-2 hover:border-primary hover:text-primary"
        >
          <Mail className="w-6 h-6" />
          <span className="font-semibold">Email Address</span>
        </Button>
        
        <Button
          onClick={() => onMethodSelect('phone')}
          variant="outline"
          className="h-16 flex-col space-y-2 border-2 hover:border-primary hover:text-primary"
        >
          <Phone className="w-6 h-6" />
          <span className="font-semibold">Phone Number</span>
        </Button>
      </div>
    </div>
  );
};