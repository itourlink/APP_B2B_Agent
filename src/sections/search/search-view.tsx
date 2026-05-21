import { useLocation } from "react-router-dom";
import {
    useListTourPublish,
    useListTourSeries,
} from "@/hooks/actions/useTour";
import { TourListCard } from "./tour-list-card";
import { useSearchHotel } from "@/hooks/actions/useHotel";
import { HotelCard } from "../hotel/components/hotel-list";
import SearchFilter from "./search-filter";
import { useEffect, useMemo, useState } from "react";
import { isValidValue } from "@/utils/utilts";
import { getUrlImage } from "@/utils/format-image";
import { Calendar, Clock, Flag, MapPin, Users } from "lucide-react";
import Pagination from "@/components/pagination/pagination";

const SearchView = () => {
    const location = useLocation();
    const state = (location.state || {}) as any;

    const isSeries = state?.isTourSeries;
    const isSearchHotel = state?.isSearchHotel;

    const searchTourPayload = state?.isSearchTour || {};

    const [pageSeries, setPageSeries] = useState(1);
    const [pageTour, setPageTour] = useState(1);
    const [pageHotel, setPageHotel] = useState(1);

    const pageSize = 5;

    const getTotalPages = (listData: any, pageSize: number) => {
        const totalRecords = listData?.[0]?.intTotalRecords || 0;
        return Math.ceil(totalRecords / pageSize);
    };



    // ================= TOUR FILTER STATE =================
    const [tourFilter, setTourFilter] = useState({
        intCateID: null as number | null,
        intProductID: null as number | null,

        strNoOfDayRange: null as string | null,
        strFilterServiceName: null as string | null,
        strListEasiaCateID: null as string | null,
        strListTransportOptionID: null as string | null,

        strLocationCode:
            searchTourPayload?.strLocationCode ?? null,

        dtmFilterDateValidFrom: null as string | null,
        dtmFilterDateValidTo: null as string | null,

        strPriceFromRange: null as string | null,
    });

    // ================= SERIES FILTER STATE =================
    const [seriesFilter, setSeriesFilter] = useState({
        intCateID: null as string | null,
        intProductID: null as string | null,

        strNoOfDayRange: null as string | null,
        strFilterServiceName: null as string | null,
        strListEasiaCateID: null as string | null,
        strListTransportOptionID: null as string | null,

        strPriceFromRange: null as string | null,

        intNoOfAdult: undefined as number | undefined,
        strListNoOfChild: undefined as string | undefined,

        intNoOfSGLSup: undefined as number | undefined,
        intNoOfTPLRec: undefined as number | undefined,

        strLocationCode: null as string | null,

        dtmFilterDateValidFrom: null as string | null,
        dtmFilterDateValidTo: null as string | null,
    });


    // ================= TEMP FILTER =================
    const [tempTourFilter, setTempTourFilter] = useState(tourFilter);

    const [tempSeriesFilter, setTempSeriesFilter] =
        useState(seriesFilter);

    // ================= API =================

    const {
        tdpData,
        tdpLoading,
    } = useListTourPublish(
        !isSeries && !isSearchHotel
            ? {
                ...searchTourPayload,
                page: pageTour,
                pageSize,
                ...tourFilter,
            }
            : null
    );

    const {
        tsData,
        tsLoading,
    } = useListTourSeries(
        isSeries
            ? {
                ...seriesFilter,
                ...searchTourPayload,
                page: pageSeries,
                pageSize,
            }
            : null
    );

    const {
        searchData: hotelData,
        searchLoading,
    } = useSearchHotel(
        isSearchHotel
            ? {
                ...isSearchHotel,
                page: pageHotel,
                pageSize,
            }
            : undefined
    );

    const tsTotalPages = getTotalPages(tsData, pageSize);
    const tourTotalPages = getTotalPages(tdpData, pageSize);
    const hotelTotalPages = getTotalPages(hotelData, pageSize);

    // ================= RESET PAGE =================
    useEffect(() => {
        setPageSeries(1);
        setPageTour(1);
        setPageHotel(1);
    }, [isSeries, isSearchHotel]);

    // ================= RAW DATA =================
    const rawData = useMemo(() => {
        if (isSeries) return tsData || [];
        if (isSearchHotel) return hotelData || [];
        return tdpData || [];
    }, [tsData, tdpData, hotelData, isSeries, isSearchHotel]);

    // ================= PAGE FIX =================
    useEffect(() => {
        const totalPages = getTotalPages(tsData, pageSize);

        if (pageSeries > totalPages && totalPages > 0) {
            setPageSeries(1);
        }
    }, [tsData, pageSeries]);

    useEffect(() => {
        const totalPages = getTotalPages(tdpData, pageSize);

        if (pageTour > totalPages && totalPages > 0) {
            setPageTour(1);
        }
    }, [tdpData, pageTour]);

    useEffect(() => {
        const totalPages = getTotalPages(hotelData, pageSize);

        if (pageHotel > totalPages && totalPages > 0) {
            setPageHotel(1);
        }
    }, [hotelData, pageHotel]);

    // ================= LOADING =================
    const loading = tsLoading || tdpLoading || searchLoading;

    const resultCount = rawData?.[0]?.intTotalRecords || 0;

    console.log("page", pageSeries);
    console.log("tsData length", tsData?.length);

    return (
        <div className="mt-20 max-w-7xl mx-auto px-4 pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* FILTER */}
                <div className="lg:col-span-3">

                    <SearchFilter
                        isSeries={isSeries}

                        tourFilter={tempTourFilter}
                        setTourFilter={setTempTourFilter}

                        seriesFilter={tempSeriesFilter}
                        setSeriesFilter={setTempSeriesFilter}

                        onApply={() => {
                            if (isSeries) {
                                setSeriesFilter(tempSeriesFilter);
                                setPageSeries(1);
                            } else {
                                setTourFilter(tempTourFilter);
                                setPageTour(1);
                            }
                        }}
                    />
                </div>

                {/* CONTENT */}
                <div className="lg:col-span-9">

                    <div className="text-2xl font-semibold mb-6">
                        {loading
                            ? "Loading..."
                            : `Tìm thấy ${resultCount} kết quả`}
                    </div>

                    {resultCount === 0 && !loading && (
                        <div className="text-center py-10 text-gray-500">
                            Không có dữ liệu
                        </div>
                    )}

                    {/* SERIES */}
                    {!loading && isSeries && (
                        <div className="grid gap-6">
                            {rawData?.map((item: any) => {
                                return (
                                    <div
                                        key={item?.strTourGUID}
                                        className="max-w-4xl mx-auto border border-gray-200 rounded-2xl p-6 flex gap-6 bg-white shadow-sm font-sans"
                                    >
                                        {/* IMAGE */}
                                        <div className="w-1/3">
                                            <img
                                                src={getUrlImage(
                                                    isValidValue(item?.strTourImageUrl)
                                                )}
                                                alt={isValidValue(item?.strTourName)}
                                                className="w-full h-full object-cover rounded-xl"
                                            />
                                        </div>

                                        {/* CONTENT */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-800 uppercase mb-4">
                                                    {isValidValue(item?.strTourName)}
                                                </h2>

                                                <div className="flex gap-4 mb-4">
                                                    <select className="border border-gray-300 rounded px-3 py-1 text-sm bg-white w-48">
                                                        <option>
                                                            {isValidValue(
                                                                item?.strEasiaCateName
                                                            )}
                                                        </option>
                                                    </select>

                                                    <div className="border border-gray-300 rounded px-3 py-1 text-sm flex items-center gap-2 bg-white w-48">
                                                        <Calendar size={14} />

                                                        <span>
                                                            {isValidValue(
                                                                item?.dtmDateStarted
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Flag size={16} />

                                                        <span>
                                                            Bởi:
                                                            <span className="font-medium ml-1">
                                                                {isValidValue(
                                                                    item?.strOwnerCompanyName
                                                                )}
                                                            </span>
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Users size={16} />

                                                        <span>
                                                            Tổng:
                                                            {" "}
                                                            {isValidValue(
                                                                item?.intPaxMax
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Clock size={16} />

                                                        <span>
                                                            Thời lượng:
                                                            {" "}
                                                            {isValidValue(
                                                                item?.intNoOfDay
                                                            )} Days
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold">
                                                            Đã bán:
                                                            {" "}
                                                            {isValidValue(
                                                                item?.intTotalPaxUsed
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={16} />

                                                        <span>
                                                            Các điểm đến:
                                                            {" "}
                                                            {isValidValue(
                                                                item?.strListTourDestinationName
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <div className="text-blue-600 font-bold">
                                                            + Trống:
                                                            {" "}
                                                            {isValidValue(
                                                                item?.intTotalPaxRemain
                                                            )}
                                                        </div>

                                                        <div className="text-blue-600 font-bold">
                                                            + Giữ chỗ:
                                                            {" "}
                                                            {isValidValue(
                                                                item?.intTotalPaxHold
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <span className="inline-block mt-4 px-3 py-1 bg-blue-100 text-blue-500 rounded-full text-xs font-medium">
                                                    {isValidValue(
                                                        item?.strTourTypeName
                                                    ) || "Tour hằng ngày"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* PRICE */}
                                        <div className="w-1/4 flex flex-col items-center justify-center border-l border-gray-100 pl-6">
                                            <div className="text-gray-700 font-bold text-lg mb-1">
                                                Giá :
                                            </div>

                                            <div className="text-blue-600 text-3xl font-extrabold mb-4">
                                                $
                                                {isValidValue(
                                                    item?.dblTotalPrice
                                                )}
                                            </div>

                                            <button className="w-full py-2 border border-gray-300 rounded-full text-blue-500 font-semibold hover:bg-blue-50 transition-colors">
                                                Đặt Ngay
                                            </button>

                                            <button className="mt-2 text-xs font-bold text-black uppercase bg-gray-100 px-2 py-1 rounded shadow-inner">
                                                Tăng giá/Giảm giá
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {isSeries && (
                        <Pagination
                            currentPage={pageSeries}
                            onPageChange={setPageSeries}
                            totalPages={tsTotalPages || 1}
                        />
                    )}

                    {/* HOTEL */}
                    {!loading && isSearchHotel && (
                        <div className="grid grid-cols-3 gap-6">
                            {rawData.map((item: any) => (
                                <HotelCard
                                    key={item?.strSupplierGUID}
                                    hotel={item}
                                />
                            ))}
                        </div>
                    )}

                    {isSearchHotel && (
                        <Pagination
                            currentPage={pageHotel}
                            onPageChange={setPageHotel}
                            totalPages={hotelTotalPages || 1}
                        />
                    )}

                    {/* TOUR */}
                    {!loading && !isSeries && !isSearchHotel && (
                        <div className="grid grid-cols-3 gap-6">
                            {rawData.map((item: any) => (
                                <TourListCard
                                    key={item?.strTourGUID}
                                    tour={item}
                                />
                            ))}
                        </div>
                    )}

                    {!isSeries && !isSearchHotel && (
                        <Pagination
                            currentPage={pageTour}
                            onPageChange={setPageTour}
                            totalPages={tourTotalPages || 1}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchView;