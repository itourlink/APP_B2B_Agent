import { useLocation } from "react-router-dom";
import {
    useListTourPublish,
    useListTourSeries,
} from "@/hooks/actions/useTour";
import { TourListCard } from "./tour-list-card";
import TourSeriesCard from "./tour-series-card";
import { useSearchHotel } from "@/hooks/actions/useHotel";
import { HotelCard } from "../hotel/components/hotel-list";
import SearchFilter from "./search-filter";
import { useMemo, useState } from "react";

const SearchView = () => {
    const location = useLocation();
    const state = (location.state || {}) as any;

    const isSeries = state?.isTourSeries;
    const isSearchHotel = state?.isSearchHotel;

    const searchTourPayload = state?.isSearchTour || {};

    // ================= FILTER STATE =================
    const [filters, setFilters] = useState({
        keyword: "",
        price: 500,
        day: 30,
        star: [] as number[],
        transport: [] as string[],
    });

    // ================= API =================
    const { tsData, tsLoading, tsError } =
        useListTourSeries(isSeries ? searchTourPayload : null);

    const { tdpData, tdpLoading, tdpError } =
        useListTourPublish(
            !isSeries && !isSearchHotel ? searchTourPayload : null
        );

    const { searchData: hotelData, searchLoading, searchError } =
        useSearchHotel(
            isSearchHotel
                ? { ...isSearchHotel, page: 1, pageSize: 20 }
                : undefined
        );

    // ================= RAW DATA =================
    const rawData = useMemo(() => {
        if (isSeries) return tsData || [];
        if (isSearchHotel) return hotelData || [];
        return tdpData || [];
    }, [tsData, tdpData, hotelData, isSeries, isSearchHotel]);

    // ================= SERIES FILTER =================
    const filteredSeriesData = useMemo(() => {
        if (!isSeries) return [];

        return (rawData || []).filter((item: any) => {
            const keyword = filters.keyword.toLowerCase();

            const name = (
                item?.strTourName ||
                item?.strServiceName ||
                ""
            ).toLowerCase();

            const matchKeyword =
                !keyword || name.includes(keyword);

            const price =
                Number(item?.dblPriceFrom) ||
                Number(item?.dblTotalPrice) ||
                0;

            const matchPrice = price <= filters.price;

            const matchStar = filters.star.length === 0;

            const day =
                item?.intNoOfDay ||
                item?.intNumberOfDay ||
                0;

            const matchDay = day <= filters.day;

            const matchTransport =
                filters.transport.length === 0;

            return (
                matchKeyword &&
                matchPrice &&
                matchStar &&
                matchDay &&
                matchTransport
            );
        });
    }, [rawData, filters, isSeries]);

    // ================= TOUR FILTER =================
    const filteredTourData = useMemo(() => {
        if (isSeries || isSearchHotel) return [];

        return (rawData || []).filter((item: any) => {
            const keyword = filters.keyword.toLowerCase();

            const name = (
                item?.strTourName ||
                item?.strServiceName ||
                ""
            ).toLowerCase();

            const matchKeyword =
                !keyword || name.includes(keyword);

            const price =
                Number(item?.dblPriceFrom) ||
                Number(item?.dblMaxPriceFrom) ||
                Number(item?.dblTotalPrice) ||
                0;

            const matchPrice = price <= filters.price;

            const star = item?.intStar ?? 0;

            const matchStar =
                filters.star.length === 0 ||
                filters.star.includes(star);

            const day = item?.intNoOfDay || 0;

            const matchDay = day <= filters.day;

            const transport =
                (item?.strVehicle || "").toLowerCase();

            const matchTransport =
                filters.transport.length === 0 ||
                filters.transport.some((x) =>
                    transport.includes(x.toLowerCase())
                );

            return (
                matchKeyword &&
                matchPrice &&
                matchStar &&
                matchDay &&
                matchTransport
            );
        });
    }, [rawData, filters, isSeries, isSearchHotel]);

    // ================= HOTEL FILTER =================
    const filteredHotelData = useMemo(() => {
        if (!isSearchHotel) return [];

        return (rawData || []).filter((item: any) => {
            const keyword = filters.keyword.toLowerCase();

            const name =
                (item?.strSupplierName || "").toLowerCase();

            return !keyword || name.includes(keyword);
        });
    }, [rawData, filters, isSearchHotel]);

    // ================= LOADING =================
    const loading =
        tsLoading || tdpLoading || searchLoading;

    const error =
        tsError || tdpError || searchError;

    // ================= UI =================
    return (
        <div className="mt-20 max-w-7xl mx-auto px-4 pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* FILTER */}
                <div className="lg:col-span-3">
                    <SearchFilter
                        filters={filters}
                        setFilters={setFilters}
                    />
                </div>

                {/* CONTENT */}
                <div className="lg:col-span-9">

                    <div className="text-2xl font-semibold mb-6">
                        {loading
                            ? "Loading..."
                            : `Tìm thấy ${(isSeries
                                ? filteredSeriesData
                                : isSearchHotel
                                    ? filteredHotelData
                                    : filteredTourData
                            ).length
                            } kết quả`}
                    </div>

                    {/* EMPTY */}
                    {((isSeries
                        ? filteredSeriesData
                        : isSearchHotel
                            ? filteredHotelData
                            : filteredTourData
                    ).length === 0 && !loading) && (
                            <div className="text-center py-10 text-gray-500">
                                Không có dữ liệu
                            </div>
                        )}

                    {/* SERIES */}
                    {!loading && isSeries && (
                        <div className="grid gap-6">
                            {filteredSeriesData.map((item: any) => (
                                <TourSeriesCard
                                    key={item?.strTourGUID}
                                    tour={item}
                                />
                            ))}
                        </div>
                    )}

                    {/* HOTEL */}
                    {!loading && isSearchHotel && (
                        <div className="grid grid-cols-3 gap-6">
                            {filteredHotelData.map((item: any) => (
                                <HotelCard
                                    key={item?.strSupplierGUID}
                                    hotel={item}
                                />
                            ))}
                        </div>
                    )}

                    {/* TOUR */}
                    {!loading &&
                        !isSeries &&
                        !isSearchHotel && (
                            <div className="grid grid-cols-3 gap-6">
                                {filteredTourData.map((item: any) => (
                                    <TourListCard
                                        key={item?.strTourGUID}
                                        tour={item}
                                    />
                                ))}
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};

export default SearchView;