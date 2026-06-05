import { useEffect, useMemo } from "react";
import PanelPopup from "@/components/popup/panel-popup";
import { useTranslate } from "@/locales";
import { fDateTime } from "@/utils/format-time";

type ApiEmptyObject = Record<string, never>;

type DetailServiceSingleApiItem = {
  No?: number;
  strSupplierMappingPriceGUID?: string;
  strSupplierName?: string;
  strItemName?: string;
  strItemTypeName?: string;
  strServiceName?: string;
  strPriceSeasonName?: string;
  strSeasonName?: string;
  strListDayID?: string;
  strComTypeName?: string;
  strEasiaCateName?: string;
  strMealIncludedTypeName?: string;
  dblMarkup?: number;
  dblPriceFrom?: number;
  dblPriceView?: number;
  dblPrice?: number;
  intCurrencyID?: number;
  intTotalRecords?: string | number;
  dtmSeasonDateFrom?: string | ApiEmptyObject;
  dtmSeasonDateTo?: string | ApiEmptyObject;
};

type DetailServiceSingleApiResponse = {
  data?: [DetailServiceSingleApiItem[], unknown[], unknown[]];
  isSuccess?: boolean;
  message?: string | null;
  errors?: unknown;
};

type DetailServiceSingleDProps = {
  open?: boolean;
  onClose?: () => void;
  title?: string;
  detailData?: DetailServiceSingleApiResponse | DetailServiceSingleApiItem[] | DetailServiceSingleApiItem;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
};

const isValidValue = (value: any) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "object" && Object.keys(value).length === 0) return false;
  if (value === "") return false;
  return true;
};

const formatDateValue = (value: any) => {
  if (!isValidValue(value) || typeof value === "object") return "-";

  try {
    return fDateTime(value);
  } catch {
    return String(value);
  }
};

const formatPriceValue = (value: any, currencyID?: number) => {
  if (!isValidValue(value)) return "-";

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) return "-";

  if (currencyID === 1) {
    return `$${numberValue}`;
  }

  return numberValue.toLocaleString("vi-VN");
};

const formatMarkupValue = (value: any, emptyLabel: string) => {
  const numberValue = Number(value ?? 0);

  if (Number.isNaN(numberValue) || numberValue <= 0) {
    return emptyLabel;
  }

  return `${numberValue}%`;
};

const DetailServiceSingleD = ({
  open = false,
  onClose,
  title,
  detailData,
  page = 1,
  pageSize = 10,
  onPageChange,
  // onPageSizeChange,
}: DetailServiceSingleDProps) => {
  const { t } = useTranslate("tourcustomize");

  const listData = useMemo(() => {
    if (Array.isArray((detailData as DetailServiceSingleApiResponse)?.data?.[0])) {
      return (detailData as DetailServiceSingleApiResponse).data![0];
    }

    if (Array.isArray((detailData as any)?.[0])) {
      return (detailData as any)[0];
    }

    if (Array.isArray(detailData)) {
      return detailData;
    }

    if (detailData && typeof detailData === "object") {
      return [detailData as DetailServiceSingleApiItem];
    }

    return [];
  }, [detailData]);

  const firstItem = listData?.[0];

  const popupTitle =
    title ||
    firstItem?.strSupplierName ||

    t("serviceDetail");

  const total = Number(firstItem?.intTotalRecords ?? listData.length ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pagedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return listData.slice(startIndex, startIndex + pageSize);
  }, [listData, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      onPageChange?.(1);
    }
  }, [onPageChange, page, totalPages]);

  return (
    <PanelPopup
      open={open}
      onClose={onClose}
      title={popupTitle}
      className="w-[980px]"
    >
      <div className="space-y-4 pt-4">
        {pagedData.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-400">
            {t("noData")}
          </div>
        ) : (
          pagedData.map((row: any, index: any) => {
            const displayNo = row?.No ?? (page - 1) * pageSize + index + 1;
            const displayPrice =
              row?.dblPriceFrom ?? row?.dblPriceView ?? row?.dblPrice;

            return (
              <div
                key={row?.strSupplierMappingPriceGUID || displayNo}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >
                <div className="border-b border-gray-100 bg-slate-50 px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {t("no")} {displayNo}
                      </div>
                      <h3 className="mt-1 text-[28px] font-semibold leading-tight text-[#0b4a8b] max-md:text-xl">
                        {row?.strSupplierName || "-"}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {t("by")} {row?.strCompanyName || "-"}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {t("price")}
                      </div>
                      <div className="mt-1 text-[36px] font-bold leading-none text-[#0b4a8b] max-md:text-2xl">
                        {formatPriceValue(displayPrice, row?.intCurrencyID)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-10 gap-y-5 px-5 py-5 max-md:grid-cols-1">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {t("serviceName")}
                    </div>
                    <div className="mt-1 text-sm text-slate-700">
                      {row?.strItemName || row?.strCompanyName || row?.strServiceName || "-"}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {t("supplierName")}
                    </div>
                    <div className="mt-1 text-sm text-slate-700">
                      {row?.strSupplierName || "-"}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {t("category")}
                    </div>
                    <div className="mt-1 text-sm text-slate-700">
                      {row?.strEasiaCateName || "-"}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {t("meal")}
                    </div>
                    <div className="mt-1 text-sm text-slate-700">
                      {row?.strMealIncludedTypeName || "-"}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {t("season")}
                    </div>
                    <div className="mt-1 text-sm text-slate-700">
                      {row?.strPriceSeasonName || row?.strSeasonName || "-"}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {t("dateValid")}
                    </div>
                    <div className="mt-1 text-sm text-slate-700">
                      {formatDateValue(row?.dtmSeasonDateFrom)} - {formatDateValue(row?.dtmSeasonDateTo)}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {t("markUp")}
                    </div>
                    <div className="mt-1 text-sm text-slate-700">
                      {formatMarkupValue(row?.dblMarkup, t("noMarkup"))}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {t("price")}
                    </div>
                    <div className="mt-1 text-sm text-slate-700">
                      {formatPriceValue(displayPrice, row?.intCurrencyID)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* {total > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages || 1}
            totalRecords={total}
            recordsPerPage={pageSize}
            onPageChange={(nextPage) => {
              onPageChange?.(nextPage);
            }}
            onRecordsPerPageChange={(nextPageSize) => {
              onPageSizeChange?.(nextPageSize);
              onPageChange?.(1);
            }}
          />
        )} */}
      </div>
    </PanelPopup>
  );
};

export default DetailServiceSingleD;
