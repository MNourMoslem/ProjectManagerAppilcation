import React, { useState, ReactNode } from 'react';

export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
  badge?: number | string;
}

export interface TabContainerProps {
  tabs: Tab[];
  defaultTabId?: string;
  variant?: 'default' | 'pills' | 'underline' | 'enclosed';
  size?: 'sm' | 'md' | 'lg';
  alignment?: 'left' | 'center' | 'right' | 'stretch';
  fullWidth?: boolean;
  tabColor?: string;
  activeTabColor?: string;
  activeTextColor?: string;
  containerClassName?: string;
  tabBarClassName?: string;
  contentClassName?: string;
  onChange?: (tabId: string) => void;
}

/**
 * A reusable multi-tab container component that supports different variants, 
 * sizes, and alignments with customizable colors.
 */
const TabContainer: React.FC<TabContainerProps> = ({
  tabs,
  defaultTabId,
  variant = 'default',
  size = 'md',
  alignment = 'left',
  fullWidth = false,
  tabColor = '',
  activeTabColor = '',
  activeTextColor = '',
  containerClassName = '',
  tabBarClassName = '',
  contentClassName = '',
  onChange
}) => {
  const [activeTab, setActiveTab] = useState(defaultTabId || (tabs.length > 0 ? tabs[0].id : ''));
  
  // If no tabs are provided, return null
  if (!tabs.length) return null;
  
  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };
  
  // Determine size-based classes
  const sizeClasses = {
    sm: 'text-sm py-2 px-3',
    md: 'text-base py-2.5 px-4',
    lg: 'text-lg py-3 px-6'
  }[size];
  
  // Determine alignment classes
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    stretch: 'justify-between'
  }[alignment];
  
  // Determine variant-specific styles
  const getVariantClasses = (isActive: boolean) => {
    switch (variant) {
      case 'pills':
        return isActive 
          ? `rounded-lg ${activeTabColor || 'bg-indigo-600'} ${activeTextColor || 'text-white'} shadow-sm` 
          : `rounded-lg ${tabColor || 'text-gray-600 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-800/50`;
      
      case 'underline':
        return isActive 
          ? `border-b-2 ${activeTabColor || 'border-indigo-600'} ${activeTextColor || 'text-indigo-600 dark:text-indigo-400'}` 
          : `border-b-2 border-transparent ${tabColor || 'text-gray-600 dark:text-gray-300'} hover:border-gray-300 dark:hover:border-gray-700`;
      
      case 'enclosed':
        return isActive 
          ? `rounded-t-lg border-t border-l border-r ${activeTabColor || 'border-gray-200 dark:border-gray-700'} ${activeTextColor || 'text-indigo-600 dark:text-indigo-400'} bg-white dark:bg-gray-800` 
          : `rounded-t-lg border-transparent ${tabColor || 'text-gray-600 dark:text-gray-300'} hover:bg-gray-50 dark:hover:bg-gray-800/50`;
      
      case 'default':
      default:
        return isActive 
          ? `${activeTabColor || 'bg-white dark:bg-gray-800'} ${activeTextColor || 'text-indigo-600 dark:text-indigo-400'} shadow-sm rounded-t-lg` 
          : `${tabColor || 'text-gray-600 dark:text-gray-300'} hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-t-lg`;
    }
  };
  
  // Get the active tab content
  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;
  
  return (
    <div className={`w-full ${containerClassName}`}>
      {/* Tab Bar */}
      <div className={`flex ${alignmentClasses} ${tabBarClassName} ${variant === 'enclosed' ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`
              ${sizeClasses}
              ${getVariantClasses(tab.id === activeTab)}
              ${fullWidth ? 'flex-1' : ''}
              font-medium transition-all duration-200 focus:outline-none
              flex items-center justify-center
            `}
            aria-selected={tab.id === activeTab}
            role="tab"
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
            {tab.badge !== undefined && (
              <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${tab.id === activeTab ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className={`mt-4 ${contentClassName}`}>
        {activeTabContent}
      </div>
    </div>
  );
};

export default TabContainer;
