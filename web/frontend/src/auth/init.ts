import { initializeAuth } from '../store/authStore';

// Initialize authentication state when the app starts
export const initAuth = () => {
  // Execute immediately
  initializeAuth().catch(error => {
    console.error('Auth initialization failed:', error);
  });
};
