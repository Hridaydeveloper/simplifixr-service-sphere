
import ComprehensiveAuth from "./ComprehensiveAuth";

interface AuthContainerProps {
  onAuthComplete: (role: 'customer' | 'provider' | 'guest') => void;
  defaultRole?: 'customer' | 'provider';
  fromBooking?: boolean;
  onBack?: () => void;
}

const AuthContainer = ({ onAuthComplete, defaultRole, fromBooking, onBack }: AuthContainerProps) => {
  return (
    <ComprehensiveAuth
      defaultRole={defaultRole}
      onComplete={onAuthComplete}
      fromBooking={fromBooking}
      onBack={onBack}
    />
  );
};

export default AuthContainer;
