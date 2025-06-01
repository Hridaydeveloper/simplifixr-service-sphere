
import { useState } from "react";
import RoleSelection from "./RoleSelection";
import EmailPasswordAuth from "./EmailPasswordAuth";

interface AuthContainerProps {
  onAuthComplete: (role: 'customer' | 'provider' | 'guest') => void;
  defaultRole?: 'customer' | 'provider';
}

const AuthContainer = ({ onAuthComplete, defaultRole }: AuthContainerProps) => {
  const [selectedRole, setSelectedRole] = useState<'customer' | 'provider' | null>(defaultRole || null);

  const handleRoleSelect = (role: 'customer' | 'provider' | 'guest') => {
    console.log('Role selected:', role);
    
    if (role === 'guest') {
      onAuthComplete('guest');
      return;
    }
    
    setSelectedRole(role);
  };

  const handleAuthComplete = (role: 'customer' | 'provider') => {
    console.log('Auth completed for role:', role);
    onAuthComplete(role);
  };

  const handleBackToRole = () => {
    setSelectedRole(null);
  };

  const handleSkipToGuest = () => {
    console.log('Skipping to guest mode');
    onAuthComplete('guest');
  };

  if (!selectedRole && !defaultRole) {
    return <RoleSelection onRoleSelect={handleRoleSelect} />;
  }

  if (selectedRole) {
    return (
      <EmailPasswordAuth
        role={selectedRole}
        onBack={defaultRole ? undefined : handleBackToRole}
        onAuthComplete={handleAuthComplete}
        onSkip={handleSkipToGuest}
      />
    );
  }

  return null;
};

export default AuthContainer;
