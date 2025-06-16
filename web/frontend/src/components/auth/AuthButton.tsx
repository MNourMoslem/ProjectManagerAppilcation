import { useRef, useState, useEffect, ButtonHTMLAttributes } from 'react';
import { LoadingSpinner } from '../buttons/LoadingSpinner';

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

// Ripple effect interface
interface Ripple {
  x: number;
  y: number;
  size: number;
  id: number;
}

const AuthButton = ({
  text,
  isLoading = false,
  variant = 'primary',
  fullWidth = false,
  icon,
  className = '',
  ...props
}: AuthButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextRippleId = useRef(0);

  // Clean up ripples after animation
  useEffect(() => {
    if (ripples.length > 0) {
      const timeoutId = setTimeout(() => {
        setRipples([]);
      }, 800); // Should match the CSS animation duration + a little extra
      
      return () => clearTimeout(timeoutId);
    }
  }, [ripples]);

  const createRipple = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (buttonRef.current) {
      const button = buttonRef.current;
      const rect = button.getBoundingClientRect();
      
      // Get click position relative to button
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate size based on button dimensions
      const size = Math.max(rect.width, rect.height) * 2;
      
      // Create new ripple
      const newRipple: Ripple = {
        x,
        y,
        size,
        id: nextRippleId.current
      };
      
      nextRippleId.current += 1;
      setRipples([...ripples, newRipple]);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    createRipple(e);
    
    if (props.onClick) {
      props.onClick(e);
    }
  };  const baseStyles = 'relative overflow-hidden flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
  };

  // Ripple colors
  const rippleColors = {
    primary: 'rgba(255, 255, 255, 0.3)',
    secondary: 'rgba(0, 0, 0, 0.1)',
    outline: 'rgba(0, 0, 0, 0.1)',
  };

  return (
    <button
      ref={buttonRef}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        animate-fade-in
        ${className}
      `}
      disabled={isLoading || props.disabled}
      onClick={handleClick}
      {...props}
    >
      {/* Ripple effect elements */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full animate-ripple"
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
            background: rippleColors[variant],
          }}
        />
      ))}
      
      {isLoading ? (
        <LoadingSpinner 
          size="sm" 
          color={variant === 'primary' ? 'white' : 'gray'} 
        />
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {text}
        </>
      )}
    </button>
  );
};

export default AuthButton;