import { GenericFilter } from "@/components/generic-filter/generic-filter";
import HotelLocationDes from "./hotel-location-des";
import { useRouter } from "@/routes/hooks/use-router";
import { useEffect, useState } from "react";
import { paths } from "@/routes/paths";
import { useSearchDesHotel } from "@/hooks/actions/useHotel";
import { useLocation } from "react-router-dom";
import { useTranslate } from "@/locales";

const today = new Date();

interface FilterState {
    page: number;
    pageSize: number;
    series: boolean;
    strFilterDestinationName: string;
    start: Date | null;
    end: Date | null;
    guestRoom: {
        rooms: number;
        adults: number;
        children: number;
        childAges: number[];
    };
}

const DEFAULT_FILTERS: FilterState = {
    page: 1,
    pageSize: 10,
    series: false,
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

interface Props {
    onDateBookingChange?: (date: {
        start: Date | null;
        end: Date | null;
    }) => void;
}

const HotelSearch = ({ onDateBookingChange }: Props) => {
    const { t } = useTranslate("search")
    const location = useLocation();
    const company =
        new URLSearchParams(location.search).get("company");

    const [isNavigating, setIsNavigating] = useState(false);

    const router = useRouter();

    const [filters, setFilters] = useState(DEFAULT_FILTERS);

    // ✅ lưu full hotel object
    const [selectedHotel, setSelectedHotel] =
        useState<any | null>(null);

    console.log("selectedHotel", selectedHotel)
    const [draftFilters, setDraftFilters] =
        useState(DEFAULT_FILTERS2);

    // 👉 dropdown search
    const { searchDesData, searchDesLoading } =
        useSearchDesHotel({
            page: filters.page,
            pageSize: filters.pageSize,
            strFilterDestinationName:
                filters.strFilterDestinationName,
        });

    useEffect(() => {
        const params = new URLSearchParams(location.search);

        const raw = params.get("hotelSearchState");

        if (!raw) return;

        try {
            const parsed = JSON.parse(raw);

            setFilters((prev) => {
                if (prev?.strFilterDestinationName) {
                    return prev;
                }

                return {
                    ...prev,
                    ...parsed.filters,
                };
            });

            setDraftFilters((prev) => ({
                ...prev,
                ...parsed.draftFilters,
            }));

            setSelectedHotel(
                parsed.selectedHotel || null
            );
        } catch { }
    }, [location.search]);

    const handleSearch = () => {
        const snapshot = {
            filters,
            draftFilters,
            selectedHotel,
        };


        // ✅ CLICK HOTEL => đi detail
        if (selectedHotel) {
            setIsNavigating(true);

            const params = {
                company,
                hotelId: selectedHotel.strSupplierGUID,
                checkIn: filters.start?.toISOString(),
                checkOut: filters.end?.toISOString(),
                rooms: filters.guestRoom.rooms,
            };

            router.pushQuery(
                paths.shop.hotel.detail,
                params,
                {
                    item: selectedHotel,
                }
            );


            setIsNavigating(false);

            return;
        }
        // ✅ SEARCH DESTINATION
        const payload = {
            ...draftFilters,

            intNoOfRooms:
                filters.guestRoom?.rooms || 1,

            dtmFilterCheckIn: filters.start,

            dtmFilterCheckOut: filters.end,

            strFilterDestinationName:
                filters.strFilterDestinationName || null,
        };

        router.pushQuery(
            paths.shop.search,
            {
                company,
                type: "hotel",
                hotelSearchState: JSON.stringify(snapshot),
            },
            {
                isSearchHotel: payload,
                mode: filters.series ? "quick" : "list",
            }
        );
    };

    return (
        <>
            <GenericFilter
                filters={[
                    {
                        type: "toggle",
                        key: "series",
                        label: t("bookRoomNow"),
                    },

                    {
                        type: "search",
                        key: "strFilterDestinationName",
                        label: t("destination"),
                        placeholder: t("searchPlaceholder"),

                        renderDropdown: ({ close }) => (
                            <HotelLocationDes
                                data={searchDesData}
                                isLoading={
                                    searchDesLoading
                                }
                                onSelectDestination={(
                                    item
                                ) => {

                                    const isHotel =
                                        item?.__type ===
                                        "hotel";

                                    setFilters((p) => ({
                                        ...p,

                                        strFilterDestinationName:
                                            item?.strDestinationName,
                                    }));

                                    if (isHotel) {

                                        // ✅ lưu full object
                                        setSelectedHotel(
                                            item
                                        );

                                        setDraftFilters(
                                            (prev) => ({
                                                ...prev,

                                                strFilterLocationCode:
                                                    null,
                                            })
                                        );

                                    } else {

                                        // ✅ clear selected hotel
                                        setSelectedHotel(
                                            null
                                        );

                                        setDraftFilters(
                                            (prev) => ({
                                                ...prev,

                                                strFilterLocationCode:
                                                    item?.strDestinationCode,
                                            })
                                        );
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
                        label:
                            t("checkInCheckOutDate"),
                    },

                    {
                        type: "guestRoom",
                        key: "guestRoom",
                        isRoomDetail: false,
                    },
                ]}

                values={filters}

                onChange={(k, v) => {

                    setFilters((prev: any) => {

                        const next = {
                            ...prev,
                            [k]: v,
                        };

                        // 👉 ROOM
                        if (k === "guestRoom") {

                            setDraftFilters((p) => ({
                                ...p,

                                intNoOfRooms:
                                    v?.rooms || 1,
                            }));

                            next.guestRoom = v;
                        }

                        // 👉 DATE
                        if (k === "start" || k === "end") {
                            const start =
                                k === "start" ? v : prev.start;

                            const end =
                                k === "end" ? v : prev.end;

                            onDateBookingChange?.({
                                start,
                                end,
                            });

                            setDraftFilters((p) => ({
                                ...p,

                                dtmFilterCheckIn:
                                    k === "start"
                                        ? v
                                        : p.dtmFilterCheckIn,

                                dtmFilterCheckOut:
                                    k === "end"
                                        ? v
                                        : p.dtmFilterCheckOut,
                            }));

                            next[k] = v;
                        }

                        // ✅ user gõ tay => reset selected hotel
                        if (
                            k ===
                            "strFilterDestinationName"
                        ) {
                            setSelectedHotel(null);
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

                        <span>
                            {t("redirectingPage")}
                        </span>
                    </div>
                </div>
            )}
        </>
    );
};

export default HotelSearch;