
import { useNavigate, useLocation } from "react-router-dom";
import SimpleAuth from "@/components/auth/SimpleAuth";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || "/";

  const handleAuthSuccess = (role: 'customer' | 'provider') => {
    navigate(from, { replace: true });
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
      <SimpleAuth
        onBack={handleBack}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Auth;
