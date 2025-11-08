import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ProviderStatus {
  isProvider: boolean;
  isVerified: boolean;
  hasRegistration: boolean;
  isApproved: boolean;
  isPending: boolean;
  loading: boolean;
}

export const useProviderStatus = () => {
  const [status, setStatus] = useState<ProviderStatus>({
    isProvider: false,
    isVerified: false,
    hasRegistration: false,
    isApproved: false,
    isPending: false,
    loading: true
  });
  const { user } = useAuth();

  useEffect(() => {
    const checkProviderStatus = async () => {
      if (!user) {
        setStatus({
          isProvider: false,
          isVerified: false,
          hasRegistration: false,
          isApproved: false,
          isPending: false,
          loading: false
        });
        return;
      }

      try {
        // Check user profile for role (using type casting until DB types update)
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error checking user profile:', profileError);
        }

        const isProvider = (profile as any)?.role === 'provider';
        
        // Check for provider registration (using type casting until DB types update)
        const { data: registration, error: regError } = await supabase
          .from('provider_registrations' as any)
          .select('status, verified')
          .eq('user_id', user.id)
          .maybeSingle();

        const hasRegistration = !!registration && !regError;
        const isVerified = (registration as any)?.verified === true;
        const registrationStatus = (registration as any)?.status;
        const isApproved = registrationStatus === 'approved' && isVerified;
        const isPending = registrationStatus === 'pending';

        setStatus({
          isProvider,
          isVerified,
          hasRegistration,
          isApproved,
          isPending,
          loading: false
        });
      } catch (error) {
        console.error('Error checking provider status:', error);
        setStatus({
          isProvider: false,
          isVerified: false,
          hasRegistration: false,
          isApproved: false,
          isPending: false,
          loading: false
        });
      }
    };

    checkProviderStatus();
  }, [user]);

  return status;
};