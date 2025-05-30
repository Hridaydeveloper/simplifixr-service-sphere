
import { Users, Briefcase, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface RoleSelectionProps {
  onRoleSelect: (role: 'customer' | 'provider' | 'guest') => void;
}

const RoleSelection = ({ onRoleSelect }: RoleSelectionProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-[#00B896] to-[#00C9A7] bg-clip-text text-transparent">
              Simplifixr
            </span>
          </h1>
          <p className="text-gray-600">Your one-stop platform for services, spaces, and solutions.</p>
        </div>

        <div className="space-y-4 mb-6">
          <p className="text-gray-700 font-medium text-center">Continue as:</p>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onRoleSelect('customer')}>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#00B896]/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-[#00B896]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">I'm a Customer</h3>
                <p className="text-sm text-gray-600">Book services, rent spaces, and more</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onRoleSelect('provider')}>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#00C9A7]/10 rounded-full flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-[#00C9A7]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">I'm a Provider</h3>
                <p className="text-sm text-gray-600">List, rent, or offer services</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Button 
          variant="outline" 
          className="w-full border-gray-300 hover:bg-gray-50"
          onClick={() => onRoleSelect('guest')}
        >
          <Eye className="w-4 h-4 mr-2" />
          Skip for now → Browse
        </Button>
      </div>
    </div>
  );
};

export default RoleSelection;
