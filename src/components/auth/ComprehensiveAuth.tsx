
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useAuthSteps } from "./hooks/useAuthSteps";
import { useAuthHandler } from "./components/AuthHandler";
// AuthStepRenderer removed during refactoring
import { toast } from "@/hooks/use-toast";

interface ComprehensiveAuthProps {
  onComplete: (role: 'customer' | 'provider' | 'guest') => void;
  onBack?: () => void;
  defaultRole?: 'customer' | 'provider';
  fromBooking?: boolean;
}

const ComprehensiveAuth = ({ 
  onComplete, 
  onBack, 
  defaultRole = 'customer', 
  fromBooking = false 
}: ComprehensiveAuthProps) => {
  const {
    step,
    role,
    formData,
    goToStep,
    updateRole,
    updateFormData
  } = useAuthSteps('role-selection');

  const { handleFormSubmit } = useAuthHandler({
    role,
    onSuccess: onComplete,
    onEmailSent: () => goToStep('email-sent'),
    updateFormData
  });

  const handleRoleSelect = (selectedRole: 'customer' | 'provider' | 'guest') => {
    if (selectedRole === 'guest') {
      onComplete(selectedRole);
      return;
    }
    updateRole(selectedRole);
    goToStep('details');
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
      goToStep('role-selection');
    } else if (onBack) {
      onBack();
    }
  };

  const getTitle = () => {
    switch (step) {
      case 'email-sent': return 'Check Your Email';
      case 'signin': return 'Welcome Back';
      case 'details': return `Join as ${role === 'customer' ? 'Customer' : 'Service Provider'}`;
      default: return 'Get Started';
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
              {getTitle()}
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600">This component needs to be updated to use the new auth flow.</p>
          </div>
          
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
