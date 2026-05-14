import { useEffect, useState } from "react";

import PanelPopup from "@/components/popup/panel-popup";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import {
    addTourCustomizedSerByListDays,
    useListServiceTourCustomized,
} from "@/hooks/actions/useUser";

import { useToastStore } from "@/zustand/useToastStore";

import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";


interface Props {
    open: boolean;
    onClose: () => void;
    strTourCustomizedPriceItemGUID: string;
    item?: any;
}

const UpdateNoOfDay = ({
    open,
    onClose,
    strTourCustomizedPriceItemGUID,
    item,
}: Props) => {
    const { showToast } = useToastStore();

    const queryClient = useQueryClient();

    const [selectedDays, setSelectedDays] = useState<string[]>([]);

    const {
        mutateAsync: addTourCustomizedSerByListDaysApi,
        isPending: isLoading,
    } = useMutation({
        mutationFn: addTourCustomizedSerByListDays,
    });

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

        enabled: !!item?.strTourCustomizedGUID,
    });

    const listData = data?.[0] ?? [];

    const groupedDays = groupByDay(listData);

    useEffect(() => {
        if (!listData?.length || !strTourCustomizedPriceItemGUID) return;

        const selected = listData
            .filter(
                (x: any) =>
                    x?.strTourCustomizedPriceItemGUID ===
                    strTourCustomizedPriceItemGUID
            )
            .map((x: any) => String(x?.intDayOrder));

        setSelectedDays(selected);
    }, [listData, strTourCustomizedPriceItemGUID]);

    const handleToggleDay = (day: string) => {
        setSelectedDays((prev) =>
            prev.includes(day)
                ? prev.filter((id) => id !== day)
                : [...prev, day]
        );
    };

    const handleUpdate = async () => {
        const payload = {
            strTourCustomizedPriceItemGUID,
            strListDays: selectedDays.join(","),
        };

        addTourCustomizedSerByListDaysApi(payload, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [
                        QUERY_KEYS.USER.LIST_SERVICE_TOUR_CUSTOMIZED,
                    ],
                });

                showToast("success", "Cập nhật thành công");

                onClose();
            },

            onError: () => {
                showToast("error", "Cập nhật thất bại");
            },
        });
    };

    return (
        <PanelPopup
            open={open}
            onClose={onClose}
            title="Update List Days"
            footer={
                <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={isLoading}
                    className="cursor-pointer rounded-lg bg-[#4a6fa5] hover:bg-[#3b5b7e] px-4 py-2 text-white disabled:opacity-50"
                >
                    {isLoading ? "Lưu..." : "Lưu"}
                </button>
            }
        >
            <div className="space-y-4 text-sm text-gray-700">
                <p className="text-[15px] font-semibold">
                    REGULAR RESTAURANTS
                </p>

                <div className="flex flex-col gap-4">
                    {groupedDays.map((dayItems: any[]) => {
                        const firstItem = dayItems?.[0];

                        const dayOrder = String(firstItem?.intDayOrder);

                        return (
                            <label
                                key={dayOrder}
                                className="flex items-center gap-3 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedDays.includes(dayOrder)}
                                    onChange={() =>
                                        handleToggleDay(dayOrder)
                                    }
                                    className="w-4 h-4"
                                />

                                <span className="font-medium text-[14px]">
                                    Day {dayOrder}
                                </span>
                            </label>
                        );
                    })}
                </div>
            </div>
        </PanelPopup>
    );
};

export default UpdateNoOfDay;