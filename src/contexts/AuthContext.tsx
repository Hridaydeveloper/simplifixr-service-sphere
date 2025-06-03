
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

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setUser(session?.user ?? null);
          console.log('Initial session user:', session?.user);
          
          // Create profile if user exists but profile doesn't
          if (session?.user && session.user.email_confirmed_at) {
            setTimeout(async () => {
              try {
                const existingProfile = await profileService.getProfile(session.user.id);
                if (!existingProfile) {
                  console.log('Creating profile for new user:', session.user.id);
                  await profileService.createProfile(session.user.id, {
                    full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                    location: session.user.user_metadata?.location || '',
                    role: session.user.user_metadata?.role || 'customer'
                  });
                  console.log('Profile created successfully');
                }
              } catch (error) {
                console.error('Error handling user profile:', error);
              }
            }, 0);
          }
        }
      } catch (error) {
        console.error('Error in getSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Clear guest mode when user logs in
      if (session?.user) {
        localStorage.removeItem('guestMode');
        
        // Handle profile creation for new confirmed users
        if (event === 'SIGNED_IN' && session.user.email_confirmed_at) {
          setTimeout(async () => {
            try {
              const existingProfile = await profileService.getProfile(session.user.id);
              if (!existingProfile) {
                console.log('Creating profile for newly signed in user:', session.user.id);
                await profileService.createProfile(session.user.id, {
                  full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                  location: session.user.user_metadata?.location || '',
                  role: session.user.user_metadata?.role || 'customer'
                });
                console.log('Profile created for signed in user');
              } else {
                console.log('Profile already exists for user:', session.user.id);
              }
            } catch (error) {
              console.error('Error creating profile on sign in:', error);
            }
          }, 0);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
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
