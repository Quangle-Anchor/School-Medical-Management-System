import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalElements, 
  pageSize, 
  onPageChange,
  isFirst = false,
  isLast = false 
}) => {
  // Generate page numbers with ellipsis logic
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show limited pages with ellipsis logic
      const half = Math.floor(maxVisiblePages / 2);
      let start = Math.max(0, currentPage - half);
      let end = Math.min(totalPages - 1, start + maxVisiblePages - 1);
      
      // Adjust start if we're near the end
      if (end - start < maxVisiblePages - 1) {
        start = Math.max(0, end - maxVisiblePages + 1);
      }
      
      // Add first page if not already included
      if (start > 0) {
        pageNumbers.push(0);
        if (start > 1) {
          pageNumbers.push('...');
        }
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      // Add last page if not already included
      if (end < totalPages - 1) {
        if (end < totalPages - 2) {
          pageNumbers.push('...');
        }
        pageNumbers.push(totalPages - 1);
      }
    }
    
    return pageNumbers;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
      onPageChange(newPage);
    }
  };

  // Don't render if there's only one page or no data
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
      <div className="flex items-center justify-between">
        {/* Pagination Info */}
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Showing {(currentPage * pageSize) + 1} to{' '}
            {Math.min((currentPage + 1) * pageSize, totalElements)} of{' '}
            {totalElements} results
          </span>
        </div>

        {/* Pagination Navigation */}
        <div className="flex items-center space-x-2">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={isFirst || currentPage === 0}
            className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {generatePageNumbers().map((pageNum, index) => (
              <React.Fragment key={index}>
                {pageNum === '...' ? (
                  <span className="px-3 py-2 text-gray-400 text-sm">...</span>
                ) : (
                  <button
                    onClick={() => handlePageChange(pageNum)}
                    className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md transition-colors ${
                      pageNum === currentPage
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={isLast || currentPage >= totalPages - 1}
            className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRightIcon className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
