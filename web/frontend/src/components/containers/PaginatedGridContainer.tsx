import React, { useState, ReactNode, useEffect } from 'react';
import { ViewMode } from './GridRowContainer';

interface PaginatedGridContainerProps {
  children: ReactNode;
  initialViewMode?: ViewMode;
  gridClassName?: string;
  rowClassName?: string;
  containerClassName?: string;
  itemClassName?: string;
  showControls?: boolean;
  title?: string;
  emptyMessage?: string;
  onViewModeChange?: (mode: ViewMode) => void;
  itemsPerPage?: number;
  totalItems?: number;
  currentPage?: number;
  onPageChange?: (page: number, from: number, to: number) => void;
  loading?: boolean;
}

/**
 * A reusable container component that can display its children as either a grid or rows
 * with pagination support.
 */
const PaginatedGridContainer: React.FC<PaginatedGridContainerProps> = ({
  children,
  initialViewMode = 'grid',
  gridClassName = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
  rowClassName = 'flex flex-col gap-4',
  containerClassName = 'w-full',
  itemClassName = '',
  showControls = true,
  title,
  emptyMessage = 'No items to display',
  onViewModeChange,
  itemsPerPage = 12,
  totalItems = 0,
  currentPage: externalCurrentPage,
  onPageChange,
  loading = false
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [internalCurrentPage, setInternalCurrentPage] = useState(externalCurrentPage || 1);
  
  // Use either controlled or uncontrolled current page
  const currentPage = externalCurrentPage !== undefined ? externalCurrentPage : internalCurrentPage;
  
  // Handle empty state - if children is empty array or null/undefined
  const childrenArray = React.Children.toArray(children);
  const isEmpty = childrenArray.length === 0 && !loading;
  
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  // Update internal page when external page changes
  useEffect(() => {
    if (externalCurrentPage !== undefined) {
      setInternalCurrentPage(externalCurrentPage);
    }
  }, [externalCurrentPage]);
  
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (onViewModeChange) {
      onViewModeChange(mode);
    }
  };
  
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    
    const newInternalPage = newPage;
    setInternalCurrentPage(newInternalPage);
    
    if (onPageChange) {
      const from = (newPage - 1) * itemsPerPage;
      const to = from + itemsPerPage;
      onPageChange(newPage, from, to);
    }
  };
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Show at most 5 page numbers at a time
    
    if (totalPages <= maxPagesToShow) {
      // If there are fewer pages than the max, show all of them
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include page 1
      pageNumbers.push(1);
      
      // Calculate start and end pages to show
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      // Add ellipsis after page 1 if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always include last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  const pageNumbers = getPageNumbers();
  
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
      {loading ? (
        <div className="w-full flex justify-center items-center py-12">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-indigo-600 animate-spin mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading items...</p>
          </div>
        </div>
      ) : isEmpty ? (
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
        {/* Pagination */}
      {!isEmpty && !loading && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-label="Previous page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {pageNumbers.map((pageNumber, index) => (
              typeof pageNumber === 'number' ? (
                <button
                  key={index}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === pageNumber
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {pageNumber}
                </button>
              ) : (
                <span key={index} className="px-2 text-gray-500">
                  {pageNumber}
                </span>
              )
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-label="Next page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default PaginatedGridContainer;
