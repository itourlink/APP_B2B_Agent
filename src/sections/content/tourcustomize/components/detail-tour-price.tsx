import { useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useUser } from "@/hooks/actions/useAuth";
import {
  updTourCustomizedByRefeshPrice,
  useListTotalPriceForTourCustom,
} from "@/hooks/actions/useUser";
import { useTranslate } from "@/locales";
import { useToastStore } from "@/zustand/useToastStore";

import DetailTourPriceOverviewPopup from "./detail-tour-price-overview-popup";

interface DetailTourPriceProps {
  item?: any;
}

const DetailTourPrice = ({ item }: DetailTourPriceProps) => {
  const { t } = useTranslate("tourcustomize");
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const { showToast } = useToastStore();
  const { user } = useUser();

  const { data, isLoading } = useQuery({
    queryKey: [
      QUERY_KEYS.USER.LIST_TOTAL_PRICE_FOR_TOUR_CUSTOM,
      item?.strTourCustomizedGUID,
    ],
    queryFn: () =>
      useListTotalPriceForTourCustom({
        strTourCustomizedGUID: item?.strTourCustomizedGUID,
      }),
    placeholderData: keepPreviousData,
  });

  const listData = data?.[0] ?? [];
  const queryClient = useQueryClient();

  const refreshPriceMutation = useMutation({
    mutationFn: (payload: any) => updTourCustomizedByRefeshPrice(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.USER.LIST_TOTAL_PRICE_FOR_TOUR_CUSTOM,
          item?.strTourCustomizedGUID,
        ],
      });
      showToast("success", t("updateSuccess"));
    },
    onError: () => {
      showToast("error", t("updateError"));
    },
  });

  const handleRecalculate = () => {
    const payload = {
      strUserGUID: user?.strUserGUID,
      strTourCustomizedGUID: item?.strTourCustomizedGUID,
    };

    refreshPriceMutation.mutate(payload);
  };

  const firstItem = listData[0];
  const adultLabel = firstItem
    ? t("adultWithCount", { count: firstItem.intAdult })
    : "Adult";
  const tplLabel = t("tplReductionWithCount", { count: 3 });

  return (
    <div className="space-y-4 pt-4 font-sans">
      <div className="flex items-center gap-4">
        <h3 className="text-lg font-bold text-gray-800 uppercase">
          {t("totalPrice")}
        </h3>

        <button
          onClick={handleRecalculate}
          disabled={refreshPriceMutation.isPending}
          className="cursor-pointer rounded bg-[#4a6fa5] px-4 py-1.5 text-[11px] font-bold uppercase text-white shadow-sm transition-colors hover:bg-[#3b5b7e]"
        >
          {refreshPriceMutation.isPending ? t("loading") : t("recalculatePrice")}
        </button>

        <button
          onClick={() => setIsOverviewOpen(true)}
          className="cursor-pointer rounded bg-[#4a6fa5] px-4 py-1.5 text-[11px] font-bold uppercase text-white shadow-sm transition-colors hover:bg-[#3b5b7e]"
        >
          {t("overviewPrice")}
        </button>
      </div>

      <div className="w-full border-b border-gray-200">
        <table className="w-full border-collapse text-left text-[14px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="w-1/3 px-4 py-3 font-semibold text-[#4a6fa5]">
                {t("description")}
              </th>
              <th className="px-4 py-3 text-right font-semibold text-[#4a6fa5]">
                {adultLabel}
              </th>
              <th className="px-4 py-3 text-right font-semibold text-[#4a6fa5]">
                {tplLabel}
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
                  {t("loadingData")}
                </td>
              </tr>
            ) : listData.length > 0 ? (
              listData.map((row: any, index: number) => {
                const isTotal = row.IsTotal === true;

                return (
                  <tr
                    key={index}
                    className={`${isTotal ? "bg-[#f8fbff]" : "bg-white"} transition-colors hover:bg-gray-50/50`}
                  >
                    <td
                      className={`px-4 py-3 ${isTotal ? "font-bold text-gray-800" : "text-gray-600"}`}
                    >
                      {isTotal ? t("total") : row.strDes}
                    </td>
                    <td
                      className={`px-4 py-3 text-right ${isTotal ? "font-bold text-gray-800" : "text-gray-600"}`}
                    >
                      $
                      {row.dblPrice?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td
                      className={`px-4 py-3 text-right ${isTotal ? "font-bold text-gray-800" : "text-gray-600"}`}
                    >
                      {row.dblPriceTPLRed < 0 ? "-" : ""}$
                      {Math.abs(row.dblPriceTPLRed || 0).toLocaleString()}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  className="px-4 py-8 text-center italic text-gray-400"
                  colSpan={3}
                >
                  {t("noData")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isOverviewOpen && (
        <DetailTourPriceOverviewPopup
          isOpen={isOverviewOpen}
          onClose={() => setIsOverviewOpen(false)}
          tourCustomizedGUID={item?.strTourCustomizedGUID}
        />
      )}
    </div>
  );
};

export default DetailTourPrice;
