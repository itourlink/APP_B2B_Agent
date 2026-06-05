import { useEffect, useMemo, useState } from "react";

import Pagination from "@/components/pagination/pagination";
import PanelPopup from "@/components/popup/panel-popup";
import { useTranslate } from "@/locales";
import { fDateTime } from "@/utils/format-time";
import { formatPrice } from "@/utils/format-number";

type DetailAccommodationDProps = {
  open: boolean;
  onClose: () => void;
  detailData?: any;
  isLoading?: boolean;
  isError?: boolean;
};

const PAGE_SIZE_STORAGE_KEY = "pagination_page_size:detail-accommodation-d";

const isValidValue = (value: any) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "object" && Object.keys(value).length === 0) return false;
  if (value === "") return false;
  return true;
};

const DetailAccommodationD = ({
  open,
  onClose,
  detailData,
  isLoading = false,
  isError = false,
}: DetailAccommodationDProps) => {
  const { t } = useTranslate("tourcustomize");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(() => {
    const savedPageSize = localStorage.getItem(PAGE_SIZE_STORAGE_KEY);
    return savedPageSize ? Number(savedPageSize) : 10;
  });

  const listData = useMemo(() => {
    if (Array.isArray(detailData?.data?.[0])) {
      return detailData.data[0];
    }

    if (Array.isArray(detailData?.[0])) {
      return detailData[0];
    }

    if (Array.isArray(detailData)) {
      return detailData;
    }

    if (detailData && typeof detailData === "object") {
      return [detailData];
    }

    return [];
  }, [detailData]);

  const totalRecords = Number(listData?.[0]?.intTotalRecords || listData.length || 0);
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  const pagedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return listData.slice(startIndex, startIndex + pageSize);
  }, [listData, page, pageSize]);

  const popupTitle = useMemo(() => {
    const firstItem = listData[0];

    return (
      firstItem?.strItemName ||
      firstItem?.strItemTypeName ||
      firstItem?.strServiceName ||
      t("serviceDetail")
    );
  }, [listData, t]);

  const startRecord = listData.length ? (page - 1) * pageSize + 1 : 0;
  const endRecord = listData.length ? Math.min(page * pageSize, totalRecords) : 0;

  useEffect(() => {
    localStorage.setItem(PAGE_SIZE_STORAGE_KEY, String(pageSize));
  }, [pageSize]);

  useEffect(() => {
    setPage(1);
  }, [detailData]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [page, totalPages]);

  const formatDateValue = (value: any) => {
    if (!isValidValue(value) || typeof value === "object") return "-";

    try {
      return fDateTime(value);
    } catch {
      return String(value);
    }
  };

  const formatPriceValue = (value: any) => {
    if (!isValidValue(value)) return "-";

    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) {
      return String(value);
    }

    return `${formatPrice(numberValue)} đ`;
  };

  const formatMarkupValue = (value: any) => {
    const numberValue = Number(value ?? 0);

    if (Number.isNaN(numberValue) || numberValue <= 0) {
      return t("noMarkup");
    }

    return `${numberValue}%`;
  };

  return (
    <PanelPopup
      open={open}
      onClose={onClose}
      title={popupTitle}
      className="w-[1280px]"
    >
      <div className="flex h-[72vh] min-h-0 overflow-hidden bg-gray-50 font-sans">
        <div className="h-full min-h-0 w-20 shrink-0 overflow-y-auto border-r border-gray-100 bg-white py-6 lg:w-52">
          <div className="flex min-h-full flex-col items-center gap-4 px-2">
            {listData.length ? (
              listData.map((item: any, index: number) => (
                <a
                  key={
                    item?.strSupplierMappingPriceGUID ||
                    item?.strSupplierGUID ||
                    index
                  }
                  href={`#detail-accommodation-${index}`}
                  className="flex w-full items-center gap-3 rounded-xl border border-gray-100 bg-white px-3 py-3 text-left transition-all hover:border-[#004b91] hover:bg-blue-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-[#004b91]">
                    {item?.No ?? index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-bold uppercase tracking-tight text-gray-700">
                      {item?.strItemName || item?.strItemTypeName || "Accommodation"}
                    </div>
                    <div className="truncate text-[11px] text-gray-400">
                      {formatPriceValue(
                        item?.dblPriceView ?? item?.dblPriceFrom ?? item?.dblPrice,
                      )}
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <div className="px-3 text-center text-xs text-gray-400">
                {t("noData")}
              </div>
            )}
          </div>
        </div>

        <div className="h-full min-h-0 flex-1 space-y-6 overflow-y-auto bg-white px-8 py-6">
          {isLoading ? (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-400">
              {t("loadingData")}
            </div>
          ) : pagedData.length ? (
            pagedData.map((item: any, index: number) => {
              const displayIndex = (page - 1) * pageSize + index + 1;

              return (
                <section
                  id={`detail-accommodation-${displayIndex - 1}`}
                  key={
                    item?.strSupplierMappingPriceGUID ||
                    item?.strSupplierGUID ||
                    displayIndex
                  }
                  className="space-y-4"
                >
                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-100 bg-slate-50 px-6 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            No. {item?.No ?? displayIndex}
                          </div>
                          <h3 className="mt-1 text-xl font-bold text-[#0b4a8b]">
                            {item?.strItemName || item?.strItemTypeName || "-"}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {t("by")} {item?.strSupplierName || item?.strOwnerCompanyName || "-"}
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            {t("price")}
                          </div>
                          <div className="mt-1 text-2xl font-bold text-[#0b4a8b]">
                            {formatPriceValue(
                              item?.dblPriceView ?? item?.dblPriceFrom ?? item?.dblPrice,
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-6 px-6 py-5 max-md:grid-cols-1">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {t("serviceName")}
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-800">
                          {item?.strItemName || item?.strItemTypeName || "-"}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {t("supplierName")}
                        </div>
                        <div className="mt-1 text-sm text-slate-700">
                          {item?.strSupplierName || item?.strOwnerCompanyName || "-"}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {t("category")}
                        </div>
                        <div className="mt-1 text-sm text-slate-700">
                          {item?.strEasiaCateName || item?.intEasiaCateID || "-"}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {t("meal")}
                        </div>
                        <div className="mt-1 text-sm text-slate-700">
                          {item?.strMealIncludedTypeName || "-"}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {t("season")}
                        </div>
                        <div className="mt-1 text-sm text-slate-700">
                          {item?.strPriceSeasonName || item?.strSeasonName || "-"}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {t("dateValid")}
                        </div>
                        <div className="mt-1 text-sm text-slate-700">
                          {formatDateValue(item?.dtmSeasonDateFrom)} - {formatDateValue(item?.dtmSeasonDateTo)}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {t("markUp")}
                        </div>
                        <div className="mt-1 text-sm text-slate-700">
                          {formatMarkupValue(item?.dblMarkup)}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {t("price")}
                        </div>
                        <div className="mt-1 text-sm text-slate-700">
                          {formatPriceValue(
                            item?.dblPriceView ?? item?.dblPriceFrom ?? item?.dblPrice,
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-400">
              {isError ? t("loadDataError") : t("noData")}
            </div>
          )}

          {!isLoading && !isError && totalRecords > 0 && (
            <div
              className="
                border-t border-gray-100 pt-3
                [&_button]:h-7
                [&_button]:min-w-7
                [&_button]:px-2
                [&_button]:text-xs
                [&_select]:h-7
                [&_select]:rounded
                [&_select]:text-xs
                [&_span]:text-xs
              "
            >
              <Pagination
                currentPage={page}
                onPageChange={(value) => setPage(value)}
                totalPages={totalPages}
                totalRecords={totalRecords}
                recordsPerPage={pageSize}
                onRecordsPerPageChange={(value) => {
                  setPageSize(value);
                  setPage(1);
                }}
              />
            </div>
          )}
        </div>

        <div className="relative hidden w-80 border-l border-gray-200 bg-gray-100 xl:block">
          <div className="absolute inset-0 overflow-y-auto bg-white">
            <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-4 py-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-800">
                {popupTitle}
              </h3>
              <p className="mt-1 text-[11px] text-gray-400">
                [{startRecord} - {endRecord} / {totalRecords}]
              </p>
            </div>

            <div className="space-y-4 p-4">
              <div className="rounded-2xl border border-gray-200 bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Summary
                </div>
                <div className="mt-3 space-y-3 text-sm text-slate-700">
                  <div className="flex items-center justify-between gap-3">
                    <span>Total Items</span>
                    <span className="font-semibold text-[#0b4a8b]">{totalRecords}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Current Page</span>
                    <span className="font-semibold text-[#0b4a8b]">{page}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Records / Page</span>
                    <span className="font-semibold text-[#0b4a8b]">{pageSize}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Total Pages</span>
                    <span className="font-semibold text-[#0b4a8b]">{totalPages}</span>
                  </div>
                </div>
              </div>

              {listData[0] && (
                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Current Supplier
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-800">
                    {listData[0]?.strSupplierName || listData[0]?.strOwnerCompanyName || "-"}
                  </div>

                  <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    First Service
                  </div>
                  <div className="mt-2 text-sm text-slate-700">
                    {listData[0]?.strItemName || listData[0]?.strItemTypeName || "-"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PanelPopup>
  );
};

export default DetailAccommodationD;
