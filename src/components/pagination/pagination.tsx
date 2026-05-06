import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: Props) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 0) return [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  if (totalPages <= 1) return null; 

  return (
    <div className={`flex items-center justify-center w-full gap-2 py-4 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white transition-all
          ${currentPage === 1
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-600 hover:border-brand-500 hover:text-brand-500 cursor-pointer"
          }`}
      >
        <ChevronLeft size={18} />
      </button>

      <div className="flex items-center gap-1.5">
        {pages.map((page, index) =>
          typeof page === "number" ? (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`flex items-center justify-center w-9 h-9 text-sm font-medium rounded-lg transition-all cursor-pointer
                ${page === currentPage
                  ? "bg-[#4a6fa5] text-white shadow-sm shadow-brand-200"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-brand-500 hover:text-brand-500"
                }`}
            >
              {page}
            </button>
          ) : (
            <span key={`dots-${index}`} className="px-1 text-gray-400 font-medium">
              {page}
            </span>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white transition-all
          ${currentPage === totalPages
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-600 hover:border-brand-500 hover:text-brand-500 cursor-pointer"
          }`}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;