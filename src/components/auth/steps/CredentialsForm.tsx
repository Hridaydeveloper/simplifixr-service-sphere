import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Phone, User, MapPin } from "lucide-react";
import { useState } from "react";

type AuthMethod = 'email' | 'phone';

interface CredentialsFormProps {
  authMethod: AuthMethod;
  isSignUp: boolean;
  loading: boolean;
  formData: {
    email: string;
    phone: string;
    password: string;
    fullName: string;
    location: string;
  };
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onToggleSignUp: () => void;
}

export const CredentialsForm = ({
  authMethod,
  isSignUp,
  loading,
  formData,
  onInputChange,
  onSubmit,
  onToggleSignUp
}: CredentialsFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">
            ✓
          </div>
          <span className="ml-2 text-sm font-medium text-green-600">Choose</span>
        </div>
        <div className="w-8 h-0.5 bg-green-500"></div>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
            2
          </div>
          <span className="ml-2 text-sm font-medium text-primary">Details</span>
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
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          {authMethod === 'email' ? <Mail className="w-6 h-6 text-primary" /> : <Phone className="w-6 h-6 text-primary" />}
        </div>
        <h3 className="text-xl font-bold mb-1">
          {isSignUp ? 'Create Your Account' : 'Welcome Back'}
        </h3>
        <p className="text-gray-600 text-sm">
          {isSignUp 
            ? `Fill in your details to get started with ${authMethod} verification`
            : 'Enter your credentials to sign in'
          }
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Full Name - Required for sign up */}
        {isSignUp && (
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Full Name *</span>
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => onInputChange('fullName', e.target.value)}
              required={isSignUp}
            />
          </div>
        )}

        {/* Email or Phone */}
        <div className="space-y-2">
          <Label htmlFor={authMethod} className="flex items-center space-x-2">
            {authMethod === 'email' ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
            <span>{authMethod === 'email' ? 'Email Address' : 'Phone Number'} *</span>
          </Label>
          <Input
            id={authMethod}
            type={authMethod === 'email' ? 'email' : 'tel'}
            placeholder={authMethod === 'email' ? 'Enter your email address' : '+1 (555) 123-4567'}
            value={authMethod === 'email' ? formData.email : formData.phone}
            onChange={(e) => onInputChange(authMethod, e.target.value)}
            required
          />
        </div>

        {/* City - Required for sign up */}
        {isSignUp && (
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>City *</span>
            </Label>
            <Input
              id="location"
              type="text"
              placeholder="Enter your city"
              value={formData.location}
              onChange={(e) => onInputChange('location', e.target.value)}
              required={isSignUp}
            />
          </div>
        )}

        {/* Password - Only for email method */}
        {authMethod === 'email' && (
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Password *</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => onInputChange('password', e.target.value)}
                required
                minLength={6}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            {isSignUp && (
              <p className="text-xs text-gray-500">
                Password must be at least 6 characters long
              </p>
            )}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 text-base font-semibold"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            authMethod === 'email' 
              ? (isSignUp ? 'Create Account' : 'Sign In') 
              : 'Send Verification Code'
          )}
        </Button>

        <div className="text-center">
          <Button
            type="button"
            variant="link"
            onClick={onToggleSignUp}
            className="text-primary hover:text-primary/80"
          >
            {isSignUp 
              ? "Already have an account? Sign in" 
              : "Don't have an account? Sign up"
            }
          </Button>
        </div>
      </form>
    </div>
  );
};