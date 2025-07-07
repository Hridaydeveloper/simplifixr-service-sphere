
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AuthConfirm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Get all possible URL parameters that Supabase might send
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        const access_token = searchParams.get('access_token');
        const refresh_token = searchParams.get('refresh_token');
        
        console.log('Auth confirm params:', { token_hash, type, access_token, refresh_token });

        let confirmationResult = null;

        if (token_hash && type) {
          // New format - use verifyOtp
          console.log('Using new format verification with token_hash');
          confirmationResult = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
          });
        } else if (access_token && refresh_token) {
          // Old format - set session directly
          console.log('Using old format verification with access and refresh tokens');
          confirmationResult = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
        } else {
          // Try to handle URL fragments (sometimes tokens come after #)
          const fragment = window.location.hash.substring(1);
          const fragmentParams = new URLSearchParams(fragment);
          const fragmentAccessToken = fragmentParams.get('access_token');
          const fragmentRefreshToken = fragmentParams.get('refresh_token');
          
          if (fragmentAccessToken && fragmentRefreshToken) {
            console.log('Using URL fragment tokens');
            confirmationResult = await supabase.auth.setSession({
              access_token: fragmentAccessToken,
              refresh_token: fragmentRefreshToken,
            });
          } else {
            console.log('No valid confirmation parameters found');
            setStatus('error');
            setMessage('Invalid confirmation link. Please check your email for the correct link or try signing up again.');
            return;
          }
        }

        const { data, error } = confirmationResult;

        if (error) {
          console.error('Email confirmation error:', error);
          
          // Handle specific error cases
          if (error.message.includes('expired')) {
            setStatus('error');
            setMessage('The confirmation link has expired. Please sign up again to receive a new link.');
          } else if (error.message.includes('invalid')) {
            setStatus('error');
            setMessage('Invalid confirmation link. Please check your email for the correct link or sign up again.');
          } else {
            setStatus('error');
            setMessage('Failed to confirm email. Please try again or contact support.');
          }
          return;
        }

        if (data.user) {
          console.log('Email confirmed successfully for user:', data.user.email);
          
          // The AuthContext will handle profile creation via onAuthStateChange
          setStatus('success');
          setMessage('Your email has been confirmed successfully!');
          
          toast({
            title: "Email Confirmed",
            description: "Your account has been verified successfully!",
          });

          // Redirect based on user role after 2 seconds
          setTimeout(() => {
            const userRole = data.user.user_metadata?.role || 'customer';
            if (userRole === 'provider') {
              navigate('/become-provider');
            } else {
              navigate('/services');
            }
          }, 2000);
        } else {
          setStatus('error');
          setMessage('Confirmation failed. Please try again.');
        }
      } catch (error: any) {
        console.error('Unexpected error during email confirmation:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try signing up again.');
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
                  onClick={() => navigate('/auth')}
                  className="w-full bg-[#00B896] hover:bg-[#00A085] text-white"
                >
                  Sign Up Again
                </Button>
                <Button 
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full"
                >
                  Go to Homepage
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
