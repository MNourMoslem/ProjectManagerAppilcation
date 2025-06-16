import React, { useState, ReactNode } from 'react';

export type ViewMode = 'grid' | 'row';

interface GridRowContainerProps {
  children: ReactNode;
  initialViewMode?: ViewMode;
  gridClassName?: string;
  rowClassName?: string;
  containerClassName?: string;
  itemClassName?: string;
  showControls?: boolean;
  itemsPerRow?: number;
  title?: string;
  emptyMessage?: string;
  onViewModeChange?: (mode: ViewMode) => void;
}

/**
 * A reusable container component that can display its children as either a grid or rows.
 * Provides toggle controls for switching between the two views.
 */
const GridRowContainer: React.FC<GridRowContainerProps> = ({
  children,
  initialViewMode = 'grid',
  gridClassName = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
  rowClassName = 'flex flex-col gap-4',
  containerClassName = 'w-full',
  itemClassName = '',
  showControls = true,
  // Removed unused prop
  title,
  emptyMessage = 'No items to display',
  onViewModeChange
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  
  // Handle empty state - if children is empty array or null/undefined
  const childrenArray = React.Children.toArray(children);
  const isEmpty = childrenArray.length === 0;
  
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (onViewModeChange) {
      onViewModeChange(mode);
    }
  };
  
  return (
    <div className={containerClassName}>
      {/* Title and View Mode Controls */}
      {(title || showControls) && (
        <div className="flex justify-between items-center mb-6">
          {title && <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>}
          
          {showControls && (
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => handleViewModeChange('grid')}
                className={`px-3 py-1 rounded ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                aria-label="Grid view"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => handleViewModeChange('row')}
                className={`px-3 py-1 rounded ${
                  viewMode === 'row'
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                aria-label="Row view"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Content */}
      {isEmpty ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
        </div>
      ) : (
        <div className={`${viewMode === 'grid' ? `grid ${gridClassName}` : rowClassName}`}>
          {React.Children.map(children, (child) => {
            // If child is not valid, don't render it
            if (!React.isValidElement(child)) return null;
              // Add additional className to each child if provided
            if (itemClassName) {
              return React.cloneElement(child as React.ReactElement<any>, {
                className: `${(child as React.ReactElement<any>).props.className || ''} ${itemClassName}`.trim()
              });
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
};

export default GridRowContainer;
