import React, { useState, useRef, useEffect } from 'react';

export interface TooltipProps {
  /**
   * The tooltip content
   */
  content: React.ReactNode;
  
  /**
   * The element that triggers the tooltip
   */
  children: React.ReactElement;
  
  /**
   * Position of the tooltip
   */
  position?: 'top' | 'bottom' | 'left' | 'right';
  
  /**
   * Delay before showing the tooltip (in ms)
   */
  delay?: number;
  
  /**
   * Whether the tooltip is dark or light themed
   */
  theme?: 'dark' | 'light';
  
  /**
   * Whether to show an arrow pointing to the trigger element
   */
  arrow?: boolean;
  
  /**
   * Whether to disable the tooltip
   */
  disabled?: boolean;
  
  /**
   * Maximum width of the tooltip
   */
  maxWidth?: number | string;
  
  /**
   * Additional CSS classes for the tooltip
   */
  className?: string;
  
  /**
   * Whether the tooltip is triggered on click instead of hover
   */
  clickable?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 300,
  theme = 'dark',
  arrow = true,
  disabled = false,
  maxWidth = 250,
  className = '',
  clickable = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  // Calculate tooltip position
  const updateTooltipPosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    // Default values
    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - 8;
        left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'bottom':
        top = triggerRect.bottom + 8;
        left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
        left = triggerRect.left - tooltipRect.width - 8;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
        left = triggerRect.right + 8;
        break;
    }

    // Adjust for viewport boundaries
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    
    // Convert to absolute positioning (relative to document)
    top += scrollY;
    left += scrollX;
    
    setTooltipPosition({ top, left });
  };

  // Event handlers
  const handleMouseEnter = () => {
    if (disabled || clickable) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
      updateTooltipPosition();
    }, delay);
  };

  const handleMouseLeave = () => {
    if (disabled || clickable) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  const handleClick = () => {
    if (disabled || !clickable) return;
    setIsVisible(!isVisible);
    if (!isVisible) {
      updateTooltipPosition();
    }
  };

  // Update position on scroll and resize
  useEffect(() => {
    if (isVisible) {
      const handleRepositioning = () => {
        if (isVisible) {
          updateTooltipPosition();
        }
      };

      window.addEventListener('scroll', handleRepositioning);
      window.addEventListener('resize', handleRepositioning);

      return () => {
        window.removeEventListener('scroll', handleRepositioning);
        window.removeEventListener('resize', handleRepositioning);
      };
    }
  }, [isVisible]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Clone the child element to attach our event handlers
  const triggerElement = React.cloneElement(children, {
    ref: triggerRef,
    onMouseEnter: !clickable ? handleMouseEnter : children.props.onMouseEnter,
    onMouseLeave: !clickable ? handleMouseLeave : children.props.onMouseLeave,
    onClick: clickable ? (e: React.MouseEvent) => {
      handleClick();
      if (children.props.onClick) children.props.onClick(e);
    } : children.props.onClick,
  });

  // Theme classes
  const themeClasses = {
    dark: 'bg-gray-800 text-white',
    light: 'bg-white text-gray-900 border border-gray-200'
  };

  // Arrow classes
  const arrowClasses = {
    top: 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 border-t-gray-800 border-l-transparent border-r-transparent',
    bottom: 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-b-gray-800 border-l-transparent border-r-transparent',
    left: 'right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 border-l-gray-800 border-t-transparent border-b-transparent',
    right: 'left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 border-r-gray-800 border-t-transparent border-b-transparent'
  };

  // Arrow theme adjustments
  if (theme === 'light') {
    arrowClasses.top = arrowClasses.top.replace('border-t-gray-800', 'border-t-gray-200');
    arrowClasses.bottom = arrowClasses.bottom.replace('border-b-gray-800', 'border-b-gray-200');
    arrowClasses.left = arrowClasses.left.replace('border-l-gray-800', 'border-l-gray-200');
    arrowClasses.right = arrowClasses.right.replace('border-r-gray-800', 'border-r-gray-200');
  }

  return (
    <>
      {triggerElement}
      
      {isVisible && !disabled && (
        <div
          ref={tooltipRef}
          className={`fixed z-50 rounded-md py-2 px-3 text-sm shadow-md transition-opacity ${themeClasses[theme]} ${className}`}
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
            opacity: isVisible ? 1 : 0,
            pointerEvents: 'none'
          }}
          role="tooltip"
        >
          {content}
          
          {arrow && (
            <div
              className={`absolute w-0 h-0 border-solid ${
                position === 'top' || position === 'bottom' 
                  ? 'border-x-[6px] border-b-0 border-t-[6px]' 
                  : 'border-y-[6px] border-r-0 border-l-[6px]'
              } ${arrowClasses[position]}`}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Tooltip;
