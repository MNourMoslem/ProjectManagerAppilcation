import React from 'react';

export interface CircularProgressProps {
  /**
   * The percentage of progress (0-100)
   */
  value: number;
  
  /**
   * Maximum value (default: 100)
   */
  max?: number;
  
  /**
   * Size of the progress circle in pixels
   */
  size?: number;
  
  /**
   * Thickness of the progress ring
   */
  thickness?: number;
  
  /**
   * Show the percentage in the center
   */
  showPercentage?: boolean;
  
  /**
   * Color variant of the progress circle
   */
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Children to render in the center of the circle
   */
  children?: React.ReactNode;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 48,
  thickness = 4,
  showPercentage = false,
  variant = 'primary',
  className = '',
  children
}) => {
  // Ensure value is between 0 and max
  const clampedValue = Math.min(Math.max(0, value), max);
  const percentage = Math.round((clampedValue / max) * 100);
  
  // Calculate SVG parameters
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Variant styles
  const variantColors = {
    primary: 'text-indigo-600 dark:text-indigo-500',
    success: 'text-green-500 dark:text-green-400',
    warning: 'text-yellow-500 dark:text-yellow-400',
    danger: 'text-red-500 dark:text-red-400',
    info: 'text-blue-500 dark:text-blue-400'
  };
  
  return (
    <div className={`relative inline-flex ${className}`} style={{ width: size, height: size }}>
      <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          className="text-gray-200 dark:text-gray-700"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={thickness}
          stroke="currentColor"
          fill="transparent"
        />
        
        {/* Progress circle */}
        <circle
          className={`${variantColors[variant]} transition-all duration-300 ease-in-out`}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={thickness}
          stroke="currentColor"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showPercentage && (
          <span className="text-xs font-medium">{percentage}%</span>
        ))}
      </div>
    </div>
  );
};

export default CircularProgress;
