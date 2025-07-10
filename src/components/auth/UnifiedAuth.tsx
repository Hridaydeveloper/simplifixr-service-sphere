import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { MethodSelection } from "./steps/MethodSelection";
import { CredentialsForm } from "./steps/CredentialsForm";
import { VerificationForm } from "./steps/VerificationForm";
import { DetailsForm } from "./steps/DetailsForm";
import { EmailSentConfirmation } from "./steps/EmailSentConfirmation";
import { useAuthFlow } from "./hooks/useAuthFlow";

interface UnifiedAuthProps {
  onBack?: () => void;
  onSuccess: (role: 'customer' | 'provider') => void;
}

const UnifiedAuth = ({ onBack, onSuccess }: UnifiedAuthProps) => {
  const {
    step,
    setStep,
    authMethod,
    isSignUp,
    setIsSignUp,
    loading,
    verificationSent,
    setVerificationSent,
    otp,
    setOtp,
    formData,
    handleInputChange,
    handleMethodSelect,
    handlePhoneAuth,
    handleSubmit
  } = useAuthFlow(onSuccess);

  const getTitle = () => {
    switch (step) {
      case 'method': return 'Sign In';
      case 'credentials': return isSignUp ? 'Create Account' : 'Welcome Back';
      case 'verification': return 'Verify Phone';
      case 'details': return 'Complete Profile';
      default: return 'Sign In';
    }
  };

  const canGoBack = () => {
    return step !== 'method' || !!onBack;
  };

  const handleBackClick = () => {
    if (step === 'credentials') {
      setStep('method');
    } else if (step === 'verification') {
      setStep('credentials');
    } else if (step === 'details') {
      if (authMethod === 'phone') {
        setStep('verification');
      } else {
        setStep('credentials');
      }
    } else if (onBack) {
      onBack();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            {getTitle()}
          </CardTitle>
          {canGoBack() && (
            <Button variant="ghost" size="sm" onClick={handleBackClick}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {verificationSent && authMethod === 'email' ? (
          <EmailSentConfirmation 
            email={formData.email}
            onChangeEmail={() => setVerificationSent(false)}
          />
        ) : step === 'method' ? (
          <MethodSelection onMethodSelect={handleMethodSelect} />
        ) : step === 'credentials' ? (
          <CredentialsForm
            authMethod={authMethod}
            isSignUp={isSignUp}
            loading={loading}
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onToggleSignUp={() => setIsSignUp(!isSignUp)}
          />
        ) : step === 'verification' ? (
          <VerificationForm
            phone={formData.phone}
            otp={otp}
            loading={loading}
            onOtpChange={setOtp}
            onSubmit={handleSubmit}
            onResend={handlePhoneAuth}
          />
        ) : step === 'details' ? (
          <DetailsForm
            authMethod={authMethod}
            loading={loading}
            formData={{ fullName: formData.fullName, location: formData.location }}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        ) : null}
      </CardContent>
    </Card>
  );
};

export default UnifiedAuth;