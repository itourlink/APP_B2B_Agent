import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Pen } from "lucide-react";

import { useListTourCustomizedInExService } from "@/hooks/actions/useUser";
import { useTranslate } from "@/locales";

import DetailTourInExPopup, {
  getTourCustomizedInExQueryKey,
  type DetailTourInExApiItem,
} from "./detail-tour-in-ex-popup";

interface DetailTourInExProps {
  item?: any;
}

const SkeletonItem = () => (
  <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
);

const DetailTourInEx = ({ item }: DetailTourInExProps) => {
  const { t } = useTranslate("tourcustomize");
  const [openPopup, setOpenPopup] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: getTourCustomizedInExQueryKey(item?.strTourCustomizedGUID),
    queryFn: () =>
      useListTourCustomizedInExService({
        strTourCustomizedGUID: item?.strTourCustomizedGUID,
        IsSelected: null,
      }),
    placeholderData: keepPreviousData,
    enabled: !!item?.strTourCustomizedGUID,
  });

  const listData: DetailTourInExApiItem[] = data?.[0] ?? [];

  const includeList = listData.filter(
    (entry) => entry?.isInclude && entry?.inIsSelected
  );
  const excludeList = listData.filter(
    (entry) => !entry?.isInclude && entry?.inIsSelected
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
        <h3 className="text-lg font-bold text-gray-800">
          {t("includedExcluded")}
        </h3>

        <button
          type="button"
          onClick={() => setOpenPopup(true)}
          className="cursor-pointer text-[#4a6fa5] transition hover:text-[#2f69b1]"
        >
          <Pen size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8 text-[13px] leading-relaxed">
        <div className="space-y-2">
          <p className="font-bold text-gray-700">{t("included")}</p>

          {error ? (
            <div className="text-sm text-red-500">{t("tryAgainMessage")}</div>
          ) : isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, index) => (
                <SkeletonItem key={index} />
              ))}
            </div>
          ) : includeList.length === 0 ? (
            <div className="text-sm text-gray-500">{t("noData")}</div>
          ) : (
            <ul className="list-inside list-disc space-y-1 pl-2 text-gray-600">
              {includeList.map((entry) => (
                <li key={entry.excludeID}>
                  {entry?.strInExName || entry?.include}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-2">
          <p className="font-bold text-gray-700">{t("excluded")}</p>

          {error ? (
            <div className="text-sm text-red-500">{t("tryAgainMessage")}</div>
          ) : isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, index) => (
                <SkeletonItem key={index} />
              ))}
            </div>
          ) : excludeList.length === 0 ? (
            <div className="text-sm text-gray-500">{t("noData")}</div>
          ) : (
            <ul className="list-inside list-disc space-y-1 pl-2 text-gray-600">
              {excludeList.map((entry) => (
                <li key={entry.excludeID}>
                  {entry?.strInExName || entry?.include}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <DetailTourInExPopup
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        strTourCustomizedGUID={item?.strTourCustomizedGUID}
      />
    </div>
  );
};

export default DetailTourInEx;
