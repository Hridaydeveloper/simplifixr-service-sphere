
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { profileService } from '@/services/profileService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const createProfileIfNeeded = async (user: User) => {
    try {
      console.log('Creating profile for user:', user.id);
      const existingProfile = await profileService.getProfile(user.id);
      if (!existingProfile) {
        await profileService.createProfile(user.id, {
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          location: user.user_metadata?.location || '',
          role: user.user_metadata?.role || 'customer'
        });
        console.log('Profile created successfully');
      } else {
        console.log('Profile already exists for user:', user.id);
      }
    } catch (error) {
      console.error('Error handling user profile:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email || 'none');
      
      if (!mounted) return;

      setUser(session?.user ?? null);
      
      // Clear guest mode when user logs in
      if (session?.user) {
        localStorage.removeItem('guestMode');
        
        // Create profile for authenticated users
        if (event === 'SIGNED_IN') {
          setTimeout(() => {
            if (mounted) {
              createProfileIfNeeded(session.user);
            }
          }, 0);
        }
      }
      
      if (mounted) {
        setLoading(false);
      }
    });

    // Then get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          console.log('Initial session user:', session?.user?.email || 'none');
          if (mounted) {
            setUser(session?.user ?? null);
            
            // Create profile if user exists
            if (session?.user) {
              setTimeout(() => {
                if (mounted) {
                  createProfileIfNeeded(session.user);
                }
              }, 0);
            }
          }
        }
      } catch (error) {
        console.error('Error in getSession:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error('Sign out error:', error);
      }
      // Clear guest mode on logout
      localStorage.removeItem('guestMode');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  const refreshUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error refreshing user:', error);
      } else {
        setUser(user);
      }
    } catch (error) {
      console.error('Error in refreshUser:', error);
    }
  };

  const value = {
    user,
    loading,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
