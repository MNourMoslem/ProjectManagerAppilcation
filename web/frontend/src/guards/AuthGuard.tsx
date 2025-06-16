import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import AuthCheck from '../components/auth/AuthCheck';

const AuthGuard = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page but save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the child routes with AuthCheck
  return (
    <>
      <AuthCheck />
      <Outlet />
    </>
  );
};

export default AuthGuard;
