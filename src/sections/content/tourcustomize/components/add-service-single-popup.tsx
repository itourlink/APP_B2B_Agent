import React from "react";

import PanelPopup from "@/components/popup/panel-popup";
import Pagination from "@/components/pagination/pagination";
import { useTranslation } from "react-i18next";

type DetailServiceSingleApiItem = {
  No?: number;
  strSupplierMappingPriceGUID?: string;

  strSupplierName?: string;
  strItemName?: string;
  strItemTypeName?: string;

  strPriceSeasonName?: string;
  strSeasonName?: string;
  strListDayID?: string;

  dblMarkup?: number;
  dblPriceFrom?: number;
  intCurrencyID?: number;

  intTotalRecords?: string | number;
};

type DetailServiceSingleApiResponse = {
  data?: [DetailServiceSingleApiItem[], unknown[], unknown[]];
  isSuccess?: boolean;
  message?: string | null;
  errors?: unknown;
};

type DetailServiceSingleDProps = {
    item?: any;
    strTourCustomizedDayGUID: string;
  open?: boolean;
  onClose?: () => void;
  title?: string;
  detailData?: DetailServiceSingleApiResponse;

  page?: number;
  pageSize?: number;

  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
};

const DetailServiceSingleD = ({
  open = false,
  onClose,
  title,
  detailData,
  page = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
}: DetailServiceSingleDProps) => {
  const { t } = useTranslation("tourcustomize");


  const listData = Array.isArray(detailData?.data?.[0])
    ? detailData.data[0]
    : [];

  const firstItem = listData?.[0];

  const popupTitle =
    title ||
    [firstItem?.strSupplierName, firstItem?.strItemName]
      .filter(Boolean)
      .join(" - ") ||
    t("serviceDetail");

  const total = Number(firstItem?.intTotalRecords ?? listData.length ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const startRecord = listData.length ? (page - 1) * pageSize + 1 : 0;
  const endRecord = listData.length ? Math.min(page * pageSize, total) : 0;

  const formatPrice = (value?: number, currencyID?: number) => {
    if (value === undefined || value === null) return "";

    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) return "";

    if (currencyID === 1) {
      return `$${numberValue.toFixed(2)}`;
    }

    return numberValue.toLocaleString("vi-VN");
  };

  const getDayText = (strListDayID?: string) => {
    if (!strListDayID) return "";

    const days = strListDayID
      .split(",")
      .map((day) => day.trim())
      .filter(Boolean);

    if (days.length === 7) {
      return "Monday - Sunday";
    }

    return strListDayID;
  };

  const getMarkupText = (item: DetailServiceSingleApiItem) => {
    const markup = Number(item.dblMarkup ?? 0);

    if (!markup) return "No Markup";

    return `${markup}%`;
  };

  const getDateValidText = (item: DetailServiceSingleApiItem) => {
    const seasonName = item.strSeasonName || "Year around";
    const dayText = getDayText(item.strListDayID);

    return `Date Valid: (${seasonName}) (${dayText})`;
  };

  const handlePageSizeChange = (value: number) => {
    onPageSizeChange?.(value);
    onPageChange?.(1);
  };

  const handlePrev = () => {
    if (page > 1) {
      onPageChange?.(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      onPageChange?.(page + 1);
    }
  };

  return (
    <PanelPopup
      open={open}
      onClose={onClose}
      title={popupTitle}
      className="w-[980px]"
    >
      <div className="overflow-hidden border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-white text-xs font-semibold text-blue-500">
                <th className="w-[70px] px-2 py-3 text-left">STT</th>
                <th className="px-2 py-3 text-left">Mô tả</th>
                <th className="w-[220px] px-2 py-3 text-left">Mark up</th>
                <th className="w-[120px] px-2 py-3 text-right">Giá</th>
              </tr>
            </thead>

            <tbody>
              {listData.map((item, index) => (
                <React.Fragment
                  key={item.strSupplierMappingPriceGUID ?? index}
                >
                  <tr className="bg-white">
                    <td className="px-2 py-2 align-top" />

                    <td className="px-2 py-2 text-xs text-gray-800">
                      <div className="font-semibold">
                        Mùa:{" "}
                        {item.strPriceSeasonName || item.strSeasonName || "-"}
                      </div>

                      <div>{getDateValidText(item)}</div>
                    </td>

                    <td className="px-2 py-2" />
                    <td className="px-2 py-2" />
                  </tr>

                  <tr className="border-t border-gray-200 bg-gray-50 text-xs text-gray-800">
                    <td className="px-2 py-2">{item.No ?? index + 1}</td>

                    <td className="px-2 py-2 text-center font-semibold">
                      {item.strItemTypeName || item.strItemName || "-"}
                    </td>

                    <td className="px-2 py-2">{getMarkupText(item)}</td>

                    <td className="px-2 py-2 text-right font-semibold">
                      {formatPrice(item.dblPriceFrom, item.intCurrencyID)}
                    </td>
                  </tr>
                </React.Fragment>
              ))}

              {listData.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-8 text-center text-sm text-gray-400"
                  >
                    {t("noData")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination responsive */}
        <div className="border-t border-gray-100 px-3 py-3">
          {/* Desktop / tablet */}
          <div
            className="
              hidden md:block
              [&_button]:!h-8
              [&_button]:!min-w-8
              [&_button]:!px-2
              [&_button]:!text-xs
              [&_select]:!h-8
              [&_select]:!text-xs
              [&_span]:!text-xs
            "
          >
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalRecords={total}
              recordsPerPage={pageSize}
              onPageChange={(nextPage) => {
                onPageChange?.(nextPage);
              }}
              onRecordsPerPageChange={(nextPageSize) => {
                handlePageSizeChange(nextPageSize);
              }}
            />
          </div>

          {/* Mobile / popup hẹp */}
          <div className="block md:hidden">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    handlePageSizeChange(Number(e.target.value));
                  }}
                  className="h-8 rounded border border-gray-300 px-2 text-xs outline-none"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>

                <span className="text-xs text-gray-600">
                  [{startRecord} - {endRecord} / {total}]
                </span>
              </div>

              <span className="text-xs font-semibold text-gray-700">
                {page} / {totalPages}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={handlePrev}
                className="h-8 rounded border border-gray-300 px-3 text-xs text-gray-700 disabled:cursor-not-allowed disabled:text-gray-300"
              >
                ‹ {t("prev")}
              </button>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={handleNext}
                className="h-8 rounded border border-gray-300 px-3 text-xs text-gray-700 disabled:cursor-not-allowed disabled:text-gray-300"
              >
                {t("next")} ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </PanelPopup>
  );
};

export default DetailServiceSingleD;