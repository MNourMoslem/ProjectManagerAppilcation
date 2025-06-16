import type { BaseButtonProps } from './ButtonBase';
import { buttonSizes, buttonStates, buttonFont } from './ButtonBase';
import LoadingSpinner from './LoadingSpinner';

function PrimaryButton({ 
  icon, 
  text, 
  onClick, 
  disabled = false, 
  loading = false,
  type = 'button',
  size = 'md',
  fullWidth = false,
  className = '',
  children
}: BaseButtonProps) {
  // Map button size to spinner size
  const spinnerSizeMap = {
    'xs': 'xs',
    'sm': 'xs',
    'md': 'sm',
    'lg': 'sm'
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
        bg-black text-white
        dark:bg-white dark:text-black
        rounded-md transition-all duration-150
        hover:bg-gray-800 dark:hover:bg-gray-100
        ${className}
      `}
    >
      <div className="flex items-center justify-center space-x-1.5">
        {loading ? (
          <LoadingSpinner size={spinnerSizeMap[size]} color="white" />
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


export default PrimaryButton;
