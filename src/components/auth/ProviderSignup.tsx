
import { useState } from "react";
import { ArrowLeft, User, MapPin, Briefcase, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/services/authService";
import { toast } from "@/hooks/use-toast";

interface ProviderSignupProps {
  contact: string;
  onBack: () => void;
  onComplete: () => void;
}

const ProviderSignup = ({ contact, onBack, onComplete }: ProviderSignupProps) => {
  const [fullName, setFullName] = useState('');
  const [location, setLocation] = useState('');
  const [services, setServices] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your full name",
        variant: "destructive",
      });
      return;
    }

    if (!services.trim()) {
      toast({
        title: "Error",
        description: "Please enter the services you provide",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await authService.signUp({
        email: contact,
        password,
        fullName,
        location,
      });
      
      toast({
        title: "Success",
        description: "Provider account created successfully! Redirecting...",
      });
      
      // Wait a moment then complete
      setTimeout(() => {
        onComplete();
      }, 1500);
    } catch (error) {
      console.error('Provider signup error:', error);
      toast({
        title: "Error",
        description: "Failed to create provider account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <CardTitle className="text-xl">Provider Registration</CardTitle>
            </div>
            <p className="text-sm text-gray-600">
              Set up your provider profile to start earning
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Service Area/Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Services you provide (e.g., Plumbing, Cleaning)"
                value={services}
                onChange={(e) => setServices(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Create Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>

            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-[#00B896] hover:bg-[#009985]"
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProviderSignup;
