import React, { ReactNode } from 'react';
import Counter, { CounterProps } from './Counter';

export interface StatCounterProps extends Omit<CounterProps, 'className'> {
  /**
   * Title of the stat counter
   */
  title: string;

  value?: number | string;
  
  /**
   * Subtitle or description
   */
  subtitle?: string;
  
  /**
   * Icon to display
   */
  icon?: ReactNode;
  
  /**
   * Color theme for the counter
   */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /**
   * Trend indicator: positive, negative, or neutral
   */
  trend?: 'up' | 'down' | 'neutral';
  
  /**
   * Trend label to display alongside the trend value
   */
  trendLabel?: string;

  /**
   * Trend percentage or text
   */
  trendValue?: string;
  
  /**
   * Container className
   */
  className?: string;
  
  /**
   * Counter value className
   */
  valueClassName?: string;
}

const StatCounter: React.FC<StatCounterProps> = ({
  title,
  subtitle,
  icon,
  variant = 'default',
  trend,
  trendValue,
  className = '',
  valueClassName = '',
  ...counterProps
}) => {
  // Variant styles
  const variantStyles = {
    default: 'text-gray-900 dark:text-white',
    primary: 'text-indigo-600 dark:text-indigo-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    danger: 'text-red-600 dark:text-red-400',
    info: 'text-blue-600 dark:text-blue-400'
  };
  
  // Trend styles
  const trendStyles = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-500 dark:text-gray-400'
  };
  
  // Trend icons
  const trendIcons = {
    up: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 15l7-7 7 7" />
      </svg>
    ),
    down: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 9l-7 7-7-7" />
      </svg>
    ),
    neutral: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14" />
      </svg>
    )
  };
  
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center space-x-2 mb-1">
        {icon && <div className={`${variantStyles[variant]}`}>{icon}</div>}
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      </div>
      
      <div className="flex items-end space-x-2">
        <Counter
          {...counterProps}
          className={`text-2xl font-semibold ${variantStyles[variant]} ${valueClassName}`}
        />
        
        {trend && trendValue && (
          <div className={`flex items-center text-xs font-medium ${trendStyles[trend]} mb-1`}>
            {trendIcons[trend]}
            <span className="ml-1">{trendValue}</span>
          </div>
        )}
      </div>
      
      {subtitle && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
      )}
    </div>
  );
};

export default StatCounter;
