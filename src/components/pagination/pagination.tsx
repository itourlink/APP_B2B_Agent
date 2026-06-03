import { useState, type ChangeEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const;

export interface Props {
  currentPage: number;
  totalPages: number;
  totalRecords?: number;
  recordsPerPage: number;
  onPageChange: (page: number) => void;
  onRecordsPerPageChange: (value: number) => void;
  className?: string;
}

interface LegacyProps {
  currentPage: number;
  totalPages: number;
  totalRecords?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (value: number) => void;
  className?: string;
}

type PaginationProps = Props | LegacyProps;

const getPageNumbers = (currentPage: number, totalPages: number) => {
  const pages: (number | string)[] = [];

  if (totalPages <= 0) return pages;

  if (totalPages <= 7) {
    for (let page = 1; page <= totalPages; page += 1) {
      pages.push(page);
    }

    return pages;
  }

  pages.push(1);

  if (currentPage > 3) {
    pages.push("...");
  }

  const startPage = Math.max(2, currentPage - 1);
  const endPage = Math.min(totalPages - 1, currentPage + 1);

  for (let page = startPage; page <= endPage; page += 1) {
    pages.push(page);
  }

  if (currentPage < totalPages - 2) {
    pages.push("...");
  }

  pages.push(totalPages);

  return pages;
};

const Pagination = (props: PaginationProps) => {
  const { t } = useTranslation("pagination");
  const { currentPage, totalPages, onPageChange, className = "" } = props;

  const recordsPerPage =
    "recordsPerPage" in props ? props.recordsPerPage : (props.pageSize ?? 10);

  const totalRecords = props.totalRecords ?? totalPages * recordsPerPage;

  const onRecordsPerPageChange =
    "onRecordsPerPageChange" in props
      ? props.onRecordsPerPageChange
      : props.onPageSizeChange;

  const safeRecordsPerPage = Math.max(Number(recordsPerPage) || 10, 1);
  const safeTotalRecords = Math.max(Number(totalRecords) || 0, 0);

  const calculatedTotalPages =
    safeTotalRecords > 0 ? Math.ceil(safeTotalRecords / safeRecordsPerPage) : 1;

  const safeTotalPages = Math.max(totalPages || calculatedTotalPages, 1);

  const safeCurrentPage = Math.min(
    Math.max(Number(currentPage) || 1, 1),
    safeTotalPages,
  );

  const shouldShowPagination = safeTotalPages > 1;
  const pageNumbers = getPageNumbers(safeCurrentPage, safeTotalPages);

  const startRecord =
    safeTotalRecords === 0 ? 0 : (safeCurrentPage - 1) * safeRecordsPerPage + 1;

  const endRecord =
    safeTotalRecords === 0
      ? 0
      : Math.min(safeCurrentPage * safeRecordsPerPage, safeTotalRecords);

  const formattedTotalRecords = new Intl.NumberFormat("vi-VN").format(
    safeTotalRecords,
  );

  const handleRecordsPerPageChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const nextValue = Number(event.target.value);

    if (!onRecordsPerPageChange || Number.isNaN(nextValue)) {
      return;
    }

    onRecordsPerPageChange(nextValue);
    onPageChange(1);
  };

  return (
    <div
      className={`flex w-full flex-col gap-4 px-4 py-3 md:flex-row md:items-center md:justify-between ${className}`}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-5">
        <div className="flex flex-col gap-1">
          {onRecordsPerPageChange ? (
            <div className="relative w-fit">
              <div className="relative w-fit">
                <select
                  value={safeRecordsPerPage}
                  onChange={handleRecordsPerPageChange}
                  className="
                    h-9 w-[72px]
                    cursor-pointer
                    rounded border border-slate-300
                    bg-white px-2
                    text-sm text-slate-700
                    outline-none
                    focus:border-[#4a6fa5]
      "
                >
                  {PAGE_SIZE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

            
            </div>
          ) : (
            <span className="text-sm font-semibold text-slate-800">
              {safeRecordsPerPage}
            </span>
          )}
        </div>

        <div className="flex items-end pb-1">
          <span className="text-sm font-medium text-slate-700">
            [{startRecord} - {endRecord}]/{formattedTotalRecords}
          </span>
        </div>
      </div>
      
      {shouldShowPagination && (
        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <button
            type="button"
            onClick={() => onPageChange(safeCurrentPage - 1)}
            disabled={safeCurrentPage === 1}
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition-all hover:border-[#4a6fa5] hover:text-[#4a6fa5] disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">{t("previous")}</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {pageNumbers.map((page, index) =>
              typeof page === "number" ? (
                <button
                  key={page}
                  type="button"
                  onClick={() => onPageChange(page)}
                  className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg border text-sm font-semibold transition-all ${
                    page === safeCurrentPage
                      ? "border-[#4a6fa5] bg-[#4a6fa5] text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[#4a6fa5] hover:text-[#4a6fa5]"
                  }`}
                >
                  {page}
                </button>
              ) : (
                <span
                  key={`dots-${index}`}
                  className="inline-flex h-9 min-w-9 items-center justify-center text-sm font-semibold text-slate-400"
                >
                  {page}
                </span>
              ),
            )}
          </div>

          <button
            type="button"
            onClick={() => onPageChange(safeCurrentPage + 1)}
            disabled={safeCurrentPage === safeTotalPages}
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition-all hover:border-[#4a6fa5] hover:text-[#4a6fa5] disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
          >
            <span className="hidden sm:inline">{t("next")}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export const PaginationExample = () => {
  const mockData = Array.from({ length: 56 }, (_, index) => ({
    id: index + 1,
    name: `Record ${index + 1}`,
  }));
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const totalRecords = mockData.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  const startIndex = (currentPage - 1) * recordsPerPage;

  const currentItems = mockData.slice(startIndex, startIndex + recordsPerPage);

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="space-y-2">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          >
            {item.name}
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        recordsPerPage={recordsPerPage}
        onPageChange={setCurrentPage}
        onRecordsPerPageChange={setRecordsPerPage}
      />
    </div>
  );
};

export default Pagination;
