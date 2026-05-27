import { GenericFilter } from "@/components/generic-filter/generic-filter";
import HotelLocationDes from "./hotel-location-des";
import { useRouter } from "@/routes/hooks/use-router";
import { useState } from "react";
import { paths } from "@/routes/paths";
import { useSearchDesHotel } from "@/hooks/actions/useHotel";
import { useLocation } from "react-router-dom";

const today = new Date();

const DEFAULT_FILTERS = {
    page: 1,
    pageSize: 10,
    strFilterDestinationName: "",
    start: today,
    end: null,
    guestRoom: {
        rooms: 1,
        adults: 1,
        children: 0,
        childAges: [],
    },
};

const DEFAULT_FILTERS2 = {
    intNoOfRooms: 1,
    dtmFilterCheckIn: today,
    dtmFilterCheckOut: null,
    strFilterLocationCode: null,
    IsShowAll: false,
};

const HotelSearch = () => {
    const location = useLocation();

    const company =
        new URLSearchParams(location.search).get("company");

    const [isNavigating, setIsNavigating] = useState(false);
    const router = useRouter();

    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

    const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS2);

    // 👉 dropdown search
    const { searchDesData, searchDesLoading } = useSearchDesHotel({
        page: filters.page,
        pageSize: filters.pageSize,
        strFilterDestinationName: filters.strFilterDestinationName,
    });



    const handleSearch = () => {
        if (selectedUrl) {
            setIsNavigating(true);

            router.replaceParams(paths.shop.hotel.detail, {
                item: {
                    strSupplierNameURL: selectedUrl,
                },
            });

            return;
        }

        const payload = {
            ...draftFilters,

            intNoOfRooms:
                filters.guestRoom?.rooms || 1,

            dtmFilterCheckIn: filters.start,

            dtmFilterCheckOut: filters.end,
        };

        router.pushQuery(
            paths.shop.search,
            {
                company,
                type: "hotel",
            },
            {
                isSearchHotel: payload,

                mode: filters.series
                    ? "quick"
                    : "list",
            }
        );
    };

    return (
        <>
            <GenericFilter
                filters={[
                    { type: "toggle", key: "series", label: "Đặt phòng ngay" },

                    {
                        type: "search",
                        key: "strFilterDestinationName",
                        label: "Điểm đến",
                        placeholder: "Search...",
                        renderDropdown: ({ close }) => (
                            <HotelLocationDes
                                data={searchDesData}
                                isLoading={searchDesLoading}
                                onSelectDestination={(item) => {
                                    const isHotel =
                                        typeof item?.strSupplierNameURL === "string" &&
                                        item.strSupplierNameURL.trim() !== "";

                                    setFilters((p) => ({
                                        ...p,
                                        strFilterDestinationName: item?.strDestinationName,
                                    }));

                                    if (isHotel) {
                                        // 👉 click HOTEL
                                        setSelectedUrl(item.strSupplierNameURL);

                                        setDraftFilters((prev) => ({
                                            ...prev,
                                            strFilterLocationCode: null,
                                        }));
                                    } else {
                                        // 👉 click DESTINATION
                                        setSelectedUrl(null);

                                        setDraftFilters((prev) => ({
                                            ...prev,
                                            strFilterLocationCode: item?.strDestinationCode,
                                        }));
                                    }

                                    close();
                                }}
                            />
                        ),
                    },

                    {
                        type: "dateRange",
                        keyStart: "start",
                        keyEnd: "end",
                        label: "Ngày nhận phòng - Ngày trả phòng",
                    },

                    { type: "guestRoom", key: "guestRoom", isRoomDetail: false },
                ]}
                values={filters}
                onChange={(k, v) => {
                    setFilters((prev: any) => {
                        const next = { ...prev, [k]: v };

                        // 👉 ROOM
                        if (k === "guestRoom") {
                            setDraftFilters((p) => ({
                                ...p,
                                intNoOfRooms: v?.rooms || 1,
                            }));

                            next.guestRoom = v; // ✅ thêm dòng này
                        }

                        // 👉 DATE
                        if (k === "start" || k === "end") {
                            setDraftFilters((p) => ({
                                ...p,
                                dtmFilterCheckIn: k === "start" ? v : p.dtmFilterCheckIn,
                                dtmFilterCheckOut: k === "end" ? v : p.dtmFilterCheckOut,
                            }));

                            next[k] = v;
                        }

                        return next;
                    });
                }}
                onSearch={handleSearch}
            />

            {isNavigating && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-white px-6 py-4 rounded-xl shadow flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                        <span>Đang chuyển trang...</span>
                    </div>
                </div>
            )}
        </>

    );
};

export default HotelSearch;