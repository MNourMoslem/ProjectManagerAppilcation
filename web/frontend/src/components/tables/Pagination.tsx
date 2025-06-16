import { useMemo } from 'react';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  maxPages?: number;
  className?: string;
}

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  maxPages = 5,
  className = '',
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const pages = useMemo(() => {
    const pagesArray: (number | string)[] = [];
    
    if (totalPages <= maxPages) {
      // If we have fewer pages than maxPages, show all
      for (let i = 1; i <= totalPages; i++) {
        pagesArray.push(i);
      }
    } else {
      // Always include first and last page
      pagesArray.push(1);
      
      // Calculate start and end of displayed pages
      let startPage = Math.max(2, currentPage - Math.floor(maxPages / 2));
      let endPage = Math.min(totalPages - 1, startPage + maxPages - 3);
      
      if (endPage - startPage < maxPages - 3) {
        startPage = Math.max(2, endPage - (maxPages - 3));
      }
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pagesArray.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pagesArray.push(i);
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pagesArray.push('...');
      }
      
      // Add last page if not already included
      if (totalPages > 1) {
        pagesArray.push(totalPages);
      }
    }
    
    return pagesArray;
  }, [totalItems, itemsPerPage, currentPage, maxPages]);

  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {/* Previous button */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          px-2 py-1 text-xs rounded
          ${currentPage === 1 
            ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}
        `}
        aria-label="Previous page"
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page buttons */}
      {pages.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...' || page === currentPage}
          className={`
            min-w-[1.5rem] h-6 px-1.5 text-xs rounded
            ${page === currentPage 
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium' 
              : page === '...' 
                ? 'text-gray-500 dark:text-gray-400 cursor-default' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}
          `}
        >
          {page}
        </button>
      ))}

      {/* Next button */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          px-2 py-1 text-xs rounded
          ${currentPage === totalPages 
            ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}
        `}
        aria-label="Next page"
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
