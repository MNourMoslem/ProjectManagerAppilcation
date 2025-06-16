import { useState, useRef } from 'react';
import type { DropdownProps } from './DropdownBase';
import { DropdownItem } from './DropdownBase';

function ExpandingDropdown({
  trigger,
  items,
  size = 'md',
  className = '',
  defaultOpen = false
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Calculate max height for animation
  const getMaxHeight = () => {
    if (contentRef.current) {
      return `${contentRef.current.scrollHeight}px`;
    }
    return '0px';
  };

  return (
    <div className={`w-full overflow-hidden border border-gray-200 dark:border-gray-700 rounded-md ${className}`}>
      {/* Trigger element */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        {trigger}
      </div>
      
      {/* Expanding content */}
      <div 
        ref={contentRef}
        className={`
          transition-all duration-200 ease-in-out
          overflow-hidden
        `}
        style={{ 
          maxHeight: isOpen ? getMaxHeight() : '0px',
          visibility: isOpen ? 'visible' : 'hidden',
          opacity: isOpen ? 1 : 0
        }}
        data-submenu="true"
      >
        <div className="border-t border-gray-200 dark:border-gray-700">
          {items.map((item, index) => (
            <DropdownItem 
              key={index} 
              {...item}
              size={size}
              onClick={item.isSubmenu ? undefined : () => {
                if (item.onClick) {
                  item.onClick();
                }
                // Only close if it's not a submenu
                if (!item.isSubmenu) {
                  setIsOpen(false);
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExpandingDropdown;
