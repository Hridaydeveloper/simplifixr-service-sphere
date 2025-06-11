
import RoleSelection from "../RoleSelection";
import DetailsForm from "../DetailsForm";
import EmailSentConfirmation from "../EmailSentConfirmation";
import { AuthStep } from "../hooks/useAuthSteps";

interface AuthStepRendererProps {
  step: AuthStep;
  role: 'customer' | 'provider';
  formData: {
    fullName: string;
    email: string;
    location: string;
    password: string;
  };
  defaultRole: 'customer' | 'provider';
  fromBooking?: boolean;
  onRoleSelect: (selectedRole: 'customer' | 'provider' | 'guest') => void;
  onFormSubmit: (data: any, isSignIn?: boolean) => Promise<void>;
  onSignIn: () => void;
  onSignUp: () => void;
  onBackToDetails: () => void;
  onTryDifferentEmail: () => void;
  onContinueAsGuest: () => void;
}

const AuthStepRenderer = ({
  step,
  role,
  formData,
  defaultRole,
  fromBooking = false,
  onRoleSelect,
  onFormSubmit,
  onSignIn,
  onSignUp,
  onBackToDetails,
  onTryDifferentEmail,
  onContinueAsGuest
}: AuthStepRendererProps) => {
  switch (step) {
    case 'role-selection':
      return (
        <RoleSelection
          onSelect={onRoleSelect}
          defaultRole={defaultRole}
        />
      );
    case 'details':
      return (
        <DetailsForm
          role={role}
          onSubmit={onFormSubmit}
          onSignIn={onSignIn}
          fromBooking={fromBooking}
        />
      );
    case 'signin':
      return (
        <DetailsForm
          role={role}
          onSubmit={(data) => onFormSubmit(data, true)}
          onSignUp={onSignUp}
          isSignIn={true}
          fromBooking={fromBooking}
        />
      );
    case 'email-sent':
      return (
        <EmailSentConfirmation
          email={formData.email}
          onBack={onBackToDetails}
          onTryDifferentEmail={onTryDifferentEmail}
          onContinueAsGuest={onContinueAsGuest}
          fullName={formData.fullName}
          location={formData.location}
          role={role}
        />
      );
    default:
      return null;
  }
};

export default AuthStepRenderer;
