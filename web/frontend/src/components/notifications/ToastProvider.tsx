import React, { useState, useEffect, createContext, useContext } from 'react';
import Notification, { NotificationProps } from './Notification';

interface ToastNotification extends Omit<NotificationProps, 'show'> {
  id: string;
  createdAt: Date;
}

interface ToastContextType {
  addToast: (toast: Omit<NotificationProps, 'show'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
  position?: NotificationProps['position'];
  defaultDuration?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 5,
  position = 'top-right',
  defaultDuration = 5000,
}) => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Remove expired toasts (for auto-dismiss ones)
  useEffect(() => {
    const currentTime = new Date();
    const expirationCheck = setInterval(() => {
      setToasts(prevToasts => 
        prevToasts.filter(toast => {
          if (!toast.autoDismiss) return true;
          const duration = toast.duration || defaultDuration;
          const expiryTime = new Date(toast.createdAt.getTime() + duration + 300); // Add 300ms for animation
          return expiryTime > currentTime;
        })
      );
    }, 1000);

    return () => clearInterval(expirationCheck);
  }, [defaultDuration]);

  // Add a new toast notification
  const addToast = (toast: Omit<NotificationProps, 'show'>) => {
    const id = Math.random().toString(36).substring(2, 11);
    const newToast = { 
      ...toast, 
      id, 
      createdAt: new Date(),
      duration: toast.duration || defaultDuration
    };
    
    setToasts(prevToasts => {
      // If we're at max capacity, remove the oldest toast
      const updatedToasts = [...prevToasts];
      if (updatedToasts.length >= maxToasts) {
        updatedToasts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        updatedToasts.shift(); // Remove the oldest
      }
      return [...updatedToasts, newToast];
    });
  };

  // Remove a specific toast by ID
  const removeToast = (id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  // Clear all toasts
  const clearToasts = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearToasts }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <Notification
            key={toast.id}
            {...toast}
            show={true}
            position={position}
            onDismiss={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
