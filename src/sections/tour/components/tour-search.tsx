import { GenericFilter } from "@/components/generic-filter/generic-filter";
import { useSearchTour } from "@/hooks/actions/useTour";
import { useState } from "react";
import TourLocationDes from "./tour-location-des";
import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks/use-router";
import { useLocation } from "react-router-dom";
import { useTranslate } from "@/locales";

const DEFAULT_FILTERS = {
    page: 1,
    pageSize: 10,
    isTourSeries: false,
    strFilterDestinationName: "",
    start: null,
    end: null,
    tourType: {
        mainType: "all",
        subType: "all",
    },
    guestRoom: {
        rooms: 1,
        adults: 1,
        children: 0,
        childAges: [],
        roomTypes: {
            sgl: 0,
            dbl: 1,
            twn: 0,
            tpl: 0,
        },
    },
};

const DEFAULT_FILTERS2: {
    intNoOfAdult: number;
    strListNoOfChild: string;
    intNoOfSGLSup: number;
    intNoOfTPLRec: number;

    strLocationCode: string | null;

    dtmFilterDateValidFrom: string | null;
    dtmFilterDateValidTo: string | null;

    intCateID?: string | null;
    intProductID?: string | null;
} = {
    intNoOfAdult: 1,
    strListNoOfChild: "",
    intNoOfSGLSup: 0,
    intNoOfTPLRec: 0,

    strLocationCode: null,

    dtmFilterDateValidFrom: null,

    dtmFilterDateValidTo: null,

    intCateID: null,
    intProductID: null,
};

const formatDate = (date: Date | null) => {
    if (!date) return null;

    return new Date(date).toLocaleDateString("en-US");
};

const TourSearch = () => {
    const { t } = useTranslate("tour")

    const TOUR_TYPE_OPTIONS = [
        { label: t("all"), value: "all" },
        { label: t("dailyTour"), value: "18" },
        { label: t("packageTour"), value: "19" },
        { label: t("fixedTour"), value: "33" },
    ];

    const getTourSubOptions = () => {
        return [
            { label: t("all"), value: "all" },
            { label: t("fit"), value: "1" },
            { label: t("git"), value: "2" },
            { label: t("excursion"), value: "100" },
            { label: t("transportPackages"), value: "101" },
        ];
    };


    const location = useLocation();

    const company =
        new URLSearchParams(location.search).get("company");

    const router = useRouter();

    const [filters, setFilters] = useState(DEFAULT_FILTERS);

    const [draftFilters2, setDraftFilters2] = useState(DEFAULT_FILTERS2);

    const [selectedTour, setSelectedTour] = useState<any>(null);

    const searchPayload = {
        intCurPage: filters.page,
        intPageSize: filters.pageSize,

        isTourSeries: filters.isTourSeries,
        strFilterDestinationName:
            filters.strFilterDestinationName,

        ...draftFilters2,
    };

    const { searchData, searchLoading } = useSearchTour(searchPayload);

    const handleSearch = () => {
        if (selectedTour) {
            router.replaceParams(paths.shop.tour.detail, {
                item: selectedTour
            });

            return;
        }

        router.pushQuery(
            paths.shop.search,
            {
                company,
                type: "tour",
            },
            {
                isTourSeries: filters.isTourSeries,

                isSearchTour: {
                    ...draftFilters2,
                },
            }
        );

    };

    return (
        <div>
            <GenericFilter
                filters={[
                    { type: "toggle", key: "isTourSeries", label: "Tour Series" },

                    {
                        type: "search",
                        key: "strFilterDestinationName",
                        label: t("search"),
                        placeholder: t("searchPlaceholder"),
                        renderDropdown: ({ close }) => (
                            <TourLocationDes
                                data={searchData}
                                isLoading={searchLoading}
                                onSelectDestination={(item: any) => {
                                    const isTour =
                                        item?.__type === "tour" &&
                                        typeof item?.strServiceNameUrl === "string";

                                    setFilters((p: any) => ({
                                        ...p,
                                        strFilterDestinationName:
                                            item?.strDestinationName,
                                    }));

                                    if (isTour) {

                                        setSelectedTour(item);

                                        setDraftFilters2((prev) => ({
                                            ...prev,
                                            strLocationCode: null,
                                        }));

                                    } else {

                                        setSelectedTour(null);

                                        setDraftFilters2((prev) => ({
                                            ...prev,
                                            strLocationCode:
                                                item?.strDestinationCode ?? "VN0000",
                                        }));
                                    }

                                    close();
                                }}
                            />
                        ),
                    },

                    { type: "dateRange", keyStart: "start", keyEnd: "end" },
                    { type: "guestRoom", key: "guestRoom", isRoomDetail: true },
                    {
                        type: "tourType",
                        key: "tourType",
                        mainOptions: TOUR_TYPE_OPTIONS,
                        getSubOptions: getTourSubOptions,
                    },
                ]}
                values={filters}
                onChange={(k, v) => {
                    setFilters((p: any) => {
                        const next = { ...p, [k]: v };

                        if (k === "isTourSeries") {
                            setDraftFilters2(DEFAULT_FILTERS2);
                            setSelectedTour(null);

                            return {
                                ...DEFAULT_FILTERS,
                                isTourSeries: v,
                            };
                        }

                        if (k === "guestRoom") {
                            setDraftFilters2((prev) => ({
                                ...prev,

                                intNoOfAdult: v?.adults || 1,

                                strListNoOfChild:
                                    v?.childAges?.length
                                        ? v.childAges.join(",")
                                        : "",

                                intNoOfSGLSup: v?.roomTypes?.sgl || 0,

                                intNoOfTPLRec: v?.roomTypes?.tpl || 0,
                            }));
                        }

                        if (k === "start" || k === "end") {
                            setDraftFilters2((prev) => ({
                                ...prev,

                                dtmFilterDateValidFrom:
                                    k === "start"
                                        ? formatDate(v)
                                        : prev.dtmFilterDateValidFrom,

                                dtmFilterDateValidTo:
                                    k === "end"
                                        ? formatDate(v)
                                        : prev.dtmFilterDateValidTo,
                            }));
                        }

                        if (k === "tourType") {
                            setDraftFilters2((prev) => ({
                                ...prev,

                                intCateID:
                                    v?.mainType === "all"
                                        ? null
                                        : v?.mainType,

                                intProductID:
                                    v?.subType === "all"
                                        ? null
                                        : v?.subType,
                            }));
                        }

                        return next;
                    });
                }}
                onSearch={handleSearch}
            />
        </div>
    );
};

export default TourSearch;