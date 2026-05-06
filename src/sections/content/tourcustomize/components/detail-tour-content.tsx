import { useState } from "react";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useListServiceTourCustomized, } from "@/hooks/actions/useUser";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { MapPin, Pen, Plus } from "lucide-react";
import ListTour from "./list-tour";
import DetailTourInEx from "./detail-tour-in-ex";
import DetailTourPrice from "./detail-tour-price";
import { useLocation } from "react-router-dom";

interface DetailTourContentProps {
    onOpenChangeDay: () => void;
    isPopupOpen: boolean;
    setIsPopupOpen: (val: boolean) => void;
    hasChange: boolean;
    setHasChange: (val: boolean) => void;
    tourCustomizedGUID: string;
}

export const DetailTourContent = ({
    isPopupOpen,
    setIsPopupOpen,
}: DetailTourContentProps) => {

    const location = useLocation();
    const item = location.state?.item;
    console.log("itemaaaaaaaaaaaaaa", item)

    const [selectedService, setSelectedService] = useState<string | null>(null);

    const { data } = useQuery({
        queryKey: [QUERY_KEYS.USER.LIST_SERVICE_TOUR_CUSTOMIZED, item?.strTourCustomizedGUID],
        queryFn: () =>
            useListServiceTourCustomized({
                strTourCustomizedGUID: item?.strTourCustomizedGUID,
                strTourCustomizedDayGUID: null
            }),
        placeholderData: keepPreviousData,
    });
    const listData = data?.[0] ?? [];

    console.log("listData", listData)

    const groupByDay = (data: any[]) => {
        const map: Record<string, any[]> = {};

        data.forEach((item) => {
            const key = item.strTourCustomizedDayGUID;

            if (!map[key]) map[key] = [];
            map[key].push(item);
        });

        return Object.values(map);
    };

    return (
        <div className="flex h-[calc(100vh-80px)] bg-gray-50 overflow-hidden font-sans">
            <div className={isPopupOpen ? "w-20 lg:w-48 bg-white border-r border-gray-100 flex flex-col items-center py-6 gap-4 opacity-50 transition-opacity pointer-events-none" : "w-20 lg:w-48 bg-white border-r border-gray-100 flex flex-col items-center py-6 gap-4"}>
                <button
                    onClick={() => setIsPopupOpen(true)}
                    className="w-12 h-12 lg:w-40 lg:h-10 flex items-center justify-center gap-2 bg-blue-50 text-[#004b91] rounded-xl hover:bg-blue-100 transition-all group cursor-pointer"
                >
                    <Pen size={18} />
                    <span className="hidden lg:inline text-xs font-bold uppercase tracking-tight">Chỉnh sửa ngày</span>

                </button>

                <button className="w-12 h-12 lg:w-40 lg:h-10 flex items-center justify-center gap-2 border border-dashed border-gray-300 text-gray-400 rounded-xl hover:border-[#004b91] hover:text-[#004b91] transition-all group">
                    <Plus size={18} />
                    <span className="hidden lg:inline text-xs font-bold uppercase tracking-tight">Add Day</span>
                </button>
            </div>

            <div className={isPopupOpen ? "flex-1 overflow-hidden px-8 py-6 space-y-6 bg-white pointer-events-none" : "flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-white"}>

                {groupByDay(listData).map((items: any[], index) => (
                    <div key={index} className="space-y-4">
                        <ListTour
                            item={items}
                            onChange={(value) => setSelectedService(value)}
                        />
                    </div>
                ))}


                <DetailTourInEx item={item} />

                <DetailTourPrice item={item} />
            </div>

            {/* <PanelPopup
                open={isPopupOpen}
                onClose={() => {
                    setIsPopupOpen(false);
                    setHasChange(false);
                }}
                title="Change Day Order"
                className="w-[800px]"
            >
                <ChangeDayOrder
                    strTourCustomizedGUID={tourCustomizedGUID}
                    onChanged={(val) => setHasChange(val)}
                    onClose={() => {
                        setIsPopupOpen(false);
                        setHasChange(false);
                    }}
                    onSave={(newDays) => {
                        onUpdateDays(newDays);
                        setIsPopupOpen(false);
                        setHasChange(false);
                    }}
                    hasChange={hasChange}
                />
            </PanelPopup> */}

            <div className="hidden xl:block w-100 bg-gray-100 border-l border-gray-200 relative">
                {selectedService ? (
                    <div className="absolute inset-0 bg-white z-10 animate-in fade-in duration-300">
                        {/* <div className="p-8 h-full flex flex-col">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                                <h2 className="text-xl font-bold text-gray-800 uppercase">
                                    {selectedService}
                                </h2>
                                <button
                                    onClick={() => setSelectedService(null)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X size={20} className="text-gray-400" />
                                </button>
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center border border-dashed border-gray-200">
                                    <Plus size={32} />
                                </div>
                                <p className="text-sm italic">Đang tải danh sách dịch vụ...</p>
                            </div>
                        </div> */}
                    </div>
                ) : (
                    <>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 space-y-2">
                            <MapPin size={48} strokeWidth={1} />
                            <span className="text-sm font-medium tracking-tight">Map API Loading Area...</span>
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