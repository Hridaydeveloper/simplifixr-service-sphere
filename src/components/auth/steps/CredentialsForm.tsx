import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
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
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={authMethod}>
          {authMethod === 'email' ? 'Email Address' : 'Phone Number'} *
        </Label>
        <Input
          id={authMethod}
          type={authMethod === 'email' ? 'email' : 'tel'}
          placeholder={authMethod === 'email' ? 'Enter your email' : 'Enter your phone number'}
          value={authMethod === 'email' ? formData.email : formData.phone}
          onChange={(e) => onInputChange(authMethod, e.target.value)}
          required
        />
      </div>

      {authMethod === 'email' && (
        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
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
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Processing...' : (authMethod === 'email' ? 'Continue' : 'Send OTP')}
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
  );
};