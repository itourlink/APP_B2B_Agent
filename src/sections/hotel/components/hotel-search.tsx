import { GenericFilter } from "@/components/generic-filter/generic-filter";
import HotelLocationDes from "./hotel-location-des";
import { useRouter } from "@/routes/hooks/use-router";
import { useEffect, useRef, useState } from "react";
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
    initialHotel?: any;
    onDateBookingChange?: (date: {
        start: Date | null;
        end: Date | null;
    }) => void;

    onSearch?: (date: {
        start: Date | null;
        end: Date | null;
    }) => void;
}

const HotelSearch = ({ initialHotel, onDateBookingChange, onSearch }: Props) => {

    const { t } = useTranslate("search")
    const location = useLocation();

    console.log("🏠 HotelSearch INIT", {
        pathname: location.pathname,
        search: location.search,
        locationState: location.state,
        initialHotel,
    });
    const company =
        new URLSearchParams(location.search).get("company");

    const [isNavigating, setIsNavigating] = useState(false);

    const router = useRouter();

    const [filters, setFilters] =
        useState<FilterState>({
            ...DEFAULT_FILTERS,
            guestRoom: {
                ...DEFAULT_FILTERS.guestRoom,
            },
        });

    const [selectedHotel, setSelectedHotel] =
        useState<any | null>(null);

    const [draftFilters, setDraftFilters] =
        useState(DEFAULT_FILTERS2);

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

            console.log("✅ PARSED HOTEL STATE", {
                filters: parsed.filters,
                draftFilters: parsed.draftFilters,
                selectedHotel: parsed.selectedHotel,
            });

            const restoredFilters = {
                ...parsed.filters,

                start: parsed.filters?.start
                    ? new Date(parsed.filters.start)
                    : null,

                end: parsed.filters?.end
                    ? new Date(parsed.filters.end)
                    : null,
            };

            setFilters((prev) => {

                console.log("🟡 BEFORE RESTORE FILTERS", prev);

                if (prev.strFilterDestinationName) {
                    console.log(
                        "⛔ SKIP RESTORE BECAUSE EXIST",
                        prev.strFilterDestinationName
                    );

                    return prev;
                }

                const next = {
                    ...prev,
                    ...restoredFilters,
                };

                console.log("🟢 AFTER RESTORE FILTERS", next);

                return next;
            });

            setDraftFilters((prev) => ({
                ...prev,
                ...parsed.draftFilters,
            }));

            const restoredSelectedHotel =
                parsed.selectedHotel ||
                (parsed.filters?.strFilterDestinationName
                    ? {
                        strSupplierGUID:
                            parsed?.params?.hotelId || null,
                        strSupplierName:
                            parsed.filters.strFilterDestinationName,
                    }
                    : null);

            setSelectedHotel(
                restoredSelectedHotel ??
                (initialHotel
                    ? {
                        ...initialHotel,
                        strSupplierGUID: initialHotel.strSupplierGUID,
                        strSupplierName: initialHotel.strSupplierName,
                    }
                    : null)
            );


        } catch { }
    }, [location.search, initialHotel]);

    const hydratedRef = useRef(false);

    useEffect(() => {
        if (hydratedRef.current || !initialHotel) return;

        console.log("🏨 INITIAL HOTEL EFFECT", {
            initialHotel,
            currentFilters: filters,
        });

        const normalizedHotel = {
            ...initialHotel,

            strSupplierGUID:
                initialHotel.strSupplierGUID,

            strSupplierName:
                initialHotel.strSupplierName ||
                initialHotel.strDestinationName ||
                "",
        };

        setSelectedHotel(normalizedHotel);

        setFilters((prev) => ({
            ...prev,
            strFilterDestinationName:
                prev.strFilterDestinationName ||
                normalizedHotel.strSupplierName,
        }));

        hydratedRef.current = true;
    }, [initialHotel]);
    useEffect(() => {
        console.log("🔥 FILTERS CHANGED", {
            strFilterDestinationName:
                filters.strFilterDestinationName,
            start: filters.start,
            guestRoom: filters.guestRoom,
        });
    }, [filters]);
    const handleSearch = () => {
        const snapshot = {
            filters,
            draftFilters,
            selectedHotel,
        };

        const hotel =
            selectedHotel &&
                filters.strFilterDestinationName.trim()
                ? selectedHotel
                : null;

        if (hotel) {
            setIsNavigating(true);

            onSearch?.({
                start: filters.start,
                end: filters.end,
            });

            const params = {
                company,
                hotelId: hotel.strSupplierGUID,
                checkIn: filters.start?.toISOString(),
                checkOut: filters.end?.toISOString(),
                rooms: filters.guestRoom.rooms,
                hotelSearchState: JSON.stringify(snapshot),
            };

            router.pushQuery(
                paths.shop.hotel.detail,
                params,
                {
                    item: hotel,
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
                        console.log(
                            "🔴 INITIAL HOTEL SET FILTER",
                            next
                        );
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