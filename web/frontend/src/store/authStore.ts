import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// API URL - use environment variable or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Define User interface based on the User schema
interface User {
  _id: string;
  email: string;
  name: string;
  lastLogin: Date;
  isVerified: boolean;
  darkMode: boolean;
  projects: string[];
  numUnreadMails?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  setNewPassword: (token: string, newPassword: string) => Promise<void>;
  // Commented out for portfolio - skip email verification
  // verifyEmail: (token: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  fetchUser: () => Promise<void>;
  clearError: () => void;
}

// Flag for using mock data or real API
const USE_MOCK_API = false; // Set to false to use real API endpoints

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async(email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Use mock data if flag is set
          if (USE_MOCK_API) {
            console.log(`Mock login with email: ${email}`);
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));
              // Mock successful login
            set({ 
              isLoading: false,
              isAuthenticated: true,
              user: {
                _id: 'mock-user-id',
                email,
                name: email.split('@')[0],
                lastLogin: new Date(),
                isVerified: true,
                darkMode: false,
                projects: [],
                numUnreadMails: 0
              },
              token: 'mock-jwt-token'
            });
            return;
          }
          
          // Real API call
          const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Login failed');
          }
          
          // Store the token in localStorage for use in requests
          localStorage.setItem('auth-token', data.token);
          
          // Debug logging for production
          if (import.meta.env.VITE_NODE_ENV === 'production') {
            console.log('Login successful, token stored:', {
              hasToken: !!data.token,
              tokenPreview: data.token ? `${data.token.substring(0, 10)}...` : 'none',
              localStorage: {
                authToken: !!localStorage.getItem('auth-token'),
                token: !!localStorage.getItem('token')
              }
            });
          }

          set({ 
            isLoading: false,
            isAuthenticated: true,
            user: data.user,
            token: data.token
          });          // Fetch user data
          const store = useAuthStore.getState();
          await store.fetchUser();
        } catch (error) {
          console.error('Login error:', error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An error occurred during login' 
          });
        }
      },      signup: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Use mock data if flag is set
          if (USE_MOCK_API) {
            console.log(`Mock signup with name: ${name}, email: ${email}`);
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));
              // Mock successful signup
            set({ 
              isLoading: false,
              isAuthenticated: false, // User needs to verify email
              user: {
                _id: 'mock-user-id',
                email,
                name,
                lastLogin: new Date(),
                isVerified: false, // New users start unverified
                darkMode: false,
                projects: [],
                numUnreadMails: 0
              },
              token: null // No token until email is verified
            });
            return;
          }
          
          // Real API call
          const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Signup failed');
          }
          
          // Store token if provided (some backends provide token even before verification)
          if (data.token) {
            localStorage.setItem('auth-token', data.token);
          }
          
          set({ 
            isLoading: false,
            isAuthenticated: data.user.isVerified, // Only set authenticated if already verified
            user: data.user,
            token: data.token // Could be null if verification required
          });
        } catch (error) {
          console.error('Signup error:', error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An error occurred during signup' 
          });
        }
      },

      logout: () => {
        if (!USE_MOCK_API) {
          // Make API call to logout (invalidate token on server)
          fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
          }).catch(error => {
            console.error('Logout error:', error);
          });
          
          // Remove token from localStorage (clean up both possible keys)
          localStorage.removeItem('auth-token');
          localStorage.removeItem('token');
        }
          console.log('User logged out');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false
        });
      },

      resetPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          // Use mock data if flag is set
          if (USE_MOCK_API) {
            console.log(`Mock password reset for email: ${email}`);
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Mock success
            set({ isLoading: false });
            return;
          }
          
          // Real API call
          const response = await fetch(`${API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Password reset request failed');
          }
          
          set({ isLoading: false });
        } catch (error) {
          console.error('Reset password error:', error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An error occurred during password reset' 
          });
        }
      },

      setNewPassword: async (token, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          // Use mock data if flag is set
          if (USE_MOCK_API) {
            console.log(`Mock set new password with token: ${token}`);
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Mock success
            set({ isLoading: false });
            return;
          }
          
          // Real API call
          const response = await fetch(`${API_URL}/auth/set-new-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, newPassword }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Setting new password failed');
          }
          
          set({ isLoading: false });
        } catch (error) {
          console.error('Set new password error:', error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An error occurred while setting new password' 
          });
        }
      },

      // Commented out for portfolio - skip email verification
      /*
      verifyEmail: async (token) => {
        set({ isLoading: true, error: null });
        try {
          // Use mock data if flag is set
          if (USE_MOCK_API) {
            console.log(`Mock email verification with token: ${token}`);
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Mock successful verification
            set((state) => ({
              isLoading: false,
              isAuthenticated: true,
              user: state.user ? { ...state.user, isVerified: true } : null,
              token: 'mock-jwt-token'
            }));
            return;
          }
          
          // Real API call
          const response = await fetch(`${API_URL}/auth/verify-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Email verification failed');
          }
          
          // Update auth state with verified user
          set({
            isLoading: false,
            isAuthenticated: true,
            user: data.user,
            token: data.token
          });
        } catch (error: any) {
          console.error('Email verification error:', error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An error occurred during email verification' 
          });
        }
      },
      */

      // Email verification skipped for portfolio

      updateUser: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const token = localStorage.getItem('auth-token') || localStorage.getItem('token');
          
          // Use mock data if flag is set
          if (USE_MOCK_API) {
            console.log(`Mock update user:`, userData);
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Update user in state
            set((state) => ({
              isLoading: false,
              user: state.user ? { ...state.user, ...userData } : null
            }));
            return;
          }
          
          // Real API call
          const response = await fetch(`${API_URL}/auth/profile`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Profile update failed');
          }
          
          set((state) => ({
            isLoading: false,
            user: state.user ? { ...state.user, ...data.user } : null
          }));
        } catch (error) {
          console.error('Update user error:', error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An error occurred while updating profile' 
          });
        }
      },      changePassword: async (currentPassword, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          const token = localStorage.getItem('auth-token') || localStorage.getItem('token');
          
          // Use mock data if flag is set
          if (USE_MOCK_API) {
            console.log(`Mock change password`);
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Mock success
            set({ isLoading: false });
            return;
          }
          
          // Real API call
          const response = await fetch(`${API_URL}/auth/change-password`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ currentPassword, newPassword }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Password change failed');
          }
          
          // Update token if a new one was provided
          if (data.token) {
            localStorage.setItem('auth-token', data.token);
            set({ 
              isLoading: false, 
              token: data.token 
            });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Change password error:', error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An error occurred while changing password' 
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
        fetchUser: async () => {
        set({ isLoading: true, error: null });
        try {
          // Use mock data if flag is set
          if (USE_MOCK_API) {
            console.log('Mock fetching user data');
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Mock data
            set({
              isLoading: false
            });
            return;
          }
          
          // Get token from localStorage (try both keys for compatibility)
          const token = localStorage.getItem('auth-token') || localStorage.getItem('token');
          if (!token) {
            throw new Error('No authentication token found');
          }
          
          // Real API call
          const response = await fetch(`${API_URL}/auth/check-auth`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch user data');
          }
          
          set({ 
            isLoading: false,
            user: data.user,
            isAuthenticated: true
          });
        } catch (error) {
          console.error('Fetch user error:', error);
          
          // If authentication error, clear user state
          if (error instanceof Error && 
              (error.message.includes('authentication') || 
               error.message.includes('Unauthorized') || 
               error.message.includes('token'))) {
            set({ 
              isLoading: false,
              isAuthenticated: false,
              user: null,
              token: null,
              error: 'Authentication expired. Please log in again.'
            });
            localStorage.removeItem('auth-token');
          } else {
            set({ 
              isLoading: false, 
              error: error instanceof Error ? error.message : 'An error occurred while fetching user data'
            });
          }
        }
      }
    }),    {
      name: 'auth-storage', // name of the item in the storage
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

// Initialize auth state by checking localStorage
export const initializeAuth = async () => {
  const token = localStorage.getItem('auth-token') || localStorage.getItem('token');
  if (token) {
    // Token exists, try to fetch user data
    const authStore = useAuthStore.getState();
    try {
      await authStore.fetchUser();
    } catch (error) {
      console.error('Failed to initialize auth state:', error);
      // Clear localStorage if token is invalid (both keys)
      localStorage.removeItem('auth-token');
      localStorage.removeItem('token');
    }
  }
};