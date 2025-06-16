import React from 'react';

interface MemberCardProps {
  id: string;
  avatar?: string | null;
  name: string;
  email: string;
  role?: string;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  disabled?: boolean;
}

export const MemberCard: React.FC<MemberCardProps> = ({
  id,
  avatar,
  name,
  email,
  role,
  isSelected = false,
  onSelect,
  disabled = false
}) => {
  return (
    <div 
      className={`flex items-center p-2 rounded-md transition-colors duration-150 ${
        isSelected ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
      }`}
    >
      <div className="flex-shrink-0 mr-2">
        {avatar ? (
          <img 
            src={avatar}
            alt={name}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-medium">
            {name?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      
      <div className="min-w-0 flex-1 mr-2">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{email}</p>
        {role && (
          <p className="text-xs text-indigo-500 dark:text-indigo-400 truncate">{role}</p>
        )}
      </div>
      
      {onSelect && (
        <div className="flex-shrink-0">
          <input 
            type="checkbox"
            id={`select-${id}`}
            checked={isSelected}
            onChange={(e) => onSelect(id, e.target.checked)}
            disabled={disabled}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:border-gray-600 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};
