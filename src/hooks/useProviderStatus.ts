import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ProviderStatus {
  isProvider: boolean;
  isVerified: boolean;
  hasRegistration: boolean;
  loading: boolean;
}

export const useProviderStatus = () => {
  const [status, setStatus] = useState<ProviderStatus>({
    isProvider: false,
    isVerified: false,
    hasRegistration: false,
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
          loading: false
        });
        return;
      }

      try {
        // Check user profile role (for now, we'll use this to determine provider status)
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error checking user profile:', profileError);
        }

        // For now, we'll consider a user a provider if they have the role set
        // Later when service_providers table is created, we'll check that table
        const isProvider = (profile as any)?.role === 'provider';
        const hasRegistration = isProvider; // Simplified for now
        const isVerified = isProvider; // For demo, verified providers are those with provider role

        setStatus({
          isProvider,
          isVerified,
          hasRegistration,
          loading: false
        });
      } catch (error) {
        console.error('Error checking provider status:', error);
        setStatus({
          isProvider: false,
          isVerified: false,
          hasRegistration: false,
          loading: false
        });
      }
    };

    checkProviderStatus();
  }, [user]);

  return status;
};