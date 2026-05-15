import { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";

import { useUser } from "@/hooks/actions/useAuth";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useGetOverViewTourCustomized } from "@/hooks/actions/useUser";
import { useListSQLData } from "@/hooks/actions/useSql";
import { formatMoney } from "@/utils/format-number";

interface DetailTourPriceOverviewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  tourCustomizedGUID: string;
}

interface OverviewColumn {
  intColRef: number;
  strColName: string;
}

interface OverviewDay {
  intRowID: number;
  TC11_DayOrder: number;
  strDes: string;
  intCurrencyID: number;
  strCol1?: unknown;
  strCol2?: unknown;
  strCol3?: unknown;
  strCol4?: unknown;
  strCol5?: unknown;
  strCol6?: unknown;
  strCol7?: unknown;
  strCol8?: unknown;
  strCol9?: unknown;
  strCol10?: unknown;
  strCol11?: unknown;
  [key: string]: unknown;
}

interface OverviewResponse {
  data?: [OverviewDay[], OverviewColumn[]];
  isSuccess?: boolean;
  message?: string | null;
  errors?: unknown;
}

const DetailTourPriceOverviewPopup = ({
  isOpen,
  onClose,
  tourCustomizedGUID,
}: DetailTourPriceOverviewPopupProps) => {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState<number>();

  const { ctData: categoriesData = [], ctLoading: isCategoryLoading } = useListSQLData({
    strTableName: "CM37",
    strWhere: `INNER JOIN TC07 ON TC07.CM37_EasiaCateID = CM37.CM37_EasiaCateID WHERE TC07.TC03_TourCustomizedGUID = '${tourCustomizedGUID}' ORDER BY CM37_Order`,
    strFeildSelect:
      "CM37.CM37_EasiaCateID AS intID, CM37.CM37_EasiaCateName AS strName",
  });

  useEffect(() => {
    if (!isOpen || !categoriesData.length) return;

    const currentExists = categoriesData.some(
      (item: any) => Number(item.intID) === selectedCategory
    );

    if (!selectedCategory || !currentExists) {
      setSelectedCategory(Number(categoriesData[0].intID));
    }
  }, [isOpen, categoriesData, selectedCategory]);

  const {
    data: overviewData,
    isLoading: isOverviewLoading,
  } = useQuery<OverviewResponse>({
    queryKey: [
      QUERY_KEYS.USER.LIST_OVERVIEW_TOUR_CUSTOMIZE,
      tourCustomizedGUID,
      selectedCategory,
    ],

    queryFn: () =>
      useGetOverViewTourCustomized({
        strTourCustomizedGUID: tourCustomizedGUID,
        intEasiaCateID: selectedCategory,
      }),

    enabled:
      isOpen &&
      !!user?.strUserGUID &&
      !!tourCustomizedGUID &&
      !!selectedCategory,

    placeholderData: keepPreviousData,
  });

  const days = overviewData?.data?.[0] ?? [];
  const columns = overviewData?.data?.[1] ?? [];

  const getCellValue = (day: OverviewDay, intColRef: number) => {
    const rawValue = day[`strCol${intColRef}`];

    if (typeof rawValue === "number") return rawValue;

    if (typeof rawValue === "string") {
      const parsed = Number(rawValue);
      return Number.isNaN(parsed) ? 0 : parsed;
    }

    return 0;
  };

  const totalByColumn = useMemo(
    () =>
      columns.map((column) =>
        days.reduce((sum, day) => sum + getCellValue(day, column.intColRef), 0)
      ),
    [columns, days]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] overflow-y-auto bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex min-h-full items-start justify-center py-6">
        <div className="relative flex max-h-[calc(100vh-48px)] w-full max-w-6xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
          <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
            <h2 className="select-none text-xl font-bold text-[#4a6fa5]">
              Overview Price
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <div className="flex max-w-[240px] flex-col gap-1.5">
                <label className="ml-1 text-[12px] font-medium text-gray-500">
                  Category
                </label>

                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(Number(e.target.value))}
                    disabled={isCategoryLoading || !categoriesData.length}
                    className="h-10 w-full cursor-pointer appearance-none rounded-md border border-gray-300 bg-white pl-3 pr-10 text-sm transition-all focus:border-[#4a6fa5] focus:outline-none focus:ring-2 focus:ring-[#4a6fa5]/20 disabled:cursor-not-allowed disabled:bg-gray-100"
                  >
                    <option value="" disabled>
                      {isCategoryLoading ? "Loading categories..." : "Select category"}
                    </option>

                    {categoriesData.map((category: any) => (
                      <option key={category.intID} value={category.intID}>
                        {category.strName}
                      </option>
                    ))}
                  </select>

                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="w-full min-w-[960px] border-collapse text-left">
                  <thead>
                    <tr className="bg-[#3b66a0] text-white">
                      <th className="px-6 py-3.5 text-[14px] font-semibold">
                        Description
                      </th>

                      {columns.map((column) => (
                        <th
                          key={column.intColRef}
                          className="px-6 py-3.5 text-right text-[14px] font-semibold"
                        >
                          {column.strColName}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="text-[14px] text-gray-700">
                    {isOverviewLoading ? (
                      <tr>
                        <td
                          colSpan={columns.length + 1}
                          className="px-6 py-8 text-center text-gray-400"
                        >
                          Loading...
                        </td>
                      </tr>
                    ) : days.length > 0 ? (
                      <>
                        {days.map((day, index) => (
                          <tr
                            key={day.intRowID}
                            className={`border-b border-gray-100 transition-colors hover:bg-gray-50/50 ${index % 2 === 1 ? "bg-[#f8fbff]/50" : ""
                              }`}
                          >
                            <td className="px-6 py-4 font-medium text-gray-900">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: day.strDes || "--",
                                }}
                              />
                            </td>

                            {columns.map((column) => (
                              <td
                                key={`${day.intRowID}-${column.intColRef}`}
                                className="px-6 py-4 text-right text-gray-600"
                              >
                                {formatMoney(getCellValue(day, column.intColRef))}
                              </td>
                            ))}
                          </tr>
                        ))}

                        <tr className="bg-gray-50/80">
                          <td className="px-6 py-4 font-bold text-gray-900">Sum</td>

                          {totalByColumn.map((total, index) => (
                            <td
                              key={`sum-${columns[index]?.intColRef}-${index}`}
                              className="px-6 py-4 text-right font-bold text-[#3b66a0]"
                            >
                              {formatMoney(total)}
                            </td>
                          ))}
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td
                          colSpan={columns.length + 1}
                          className="px-6 py-8 text-center text-gray-400"
                        >
                          No data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default DetailTourPriceOverviewPopup;
