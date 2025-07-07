
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EmailConfirmAuthProps {
  onBack?: () => void;
  onSuccess: (role: 'customer' | 'provider') => void;
  defaultRole?: 'customer' | 'provider';
}

const EmailConfirmAuth = ({ onBack, onSuccess, defaultRole = 'customer' }: EmailConfirmAuthProps) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    location: '',
    role: defaultRole
  });

  const { signIn } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const sendCustomConfirmationEmail = async (email: string, fullName: string) => {
    try {
      console.log('Sending custom confirmation email to:', email);
      
      const { data, error } = await supabase.functions.invoke('send-confirmation-email', {
        body: {
          email: email,
          confirmationUrl: `${window.location.origin}/auth/confirm`,
          fullName: fullName
        }
      });

      if (error) {
        console.error('Error invoking send-confirmation-email function:', error);
        throw error;
      }

      console.log('Custom confirmation email sent successfully:', data);
      return data;
    } catch (error) {
      console.error('Failed to send custom confirmation email:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        console.log('Starting sign up process for:', formData.email);
        
        // First, try to sign up the user with Supabase
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              location: formData.location,
              role: formData.role
            }
          }
        });

        if (signUpError) {
          console.error('Supabase sign up error:', signUpError);
          
          if (signUpError.message.includes('already registered')) {
            toast({
              title: "Account exists",
              description: "This email is already registered. Try signing in instead.",
              variant: "destructive"
            });
            setIsSignUp(false);
            return;
          }
          throw signUpError;
        }

        console.log('Supabase sign up successful:', signUpData);

        // Now send our custom confirmation email
        try {
          await sendCustomConfirmationEmail(formData.email, formData.fullName);
          
          setEmailSent(true);
          toast({
            title: "Check your email!",
            description: "We've sent you a confirmation link to complete your registration.",
          });
        } catch (emailError) {
          console.error('Custom email sending failed:', emailError);
          
          // Fallback: Still show email sent state since Supabase might have sent their default email
          setEmailSent(true);
          toast({
            title: "Check your email!",
            description: "We've sent you a confirmation link to complete your registration.",
          });
        }
      } else {
        // Sign in
        console.log('Starting sign in process for:', formData.email);
        
        const { error } = await signIn({
          email: formData.email,
          password: formData.password
        });

        if (error) {
          console.error('Sign in error:', error);
          
          if (error.message.includes('Email not confirmed')) {
            toast({
              title: "Email not confirmed",
              description: "Please check your email and click the confirmation link first.",
              variant: "destructive"
            });
            return;
          }
          throw error;
        }

        console.log('Sign in successful');
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in."
        });
        
        onSuccess(formData.role);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: isSignUp ? "Sign Up Failed" : "Sign In Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    console.log('Resending email to:', formData.email);
    setLoading(true);
    
    try {
      // Send our custom confirmation email
      await sendCustomConfirmationEmail(formData.email, formData.fullName);
      
      toast({
        title: "Email Resent",
        description: "We've sent another confirmation email to your inbox.",
      });
    } catch (error: any) {
      console.error('Error resending email:', error);
      toast({
        variant: "destructive",
        title: "Failed to Resend",
        description: "There was an error sending the email. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          <p className="text-gray-600">
            We've sent a confirmation email to <strong>{formData.email}</strong>
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-800">
              Please check your email and click the confirmation link to activate your account.
            </p>
          </div>

          <Button
            onClick={handleResendEmail}
            disabled={loading}
            className="w-full bg-[#00B896] hover:bg-[#00A085] text-white"
          >
            {loading ? 'Resending...' : 'Resend Email'}
          </Button>

          <Button
            onClick={() => setEmailSent(false)}
            variant="outline"
            className="w-full"
          >
            Back to Sign Up
          </Button>
          {onBack && (
            <Button
              onClick={onBack}
              variant="ghost"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </CardTitle>
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}
        </div>
        <p className="text-gray-600">
          {isSignUp 
            ? `Join as a ${formData.role}` 
            : 'Sign in to your account'
          }
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="City, State"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Account Type</Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00B896] focus:border-transparent"
                >
                  <option value="customer">Customer - Book Services</option>
                  <option value="provider">Service Provider - Offer Services</option>
                </select>
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
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
            {isSignUp && (
              <p className="text-xs text-gray-500">
                Password must be at least 6 characters long
              </p>
            )}
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00B896] hover:bg-[#00A085] text-white"
          >
            {loading 
              ? (isSignUp ? 'Creating Account...' : 'Signing In...') 
              : (isSignUp ? 'Create Account' : 'Sign In')
            }
          </Button>
        </form>
        
        <div className="text-center">
          <Button
            variant="link"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[#00B896] hover:text-[#00A085]"
          >
            {isSignUp 
              ? "Already have an account? Sign in" 
              : "Don't have an account? Sign up"
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailConfirmAuth;
