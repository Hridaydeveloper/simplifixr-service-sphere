
import { useState } from "react";
import RoleSelection from "./RoleSelection";
import OTPAuth from "./OTPAuth";
import CustomerSignup from "./CustomerSignup";
import ProviderSignup from "./ProviderSignup";

interface AuthContainerProps {
  onAuthComplete: (role: 'customer' | 'provider' | 'guest') => void;
  defaultRole?: 'customer' | 'provider';
}

const AuthContainer = ({ onAuthComplete, defaultRole }: AuthContainerProps) => {
  const [step, setStep] = useState<'role' | 'otp' | 'signup'>(defaultRole ? 'otp' : 'role');
  const [selectedRole, setSelectedRole] = useState<'customer' | 'provider' | null>(defaultRole || null);
  const [userContact, setUserContact] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(false);

  const handleRoleSelect = (role: 'customer' | 'provider' | 'guest') => {
    console.log('Role selected:', role);
    
    if (role === 'guest') {
      onAuthComplete('guest');
      return;
    }
    
    setSelectedRole(role);
    setStep('otp');
  };

  const handleOTPVerified = (contact: string, isExisting: boolean) => {
    console.log('OTP verified for:', contact, 'isExisting:', isExisting);
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
    console.log('Signup completed for role:', selectedRole);
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
    console.log('Skipping to guest mode');
    onAuthComplete('guest');
  };

  if (step === 'role' && !defaultRole) {
    return <RoleSelection onRoleSelect={handleRoleSelect} />;
  }

  if (step === 'otp' && selectedRole) {
    return (
      <OTPAuth
        role={selectedRole}
        onBack={defaultRole ? undefined : handleBackToRole}
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
