import { ReactNode, useEffect, useRef, useState } from 'react';
import { PrimaryButton, SecondaryButton } from '../buttons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
  contentClassName?: string;
  primaryAction?: {
    text: string;
    onClick: () => void;
    loading?: boolean;
    disabled?: boolean;
  };
  secondaryAction?: {
    text: string;
    onClick: () => void;
    disabled?: boolean;
  };
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = '3xl',
  contentClassName = '',
  primaryAction,
  secondaryAction
}: ModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  // Size class based on the size prop
  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    'full': 'max-w-full'
  }[size];
  
  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
      
      // Animate in
      setTimeout(() => setIsVisible(true), 10);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = ''; // Re-enable scrolling when modal is closed
    };
  }, [isOpen, onClose]);

  // Handle click outside modal
  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Render nothing if modal is not open
  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClickOutside}
    >      <div 
        ref={modalRef}
        className={`bg-white dark:bg-gray-900 rounded-md shadow-lg w-full ${sizeClass} max-h-[90vh] flex flex-col transform transition-transform duration-200 ${isVisible ? 'translate-y-0' : 'translate-y-4'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-medium">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
          {/* Modal Body */}
        <div className={`p-4 ${contentClassName}`}>
          {children}
        </div>
        
        {/* Modal Footer */}
        {(footer || primaryAction || secondaryAction) && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex justify-end space-x-2">
            {footer || (
              <>
                {secondaryAction && (
                  <SecondaryButton
                    text={secondaryAction.text}
                    onClick={secondaryAction.onClick}
                    disabled={secondaryAction.disabled}
                    size="sm"
                  />
                )}
                {primaryAction && (
                  <PrimaryButton
                    text={primaryAction.text}
                    onClick={primaryAction.onClick}
                    loading={primaryAction.loading}
                    disabled={primaryAction.disabled}
                    size="sm"
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
