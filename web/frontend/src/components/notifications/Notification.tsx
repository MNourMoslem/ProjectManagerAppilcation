import React, { useState, useEffect } from 'react';

export interface NotificationProps {
  /**
   * The title or header of the notification
   */
  title?: string;
  
  /**
   * The main message content of the notification
   */
  message: string;
  
  /**
   * The type/variant of the notification which determines its color scheme
   */
  type?: 'info' | 'success' | 'warning' | 'error';
  
  /**
   * Whether the notification should be visible
   */
  show: boolean;
  
  /**
   * Function to call when the notification is dismissed
   */
  onDismiss?: () => void;
  
  /**
   * Whether the notification should auto-dismiss after a timeout
   */
  autoDismiss?: boolean;
  
  /**
   * Duration in milliseconds before auto-dismissing (default: 5000ms)
   */
  duration?: number;
  
  /**
   * Position of the notification on the screen
   */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  
  /**
   * Additional CSS class name
   */
  className?: string;
  
  /**
   * Optional action button text
   */
  actionText?: string;
  
  /**
   * Optional action button click handler
   */
  onAction?: () => void;
  
  /**
   * Optional icon component or element to display
   */
  icon?: React.ReactNode;
}

const Notification: React.FC<NotificationProps> = ({
  title,
  message,
  type = 'info',
  show,
  onDismiss,
  autoDismiss = true,
  duration = 5000,
  position = 'top-right',
  className = '',
  actionText,
  onAction,
  icon
}) => {
  const [isVisible, setIsVisible] = useState(show);
  const [isExiting, setIsExiting] = useState(false);

  // Handle show prop changes
  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsExiting(false);
    } else {
      handleDismiss();
    }
  }, [show]);

  // Auto-dismiss functionality
  useEffect(() => {
    let dismissTimer: number | undefined;
    
    if (isVisible && autoDismiss) {
      dismissTimer = window.setTimeout(() => {
        handleDismiss();
      }, duration);
    }
    
    return () => {
      if (dismissTimer) clearTimeout(dismissTimer);
    };
  }, [isVisible, autoDismiss, duration]);

  const handleDismiss = () => {
    setIsExiting(true);
    // Wait for exit animation to complete before fully hiding
    setTimeout(() => {
      setIsVisible(false);
      if (onDismiss) onDismiss();
    }, 300); // Match this with the CSS transition duration
  };

  // If not visible at all, render nothing
  if (!isVisible && !isExiting) return null;

  // Styling based on notification type
  const typeStyles = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      border: 'border-blue-400 dark:border-blue-700',
      text: 'text-blue-800 dark:text-blue-300',
      icon: icon || (
        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      )
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/30',
      border: 'border-green-400 dark:border-green-700',
      text: 'text-green-800 dark:text-green-300',
      icon: icon || (
        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/30',
      border: 'border-yellow-400 dark:border-yellow-700',
      text: 'text-yellow-800 dark:text-yellow-300',
      icon: icon || (
        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/30',
      border: 'border-red-400 dark:border-red-700',
      text: 'text-red-800 dark:text-red-300',
      icon: icon || (
        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )
    }
  };

  // Position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  // Animation classes
  const animationClasses = isExiting
    ? 'animate-fade-out'
    : 'animate-fade-in';

  return (
    <div 
      className={`fixed z-50 ${positionClasses[position]} ${animationClasses} ${className}`}
      role="alert"
    >
      <div className={`max-w-md rounded-md border ${typeStyles[type].border} ${typeStyles[type].bg} p-4 shadow-lg transition-all duration-300`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {typeStyles[type].icon}
          </div>
          <div className="ml-3 flex-1">
            {title && (
              <h3 className={`text-sm font-medium ${typeStyles[type].text}`}>
                {title}
              </h3>
            )}
            <div className={`text-sm ${typeStyles[type].text} mt-1`}>
              {message}
            </div>
            
            {actionText && onAction && (
              <div className="mt-3">
                <button
                  type="button"
                  className={`text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    type === 'info' ? 'text-blue-600 dark:text-blue-400 focus:ring-blue-500' :
                    type === 'success' ? 'text-green-600 dark:text-green-400 focus:ring-green-500' :
                    type === 'warning' ? 'text-yellow-600 dark:text-yellow-400 focus:ring-yellow-500' :
                    'text-red-600 dark:text-red-400 focus:ring-red-500'
                  }`}
                  onClick={() => {
                    onAction();
                    handleDismiss();
                  }}
                >
                  {actionText}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={handleDismiss}
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
