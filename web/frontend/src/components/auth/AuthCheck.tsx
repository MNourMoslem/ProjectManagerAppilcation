import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

/**
 * Component that checks authentication status on mount and periodically.
 * Place this in protected layouts/pages to ensure user authentication is always valid.
 */
const AuthCheck: React.FC = () => {
  const { fetchUser, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check authentication on component mount
    const checkAuth = async () => {
      try {
        await fetchUser();
      } catch (error) {
        // If fetchUser fails, user will be logged out via the error handling in fetchUser
        console.error('Authentication check failed:', error);
      }
    };
    
    // Run check immediately
    checkAuth();
    
    // Set up periodic checks (every 5 minutes)
    const intervalId = setInterval(checkAuth, 5 * 60 * 1000);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [fetchUser]);
  
  // If not authenticated, redirect to login
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // This component doesn't render anything visible
  return null;
};

export default AuthCheck;
