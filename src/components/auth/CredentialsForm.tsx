
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, AtSign, Smartphone } from "lucide-react";

interface CredentialsFormProps {
  authMethod: 'email' | 'phone';
  authMode: 'login' | 'signup';
  formData: {
    email: string;
    phone: string;
    password: string;
    fullName: string;
    location: string;
    confirmPassword: string;
  };
  loading: boolean;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onModeChange: (mode: 'login' | 'signup') => void;
}

const CredentialsForm = ({
  authMethod,
  authMode,
  formData,
  loading,
  onInputChange,
  onSubmit,
  onModeChange
}: CredentialsFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          {authMethod === 'email' ? (
            <AtSign className="w-4 h-4" />
          ) : (
            <Smartphone className="w-4 h-4" />
          )}
          <span>
            {authMethod === 'email' ? 'Email' : 'Phone'} {authMode === 'login' ? 'Login' : 'Signup'}
          </span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {authMode === 'signup' && (
          <>
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => onInputChange('fullName', e.target.value)}
                className="mt-1 border-gray-300 focus:border-[#00B896] focus:ring-[#00B896]"
                required
              />
            </div>
            <div>
              <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location</Label>
              <Input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => onInputChange('location', e.target.value)}
                placeholder="City, State"
                className="mt-1 border-gray-300 focus:border-[#00B896] focus:ring-[#00B896]"
              />
            </div>
          </>
        )}

        <div>
          <Label htmlFor="contact" className="text-sm font-medium text-gray-700">
            {authMethod === 'email' ? 'Email Address' : 'Phone Number'}
          </Label>
          <Input
            id="contact"
            type={authMethod === 'email' ? 'email' : 'tel'}
            value={authMethod === 'email' ? formData.email : formData.phone}
            onChange={(e) => onInputChange(authMethod, e.target.value)}
            placeholder={authMethod === 'email' ? 'Enter your email' : 'Enter 10-digit phone number'}
            className="mt-1 border-gray-300 focus:border-[#00B896] focus:ring-[#00B896]"
            required
          />
        </div>

        {authMethod === 'email' && (
          <>
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => onInputChange('password', e.target.value)}
                  className="border-gray-300 focus:border-[#00B896] focus:ring-[#00B896] pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-8 w-8"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {authMode === 'signup' && (
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => onInputChange('confirmPassword', e.target.value)}
                  className="mt-1 border-gray-300 focus:border-[#00B896] focus:ring-[#00B896]"
                  required
                />
              </div>
            )}
          </>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#00B896] to-[#00C9A7] hover:from-[#00A085] hover:to-[#00B896] text-white font-semibold py-3 transition-all duration-300"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{authMode === 'login' ? 'Signing In...' : 'Creating Account...'}</span>
            </div>
          ) : (
            authMethod === 'email' ? (authMode === 'login' ? 'Sign In' : 'Create Account') : 'Send OTP'
          )}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-gray-600">
          {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => onModeChange(authMode === 'login' ? 'signup' : 'login')}
            className="text-[#00B896] hover:text-[#00A085] font-semibold underline-offset-4 hover:underline transition-all"
          >
            {authMode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default CredentialsForm;
