import { useTranslate } from "@/locales";
import React, { useRef, useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, Folder } from "lucide-react";

export type ColumnDef<T> = {
  field: keyof T;
  headerName?: string;
  render?: (value: any, row: T, rowIndex: number) => React.ReactNode;
  width?: number;
  sort?: boolean;
  algin?: "center" | "start" | "end";
  title?: boolean;
};

type TableCoreProps<T> = {
  rowData: T[];
  columnDefs: ColumnDef<T>[];
  loading?: boolean;
  onSort?: (sort: { field: keyof T; direction: "asc" | "desc" | "" }) => void;
  title?: boolean;
};

export function TableCore<T extends object>({
  rowData,
  columnDefs,
  loading = false,
  onSort,
}: TableCoreProps<T>) {
  const { t } = useTranslate("exchange");
  const [sortState, setSortState] = useState<{
    field: keyof T | null;
    direction: "asc" | "desc" | "";
  }>({ field: null, direction: "" });
  const tableRef = useRef<HTMLTableElement>(null);

  const handleSortClick = (col: ColumnDef<T>) => {
    if (!col.sort) return;

    setSortState((prev) => {
      let newDirection: "asc" | "desc" | "" = "asc";
      if (prev.field === col.field) {
        if (prev.direction === "asc") newDirection = "desc";
        else if (prev.direction === "desc") newDirection = "";
      }

      const newState = {
        field: col.field,
        direction: newDirection,
      };
      onSort?.(newState);
      return newState;
    });
  };

  const getAlignmentClass = (align?: string) => {
    switch (align) {
      case "start": return "justify-start text-left";
      case "end": return "justify-end text-right";
      default: return "justify-center text-center";
    }
  };

  const isEmptyObject = (v: any) =>
    typeof v === "object" &&
    v !== null &&
    !Array.isArray(v) &&
    Object.keys(v).length === 0;

  const safeValueFn = (v: any) => {
    if (
      v === null ||
      v === undefined ||
      v === "" ||
      Number.isNaN(v) ||
      isEmptyObject(v)
    ) return "--";

    return v;
  };

  const buildSafeRow = (row: any) => {
    const result: any = {};
    for (const key in row) {
      result[key] = safeValueFn(row[key]);
    }
    return result;
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm bg-white">
        <table ref={tableRef} className="min-w-full border-collapse">
          <thead>
            <tr className="bg-blue-50/80 border-b border-gray-200">
              {columnDefs.map((col, idx) => (
                <th
                  key={`${String(col.field)}-${idx}`}
                  onClick={() => handleSortClick(col)}
                  style={{ width: col.width ? `${col.width}px` : "auto" }}
                  className={`px-4 py-3.5 font-semibold text-[13px] text-gray-600 transition-colors ${col.sort ? "cursor-pointer hover:bg-gray-100" : ""
                    }`}
                >
                  <div className={`flex items-center gap-1.5 ${getAlignmentClass(col.algin)}`}>
                    <span className="truncate">
                      {col.headerName ?? String(col.field)}
                    </span>
                    {col.sort && (
                      <span className="text-gray-400">
                        {sortState.field === col.field ? (
                          sortState.direction === "asc" ? <ChevronUp size={14} className="text-brand-500" /> :
                            sortState.direction === "desc" ? <ChevronDown size={14} className="text-brand-500" /> :
                              <ChevronsUpDown size={14} />
                        ) : (
                          <ChevronsUpDown size={14} className="opacity-40" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`skeleton-${idx}`} className="animate-pulse">
                  {columnDefs.map((_, cIdx) => (
                    <td key={cIdx} className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded-md w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : rowData.length === 0 ? (
              <tr>
                <td colSpan={columnDefs.length} className="py-16">
                  <div className="flex flex-col items-center justify-center animate-in fade-in duration-500">
                    <div className="flex items-center justify-center w-16 h-16 bg-blue-50/80 rounded-full mb-4">
                      <Folder size={32} strokeWidth={1.5} className="text-[#4a6fa5]" />
                    </div>
                    <span className="text-gray-500 text-sm font-medium">
                      {t("Không có dữ liệu")}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              rowData.map((row: any, rIdx) => {
                const safeRow = buildSafeRow(row);

                return (
                  <tr
                    key={rIdx}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    {columnDefs.map((col, cIdx) => {
                      const rawValue = row[col.field];
                      const safeValue = safeValueFn(rawValue);

                      return (
                        <td
                          key={cIdx}
                          className="px-4 py-3.5 text-[14px] text-gray-700"
                          title={col.title ? String(safeValue) : ""}
                        >
                          <div
                            className={`flex items-center ${getAlignmentClass(col.algin).split(" ")[0]
                              }`}
                          >
                            {col.render ? (
                              (() => {
                                try {
                                  return col.render(safeValue, safeRow, rIdx);
                                } catch {
                                  return "--";
                                }
                              })()
                            ) : (
                              String(safeValue)
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}