import type { BaseButtonProps } from './ButtonBase';
import { buttonSizes, buttonStates, buttonFont } from './ButtonBase';
import LoadingSpinner from './LoadingSpinner';

interface OutlineButtonProps extends BaseButtonProps {
  variant?: 'default' | 'primary' | 'danger' | 'success';
}

function OutlineButton({ 
  icon, 
  text, 
  onClick, 
  disabled = false,
  loading = false, 
  type = 'button',
  size = 'md',
  fullWidth = false,
  variant = 'default',
  className = '',
  children
}: OutlineButtonProps) {
  
  // Different border colors based on variant
  const variants = {
    default: 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500',
    primary: 'border-black text-black dark:border-white dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black',
    danger: 'border-red-500 text-red-600 dark:border-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-500',
    success: 'border-green-500 text-green-600 dark:border-green-500 dark:text-green-400 hover:bg-green-500 hover:text-white dark:hover:bg-green-500'
  };
  
  // Map button size to spinner size
  const spinnerSizeMap = {
    'xs': 'xs',
    'sm': 'xs',
    'md': 'sm',
    'lg': 'sm'
  } as const;
  
  // Map variant to spinner color
  const spinnerColorMap = {
    'default': 'gray',
    'primary': 'black',
    'danger': 'gray',
    'success': 'gray'
  } as const;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${buttonFont}
        ${buttonSizes[size]}
        ${buttonStates.focus}
        ${(disabled || loading) ? buttonStates.disabled : ''}
        ${fullWidth ? 'w-full' : ''}
        bg-transparent
        border
        ${variants[variant]}
        rounded-md transition-all duration-150
        ${className}
      `}
    >
      <div className="flex items-center justify-center space-x-1.5">
        {loading ? (
          <LoadingSpinner size={spinnerSizeMap[size]} color={spinnerColorMap[variant]} />
        ) : (
          <>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {text && <span className="leading-tight">{text}</span>}
            {children}
          </>
        )}
      </div>
    </button>
  );
}

export default OutlineButton;
