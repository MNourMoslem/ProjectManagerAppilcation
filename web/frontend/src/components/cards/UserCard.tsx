import React from 'react';

interface UserCardProps {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled';
  onClick?: () => void;
  className?: string;
  selected?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

const UserCard: React.FC<UserCardProps> = ({
  name,
  email,
  avatarUrl,
  size = 'md',
  variant = 'default',
  onClick,
  className = '',
  selected = false,
  removable = false,
  onRemove
}) => {
  // Generate avatar initials if no avatar URL is provided
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  // Determine avatar size based on the size prop
  const avatarSizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
  };

  // Determine card padding based on the size prop
  const cardPaddingClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  // Determine text size based on the size prop
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  // Apply variant styles
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700',
    outlined: 'border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
    filled: 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600',
  };

  // Apply selected styles
  const selectedClasses = selected 
    ? 'ring-2 ring-blue-500 dark:ring-blue-400' 
    : '';

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) onRemove();
  };

  return (
    <div 
      className={`
        flex items-center gap-3 rounded-lg transition-all
        ${cardPaddingClasses[size]}
        ${variantClasses[variant]}
        ${selectedClasses}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Avatar */}
      <div className={`
        flex-shrink-0 rounded-full flex items-center justify-center bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-medium
        ${avatarSizeClasses[size]}
      `}>
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={`${name}'s avatar`} 
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          initials
        )}
      </div>

      {/* User details */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-gray-900 dark:text-white truncate ${textSizeClasses[size]}`}>
          {name}
        </p>
        <p className={`text-gray-500 dark:text-gray-400 truncate ${size === 'sm' ? 'text-xs' : 'text-xs'}`}>
          {email}
        </p>
      </div>

      {/* Remove button */}
      {removable && (
        <button 
          onClick={handleRemoveClick}
          className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Remove user"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default UserCard;
