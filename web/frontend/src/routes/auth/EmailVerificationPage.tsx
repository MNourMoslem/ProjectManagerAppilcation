import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthButton from '../../components/auth/AuthButton';
import { useAuthStore } from '../../store/authStore';

const EmailVerificationPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { verifyEmail, isLoading, error, isAuthenticated } = useAuthStore();
  const [verificationAttempted, setVerificationAttempted] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        await verifyEmail(token);
        setVerificationAttempted(true);
      }
    };

    verifyToken();
  }, [token, verifyEmail]);

  useEffect(() => {
    if (verificationAttempted && isAuthenticated && !error) {
      // Redirect to dashboard after successful verification
      const redirectTimer = setTimeout(() => {
        navigate('/dashboard');
      }, 3000);

      return () => clearTimeout(redirectTimer);
    }
  }, [verificationAttempted, isAuthenticated, error, navigate]);

  const handleResendVerification = async () => {
    // In a real implementation, call an API to resend verification email
    console.log('Resending verification email');
    alert('Verification email resent. Please check your inbox.');
  };

  return (
    <AuthLayout
      title="Email Verification"
      subtitle={
        error
          ? "We couldn't verify your email"
          : isAuthenticated
          ? "Your email has been verified!"
          : "Verifying your email..."
      }
    >
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div>
            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-md mb-6">
              <p>{error}</p>
              <p className="mt-2">The verification link may have expired or is invalid.</p>
            </div>
            <AuthButton
              onClick={handleResendVerification}
              isLoading={false}
              text="Resend Verification Email"
              variant="secondary"
              fullWidth
            />
          </div>
        ) : isAuthenticated ? (
          <div>
            <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 p-4 rounded-md mb-6">
              <p>Your email has been successfully verified!</p>
              <p className="mt-2">You will be redirected to the dashboard in a few seconds.</p>
            </div>
            <AuthButton
              onClick={() => navigate('/dashboard')}
              isLoading={false}
              text="Go to Dashboard"
              variant="primary"
              fullWidth
            />
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        <div className="text-center mt-4">
          <Link
            to="/login"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default EmailVerificationPage;