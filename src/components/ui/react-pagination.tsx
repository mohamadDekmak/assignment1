import React from 'react';
import ReactPaginate from 'react-paginate';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './react-pagination.css';

interface ReactPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function ReactPagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  isLoading = false 
}: ReactPaginationProps) {
  if (totalPages <= 1) return null;

  const handlePageClick = (event: { selected: number }) => {
    const newPage = event.selected + 1;
    onPageChange(newPage);
  };

  return (
    <div className="flex items-center justify-center mt-4">
      <ReactPaginate
        previousLabel={
          <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </div>
        }
        nextLabel={
          <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        }
        breakLabel={
          <span className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300">
            ...
          </span>
        }
        pageCount={totalPages}
        marginPagesDisplayed={1}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        forcePage={currentPage - 1}
        containerClassName="pagination-container"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName={`previous-item ${currentPage <= 1 || isLoading ? 'disabled' : ''}`}
        nextClassName={`next-item ${currentPage >= totalPages || isLoading ? 'disabled' : ''}`}
        activeClassName="active-page"
        disabledClassName="disabled"
        breakClassName="break-item"
      />
    </div>
  );
}
