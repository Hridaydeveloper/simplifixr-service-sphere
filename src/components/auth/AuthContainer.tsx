
import ComprehensiveAuth from "./ComprehensiveAuth";

interface AuthContainerProps {
  onAuthComplete: () => void;
  fromBooking?: boolean;
  onBack?: () => void;
}

const AuthContainer = ({ onAuthComplete, fromBooking, onBack }: AuthContainerProps) => {
  return (
    <ComprehensiveAuth
      onComplete={onAuthComplete}
      fromBooking={fromBooking}
      onBack={onBack}
    />
  );
};

export default AuthContainer;
