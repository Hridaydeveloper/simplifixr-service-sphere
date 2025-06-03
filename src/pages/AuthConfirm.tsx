
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { profileService } from '@/services/profileService';

const AuthConfirm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Get the token_hash and type from URL params (Supabase format)
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        
        console.log('Auth confirm params:', { token_hash, type });

        if (token_hash && type) {
          // Use Supabase's verifyOtp method for email confirmation
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
          });

          if (error) {
            console.error('Email confirmation error:', error);
            setStatus('error');
            setMessage('Failed to confirm email. The link may be expired or invalid.');
            toast({
              variant: "destructive",
              title: "Confirmation Failed",
              description: error.message,
            });
            return;
          }

          if (data.user) {
            console.log('Email confirmed successfully for user:', data.user.email);
            
            // Wait a moment for the auth state to update
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setStatus('success');
            setMessage('Your email has been confirmed successfully!');
            
            toast({
              title: "Email Confirmed",
              description: "Your account has been verified successfully!",
            });

            // Get the user's role from metadata to determine redirect
            const userRole = data.user.user_metadata?.role || 'customer';
            console.log('User role for redirect:', userRole);
            
            // Redirect based on user role after 2 seconds
            setTimeout(() => {
              if (userRole === 'provider') {
                navigate('/become-provider');
              } else {
                navigate('/services');
              }
            }, 2000);
          }
        } else {
          // Handle the old format or missing params
          console.log('No token_hash found, checking for other params');
          setStatus('error');
          setMessage('Invalid confirmation link. Please check your email for the correct link.');
        }
      } catch (error: any) {
        console.error('Unexpected error during email confirmation:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    confirmEmail();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00B896]/5 to-[#00C9A7]/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-[#00B896] mx-auto mb-4 animate-spin" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirming your email...</h1>
              <p className="text-gray-600">Please wait while we verify your account.</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Confirmed!</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <p className="text-sm text-gray-500">Redirecting you now...</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirmation Failed</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/')}
                  className="w-full bg-[#00B896] hover:bg-[#00A085] text-white"
                >
                  Go to Homepage
                </Button>
                <Button 
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="w-full"
                >
                  Try Again
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthConfirm;
