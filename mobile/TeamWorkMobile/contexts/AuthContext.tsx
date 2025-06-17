import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { getToken, getUser } from '../api/apiUtils';
import * as authApi from '../api/authApi';
import { useRouter } from 'expo-router';

interface User {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  [key: string]: any; // For other user properties
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize router

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await getToken();
        if (token) {
          const userData = await getUser();
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        console.error('Auth status check error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Monitor authentication state changes
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        console.log('Auth state changed: Authenticated, navigating to dashboard');
        router.replace('/(dashboard)/home');
      } else if (!isAuthenticated && !isLoading) {
        console.log('Auth state changed: Not authenticated, navigating to login');
        router.replace('/(auth)/login');
      }
    }
  }, [isAuthenticated, isLoading, user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login({ email, password });
      console.log('Login response:', response); // Add logging
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        console.log('Authentication state updated:', { user: response.user, isAuthenticated: true });
        router.push('/'); // Navigate to home on successful login
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.signup({ name, email, password });
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        router.push('/'); // Navigate to home on successful signup
      }
    } catch (err: any) {
      setError(err.message || 'Failed to signup');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
      setIsAuthenticated(false);
      // Force navigation to login screen
      router.replace('/(auth)/login');
    } catch (err: any) {
      console.error('Logout error:', err);
      setError(err.message || 'Failed to logout');
      // Even if there's an error, we should still reset the auth state
      setUser(null);
      setIsAuthenticated(false);
      router.replace('/(auth)/login');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.verifyEmail({ code });
      if (response.success && response.user) {
        setUser(response.user);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify email');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.forgotPassword({ email });
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.resetPassword(token, { password });
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.resendVerification();
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        error,
        login,
        signup,
        logout,
        verifyEmail,
        forgotPassword,
        resetPassword,
        resendVerification,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
