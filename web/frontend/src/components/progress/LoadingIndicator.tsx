import React from 'react';

export interface LoadingIndicatorProps {
  /**
   * Size of the loading indicator
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  
  /**
   * Type of loading indicator
   */
  type?: 'spinner' | 'dots' | 'pulse';
  
  /**
   * Color variant
   */
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark';
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'md',
  type = 'spinner',
  variant = 'primary',
  className = ''
}) => {
  // Size styles
  const sizeStyles = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };
  
  // Variant styles
  const variantColors = {
    primary: 'text-indigo-600 dark:text-indigo-500',
    success: 'text-green-500 dark:text-green-400',
    warning: 'text-yellow-500 dark:text-yellow-400',
    danger: 'text-red-500 dark:text-red-400',
    info: 'text-blue-500 dark:text-blue-400',
    light: 'text-gray-300 dark:text-gray-400',
    dark: 'text-gray-800 dark:text-gray-200'
  };
  
  // Spinner loading indicator
  if (type === 'spinner') {
    return (
      <div className={`${sizeStyles[size]} ${variantColors[variant]} ${className}`}>
        <svg
          className="animate-spin w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }
  
  // Dots loading indicator
  if (type === 'dots') {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`${sizeStyles[size].split(' ')[0]} rounded-full ${variantColors[variant]} animate-pulse`}
            style={{ animationDelay: `${index * 0.15}s` }}
          ></div>
        ))}
      </div>
    );
  }
  
  // Pulse loading indicator
  if (type === 'pulse') {
    return (
      <div className={`${sizeStyles[size]} ${variantColors[variant]} ${className}`}>
        <div className="w-full h-full rounded-full animate-ping opacity-75"></div>
      </div>
    );
  }
  
  return null;
};

export default LoadingIndicator;
