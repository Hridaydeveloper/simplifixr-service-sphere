
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface AuthHandlerProps {
  role: 'customer' | 'provider';
  onSuccess: (role: 'customer' | 'provider') => void;
  onEmailSent: () => void;
  updateFormData: (data: any) => void;
}

export const useAuthHandler = ({ role, onSuccess, onEmailSent, updateFormData }: AuthHandlerProps) => {
  const { signUp, signIn } = useAuth();

  const handleFormSubmit = async (data: any, isSignIn: boolean = false) => {
    try {
      updateFormData(data);
      
      if (isSignIn) {
        const { error } = await signIn({
          email: data.email,
          password: data.password
        });

        if (error) {
          toast({
            title: "Sign In Failed",
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "Welcome back!",
          description: "You have successfully signed in."
        });
        
        onSuccess(role);
      } else {
        const { error } = await signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/confirm`,
            data: {
              full_name: data.fullName,
              location: data.location,
              role: role
            }
          }
        });

        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: "Account exists",
              description: "This email is already registered. Try signing in instead.",
              variant: "destructive"
            });
            return;
          }
          
          toast({
            title: "Sign Up Failed",
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        onEmailSent();
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  return { handleFormSubmit };
};
