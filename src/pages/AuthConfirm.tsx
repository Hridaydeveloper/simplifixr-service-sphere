
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
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        const email = searchParams.get('email');

        console.log('Confirming email with params:', { token_hash, type, email });

        if (token_hash && type) {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
          });

          if (error) {
            console.error('Email confirmation error:', error);
            setStatus('error');
            setMessage(error.message || 'Failed to confirm email. The link may be expired or invalid.');
            toast({
              variant: "destructive",
              title: "Confirmation Failed",
              description: error.message || 'Failed to confirm email. Please try again.',
            });
          } else if (data.user) {
            console.log('Email confirmed successfully for user:', data.user.email);
            
            // Create profile if it doesn't exist
            try {
              const existingProfile = await profileService.getProfile(data.user.id);
              if (!existingProfile) {
                console.log('Creating profile for confirmed user:', data.user.id);
                await profileService.createProfile(data.user.id, {
                  full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
                  location: data.user.user_metadata?.location || '',
                  role: data.user.user_metadata?.role || 'customer'
                });
              }
            } catch (profileError) {
              console.error('Error creating profile:', profileError);
            }

            setStatus('success');
            setMessage('Your email has been confirmed successfully! Redirecting you now...');
            toast({
              title: "Email Confirmed",
              description: "Your account has been verified successfully!",
            });
            
            // Redirect based on user role
            const userRole = data.user.user_metadata?.role || 'customer';
            setTimeout(() => {
              if (userRole === 'provider') {
                navigate('/become-provider');
              } else {
                navigate('/services');
              }
            }, 2000);
          }
        } else {
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
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/services')}
                  className="w-full bg-[#00B896] hover:bg-[#00A085] text-white"
                >
                  Go to Services
                </Button>
                <Button 
                  onClick={() => navigate('/become-provider')}
                  variant="outline"
                  className="w-full"
                >
                  Become a Provider
                </Button>
              </div>
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
