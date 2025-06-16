import { type ReactNode, useState } from 'react';

export interface Column<T> {
  id: string;
  header: ReactNode;
  accessor: keyof T | ((row: T) => ReactNode);
  sortable?: boolean;
  sortFn?: (a: T, b: T) => number;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  emptyState?: ReactNode;
  compact?: boolean;
  keyExtractor?: (item: T) => string | number;
  onRowClick?: (item: T) => void;
}

function Table<T>({ 
  columns, 
  data, 
  className = '',
  emptyState,
  compact = false,
  keyExtractor,
  onRowClick
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Helper function to get the cell content
  const getCellContent = (item: T, column: Column<T>): ReactNode => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    return item[column.accessor as keyof T] as ReactNode;
  };

  // Sorting logic
  const handleSort = (columnId: string, sortFn?: (a: T, b: T) => number) => {
    if (!sortFn) return;

    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === columnId) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    setSortConfig({ key: columnId, direction });
  };

  // Apply sorting to data
  const sortedData = [...data];
  if (sortConfig) {
    const column = columns.find(col => col.id === sortConfig.key);
    if (column && column.sortFn) {
      sortedData.sort((a, b) => {
        const result = column.sortFn!(a, b);
        return sortConfig.direction === 'asc' ? result : -result;
      });
    }
  }

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              {columns.map((column) => (
                <th 
                  key={column.id}
                  className={`
                    px-3 py-2 text-xs font-medium text-left text-gray-500 dark:text-gray-400
                    ${column.align === 'center' ? 'text-center' : ''}
                    ${column.align === 'right' ? 'text-right' : ''}
                    ${column.sortable ? 'cursor-pointer hover:text-gray-900 dark:hover:text-gray-200' : ''}
                  `}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.id, column.sortFn)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <span className="flex flex-col">
                        <svg 
                          className={`w-2.5 h-2.5 ${sortConfig?.key === column.id && sortConfig.direction === 'asc' ? 'text-black dark:text-white' : 'text-gray-400'}`} 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="1.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                        <svg 
                          className={`w-2.5 h-2.5 -mt-0.5 ${sortConfig?.key === column.id && sortConfig.direction === 'desc' ? 'text-black dark:text-white' : 'text-gray-400'}`} 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="1.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((item, index) => (
                <tr 
                  key={keyExtractor ? keyExtractor(item) : index}
                  className={`
                    border-b border-gray-50 dark:border-gray-800 
                    ${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50' : ''}
                  `}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {columns.map((column) => (
                    <td 
                      key={`${index}-${column.id}`}
                      className={`
                        px-3 ${compact ? 'py-1.5' : 'py-2.5'}
                        text-xs
                        ${column.align === 'center' ? 'text-center' : ''}
                        ${column.align === 'right' ? 'text-right' : ''}
                      `}
                    >
                      {getCellContent(item, column)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="px-3 py-6 text-center text-xs text-gray-500 dark:text-gray-400"
                >
                  {emptyState || "No data available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
