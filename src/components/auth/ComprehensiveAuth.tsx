
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import RoleSelection from "./RoleSelection";
import DetailsForm from "./DetailsForm";
import EmailSentConfirmation from "./EmailSentConfirmation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface ComprehensiveAuthProps {
  onComplete: (role: 'customer' | 'provider' | 'guest') => void;
  onBack?: () => void;
  defaultRole?: 'customer' | 'provider';
  fromBooking?: boolean;
}

const ComprehensiveAuth = ({ onComplete, onBack, defaultRole = 'customer', fromBooking = false }: ComprehensiveAuthProps) => {
  const [step, setStep] = useState<'role-selection' | 'details' | 'signin' | 'email-sent'>('role-selection');
  const [role, setRole] = useState<'customer' | 'provider'>(defaultRole);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    location: '',
    password: ''
  });

  const { signUp, signIn } = useAuth();

  const handleRoleSelect = (selectedRole: 'customer' | 'provider' | 'guest') => {
    if (selectedRole === 'guest') {
      onComplete(selectedRole);
      return;
    }
    setRole(selectedRole);
    setStep('details');
  };

  const handleFormSubmit = async (data: typeof formData, isSignIn: boolean = false) => {
    try {
      setFormData(data);
      
      if (isSignIn) {
        const { error } = await signIn({
          email: data.email,
          password: data.password
        });

        if (error) {
          toast({
            title: "Sign In Failed",
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "Welcome back!",
          description: "You have successfully signed in."
        });
        
        onComplete(role);
      } else {
        const { error } = await signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/confirm`,
            data: {
              full_name: data.fullName,
              location: data.location,
              role: role
            }
          }
        });

        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: "Account exists",
              description: "This email is already registered. Try signing in instead.",
              variant: "destructive"
            });
            return;
          }
          
          toast({
            title: "Sign Up Failed",
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        setStep('email-sent');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleContinueAsGuest = () => {
    localStorage.setItem('guestMode', 'true');
    toast({
      title: "Browsing as Guest",
      description: "You can explore services. Sign up to book appointments.",
    });
    onComplete('guest');
  };

  const handleBack = () => {
    if (step === 'details' || step === 'signin') {
      setStep('role-selection');
    } else if (onBack) {
      onBack();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'role-selection':
        return (
          <RoleSelection
            onSelect={handleRoleSelect}
            defaultRole={defaultRole}
          />
        );
      case 'details':
        return (
          <DetailsForm
            role={role}
            onSubmit={handleFormSubmit}
            onSignIn={() => setStep('signin')}
            fromBooking={fromBooking}
          />
        );
      case 'signin':
        return (
          <DetailsForm
            role={role}
            onSubmit={(data) => handleFormSubmit(data, true)}
            onSignUp={() => setStep('details')}
            isSignIn={true}
            fromBooking={fromBooking}
          />
        );
      case 'email-sent':
        return (
          <EmailSentConfirmation
            email={formData.email}
            onBack={() => setStep('details')}
            onTryDifferentEmail={() => setStep('details')}
            onContinueAsGuest={handleContinueAsGuest}
            fullName={formData.fullName}
            location={formData.location}
            role={role}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <div className="text-white text-lg font-bold">S</div>
            </div>
            {(step !== 'role-selection' || onBack) && (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
          </div>
          
          <div className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {step === 'email-sent' ? 'Check Your Email' : 
               step === 'signin' ? 'Welcome Back' :
               step === 'details' ? `Join as ${role === 'customer' ? 'Customer' : 'Service Provider'}` : 
               'Get Started'}
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderStep()}
          
          {fromBooking && step !== 'email-sent' && step !== 'role-selection' && (
            <div className="text-center pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={handleContinueAsGuest}
                className="w-full"
              >
                Continue for Now
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Explore services without creating an account
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComprehensiveAuth;
