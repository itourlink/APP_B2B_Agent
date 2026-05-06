import { GenericFilter } from "@/components/generic-filter/generic-filter";
import { useSearchTour } from "@/hooks/actions/useTour";
import { useState } from "react";
import TourLocationDes from "./tour-location-des";
import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks/use-router";

const today = new Date();

const DEFAULT_FILTERS = {
    page: 1,
    pageSize: 10,
    isTourSeries: false,
    strFilterDestinationName: "Ha Noi, Vietnam",
    start: today,
    end: null,
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

const DEFAULT_FILTERS2 = {
    intNoOfAdult: 1,
    strListNoOfChild: "",
    intNoOfSGLSup: 0,
    intNoOfTPLRec: 0,
    strLocationCode: "VN0000",
    dtmFilterDateValidFrom: today,
    dtmFilterDateValidTo: null,
};

const TourSearch = () => {
    const router = useRouter();

    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [draftFilters2, setDraftFilters2] = useState<{
        intNoOfAdult: number;
        strListNoOfChild: string;
        intNoOfSGLSup: number;
        intNoOfTPLRec: number;
        strLocationCode: string | null;
        dtmFilterDateValidFrom: Date;
        dtmFilterDateValidTo: Date | null;
    }>(DEFAULT_FILTERS2);

    const [selectedTourUrl, setSelectedTourUrl] = useState<string | null>(null);

    const searchPayload = {
        page: filters.page,
        pageSize: filters.pageSize,
        isTourSeries: filters.isTourSeries,
        strFilterDestinationName: filters.strFilterDestinationName,
    };

    const { searchData, searchLoading } = useSearchTour(searchPayload);

    const handleSearch = () => {
        // TOUR → detail
        if (selectedTourUrl) {
            router.replaceParams(paths.tour.detail, {
                item: {
                    strServiceNameUrl: selectedTourUrl,
                },
            });
            return;
        }

        // SEARCH LIST
        router.replaceParams(paths.search, {
            isTourSeries: filters.isTourSeries,
            isSearchTour: draftFilters2,
        });
    };

    return (
        <div>
            <GenericFilter
                filters={[
                    { type: "toggle", key: "isTourSeries", label: "Tour Series" },

                    {
                        type: "search",
                        key: "strFilterDestinationName",
                        label: "Search",
                        placeholder: "Search...",
                        renderDropdown: ({ close }) => (
                            <TourLocationDes
                                data={searchData}
                                isLoading={searchLoading}
                                onSelectDestination={(item: any) => {
                                    const isTour = !!item?.strServiceNameUrl;

                                    setFilters((p: any) => ({
                                        ...p,
                                        strFilterDestinationName:
                                            item?.strDestinationName,
                                    }));

                                    if (isTour) {
                                        setSelectedTourUrl(
                                            item?.strServiceNameUrl
                                        );

                                        setDraftFilters2((prev) => ({
                                            ...prev,
                                            strLocationCode: null,
                                        }));
                                    } else {
                                        setSelectedTourUrl(null);

                                        setDraftFilters2((prev) => ({
                                            ...prev,
                                            strLocationCode:
                                                item?.strDestinationCode,
                                        }));
                                    }

                                    close();
                                }}
                            />
                        ),
                    },

                    { type: "guestRoom", key: "guestRoom", isRoomDetail: true },
                    { type: "dateRange", keyStart: "start", keyEnd: "end" },
                ]}
                values={filters}
                onChange={(k, v) => {
                    setFilters((p: any) => {
                        const next = { ...p, [k]: v };

                        if (k === "isTourSeries") {
                            setDraftFilters2(DEFAULT_FILTERS2);
                            setSelectedTourUrl(null);

                            return {
                                ...DEFAULT_FILTERS,
                                isTourSeries: v,
                            };
                        }

                        if (k === "guestRoom") {
                            setDraftFilters2((prev) => ({
                                ...prev,
                                intNoOfAdult: v?.adults || 1,
                                strListNoOfChild: v?.children
                                    ? String(v.children)
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
                                        ? v
                                        : prev.dtmFilterDateValidFrom,
                                dtmFilterDateValidTo:
                                    k === "end"
                                        ? v
                                        : prev.dtmFilterDateValidTo,
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