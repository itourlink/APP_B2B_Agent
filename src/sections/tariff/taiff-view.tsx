import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";
import { useListCompanyOwner } from "@/hooks/actions/useCompanyOwner";
import { useGetDetailCompanyTopup, useGetListSupplierMappingPrice } from "@/hooks/actions/useTariff";
import Pagination from "@/components/pagination/pagination";
import {
    ArrowLeft,
    Filter,
    RotateCcw,
    Search,
    Download, SlidersHorizontal, ChevronDown
} from "lucide-react";

// Mock Tariff Data matching the screenshot structure
const MOCK_TARIFF_DATA = [
    {
        stt: 1,
        hotelName: "AIRA BOUTIQUE HANOI HOTEL&SPA (****)",
        hotelAddress: "28A P. Trần Phú, Điện Biên, Ba Đình, Hà Nội",
        hotelWebsite: "https://airaboutiquehanoi.com",
        roomName: "Balcony Deluxe Room (Monday->Sunday)",
        dateFrom: "01 Thg 01, 2025",
        dateTo: "31 Thg 03, 2027",
        price: "1,240,000",
        priceSgl: "1,240,000",
        priceDbl: "0",
        priceChild: "216,000",
        remark: "",
        supplierType: "Hotel",
        country: "Vietnam",
        region: "North",
        destination: "Hanoi"
    },
    {
        stt: 2,
        hotelName: "AIRA BOUTIQUE HANOI HOTEL&SPA (****)",
        hotelAddress: "28A P. Trần Phú, Điện Biên, Ba Đình, Hà Nội",
        hotelWebsite: "https://airaboutiquehanoi.com",
        roomName: "Balcony Junior Suite (Monday->Sunday)",
        dateFrom: "01 Thg 01, 2025",
        dateTo: "31 Thg 03, 2027",
        price: "2,078,000",
        priceSgl: "2,078,000",
        priceDbl: "0",
        priceChild: "274,000",
        remark: "",
        supplierType: "Hotel",
        country: "Vietnam",
        region: "North",
        destination: "Hanoi"
    },
    {
        stt: 3,
        hotelName: "AIRA BOUTIQUE HANOI HOTEL&SPA (****)",
        hotelAddress: "28A P. Trần Phú, Điện Biên, Ba Đình, Hà Nội",
        hotelWebsite: "https://airaboutiquehanoi.com",
        roomName: "Balcony Luxury Suite (Monday->Sunday)",
        dateFrom: "01 Thg 01, 2025",
        dateTo: "31 Thg 03, 2027",
        price: "2,240,000",
        priceSgl: "2,240,000",
        priceDbl: "162,000",
        priceChild: "0",
        remark: "",
        supplierType: "Hotel",
        country: "Vietnam",
        region: "North",
        destination: "Hanoi"
    },
    {
        stt: 4,
        hotelName: "AIRA BOUTIQUE HANOI HOTEL&SPA (****)",
        hotelAddress: "28A P. Trần Phú, Điện Biên, Ba Đình, Hà Nội",
        hotelWebsite: "https://airaboutiquehanoi.com",
        roomName: "Balcony Aira Suite (Monday->Sunday)",
        dateFrom: "01 Thg 01, 2025",
        dateTo: "31 Thg 03, 2027",
        price: "2,780,000",
        priceSgl: "2,780,000",
        priceDbl: "0",
        priceChild: "678,000",
        remark: "",
        supplierType: "Hotel",
        country: "Vietnam",
        region: "North",
        destination: "Hanoi"
    },
    {
        stt: 5,
        hotelName: "AIRA BOUTIQUE HANOI HOTEL&SPA (****)",
        hotelAddress: "28A P. Trần Phú, Điện Biên, Ba Đình, Hà Nội",
        hotelWebsite: "https://airaboutiquehanoi.com",
        roomName: "Balcony Pool View Suite (Monday->Sunday)",
        dateFrom: "01 Thg 01, 2025",
        dateTo: "31 Thg 03, 2027",
        price: "2,484,000",
        priceSgl: "2,484,000",
        priceDbl: "162,000",
        priceChild: "0",
        remark: "",
        supplierType: "Hotel",
        country: "Vietnam",
        region: "North",
        destination: "Hanoi"
    },
    {
        stt: 6,
        hotelName: "AIRA BOUTIQUE HANOI HOTEL&SPA (****)",
        hotelAddress: "28A P. Trần Phú, Điện Biên, Ba Đình, Hà Nội",
        hotelWebsite: "https://airaboutiquehanoi.com",
        roomName: "Family Suite (Triple) (Monday->Sunday)",
        dateFrom: "01 Thg 01, 2025",
        dateTo: "31 Thg 03, 2027",
        price: "2,700,000",
        priceSgl: "0",
        priceDbl: "162,000",
        priceChild: "0",
        remark: "",
        supplierType: "Hotel",
        country: "Vietnam",
        region: "North",
        destination: "Hanoi"
    },
    {
        stt: 7,
        hotelName: "AIRA BOUTIQUE HANOI HOTEL&SPA (****)",
        hotelAddress: "28A P. Trần Phú, Điện Biên, Ba Đình, Hà Nội",
        hotelWebsite: "https://airaboutiquehanoi.com",
        roomName: "Connecting Rooms (Monday->Sunday)",
        dateFrom: "01 Thg 01, 2025",
        dateTo: "31 Thg 03, 2027",
        price: "3,948,000",
        priceSgl: "0",
        priceDbl: "162,000",
        priceChild: "0",
        remark: "",
        supplierType: "Hotel",
        country: "Vietnam",
        region: "North",
        destination: "Hanoi"
    },
    {
        stt: 8,
        hotelName: "ALAGON CITY HOTEL & SPA (****)",
        hotelAddress: "54-56-58 Pham Hong Thai Street, Ben Thanh Ward, District 1, Ho Chi Minh, Vietnam",
        hotelWebsite: "https://www.alagonhotels.com/alagon-city-point-hotel",
        roomName: "Superior No Window (Monday->Sunday)",
        dateFrom: "01 Thg 01, 2025",
        dateTo: "31 Thg 12, 2025",
        price: "$123.6",
        priceSgl: "$123.6",
        priceDbl: "$0",
        priceChild: "$50",
        remark: "",
        supplierType: "Hotel",
        country: "Vietnam",
        region: "South",
        destination: "Ho Chi Minh"
    },
    {
        stt: 9,
        hotelName: "ALAGON CITY HOTEL & SPA (****)",
        hotelAddress: "54-56-58 Pham Hong Thai Street, Ben Thanh Ward, District 1, Ho Chi Minh, Vietnam",
        hotelWebsite: "https://www.alagonhotels.com/alagon-city-point-hotel",
        roomName: "Deluxe No Window (Monday->Sunday)",
        dateFrom: "01 Thg 01, 2025",
        dateTo: "31 Thg 12, 2025",
        price: "$151.2",
        priceSgl: "$151.2",
        priceDbl: "$0",
        priceChild: "$55",
        remark: "",
        supplierType: "Hotel",
        country: "Vietnam",
        region: "South",
        destination: "Ho Chi Minh"
    },
    {
        stt: 10,
        hotelName: "ALAGON CITY HOTEL & SPA (****)",
        hotelAddress: "54-56-58 Pham Hong Thai Street, Ben Thanh Ward, District 1, Ho Chi Minh, Vietnam",
        hotelWebsite: "https://www.alagonhotels.com/alagon-city-point-hotel",
        roomName: "Deluxe Connecting (Monday->Sunday)",
        dateFrom: "01 Thg 01, 2025",
        dateTo: "31 Thg 12, 2025",
        price: "$185.6",
        priceSgl: "$185.6",
        priceDbl: "$60",
        priceChild: "$0",
        remark: "",
        supplierType: "Hotel",
        country: "Vietnam",
        region: "South",
        destination: "Ho Chi Minh"
    }
];

const TariffView = () => {
    const router = useRouter();
    const location = useLocation();
    const { coData } = useListCompanyOwner();

    // Call and log the GetDetailCompanyTopup API
    const { data: topupData, isLoading: topupLoading, isError: topupError } = useGetDetailCompanyTopup();
    console.log(">>> GetDetailCompanyTopup API Response:", { topupData, topupLoading, topupError });

    const company = new URLSearchParams(location.search).get("company") || "";
    const companyName = coData?.strCompanyName || "CÔNG TY KẾT NỐI DU LỊCH";


    // Filter States
    const [supplierType, setSupplierType] = useState("Hotel");
    const [serviceName, setServiceName] = useState("");
    const [dateFrom, setDateFrom] = useState("2026-01-01");
    const [dateTo, setDateTo] = useState("2026-12-31");
    const [category, setCategory] = useState("");
    const [country, setCountry] = useState("");
    const [region, setRegion] = useState("");
    const [destination, setDestination] = useState("");

    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Pagination States
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Call and log the GetListSupplierMappingPrice API
    const { 
        data: tariffData, 
        totalRecords: tariffTotalRecords, 
        isLoading: tariffLoading, 
        isError: tariffError 
    } = useGetListSupplierMappingPrice({
        strCompanyGUID: coData?.strCompanyGUID,
        strFilterSupplierName: serviceName || null,
        dtmFilterDateFrom: dateFrom || "2026-01-01",
        dtmFilterDateTo: dateTo || "2026-12-31",
        page: currentPage,
        pageSize: pageSize,
    });
    console.log(">>> GetListSupplierMappingPrice API Response:", { tariffData, tariffTotalRecords, tariffLoading, tariffError });

    // Filter & Search logic
    const filteredData = useMemo(() => {
        return MOCK_TARIFF_DATA.filter((item) => {
            // Filter by supplier type
            if (supplierType && item.supplierType !== supplierType) return false;
            // Filter by service/hotel name
            if (
                serviceName &&
                !item.hotelName.toLowerCase().includes(serviceName.toLowerCase()) &&
                !item.roomName.toLowerCase().includes(serviceName.toLowerCase())
            ) {
                return false;
            }
            // Filter by country
            if (country && item.country !== country) return false;
            // Filter by region
            if (region && item.region !== region) return false;
            // Filter by destination
            if (destination && item.destination !== destination) return false;

            return true;
        });
    }, [supplierType, serviceName, country, region, destination]);

    // Paginated Data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredData.slice(startIndex, startIndex + pageSize);
    }, [filteredData, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredData.length / pageSize) || 1;

    const handleReset = () => {
        setSupplierType("Hotel");
        setServiceName("");
        setDateFrom("2026-01-01");
        setDateTo("2026-12-31");
        setCategory("");
        setCountry("");
        setRegion("");
        setDestination("");
        setCurrentPage(1);
    };

    // Group hotels to compute rowSpan
    const hotelGroupSpans = useMemo(() => {
        const spans: Record<number, number> = {};
        let i = 0;
        while (i < paginatedData.length) {
            const currentHotelName = paginatedData[i].hotelName;
            let count = 1;
            let j = i + 1;
            while (j < paginatedData.length && paginatedData[j].hotelName === currentHotelName) {
                count++;
                j++;
            }
            spans[i] = count;
            i = j;
        }
        return spans;
    }, [paginatedData]);

    return (
        <div className="max-w-[1400px] mx-auto px-4 py-6 font-sans">
            {/* Title Header with Back Arrow */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => router.push(`${paths.content.agent}`)}
                    className="p-2 hover:bg-gray-150 rounded-full transition-colors cursor-pointer text-[#004b91]"
                >
                    <ArrowLeft size={22} className="stroke-[3]" />
                </button>
                <h1 className="text-xl font-bold uppercase text-[#004b91] tracking-tight">
                    {companyName}
                </h1>
            </div>

            {/* Filter Card Container */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    {/* Supplier Type */}
                    <div className="relative">
                        <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-medium text-gray-500">
                            supplier type
                        </label>
                        <select
                            value={supplierType}
                            onChange={(e) => setSupplierType(e.target.value)}
                            className="w-full h-11 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500 bg-white"
                        >
                            <option value="Hotel">Hotel</option>
                            <option value="Boat">Boat</option>
                            <option value="Flight">Flight</option>
                            <option value="Vehicle">Vehicle</option>
                        </select>
                    </div>

                    {/* Service Name */}
                    <div className="relative">
                        <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-medium text-gray-500">
                            Tên dịch vụ
                        </label>
                        <input
                            type="text"
                            value={serviceName}
                            onChange={(e) => setServiceName(e.target.value)}
                            placeholder="Nhập tên dịch vụ..."
                            className="w-full h-11 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 md:col-span-2">
                        <button
                            onClick={() => setCurrentPage(1)}
                            className="h-11 px-4 bg-[#004b91] hover:bg-[#003d76] text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                            <Filter size={16} />
                            Lọc
                        </button>

                        <button
                            onClick={handleReset}
                            className="h-11 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                            <RotateCcw size={16} />
                            Reset
                        </button>
                        <button
                            onClick={() => setShowAdvancedFilters((prev) => !prev)}
                            className="h-11 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                            <SlidersHorizontal size={16} className="text-[#004b91]" />

                            <ChevronDown
                                size={14}
                                className={`transition-transform duration-200 ${showAdvancedFilters ? "rotate-180" : ""}`}
                            />
                        </button>
                        <button
                            onClick={() => alert("Xuất Excel...")}
                            className="h-11 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 ml-auto shadow-sm transition-colors cursor-pointer"
                        >
                            <Download size={16} />
                            Xuất Excel
                        </button>
                    </div>
                </div>

                {showAdvancedFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4 pt-4 border-t border-gray-100 transition-all duration-300">
                        {/* Date Range */}
                        <div className="relative md:col-span-2 flex items-center border border-gray-300 rounded-lg px-3 h-11">
                            <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-medium text-gray-500">
                                Date from - Date to
                            </label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-1/2 text-sm focus:outline-none bg-transparent"
                            />
                            <span className="text-gray-400 mx-2">—</span>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-1/2 text-sm focus:outline-none bg-transparent"
                            />
                        </div>

                        {/* Category */}
                        <div className="relative">
                            <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-medium text-gray-500">
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full h-11 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500 bg-white"
                            >
                                <option value="">-- Chọn --</option>
                                <option value="Standard">Standard</option>
                                <option value="Superior">Superior</option>
                                <option value="Deluxe">Deluxe</option>
                                <option value="Suite">Suite</option>
                            </select>
                        </div>

                        {/* Country */}
                        <div className="relative">
                            <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-medium text-gray-500">
                                Chọn quốc gia
                            </label>
                            <select
                                value={country}
                                onChange={(e) => {
                                    setCountry(e.target.value);
                                    setRegion("");
                                    setDestination("");
                                }}
                                className="w-full h-11 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500 bg-white"
                            >
                                <option value="">-- Chọn --</option>
                                <option value="Vietnam">Việt Nam</option>
                            </select>
                        </div>

                        {/* Region */}
                        <div className="relative">
                            <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-medium text-gray-500">
                                Chọn Vùng miền
                            </label>
                            <select
                                value={region}
                                onChange={(e) => {
                                    setRegion(e.target.value);
                                    setDestination("");
                                }}
                                className="w-full h-11 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500 bg-white"
                            >
                                <option value="">-- Chọn --</option>
                                <option value="North">Miền Bắc</option>
                                <option value="South">Miền Nam</option>
                            </select>
                        </div>

                        {/* Destination */}
                        <div className="relative">
                            <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-medium text-gray-500">
                                Chọn Địa điểm
                            </label>
                            <select
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                className="w-full h-11 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500 bg-white"
                            >
                                <option value="">-- Chọn --</option>
                                {region === "North" && <option value="Hanoi">Hà Nội</option>}
                                {region === "South" && <option value="Ho Chi Minh">TP. HCM</option>}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Tariff Grid/Table Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="bg-blue-50/70 border-b border-gray-200">
                                <th className="px-4 py-3 font-semibold text-gray-600 text-center w-12">STT</th>
                                <th className="px-4 py-3 font-semibold text-gray-600 w-1/4">Hotel name</th>
                                <th className="px-4 py-3 font-semibold text-gray-600 w-1/4">Room name</th>
                                <th className="px-4 py-3 font-semibold text-gray-600 text-center">Date from</th>
                                <th className="px-4 py-3 font-semibold text-gray-600 text-center">Date to</th>
                                <th className="px-4 py-3 font-semibold text-gray-600 text-right">Price</th>
                                <th className="px-4 py-3 font-semibold text-gray-600 text-right">Price SGL</th>
                                <th className="px-4 py-3 font-semibold text-gray-600 text-right">Price Dbl</th>
                                <th className="px-4 py-3 font-semibold text-gray-600 text-right">Price Child</th>
                                <th className="px-4 py-3 font-semibold text-gray-600 text-center">Remark</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-[13px] text-gray-700">
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="py-12 text-center text-gray-400 font-medium bg-gray-50/50">
                                        Không tìm thấy dữ liệu tariff tương thích.
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((row, idx) => {
                                    const span = hotelGroupSpans[idx];

                                    return (
                                        <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                                            <td className="px-4 py-4 text-center text-gray-400 font-medium border-r border-gray-100">
                                                {row.stt}
                                            </td>

                                            {/* Hotel name cell spans across rooms belonging to the same hotel */}
                                            {span !== undefined ? (
                                                <td
                                                    rowSpan={span}
                                                    className="px-4 py-4 font-semibold text-gray-900 border-r border-gray-100 align-top bg-white"
                                                >
                                                    <div className="space-y-1">
                                                        <span className="text-[#004b91] uppercase">{row.hotelName}</span>
                                                        <p className="text-gray-500 font-normal text-xs">{row.hotelAddress}</p>
                                                        {row.hotelWebsite && (
                                                            <a
                                                                href={row.hotelWebsite}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-blue-500 text-xs font-normal hover:underline block"
                                                            >
                                                                {row.hotelWebsite}
                                                            </a>
                                                        )}
                                                    </div>
                                                </td>
                                            ) : null}

                                            <td className="px-4 py-4 border-r border-gray-100 font-medium">
                                                {row.roomName}
                                            </td>
                                            <td className="px-4 py-4 text-center border-r border-gray-100 text-gray-500">
                                                {row.dateFrom}
                                            </td>
                                            <td className="px-4 py-4 text-center border-r border-gray-100 text-gray-500">
                                                {row.dateTo}
                                            </td>
                                            <td className="px-4 py-4 text-right font-semibold border-r border-gray-100 text-blue-600">
                                                {row.price}
                                            </td>
                                            <td className="px-4 py-4 text-right font-medium border-r border-gray-100">
                                                {row.priceSgl}
                                            </td>
                                            <td className="px-4 py-4 text-right font-medium border-r border-gray-100 text-gray-600">
                                                {row.priceDbl}
                                            </td>
                                            <td className="px-4 py-4 text-right font-medium border-r border-gray-100 text-gray-600">
                                                {row.priceChild}
                                            </td>
                                            <td className="px-4 py-4 text-center text-gray-400">
                                                {row.remark || "--"}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Bar */}
            {filteredData.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalRecords={filteredData.length}
                    recordsPerPage={pageSize}
                    onPageChange={setCurrentPage}
                    onRecordsPerPageChange={setPageSize}
                    className="mt-6"
                />
            )}
        </div>
    );
};

export default TariffView;