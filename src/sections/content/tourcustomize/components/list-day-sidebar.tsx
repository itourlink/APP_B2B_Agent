import clsx from "clsx";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useListServiceTourCustomized } from "@/hooks/actions/useUser";
import { useTranslate } from "@/locales";

interface Props {
  item?: any;
}

const ListDaySidebar = ({ item }: Props) => {
  const { t, currentLang } = useTranslate("tourcustomize");

  const groupByDay = (sourceData: any[]) => {
    const map: Record<string, any[]> = {};

    sourceData.forEach((dataItem) => {
      const key = dataItem?.strTourCustomizedDayGUID;

      if (!map[key]) {
        map[key] = [];
      }

      map[key].push(dataItem);
    });

    return Object.values(map);
  };

  const { data } = useQuery({
    queryKey: [
      QUERY_KEYS.USER.LIST_SERVICE_TOUR_CUSTOMIZED,
      item?.strTourCustomizedGUID,
    ],
    queryFn: () =>
      useListServiceTourCustomized({
        strTourCustomizedGUID: item?.strTourCustomizedGUID || "",
        strTourCustomizedDayGUID: null,
      }),
    placeholderData: keepPreviousData,
    enabled: !!item?.strTourCustomizedGUID,
  });

  const listData = data?.[0] ?? [];
  const groupedDays = groupByDay(listData);
  const localeCode = currentLang.value === "vi" ? "vi-VN" : "en-US";

  return (
    <div className="flex flex-col gap-5">
      {groupedDays.map((dayItems: any[]) => {
        const firstItem = dayItems?.[0];
        const date = new Date(firstItem?.strDateDay);
        const dateLabel = Number.isNaN(date.getTime())
          ? ""
          : date.toLocaleDateString(localeCode, {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            });

        return (
          <div
            key={firstItem?.strTourCustomizedDayGUID}
            className={clsx(
              "rounded-2xl border border-slate-200 px-3 py-5 text-center transition-all"
            )}
          >
            <div className="text-[14px] font-bold">
              {t("dayWithNumber", { number: firstItem?.intDayOrder })}
            </div>

            <div className="mt-2 text-[14px] font-medium leading-7">
              <div>{dateLabel}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListDaySidebar;
