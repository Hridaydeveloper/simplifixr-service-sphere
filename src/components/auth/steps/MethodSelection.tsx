import { Button } from "@/components/ui/button";
import { Mail, Phone, User, CheckCircle } from "lucide-react";
import { useState } from "react";
type AuthMethod = 'email' | 'phone';
interface MethodSelectionProps {
  onMethodSelect: (method: AuthMethod) => void;
}
export const MethodSelection = ({
  onMethodSelect
}: MethodSelectionProps) => {
  const [selectedMethod, setSelectedMethod] = useState<AuthMethod | null>(null);
  const handleMethodSelect = (method: AuthMethod) => {
    setSelectedMethod(method);
    setTimeout(() => onMethodSelect(method), 200); // Small delay for visual feedback
  };
  return <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
            1
          </div>
          <span className="ml-2 text-sm font-medium text-primary">Choose</span>
        </div>
        <div className="w-8 h-0.5 bg-gray-200"></div>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm">
            2
          </div>
          <span className="ml-2 text-sm text-gray-500">Details</span>
        </div>
        <div className="w-8 h-0.5 bg-gray-200"></div>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm">
            3
          </div>
          <span className="ml-2 text-sm text-gray-500">Verify</span>
        </div>
      </div>

      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Welcome to Simplifixr</h3>
        <p className="text-gray-600 text-sm">Choose your preferred verification method to get started</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <Button onClick={() => handleMethodSelect('email')} variant="outline" className={`h-20 flex-col space-y-3 border-2 transition-all duration-300 transform hover:scale-105 ${selectedMethod === 'email' ? 'border-primary bg-primary/5 text-primary shadow-lg scale-105' : 'hover:border-primary hover:text-primary hover:bg-primary/5'}`}>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            {selectedMethod === 'email' && <CheckCircle className="w-5 h-5 text-green-500" />}
          </div>
          <div className="text-center">
            <span className="font-semibold">Email Verification</span>
            
          </div>
        </Button>
        
        <Button onClick={() => handleMethodSelect('phone')} variant="outline" className={`h-20 flex-col space-y-3 border-2 transition-all duration-300 transform hover:scale-105 ${selectedMethod === 'phone' ? 'border-primary bg-primary/5 text-primary shadow-lg scale-105' : 'hover:border-primary hover:text-primary hover:bg-primary/5'}`}>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            {selectedMethod === 'phone' && <CheckCircle className="w-5 h-5 text-green-500" />}
          </div>
          <div className="text-center">
            <span className="font-semibold">SMS Verification</span>
            
          </div>
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>;
};