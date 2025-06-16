import type { BaseButtonProps } from './ButtonBase';
import { buttonStates, buttonFont } from './ButtonBase';
import LoadingSpinner from './LoadingSpinner';

interface IconButtonProps extends Omit<BaseButtonProps, 'text' | 'size'> {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

function IconButton({ 
  icon, 
  onClick, 
  disabled = false,
  loading = false,
  type = 'button',
  size = 'md',
  variant = 'ghost',
  className = '',
  children
}: IconButtonProps) {  // Icon button sizes are square
  const iconSizes = {
    xs: 'p-0.5 text-[10px]',
    sm: 'p-1 text-xs',
    md: 'p-1.5 text-sm',
    lg: 'p-2 text-base',
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
    'primary': 'white',
    'secondary': 'gray',
    'ghost': 'gray',
    'danger': 'red',
  } as const;
  const variants = {
    primary: 'bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600',
    ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
    danger: 'bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${buttonFont}
        ${iconSizes[size]}
        ${buttonStates.focus}
        ${(disabled || loading) ? buttonStates.disabled : ''}
        ${variants[variant]}
        rounded-md transition-all duration-150
        flex items-center justify-center
        ${className}
      `}
    >
      {loading ? (
        <LoadingSpinner size={spinnerSizeMap[size]} color={spinnerColorMap[variant]} />
      ) : (
        icon || children
      )}
    </button>
  );
}

export default IconButton;
