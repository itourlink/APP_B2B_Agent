import { GripHorizontal, MapPin, Trash2, Plus, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import CreatedDayPopup from "./created-day-popup";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useAddDayTourCustomized, useDelDayTourCustomized, useListServiceTourCustomized } from "@/hooks/actions/useUser";
import { isValidValue } from "@/utils/utilts";
import { fDateTime } from "@/utils/format-time";
import { useToastStore } from "@/zustand/useToastStore";

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

  const location = useLocation();
  const item = location.state?.item;
  const [localListData, setLocalListData] = useState<any[]>([]);
  // ưu tiên lấy guid từ location state
  const currentGUID =
    item?.strTourCustomizedGUID || strTourCustomizedGUID;

  // local state
  const [localDays, setLocalDays] = useState<IDayItem[]>(items);

  const [isAddDayOpen, setIsAddDayOpen] = useState(false);

  // sync khi items từ parent thay đổi
  useEffect(() => {
    setLocalDays(items);
  }, [items]);



  // mở popup add day
  const handleOpenAddDay = () => {
    setIsAddDayOpen(true);
  };

  // reset data
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
        strTourCustomizedGUID:
          item?.strTourCustomizedGUID || "",
        strTourCustomizedDayGUID: null,
      }),
    placeholderData: keepPreviousData,
    enabled: !!(item?.strTourCustomizedGUID),
  });

  const listData = data?.[0] ?? [];

  // detect change
  useEffect(() => {
    const isDifferent =
      JSON.stringify(localListData) !== JSON.stringify(listData);

    onChanged(isDifferent);

  }, [localListData, listData, onChanged]);


  // group theo day guid
  const groupByDay = (data: any[]) => {
    const map: Record<string, any[]> = {};

    data.forEach((item) => {
      const key = item?.strTourCustomizedDayGUID;

      if (!map[key]) {
        map[key] = [];
      }

      map[key].push(item);
    });

    return Object.values(map);
  };

  const groupedDays = groupByDay(localListData);
  // parse location
  const parseLocations = (locationString: string) => {
    if (!locationString) return "";

    return locationString
      .split("#")
      .filter(Boolean)
      .map((item) => {
        const arr = item.split("!");

        // arr[1] = location name
        return arr[1];
      })
      .filter(Boolean)
      .join(", ");
  };


  useEffect(() => {
    setLocalListData(listData);
  }, [listData]);

  const handleAddLocalDay = (newDay: any) => {
    const item = {
      strTourCustomizedDayGUID:
        newDay?.strTourCustomizedDayGUID,

      strDayTitle:
        newDay?.strDayTitle ?? "",

      strDateDay:
        newDay?.strDateDay ?? "",

      strListLocation:
        newDay?.strListLocation ?? "",
    };

    setLocalListData((prev) => [...prev, item]);

    setAddedDays((prev) => [...prev, item]); // thêm dòng này

    onChanged(true);
  };

  const [addedDays, setAddedDays] = useState<any[]>([]);

  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  const [deletedDays, setDeletedDays] = useState<any[]>([]);

  const handleDelete = (day: any) => {
    setLocalListData((prev) =>
      prev.filter(
        (item) =>
          item?.strTourCustomizedDayGUID !==
          day?.strTourCustomizedDayGUID
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
      // ADD
      await Promise.all(
        addedDays.map((day, index) => {
          return addDayAsync({
            strTourCustomizedGUID: currentGUID,
            strDayTitle: day?.strDayTitle,
            intDayOrder: groupedDays.length + index + 1,
          });
        })
      );

      // DELETE
      await Promise.all(
        deletedDays.map((day) => {
          return deleteDayAsync({
            strTourCustomizedDayGUID:
              day?.strTourCustomizedDayGUID,
          });
        })
      );

      // refetch
      await queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.USER.LIST_SERVICE_TOUR_CUSTOMIZED,
        ],
      });

      // reset state
      setAddedDays([]);
      setDeletedDays([]);
      setLocalListData([]);

      onChanged(false);

      showToast("success", "Lưu thành công");

      // đóng popup
      onClose();

    } catch (error) {
      console.log(error);

      showToast("error", "Lưu thất bại");
    }
  };

  return (
    <div className="flex flex-col gap-5 font-sans">

      {/* LIST DAY */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar overscroll-contain">

        {groupedDays.map((days: any[], index: number) => {

          const day = days?.[0];

          return (
            <div
              key={day?.strTourCustomizedDayGUID}
              className="rounded-lg bg-[#efefef] px-4 py-5 border border-transparent transition-all"
            >
              <div className="flex items-center justify-between gap-4">

                <div className="flex min-w-0 items-center gap-3">

                  <button
                    type="button"
                    className="shrink-0 text-[#3d3d3d]"
                  >
                    <GripHorizontal size={20} />
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">

                      <p>
                        Day {index + 1}
                      </p>

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
                      <MapPin
                        size={18}
                        className="fill-[#333]"
                      />

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
          <div className="py-10 text-center text-gray-400 italic">
            Chưa có ngày nào trong lịch trình
          </div>
        )}
      </div>

      {/* SAVE BUTTON */}
      {hasChange && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-200">

          <button
            type="button"
            onClick={handleSave}
            disabled={isAddLoading || isDeleteLoading}
            className="px-8 py-2 bg-[#004b91] text-white rounded-lg font-bold text-sm hover:bg-[#003c73] transition-all shadow-sm disabled:opacity-50"
          >
            {
              isAddLoading || isDeleteLoading
                ? "Đang lưu..."
                : "Lưu"
            }
          </button>
        </div>
      )}

      {/* FOOTER ACTION */}
      <div className="border-t border-gray-100 pt-5">

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={handleOpenAddDay}
            className="inline-flex items-center gap-2 rounded-md bg-[#efefef] px-4 py-2 text-sm font-medium text-[#444] transition hover:bg-[#e7e7e7]"
          >
            <Plus size={20} strokeWidth={2.5} />

            <span>Add Last Day</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[#444] transition hover:bg-gray-50"
          >
            <RefreshCw size={18} />

            <span>Nhập lại</span>
          </button>
        </div>
      </div>

      {/* POPUP */}
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