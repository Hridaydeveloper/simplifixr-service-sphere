
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, MapPin } from "lucide-react";

interface DetailsFormProps {
  role: 'customer' | 'provider';
  onSubmit: (data: { fullName: string; email: string; location: string; password: string }, isSignIn?: boolean) => Promise<void>;
  onSignIn?: () => void;
  onSignUp?: () => void;
  isSignIn?: boolean;
  fromBooking?: boolean;
}

const DetailsForm = ({ 
  role, 
  onSubmit, 
  onSignIn, 
  onSignUp, 
  isSignIn = false, 
  fromBooking = false 
}: DetailsFormProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    location: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData, isSignIn);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-[#00B896]/10 to-[#00C9A7]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-[#00B896]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isSignIn ? 'Welcome Back' : `Join as ${role === 'customer' ? 'Customer' : 'Service Provider'}`}
        </h2>
        <p className="text-gray-600">
          {isSignIn ? 'Sign in to your account' : 'Just a few details to get started'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isSignIn && (
          <div>
            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name</Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="pl-10 border-gray-300 focus:border-[#00B896] focus:ring-[#00B896]"
                required
              />
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="pl-10 border-gray-300 focus:border-[#00B896] focus:ring-[#00B896]"
              required
            />
          </div>
        </div>

        {!isSignIn && (
          <div>
            <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location</Label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="City, State"
                className="pl-10 border-gray-300 focus:border-[#00B896] focus:ring-[#00B896]"
              />
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="pl-10 border-gray-300 focus:border-[#00B896] focus:ring-[#00B896]"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#00B896] to-[#00C9A7] hover:from-[#00A085] hover:to-[#00B896] text-white font-semibold py-3 transition-all duration-300"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{isSignIn ? 'Signing In...' : 'Creating Account...'}</span>
            </div>
          ) : (
            isSignIn ? 'Sign In' : 'Complete Signup'
          )}
        </Button>

        <div className="text-center">
          {isSignIn ? (
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSignUp}
                className="text-[#00B896] hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSignIn}
                className="text-[#00B896] hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default DetailsForm;
