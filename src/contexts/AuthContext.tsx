
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage for existing session
    const storedUser = localStorage.getItem('skininsight_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // In a real app, these would communicate with Supabase Auth
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Mock user for now - would be replaced with Supabase Auth call
      const mockUser: User = {
        id: '123456',
        email,
        firstName: 'Demo',
        lastName: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
        subscriptionTier: 'free',
        subscriptionStatus: 'active'
      };
      
      setUser(mockUser);
      localStorage.setItem('skininsight_user', JSON.stringify(mockUser));
      setError(null);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Mock user for now - would be replaced with Supabase Auth call
      const mockUser: User = {
        id: '123456',
        email,
        createdAt: new Date(),
        updatedAt: new Date(),
        subscriptionTier: 'free',
        subscriptionStatus: 'trial'
      };
      
      setUser(mockUser);
      localStorage.setItem('skininsight_user', JSON.stringify(mockUser));
      setError(null);
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      // In a real app, this would call to Supabase Auth logout
      localStorage.removeItem('skininsight_user');
      setUser(null);
      setError(null);
    } catch (err) {
      setError('Logout failed.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logout, setUser }}
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
