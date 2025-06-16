import { ReactNode, useState } from 'react';
import Table, { TableProps, Column } from './Table';
import Pagination from './Pagination';

export interface TableWithPaginationProps<T> extends Omit<TableProps<T>, 'data'> {
  data: T[];
  itemsPerPage?: number;
  paginationClassName?: string;
  showPagination?: boolean;
}

function TableWithPagination<T>({
  columns,
  data,
  className = '',
  paginationClassName = '',
  itemsPerPage = 10,
  showPagination = true,
  ...rest
}: TableWithPaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate the current page's data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  
  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  return (
    <div className={className}>
      <Table
        columns={columns}
        data={currentItems}
        {...rest}
      />
      
      {showPagination && (
        <div className="mt-3">
          <Pagination
            totalItems={data.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            className={paginationClassName}
          />
        </div>
      )}
    </div>
  );
}

export default TableWithPagination;
export type { Column };
