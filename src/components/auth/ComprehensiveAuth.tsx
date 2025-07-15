
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useAuthSteps } from "./hooks/useAuthSteps";
import { useAuthHandler } from "./components/AuthHandler";
// AuthStepRenderer removed during refactoring
import { toast } from "@/hooks/use-toast";

interface ComprehensiveAuthProps {
  onComplete: () => void;
  onBack?: () => void;
  fromBooking?: boolean;
}

const ComprehensiveAuth = ({ 
  onComplete, 
  onBack, 
  fromBooking = false 
}: ComprehensiveAuthProps) => {
  const handleContinueAsGuest = () => {
    localStorage.setItem('guestMode', 'true');
    toast({
      title: "Browsing as Guest",
      description: "You can explore services. Sign up to book appointments.",
    });
    onComplete();
  };

  const getTitle = () => {
    return 'Get Started';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <div className="text-white text-lg font-bold">S</div>
            </div>
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
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
            <p className="text-gray-600">Please use the simplified authentication flow.</p>
            <Button 
              onClick={onComplete}
              className="mt-4 w-full"
            >
              Go to Auth
            </Button>
          </div>
          
          {fromBooking && (
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
