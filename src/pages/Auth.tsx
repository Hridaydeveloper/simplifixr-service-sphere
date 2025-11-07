
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
    <div className="min-h-screen flex items-center justify-center bg-black/90 backdrop-blur-md p-4 fixed inset-0 z-50">
      <div className="w-full max-w-md bg-background rounded-2xl shadow-2xl border border-border/50">
        <SimpleAuth
          onBack={handleBack}
          onSuccess={handleAuthSuccess}
        />
      </div>
    </div>
  );
};

export default Auth;
