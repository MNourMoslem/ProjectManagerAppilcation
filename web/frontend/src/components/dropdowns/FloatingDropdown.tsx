import { useState, useRef, useEffect } from 'react';
import type { DropdownProps } from './DropdownBase';
import { DropdownItem, dropdownMenuStyles, dropdownSizes } from './DropdownBase';

function FloatingDropdown({
  trigger,
  items,
  align = 'left',
  size = 'md',
  width,
  className = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Only close if the click is outside the dropdown and not on a submenu
      const target = event.target as Element;
      const isSubmenuClick = target.closest('[data-submenu="true"]');
      
      if (dropdownRef.current && 
          !dropdownRef.current.contains(target) && 
          !isSubmenuClick) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Calculate positioning classes based on alignment
  const positionClasses = align === 'left' 
    ? 'left-0 origin-top-left' 
    : 'right-0 origin-top-right';
  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Trigger element */}
      <div 
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        {trigger}
      </div>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div 
          className={`
            absolute z-50 mt-1 
            ${positionClasses}
            ${dropdownMenuStyles.base}
            ${dropdownMenuStyles.animation}
            ${width ? width : dropdownSizes[size]}
          `}
          data-submenu="true"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1">            {items.map((item, index) => (
              <DropdownItem 
                key={index} 
                {...item}
                size={size}
                onClick={item.isSubmenu ? undefined : () => {
                  if (item.onClick) {
                    item.onClick();
                  }
                  // Only close if it's not a submenu or a checkbox
                  if (!item.isSubmenu && !item.isCheckbox) {
                    setIsOpen(false);
                  }
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FloatingDropdown;
