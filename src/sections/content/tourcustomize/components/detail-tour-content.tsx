import { useState } from "react";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useAddDayTourCustomized, useListServiceTourCustomized } from "@/hooks/actions/useUser";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MapPin, Pen, Plus } from "lucide-react";
import ListTour from "./list-tour";
import DetailTourInEx from "./detail-tour-in-ex";
import DetailTourPrice from "./detail-tour-price";
import { useLocation } from "react-router-dom";
import PanelPopup from "@/components/popup/panel-popup";
import ChangeDayOrder from "./change-day-order";
import ListDaySidebar from "./list-day-sidebar";
import { useToastStore } from "@/zustand/useToastStore";

interface DetailTourContentProps {
    itemListData?: any
    itemDetail?: any
    onOpenChangeDay: () => void;
    isPopupOpen: boolean;
    setIsPopupOpen: (val: boolean) => void;
    hasChange: boolean;
    setHasChange: (val: boolean) => void;
    tourCustomizedGUID: string;
}

export const DetailTourContent = ({
    itemDetail,
    isPopupOpen,
    setIsPopupOpen,
    hasChange,
    setHasChange,
    tourCustomizedGUID,
}: DetailTourContentProps) => {
    const { showToast } = useToastStore()
    const queryClient = useQueryClient();
    const location = useLocation();
    const item = location.state?.item;
    const [selectedService, setSelectedService] = useState<string | null>(null);

    // CLOSE POPUP
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    // SAVE
    const handleSave = () => {
        setHasChange(false);

        setIsPopupOpen(false);
    };

    const { data } = useQuery({
        queryKey: [
            QUERY_KEYS.USER.LIST_SERVICE_TOUR_CUSTOMIZED,
            item?.strTourCustomizedGUID,
        ],
        queryFn: () =>
            useListServiceTourCustomized({
                strTourCustomizedGUID: item?.strTourCustomizedGUID,
                strTourCustomizedDayGUID: null,
            }),
        placeholderData: keepPreviousData,
        enabled: !!item?.strTourCustomizedGUID,
    });

    const listData = data?.[0] ?? [];

    // GROUP DAY
    const groupByDay = (data: any[]) => {
        const map: Record<string, any[]> = {};

        data.forEach((item) => {
            const key =
                item?.strTourCustomizedDayGUID;

            if (!map[key]) {
                map[key] = [];
            }

            map[key].push(item);
        });

        return Object.values(map);
    };

    // useAddDayTourCustomized
    const { mutate: useAddDayTourCustomizedApi, isPending: isLoading } = useMutation({
        mutationFn: useAddDayTourCustomized,
    });
    const handleAddTourNow = () => {
        const totalDay = groupByDay(listData).length;

        const payload = {
            strTourCustomizedGUID: item?.strTourCustomizedGUID,
            intDayOrder: totalDay + 1,
            strDayTitle: `Day ${totalDay + 1}`,
        };

        useAddDayTourCustomizedApi(payload, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [
                        QUERY_KEYS.USER.LIST_SERVICE_TOUR_CUSTOMIZED,
                        item?.strTourCustomizedGUID,
                    ],
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        QUERY_KEYS.USER.LIST_TOUR_CUSTOMIZED
                    ],
                });

                showToast("success", "Add day success");
            },

            onError: () => {
                showToast("error", "Add day failed");
            },
        });
    };

    return (
        <div className="flex bg-gray-50 overflow-hidden font-sans h-full">

            {/* LEFT */}
            <div
                className={
                    isPopupOpen
                        ? "w-20 lg:w-48 bg-white border-r border-gray-100 flex flex-col items-center py-6 gap-4 opacity-50 transition-opacity pointer-events-none"
                        : "w-20 lg:w-48 bg-white border-r border-gray-100 flex flex-col items-center py-6 gap-4"
                }
            >

                <ListDaySidebar item={item ?? ""} />

                {/* CHANGE DAY */}
                <button
                    onClick={() => setIsPopupOpen(true)}
                    className="w-12 h-12 lg:w-40 lg:h-10 flex items-center justify-center gap-2 bg-blue-50 text-[#004b91] rounded-xl hover:bg-blue-100 transition-all group cursor-pointer"
                >
                    <Pen size={18} />

                    <span className="hidden lg:inline text-xs font-bold uppercase tracking-tight">
                        Chỉnh sửa ngày
                    </span>
                </button>

                {/* ADD DAY */}
                <button
                    className="cursor-pointer w-12 h-12 lg:w-40 lg:h-10 flex items-center justify-center gap-2 border border-dashed border-gray-300 text-gray-400 rounded-xl hover:border-[#004b91] hover:text-[#004b91] transition-all group"
                    onClick={handleAddTourNow}
                >
                    <Plus size={18} />

                    <span className="hidden lg:inline text-xs font-bold uppercase tracking-tight">
                        {isLoading ? "Add Day..." : "Add Day"}
                    </span>
                </button>
            </div>

            {/* CONTENT */}
            <div
                className={
                    isPopupOpen
                        ? "flex-1 overflow-hidden px-8 py-6 space-y-6 bg-white pointer-events-none"
                        : "flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-white"
                }
            >
                
                {/* LIST DAY */}
                {groupByDay(listData).map(
                    (items: any[], index) => (
                        <div
                            key={index}
                            className="space-y-4"
                        >
                            <ListTour
                                item={items}
                                itemDetail={itemDetail ?? ""}
                                onChange={(value) =>
                                    setSelectedService(value)
                                }
                            />
                            
                        </div>
                    )
                )}

                {/* DETAIL */}
                <DetailTourInEx item={item} />

                <DetailTourPrice item={item} />
            </div>

            {/* POPUP */}
            <PanelPopup
                open={isPopupOpen}
                onClose={handleClosePopup}
                title="Change Day Order"
                className="w-[800px]"
            >
                <ChangeDayOrder
                    strTourCustomizedGUID={
                        item?.strTourCustomizedGUID ||
                        tourCustomizedGUID
                    }
                    onChanged={(val) =>
                        setHasChange(val)
                    }
                    onClose={handleClosePopup}
                    onSave={handleSave}
                    hasChange={hasChange}
                />
            </PanelPopup>

            {/* RIGHT */}
            <div className="hidden xl:block w-100 bg-gray-100 border-l border-gray-200 relative">

                {selectedService ? (
                    <div className="absolute inset-0 bg-white z-10 animate-in fade-in duration-300">
                    </div>
                ) : (
                    <>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 space-y-2">

                            <MapPin
                                size={48}
                                strokeWidth={1}
                            />

                            <span className="text-sm font-medium tracking-tight">
                                Map API Loading Area...
                            </span>
                        </div>

                        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-2 py-1 rounded text-[10px] text-gray-500 border border-gray-100">
                            © OpenStreetMap contributors
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
