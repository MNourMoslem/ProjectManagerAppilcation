import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthButton from '../../components/auth/AuthButton';
import { useAuthStore } from '../../store/authStore';

const VerificationSentPage = () => {
  const { user } = useAuthStore();
  const email = user?.email || 'your email';
  const navigate = useNavigate();

  const handleResendVerification = async () => {
    // In a real implementation, call an API to resend verification email
    console.log('Resending verification email');
    alert('Verification email resent. Please check your inbox.');
  };

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle={`We've sent a verification link to ${email}. Please check your inbox to activate your account.`}
    >
      <div className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-4 rounded-md">
          <p>
            If you don't see the email in your inbox, please check your spam folder or request a new
            verification link.
          </p>
        </div>

        <div className="space-y-3">
          <AuthButton
            onClick={handleResendVerification}
            isLoading={false}
            text="Resend Verification Email"
            variant="secondary"
            fullWidth
          />
            <div className="text-center">
            <span
              onClick={() => navigate('/auth/login')}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer"
            >
              Return to Login
            </span>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerificationSentPage;