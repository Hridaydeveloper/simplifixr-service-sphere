
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import EmailConfirmAuth from "@/components/auth/EmailConfirmAuth";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || "/";
  const defaultRole = location.state?.role || 'customer';

  const handleAuthSuccess = (role: 'customer' | 'provider') => {
    if (role === 'provider') {
      navigate('/provider-dashboard');
    } else {
      navigate(from, { replace: true });
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00B896]/5 to-[#00C9A7]/5 p-4">
      <EmailConfirmAuth
        onBack={handleBack}
        onSuccess={handleAuthSuccess}
        defaultRole={defaultRole}
      />
    </div>
  );
};

export default Auth;
