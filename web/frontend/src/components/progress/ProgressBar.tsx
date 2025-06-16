import React from 'react';

export interface ProgressBarProps {
  /**
   * The percentage of progress (0-100)
   */
  value: number;
  
  /**
   * Maximum value (default: 100)
   */
  max?: number;
  
  /**
   * Show percentage text inside the progress bar
   */
  showPercentage?: boolean;
  
  /**
   * Color variant of the progress bar
   */
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /**
   * Size of the progress bar
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  
  /**
   * Whether the progress bar is striped
   */
  striped?: boolean;
  
  /**
   * Whether the progress bar is animated
   */
  animated?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  showPercentage = false,
  variant = 'primary',
  size = 'md',
  striped = false,
  animated = false,
  className = ''
}) => {
  // Ensure value is between 0 and max
  const clampedValue = Math.min(Math.max(0, value), max);
  const percentage = Math.round((clampedValue / max) * 100);
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-indigo-600 dark:bg-indigo-500',
    success: 'bg-green-500 dark:bg-green-400',
    warning: 'bg-yellow-500 dark:bg-yellow-400',
    danger: 'bg-red-500 dark:bg-red-400',
    info: 'bg-blue-500 dark:bg-blue-400'
  };
  
  // Size styles
  const sizeStyles = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };
  
  // Striped effect using CSS gradient
  const stripedClass = striped ? 
    'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:20px_100%]' : '';
  
  // Animation effect
  const animatedClass = animated && striped ? 'animate-progress-bar' : '';
  
  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeStyles[size]} ${className}`}>
      <div 
        className={`${variantStyles[variant]} ${stripedClass} ${animatedClass} h-full rounded-full transition-all duration-300 ease-in-out flex items-center justify-center`}
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        {showPercentage && size !== 'xs' && size !== 'sm' && (
          <span className="text-xs font-medium text-white drop-shadow">
            {percentage}%
          </span>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
