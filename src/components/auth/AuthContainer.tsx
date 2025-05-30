
import { useState } from "react";
import RoleSelection from "./RoleSelection";
import OTPAuth from "./OTPAuth";
import CustomerSignup from "./CustomerSignup";
import ProviderSignup from "./ProviderSignup";

interface AuthContainerProps {
  onAuthComplete: (role: 'customer' | 'provider' | 'guest') => void;
}

const AuthContainer = ({ onAuthComplete }: AuthContainerProps) => {
  const [step, setStep] = useState<'role' | 'otp' | 'signup'>('role');
  const [selectedRole, setSelectedRole] = useState<'customer' | 'provider' | null>(null);
  const [userContact, setUserContact] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(false);

  const handleRoleSelect = (role: 'customer' | 'provider' | 'guest') => {
    if (role === 'guest') {
      onAuthComplete('guest');
      return;
    }
    setSelectedRole(role);
    setStep('otp');
  };

  const handleOTPVerified = (contact: string, isExisting: boolean) => {
    setUserContact(contact);
    setIsExistingUser(isExisting);
    
    if (isExisting) {
      // User exists, complete auth
      onAuthComplete(selectedRole!);
    } else {
      // New user, show signup form
      setStep('signup');
    }
  };

  const handleSignupComplete = () => {
    onAuthComplete(selectedRole!);
  };

  const handleBackToRole = () => {
    setStep('role');
    setSelectedRole(null);
    setUserContact('');
    setIsExistingUser(false);
  };

  const handleBackToOTP = () => {
    setStep('otp');
  };

  const handleSkipToGuest = () => {
    onAuthComplete('guest');
  };

  if (step === 'role') {
    return <RoleSelection onRoleSelect={handleRoleSelect} />;
  }

  if (step === 'otp' && selectedRole) {
    return (
      <OTPAuth
        role={selectedRole}
        onBack={handleBackToRole}
        onOTPVerified={handleOTPVerified}
        onSkip={handleSkipToGuest}
      />
    );
  }

  if (step === 'signup' && selectedRole) {
    if (selectedRole === 'customer') {
      return (
        <CustomerSignup
          contact={userContact}
          onBack={handleBackToOTP}
          onComplete={handleSignupComplete}
        />
      );
    } else {
      return (
        <ProviderSignup
          contact={userContact}
          onBack={handleBackToOTP}
          onComplete={handleSignupComplete}
        />
      );
    }
  }

  return null;
};

export default AuthContainer;
