import { useState, useRef, useEffect, type ReactNode } from 'react';

export interface DropdownItemProps {
  icon?: ReactNode;
  text: string;
  rightText?: string;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  isSubmenu?: boolean;
  submenu?: ReactNode;
  isActive?: boolean;
  isCheckbox?: boolean;
  checked?: boolean;
  onCheckChange?: (checked: boolean) => void;
  color?: string;
}

export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItemProps[];
  align?: 'left' | 'right';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  width?: string;
  className?: string;
  defaultOpen?: boolean;
}

// Common dropdown menu styles
export const dropdownMenuStyles = {
  base: 'bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden',
  animation: 'transition-all duration-150 transform origin-top-left',
};

// Dropdown item styles
export const dropdownItemStyles = {
  base: 'flex items-center w-full px-3 py-1.5 text-left transition-colors',
  hover: 'hover:bg-gray-100 dark:hover:bg-gray-700',
  focus: 'focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700',
  disabled: 'opacity-50 cursor-not-allowed',
  danger: 'text-red-600 dark:text-red-400',
  normal: 'text-gray-700 dark:text-gray-200',  size: {
    xs: 'text-[10px] md:text-xs py-1 px-2',
    sm: 'text-xs md:text-sm py-1 px-2.5',
    md: 'text-sm md:text-base py-1.5 px-3',
    lg: 'text-base md:text-lg py-2 px-3.5',
  },
};

// Sizes for the dropdown container
export const dropdownSizes = {
  xs: 'min-w-32',
  sm: 'min-w-40',
  md: 'min-w-48',
  lg: 'min-w-56',
};

// Dropdown item component
export function DropdownItem({ 
  icon, 
  text, 
  rightText, 
  onClick, 
  disabled = false, 
  danger = false,
  isSubmenu = false,
  submenu,
  isActive = false,
  isCheckbox = false,
  checked = false,
  onCheckChange,
  color,
  size = 'md'
}: DropdownItemProps & { size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const itemRef = useRef<HTMLButtonElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  
  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);
  
  // Debug the state changes
  useEffect(() => {
    if (isSubmenu) {
      console.log(`Submenu state for "${text}": ${showSubmenu ? 'showing' : 'hidden'}`);
    }
  }, [showSubmenu, text, isSubmenu]);
  
  const handleMouseEnter = () => {
    if (isSubmenu && !disabled) {
      console.log(`Mouse entered submenu item: ${text}`);
      
      // Clear any pending close timeout
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
      
      setShowSubmenu(true);
    }
  };
  
  const handleMouseLeave = (e: React.MouseEvent) => {
    if (isSubmenu) {
      // Check if we're moving to the submenu
      if (submenuRef.current && submenuRef.current.contains(e.relatedTarget as Node)) {
        console.log('Moving to submenu, keeping it open');
        return;
      }
      
      // Set a delay before closing to give user time to move to submenu
      closeTimeoutRef.current = window.setTimeout(() => {
        console.log(`Mouse left submenu item: ${text}, closing after delay`);
        setShowSubmenu(false);
      }, 300);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isSubmenu) {
      // Prevent closing the parent dropdown when clicking a submenu trigger
      e.stopPropagation();
      console.log(`Clicked submenu item: ${text}, toggling submenu`);
      setShowSubmenu(!showSubmenu);
    } else if (isCheckbox && onCheckChange) {
      onCheckChange(!checked);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className="relative" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >      <button
        ref={itemRef}
        onClick={handleClick}
        disabled={disabled}
        className={`
          ${dropdownItemStyles.base}
          ${dropdownItemStyles.size[size]}
          ${!disabled && dropdownItemStyles.hover}
          ${!disabled && dropdownItemStyles.focus}
          ${disabled && dropdownItemStyles.disabled}
          ${danger ? dropdownItemStyles.danger : dropdownItemStyles.normal}
          ${isSubmenu ? 'justify-between' : ''}
          w-full text-left
        `}
      >        <span className="flex items-center">
          {isCheckbox ? (
            <span className="mr-2 flex-shrink-0">
              <div className={`w-4 h-4 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center ${checked ? 'bg-indigo-600 dark:bg-indigo-500 border-indigo-600 dark:border-indigo-500' : 'bg-white dark:bg-gray-700'}`}>
                {checked && (
                  <svg 
                    className="w-3 h-3 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </span>
          ) : icon ? (
            <span className="mr-2 flex-shrink-0">{icon}</span>
          ) : null}
          <span className="flex items-center">
            {color && isCheckbox && (
              <span className={`inline-block w-2 h-2 mr-2 rounded-full ${color}`}></span>
            )}
            {text}
          </span>
        </span>{rightText && !isSubmenu && (
          <span className="ml-auto pl-4 text-gray-400 dark:text-gray-500 text-xs md:text-sm">{rightText}</span>
        )}
        {isSubmenu && (
          <span className="ml-auto pl-4">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        )}
      </button>      {isSubmenu && submenu && (
        <div 
          ref={submenuRef}
          className={`
            absolute top-0 left-[calc(100%-3px)] ml-1 z-[1000]
            ${dropdownMenuStyles.base}
            ${showSubmenu ? 'opacity-100 visible' : 'opacity-0 invisible'}
            transition-opacity duration-150 ease-in-out
          `}
          style={{ 
            minWidth: '8rem',
            pointerEvents: showSubmenu ? 'auto' : 'none',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
          onMouseEnter={() => {
            // Clear any pending close timeout
            if (closeTimeoutRef.current !== null) {
              window.clearTimeout(closeTimeoutRef.current);
              closeTimeoutRef.current = null;
            }
            setShowSubmenu(true);
          }}
          onMouseLeave={() => {
            closeTimeoutRef.current = window.setTimeout(() => {
              setShowSubmenu(false);
            }, 300);
          }}
        >
          {submenu}
        </div>
      )}
    </div>
  );
}

// Dropdown divider component
export function DropdownDivider() {
  return <div className="border-t border-gray-200 dark:border-gray-700 my-1" />;
}

// Checkbox Dropdown Item component
export function CheckboxDropdownItem({ 
  text, 
  checked = false, 
  onCheckChange,
  disabled = false, 
  size = 'md',
  color
}: {
  text: string;
  checked?: boolean;
  onCheckChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: string;
}) {
  const handleClick = () => {
    if (!disabled && onCheckChange) {
      onCheckChange(!checked);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`
          ${dropdownItemStyles.base}
          ${dropdownItemStyles.size[size]}
          ${!disabled && dropdownItemStyles.hover}
          ${!disabled && dropdownItemStyles.focus}
          ${disabled && dropdownItemStyles.disabled}
          ${dropdownItemStyles.normal}
          w-full text-left
        `}
      >
        <span className="flex items-center">
          <span className="mr-2 flex-shrink-0">
            <div className={`w-4 h-4 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center ${checked ? 'bg-indigo-600 dark:bg-indigo-500 border-indigo-600 dark:border-indigo-500' : 'bg-white dark:bg-gray-700'}`}>
              {checked && (
                <svg 
                  className="w-3 h-3 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </span>
          <span className="flex items-center">
            {color && (
              <span className={`inline-block w-2 h-2 mr-2 rounded-full ${color}`}></span>
            )}
            {text}
          </span>
        </span>
      </button>
    </div>
  );
}
