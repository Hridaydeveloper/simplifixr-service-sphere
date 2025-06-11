
import { useState } from 'react';

export type AuthStep = 'role-selection' | 'details' | 'signin' | 'email-sent';

export const useAuthSteps = (initialStep: AuthStep = 'role-selection') => {
  const [step, setStep] = useState<AuthStep>(initialStep);
  const [role, setRole] = useState<'customer' | 'provider'>('customer');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    location: '',
    password: ''
  });

  const goToStep = (newStep: AuthStep) => setStep(newStep);
  const updateRole = (newRole: 'customer' | 'provider') => setRole(newRole);
  const updateFormData = (data: typeof formData) => setFormData(data);

  return {
    step,
    role,
    formData,
    goToStep,
    updateRole,
    updateFormData,
    setStep,
    setRole,
    setFormData
  };
};
