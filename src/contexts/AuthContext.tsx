
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User as AppUser } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => Promise<void>; // Changed from signOut to logout for consistency
  setUser: (user: AppUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Convert Supabase user to our app user
          const appUser: AppUser = {
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            firstName: currentSession.user.user_metadata.firstName,
            lastName: currentSession.user.user_metadata.lastName,
            createdAt: new Date(currentSession.user.created_at),
            updatedAt: new Date(),
            subscriptionTier: 'free',
            subscriptionStatus: 'active'
          };
          setUser(appUser);
        } else {
          setUser(null);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        // Convert Supabase user to our app user
        const appUser: AppUser = {
          id: currentSession.user.id,
          email: currentSession.user.email || '',
          firstName: currentSession.user.user_metadata.firstName,
          lastName: currentSession.user.user_metadata.lastName,
          createdAt: new Date(currentSession.user.created_at),
          updatedAt: new Date(),
          subscriptionTier: 'free',
          subscriptionStatus: 'active'
        };
        setUser(appUser);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) throw signInError;
      
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
      toast({
        variant: "destructive",
        title: "Login failed",
        description: err.message || "Please check your credentials and try again.",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstName,
            lastName,
          },
          emailRedirectTo: window.location.origin + '/login',
        }
      });
      
      if (signUpError) throw signUpError;
      
      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account.",
      });
      
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: err.message || "Please try again later.",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) throw signOutError;
      
      setUser(null);
      setSession(null);
      
    } catch (err: any) {
      setError(err.message || 'Logout failed.');
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: err.message || "Please try again later.",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, error, login, register, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
