
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { profileService } from '@/services/profileService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  signUp: (data: { email: string; password: string; options?: any }) => Promise<any>;
  signIn: (data: { email: string; password: string }) => Promise<any>;
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
        const userData = user.user_metadata || {};
        await profileService.createProfile(user.id, {
          full_name: userData.full_name || user.email?.split('@')[0] || 'User',
          location: userData.location || '',
          role: userData.role || 'customer',
          bio: userData.service_description || userData.bio || '',
          phone: userData.phone || ''
        });
        console.log('Profile created successfully');
      } else {
        console.log('Profile already exists for user:', user.id);
        
        // Update role if it's specified in metadata but not in profile
        const userData = user.user_metadata || {};
        if (userData.role && userData.role !== (existingProfile as any).role) {
          console.log('Updating user role to:', userData.role);
          await profileService.updateProfile(user.id, {
            role: userData.role
          });
        }
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
        
        // Create/update profile for authenticated users
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
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
            
            // Create/update profile if user exists
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

  const signUp = async (data: { email: string; password: string; options?: any }) => {
    try {
      const result = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          ...data.options,
          emailRedirectTo: `${window.location.origin}/auth/confirm`
        }
      });
      return result;
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
    }
  };

  const signIn = async (data: { email: string; password: string }) => {
    try {
      const result = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });
      return result;
    } catch (error) {
      console.error('Error in signIn:', error);
      throw error;
    }
  };

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
    signUp,
    signIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
