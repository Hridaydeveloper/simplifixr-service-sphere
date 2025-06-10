import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Mail, User, Lock, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import EmailSentConfirmation from "./EmailSentConfirmation";

interface ComprehensiveAuthProps {
  onComplete: (role: 'customer' | 'provider' | 'guest') => void;
  onBack?: () => void;
  defaultRole?: 'customer' | 'provider';
  fromBooking?: boolean;
}

const ComprehensiveAuth = ({ onComplete, onBack, defaultRole = 'customer', fromBooking = false }: ComprehensiveAuthProps) => {
  const [step, setStep] = useState<'role-selection' | 'details' | 'email-sent'>('role-selection');
  const [role, setRole] = useState<'customer' | 'provider'>(defaultRole);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (value: 'customer' | 'provider') => {
    setRole(value);
    setStep('details');
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (role === 'customer') {
        // Customer Signup
        const { error } = await signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              location: formData.location,
              role: 'customer'
            },
            emailRedirectTo: `${window.location.origin}/auth/confirm`
          }
        });

        if (error) {
          console.error("Customer signup error:", error);
          toast({
            variant: "destructive",
            title: "Signup failed",
            description: error.message,
          });
        } else {
          toast({
            title: "Signup successful",
            description: "Please check your email to confirm your account.",
          });
          setStep('email-sent');
        }
      } else {
        // Provider Onboarding - Redirect to registration page
        navigate('/provider-registration', { state: { ...formData } });
        return;
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message || "An error occurred during signup.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await signIn({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error("Signin error:", error);
        toast({
          variant: "destructive",
          title: "Signin failed",
          description: error.message,
        });
      } else {
        toast({
          title: "Signin successful",
          description: "You have successfully signed in.",
        });
        onComplete(role);
      }
    } catch (error: any) {
      console.error("Signin error:", error);
      toast({
        variant: "destructive",
        title: "Signin failed",
        description: error.message || "An error occurred during signin.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00B896]/5 to-[#00C9A7]/5 flex flex-col">
      <div className="py-8 px-4">
        {onBack && (
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0">
            <CardContent className="p-8">
              {step === 'role-selection' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-center">
                    Join as a Customer or Provider?
                  </h2>
                  <p className="text-muted-foreground text-center">
                    Select your role to continue.
                  </p>
                  <div className="grid gap-4">
                    <Button size="lg" className="bg-[#00B896] hover:bg-[#00A085] text-white" onClick={() => handleRoleSelect('customer')}>
                      I'm a Customer
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => handleRoleSelect('provider')}>
                      I'm a Service Provider
                    </Button>
                  </div>
                </div>
              )}

              {step === 'details' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-center">
                    {role === 'customer' ? 'Create Customer Account' : 'Create Provider Account'}
                  </h2>
                  <p className="text-muted-foreground text-center">
                    Enter your details to create an account.
                  </p>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="Enter your full name"
                        type="text"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="Enter your location"
                        type="text"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </div>
                    <Button disabled={loading} className="bg-[#00B896] hover:bg-[#00A085] text-white" onClick={handleSubmit}>
                      {role === 'customer' ? 'Sign Up' : 'Continue as Provider'}
                    </Button>
                  </div>

                  <div className="mt-6 pt-6 border-t text-center">
                    <p className="text-sm text-muted-foreground mb-3">
                      Already have an account?
                    </p>
                    <Button variant="link" onClick={() => setStep('signin')}>
                      Sign In
                    </Button>
                  </div>
                </div>
              )}

              {step === 'signin' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-center">
                    Sign In
                  </h2>
                  <p className="text-muted-foreground text-center">
                    Enter your email and password to sign in.
                  </p>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                    <Button disabled={loading} className="bg-[#00B896] hover:bg-[#00A085] text-white" onClick={handleSignIn}>
                      Sign In
                    </Button>
                  </div>

                  <div className="mt-6 pt-6 border-t text-center">
                    <p className="text-sm text-muted-foreground mb-3">
                      Don't have an account?
                    </p>
                    <Button variant="link" onClick={() => setStep('details')}>
                      Create Account
                    </Button>
                  </div>
                </div>
              )}
              
              {step === 'email-sent' && (
                <EmailSentConfirmation
                  email={formData.email}
                  onTryDifferentEmail={() => setStep('details')}
                  onContinueAsGuest={() => {
                    console.log('Continuing as guest from email confirmation');
                    onComplete('guest');
                  }}
                  fullName={formData.fullName}
                  location={formData.location}
                  role={role}
                />
              )}

              {fromBooking && step !== 'email-sent' && step !== 'role-selection' && (
                <div className="mt-6 pt-6 border-t text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Need service urgently?
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      console.log('Continuing as guest from booking flow');
                      onComplete('guest');
                    }}
                    className="w-full"
                  >
                    Continue for Now
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveAuth;
