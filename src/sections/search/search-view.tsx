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
import TourSeriesCard from "./tour-series-card";
import { isValidValue } from "@/utils/utilts";
import { getUrlImage } from "@/utils/format-image";
import { Calendar, Clock, Flag, MapPin, Users } from "lucide-react";

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

    // ================= NORMALIZE SERIES (FIX CORE BUG) =================
    const normalizedSeries = useMemo(() => {
        if (!isSeries) return [];

        return (rawData || []).map((item: any) => ({
            ...item,
            _name:
                item?.strTourName ||
                item?.strServiceName ||
                "",

            _price:
                Number(item?.dblPriceFrom) ||
                Number(item?.dblTotalPrice) ||
                0,

            _day:
                Number(item?.intNoOfDay) ||
                Number(item?.intNumberOfDay) ||
                0,
        }));
    }, [rawData, isSeries]);

    // ================= FILTER SERIES =================
    const seriesData = useMemo(() => {
        if (!isSeries) return [];
        return tsData || [];
    }, [tsData, isSeries]);

    const filteredSeriesData = useMemo(() => {
        if (!isSeries) return [];

        return normalizedSeries.filter((item: any) => {
            const keyword = filters.keyword.toLowerCase();

            const matchKeyword =
                !keyword || item._name.toLowerCase().includes(keyword);

            const matchPrice = item._price <= filters.price;

            const matchDay = item._day <= filters.day;

            const matchStar =
                filters.star.length === 0 || filters.star.includes(item.intStar);

            const matchTransport =
                filters.transport.length === 0 ||
                filters.transport.some((x) =>
                    (item.strVehicle || "").toLowerCase().includes(x.toLowerCase())
                );

            return (
                matchKeyword &&
                matchPrice &&
                matchDay &&
                matchStar &&
                matchTransport
            );
        });
    }, [normalizedSeries, filters, isSeries]);

    // ================= FILTER TOUR =================
    const filteredTourData = useMemo(() => {
        if (isSeries || isSearchHotel) return [];

        return (rawData || []).filter((item: any) => {
            const keyword = filters.keyword.toLowerCase();

            const name =
                (item?.strTourName || item?.strServiceName || "").toLowerCase();

            const matchKeyword = !keyword || name.includes(keyword);

            const price =
                Number(item?.dblPriceFrom) ||
                Number(item?.dblMaxPriceFrom) ||
                Number(item?.dblTotalPrice) ||
                0;

            const matchPrice = price <= filters.price;

            const star = item?.intStar ?? 0;
            const matchStar =
                filters.star.length === 0 || filters.star.includes(star);

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



    // ================= FILTER HOTEL =================
    const filteredHotelData = useMemo(() => {
        if (!isSearchHotel) return [];

        return (rawData || []).filter((item: any) => {
            const keyword = filters.keyword.toLowerCase();

            const name = (item?.strSupplierName || "").toLowerCase();

            return !keyword || name.includes(keyword);
        });
    }, [rawData, filters, isSearchHotel]);

    // ================= LOADING =================
    const loading = tsLoading || tdpLoading || searchLoading;
    const error = tsError || tdpError || searchError;

    const resultCount = isSeries
        ? filteredSeriesData.length
        : isSearchHotel
            ? filteredHotelData.length
            : filteredTourData.length;

    console.log("filteredSeriesData", filteredSeriesData)


    useEffect(() => {
        console.log("tsData length:", tsData?.length);
        console.log("seriesData length:", seriesData?.length);
    }, [tsData, seriesData]);
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
                        {loading ? "Loading..." : `Tìm thấy ${resultCount} kết quả`}
                    </div>

                    {resultCount === 0 && !loading && (
                        <div className="text-center py-10 text-gray-500">
                            Không có dữ liệu
                        </div>
                    )}

                    {/* SERIES */}
                    {/* {!loading && isSeries && filteredSeriesData && (
                        <div className="grid gap-6">
                            {filteredSeriesData.map((item: any) => (
                                <TourSeriesCard
                                    key={item?.strTourGUID}
                                    tour={item}
                                />
                            ))}
                        </div>
                    )} */}

                    {/* SERIES */}
                    <div className="grid gap-6">
                        {filteredSeriesData.map((item: any) => (
                            <div className="max-w-4xl mx-auto border border-gray-200 rounded-2xl p-6 flex gap-6 bg-white shadow-sm font-sans">
                                {/* Left Side: Image */}
                                <div className="w-1/3">
                                    <img
                                        src={getUrlImage(isValidValue(item?.strTourImageUrl))}
                                        alt={isValidValue(item?.strTourName)}
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                </div>

                                {/* Right Side */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800 uppercase mb-4">
                                            {isValidValue(item?.strTourName)}
                                        </h2>

                                        <div className="flex gap-4 mb-4">
                                            <select className="border border-gray-300 rounded px-3 py-1 text-sm bg-white w-48">
                                                <option>
                                                    {isValidValue(item?.strEasiaCateName)}
                                                </option>
                                            </select>

                                            <div className="border border-gray-300 rounded px-3 py-1 text-sm flex items-center gap-2 bg-white w-48">
                                                <Calendar size={14} />
                                                <span>
                                                    {isValidValue(item?.dtmDateStarted)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Flag size={16} />
                                                <span>
                                                    Bởi:{" "}
                                                    <span className="font-medium">
                                                        {isValidValue(item?.strOwnerCompanyName)}
                                                    </span>
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Users size={16} />
                                                <span>
                                                    Tổng: {isValidValue(item?.intPaxMax)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Clock size={16} />
                                                <span>
                                                    Thời lượng:{" "}
                                                    {isValidValue(item?.intNoOfDay)} Days
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="font-bold">
                                                    Đã bán:{" "}
                                                    {isValidValue(item?.intTotalPaxUsed)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} />
                                                <span>
                                                    Các điểm đến:{" "}
                                                    {isValidValue(
                                                        item?.strListTourDestinationName
                                                    )}
                                                </span>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="text-blue-600 font-bold">
                                                    + Trống:{" "}
                                                    {isValidValue(item?.intTotalPaxRemain)}
                                                </div>

                                                <div className="text-blue-600 font-bold">
                                                    + Giữ chỗ:{" "}
                                                    {isValidValue(item?.intTotalPaxHold)}
                                                </div>
                                            </div>
                                        </div>

                                        <span className="inline-block mt-4 px-3 py-1 bg-blue-100 text-blue-500 rounded-full text-xs font-medium">
                                            {isValidValue(item?.strTourTypeName) || "Tour hằng ngày"}
                                        </span>
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div className="w-1/4 flex flex-col items-center justify-center border-l border-gray-100 pl-6">
                                    <div className="text-gray-700 font-bold text-lg mb-1">
                                        Giá :
                                    </div>

                                    <div className="text-blue-600 text-3xl font-extrabold mb-4">
                                        ${isValidValue(item?.dblTotalPrice)}
                                    </div>

                                    <button className="w-full py-2 border border-gray-300 rounded-full text-blue-500 font-semibold hover:bg-blue-50 transition-colors">
                                        Đặt Ngay
                                    </button>

                                    <button className="mt-2 text-xs font-bold text-black uppercase bg-gray-100 px-2 py-1 rounded shadow-inner">
                                        Tăng giá/Giảm giá
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>


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
                    {!loading && !isSeries && !isSearchHotel && (
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