import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const GuestGuard = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  
  // Get the redirect path from location state or default to dashboard
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  if (isAuthenticated) {
    // If authenticated, redirect to the intended page or dashboard
    return <Navigate to={from} replace />;
  }

  // If not authenticated, render the auth pages
  return <Outlet />;
};

export default GuestGuard;
