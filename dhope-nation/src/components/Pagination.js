import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="px-4 py-2 mx-1 bg-[#4E6A56] text-white cursor-pointer rounded-md"
      >
        First
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 mx-1 bg-[#4E6A56] text-white cursor-pointer rounded-md"
      >
        Previous
      </button>
      <span className="px-4 py-2 mx-1 text-[#303934]">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 mx-1 bg-[#4E6A56] text-white cursor-pointer rounded-md"
      >
        Next
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 mx-1 bg-[#4E6A56] text-white cursor-pointer rounded-md"
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;
