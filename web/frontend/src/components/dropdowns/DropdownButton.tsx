import type { BaseButtonProps } from '../buttons/ButtonBase';
import { buttonSizes, buttonStates, buttonFont } from '../buttons/ButtonBase';

interface DropdownButtonProps extends BaseButtonProps {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost';
  showCaret?: boolean;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

function DropdownButton({ 
  icon, 
  text, 
  onClick, 
  disabled = false, 
  type = 'button',
  size = 'md',
  variant = 'default',
  showCaret = true,
  iconPosition = 'left',
  className = '',
  loading = false,
  children
}: DropdownButtonProps) {
  
  // Styles for different variants
  const variants = {
    default: 'bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700',
    primary: 'bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600',
    ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${buttonFont}
        ${buttonSizes[size]}
        ${buttonStates.focus}
        ${disabled || loading ? buttonStates.disabled : ''}
        ${variants[variant]}
        rounded-md transition-all duration-150
        flex items-center justify-center
        ${className}
        ${loading ? 'relative' : ''}
      `}
    >
      {loading ? (
        <>
          <div className="opacity-0">
            <div className="flex items-center space-x-1.5">
              {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
              {text && <span className="leading-tight">{text}</span>}
              {children}
              {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
              {showCaret && (
                <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </>
      ) : (
        <div className="flex items-center space-x-1.5">
          {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
          {text && <span className="leading-tight">{text}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
          {showCaret && (
            <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      )}
    </button>
  );
}

export default DropdownButton;
