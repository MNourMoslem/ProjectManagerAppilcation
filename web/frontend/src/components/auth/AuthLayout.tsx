import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  footer?: ReactNode;
}

const AuthLayout = ({ children, title, subtitle, footer }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-6 animate-fade-in-down">
          <Link to="/" className="flex items-center space-x-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black dark:text-white">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="text-xl font-medium tracking-tight text-gray-900 dark:text-white">TeamWork</span>
          </Link>
        </div>
        
        {/* Header */}
        <div className="text-center mb-6 animate-fade-in-up animate-delay-100">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
        
        {/* Content */}
        <div className="mb-6 animate-fade-in-up animate-delay-200">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="text-center text-sm text-gray-600 dark:text-gray-400 animate-fade-in-up animate-delay-300">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthLayout;