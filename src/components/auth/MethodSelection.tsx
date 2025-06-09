
import { Button } from "@/components/ui/button";
import { User, Briefcase, AtSign, Smartphone } from "lucide-react";

interface MethodSelectionProps {
  selectedRole: 'customer' | 'provider';
  setSelectedRole: (role: 'customer' | 'provider') => void;
  onMethodSelect: (method: 'email' | 'phone') => void;
  onAuthComplete: (role: 'customer' | 'provider' | 'guest') => void;
  role?: 'customer' | 'provider';
}

const MethodSelection = ({ 
  selectedRole, 
  setSelectedRole, 
  onMethodSelect, 
  onAuthComplete, 
  role 
}: MethodSelectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#00B896] to-[#00C9A7] bg-clip-text text-transparent mb-3">
          Welcome to Simplifixr
        </h2>
        <p className="text-gray-600">Choose how you'd like to continue</p>
      </div>

      {!role && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-700 text-center">I am a:</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedRole('customer')}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                selectedRole === 'customer'
                  ? 'border-[#00B896] bg-gradient-to-br from-[#00B896]/10 to-[#00C9A7]/10 text-[#00B896] shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <User className="w-8 h-8 mx-auto mb-2" />
              <div className="font-semibold">Customer</div>
              <div className="text-xs text-gray-500 mt-1">Looking for services</div>
            </button>
            <button
              onClick={() => setSelectedRole('provider')}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                selectedRole === 'provider'
                  ? 'border-[#00B896] bg-gradient-to-br from-[#00B896]/10 to-[#00C9A7]/10 text-[#00B896] shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <Briefcase className="w-8 h-8 mx-auto mb-2" />
              <div className="font-semibold">Provider</div>
              <div className="text-xs text-gray-500 mt-1">Offering services</div>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700 text-center">Choose your login method:</p>
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => onMethodSelect('email')}
            variant="outline"
            className="h-20 flex-col space-y-2 border-2 hover:border-[#00B896] hover:text-[#00B896] hover:bg-[#00B896]/5 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-[#00B896]/10 flex items-center justify-center transition-colors">
              <AtSign className="w-5 h-5" />
            </div>
            <span className="font-semibold">Email</span>
          </Button>
          <Button
            onClick={() => onMethodSelect('phone')}
            variant="outline"
            className="h-20 flex-col space-y-2 border-2 hover:border-[#00B896] hover:text-[#00B896] hover:bg-[#00B896]/5 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-[#00B896]/10 flex items-center justify-center transition-colors">
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="font-semibold">Phone</span>
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or</span>
        </div>
      </div>

      <Button
        onClick={() => onAuthComplete('guest')}
        variant="ghost"
        className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-50"
      >
        Continue as Guest
      </Button>
    </div>
  );
};

export default MethodSelection;
