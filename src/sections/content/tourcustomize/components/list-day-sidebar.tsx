import clsx from "clsx";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { getListServiceTourCustomized } from "@/hooks/actions/useUser";
import { useTranslate } from "@/locales";

interface Props {
  item?: any;
  groupedDays?: any[][];
  selectedDayGUID?: string | null;
  onSelectDay?: (dayGUID: string) => void;
}

const ListDaySidebar = ({
  item,
  groupedDays: groupedDaysFromProps,
  selectedDayGUID,
  onSelectDay,
}: Props) => {
  const { t } = useTranslate("tourcustomize");

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
      getListServiceTourCustomized({
        strTourCustomizedGUID: item?.strTourCustomizedGUID || "",
        strTourCustomizedDayGUID: null,
      }),
    placeholderData: keepPreviousData,
    enabled: !!item?.strTourCustomizedGUID,
  });

  const listData = data?.[0] ?? [];
  const groupedDays = groupByDay(listData);

  const finalGroupedDays =
    groupedDaysFromProps && groupedDaysFromProps.length > 0
      ? groupedDaysFromProps
      : groupedDays;

  return (
    <div className="flex flex-col gap-5">
      {finalGroupedDays.map((dayItems: any[]) => {
        const firstItem = dayItems?.[0];
        const dayGUID = firstItem?.strTourCustomizedDayGUID;
        const isActive = selectedDayGUID === dayGUID;

        const date = new Date(firstItem?.strDateDay);
        const dateLabel = Number.isNaN(date.getTime())
          ? ""
          : date.toLocaleDateString("vi-VN", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            });

        return (
          <button
            key={dayGUID}
            type="button"
            onClick={() => {
              if (dayGUID && onSelectDay) {
                onSelectDay(dayGUID);
              }
            }}
            className={clsx(
              "rounded-2xl border px-3 py-5 text-center transition-all cursor-pointer",
              isActive
                ? "border-[#2566b0] bg-[#2566b0] text-white"
                : "border-slate-200 bg-white text-slate-900 hover:border-[#2566b0] hover:bg-blue-50"
            )}
          >
            <div className="text-[14px] font-bold">
              {t("dayWithNumber", { number: firstItem?.intDayOrder })}
            </div>

            <div className="mt-2 text-[14px] font-medium leading-7">
              <div>{dateLabel}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ListDaySidebar;