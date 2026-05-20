import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { GripHorizontal, MapPin, Plus, RefreshCw, Trash2 } from "lucide-react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import {
  useAddDayTourCustomized,
  useDelDayTourCustomized,
  useListServiceTourCustomized,
} from "@/hooks/actions/useUser";
import { useTranslate } from "@/locales";
import { fDateTime } from "@/utils/format-time";
import { isValidValue } from "@/utils/utilts";
import { useToastStore } from "@/zustand/useToastStore";

import CreatedDayPopup from "./created-day-popup";

export interface IDayItem {
  id: string;
  name: string;
  date: string;
}

interface ChangeDayOrderProps {
  items?: IDayItem[];
  onChanged: (hasChange: boolean) => void;
  onClose: () => void;
  onSave: (newDays: IDayItem[]) => void;
  hasChange: boolean;
  strTourCustomizedGUID: string;
}

const ChangeDayOrder = ({
  items = [],
  onChanged,
  hasChange,
  strTourCustomizedGUID,
  onClose,
}: ChangeDayOrderProps) => {
  const { t } = useTranslate("tourcustomize");
  const location = useLocation();
  const item = location.state?.item;
  const [localListData, setLocalListData] = useState<any[]>([]);
  const currentGUID = item?.strTourCustomizedGUID || strTourCustomizedGUID;
  const [, setLocalDays] = useState<IDayItem[]>(items);
  const [isAddDayOpen, setIsAddDayOpen] = useState(false);

  useEffect(() => {
    setLocalDays(items);
  }, [items]);

  const handleOpenAddDay = () => {
    setIsAddDayOpen(true);
  };

  const handleReset = () => {
    setLocalDays(items);
    onChanged(false);
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

  useEffect(() => {
    const isDifferent =
      JSON.stringify(localListData) !== JSON.stringify(listData);

    onChanged(isDifferent);
  }, [listData, localListData, onChanged]);

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

  const groupedDays = groupByDay(localListData);

  const parseLocations = (locationString: string) => {
    if (!locationString) return "";

    return locationString
      .split("#")
      .filter(Boolean)
      .map((entry) => entry.split("!")[1])
      .filter(Boolean)
      .join(", ");
  };

  useEffect(() => {
    setLocalListData(listData);
  }, [listData]);

  const handleAddLocalDay = (newDay: any) => {
    const nextItem = {
      strTourCustomizedDayGUID: newDay?.strTourCustomizedDayGUID,
      strDayTitle: newDay?.strDayTitle ?? "",
      strDateDay: newDay?.strDateDay ?? "",
      strListLocation: newDay?.strListLocation ?? "",
    };

    setLocalListData((prev) => [...prev, nextItem]);
    setAddedDays((prev) => [...prev, nextItem]);
    onChanged(true);
  };

  const [addedDays, setAddedDays] = useState<any[]>([]);
  const [deletedDays, setDeletedDays] = useState<any[]>([]);
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  const handleDelete = (day: any) => {
    setLocalListData((prev) =>
      prev.filter(
        (entry) =>
          entry?.strTourCustomizedDayGUID !== day?.strTourCustomizedDayGUID
      )
    );

    setDeletedDays((prev) => [...prev, day]);
    onChanged(true);
  };

  const {
    mutateAsync: addDayAsync,
    isPending: isAddLoading,
  } = useMutation({
    mutationFn: useAddDayTourCustomized,
  });

  const {
    mutateAsync: deleteDayAsync,
    isPending: isDeleteLoading,
  } = useMutation({
    mutationFn: useDelDayTourCustomized,
  });

  const handleSave = async () => {
    try {
      await Promise.all(
        addedDays.map((day, index) =>
          addDayAsync({
            strTourCustomizedGUID: currentGUID,
            strDayTitle: day?.strDayTitle,
            intDayOrder: groupedDays.length + index + 1,
          })
        )
      );

      await Promise.all(
        deletedDays.map((day) =>
          deleteDayAsync({
            strTourCustomizedDayGUID: day?.strTourCustomizedDayGUID,
          })
        )
      );

      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER.LIST_SERVICE_TOUR_CUSTOMIZED],
      });

      setAddedDays([]);
      setDeletedDays([]);
      setLocalListData([]);
      onChanged(false);

      showToast("success", t("saveSuccess"));
      onClose();
    } catch (error) {
      showToast("error", t("saveError"));
    }
  };

  return (
    <div className="flex flex-col gap-5 font-sans">
      <div className="custom-scrollbar max-h-[400px] space-y-3 overflow-y-auto overscroll-contain pr-2">
        {groupedDays.map((days: any[], index: number) => {
          const day = days?.[0];

          return (
            <div
              key={day?.strTourCustomizedDayGUID}
              className="rounded-lg border border-transparent bg-[#efefef] px-4 py-5 transition-all"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <button type="button" className="shrink-0 text-[#3d3d3d]">
                    <GripHorizontal size={20} />
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p>{t("dayWithNumber", { number: index + 1 })}</p>

                      <p className="font-medium text-[#333]">
                        {isValidValue(day?.strDayTitle)}
                      </p>

                      <p className="text-[15px] font-medium text-[#4a4a4a]">
                        {fDateTime(isValidValue(day?.strDateDay))
                          ? `(${fDateTime(isValidValue(day?.strDateDay))})`
                          : ""}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-[#333]">
                      <MapPin size={18} className="fill-[#333]" />

                      <p className="text-[15px] font-medium text-[#4a4a4a]">
                        {parseLocations(day?.strListLocation)}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(day)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/70 text-[#333] transition hover:bg-white hover:text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}

        {groupedDays.length === 0 && (
          <div className="py-10 text-center italic text-gray-400">
            {t("dayScheduleEmpty")}
          </div>
        )}
      </div>

      {hasChange && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
          <button
            type="button"
            onClick={handleSave}
            disabled={isAddLoading || isDeleteLoading}
            className="rounded-lg bg-[#004b91] px-8 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#003c73] disabled:opacity-50"
          >
            {isAddLoading || isDeleteLoading ? t("saving") : t("save")}
          </button>
        </div>
      )}

      <div className="border-t border-gray-100 pt-5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenAddDay}
            className="inline-flex items-center gap-2 rounded-md bg-[#efefef] px-4 py-2 text-sm font-medium text-[#444] transition hover:bg-[#e7e7e7]"
          >
            <Plus size={20} strokeWidth={2.5} />
            <span>{t("addLastDay")}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[#444] transition hover:bg-gray-50"
          >
            <RefreshCw size={18} />
            <span>{t("reset")}</span>
          </button>
        </div>
      </div>

      <CreatedDayPopup
        open={isAddDayOpen}
        onClose={() => setIsAddDayOpen(false)}
        strTourCustomizedGUID={currentGUID}
        intDayOrder={groupedDays.length + 1}
        onAddLocalDay={handleAddLocalDay}
      />
    </div>
  );
};

export default ChangeDayOrder;
