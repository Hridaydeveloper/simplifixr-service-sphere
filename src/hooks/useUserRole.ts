
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type UserRole = 'customer' | 'provider' | 'admin';

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          setRole('customer'); // Default fallback
        } else {
          setRole(data.role as UserRole);
        }
      } catch (error) {
        console.error('Error in fetchUserRole:', error);
        setRole('customer');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const updateRole = async (newRole: UserRole) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', user.id);

      if (error) throw error;
      setRole(newRole);
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };

  return { role, loading, updateRole };
};
