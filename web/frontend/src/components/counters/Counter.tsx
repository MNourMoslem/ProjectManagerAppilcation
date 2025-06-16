import React, { useState, useEffect } from 'react';

export interface CounterProps {
  /**
   * The starting value of the counter
   */
  start?: number;
  
  /**
   * The end value of the counter
   */
  end: number;
  
  /**
   * Duration of the counting animation in milliseconds
   */
  duration?: number;
  
  /**
   * Prefix to display before the number (e.g., "$")
   */
  prefix?: string;
  
  /**
   * Suffix to display after the number (e.g., "%")
   */
  suffix?: string;
  
  /**
   * Number of decimal places to show
   */
  decimals?: number;
  
  /**
   * Separator for thousands (e.g., ",")
   */
  separator?: string;
  
  /**
   * Whether to animate the counter on mount
   */
  animate?: boolean;
  
  /**
   * CSS class name for styling
   */
  className?: string;
  
  /**
   * Callback function that fires when the animation completes
   */
  onComplete?: () => void;
}

const Counter: React.FC<CounterProps> = ({
  start = 0,
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
  decimals = 0,
  separator = ',',
  animate = true,
  className = '',
  onComplete
}) => {
  const [count, setCount] = useState(animate ? start : end);
  
  // Format the number with separators and decimals
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: true
    }).format(num).replace(/,/g, separator);
  };
  
  useEffect(() => {
    if (!animate) {
      setCount(end);
      return;
    }
    
    let startTime: number | null = null;
    let animationFrame: number;
    
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentCount = progress * (end - start) + start;
      
      setCount(currentCount);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        if (onComplete) onComplete();
      }
    };
    
    animationFrame = requestAnimationFrame(step);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [start, end, duration, animate, onComplete]);
  
  return (
    <span className={className}>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
};

export default Counter;
