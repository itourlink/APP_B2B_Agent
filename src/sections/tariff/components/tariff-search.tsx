import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";
import DateRangePopup from "@/components/generic-filter/date-range-popup";
import { useListCompanyOwner } from "@/hooks/actions/useCompanyOwner";
import {
    ArrowLeft,
    Filter,
    RotateCcw,
    SlidersHorizontal,
    ChevronDown,
    Download
} from "lucide-react";

interface TariffSearchProps {
    serviceName: string;
    setServiceName: (val: string) => void;
    dateFrom: string;
    setDateFrom: (val: string) => void;
    dateTo: string;
    setDateTo: (val: string) => void;

    // Advanced Filters
    supplierType: string;
    setSupplierType: (val: string) => void;
    category: string;
    setCategory: (val: string) => void;
    country: string;
    setCountry: (val: string) => void;
    region: string;
    setRegion: (val: string) => void;
    destination: string;
    setDestination: (val: string) => void;

    onSearch: () => void;
    onReset: () => void;
    isLoading?: boolean;
}

const TariffSearch = ({
    serviceName,
    setServiceName,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    supplierType,
    setSupplierType,
    category,
    setCategory,
    country,
    setCountry,
    region,
    setRegion,
    destination,
    setDestination,
    onSearch,
    onReset,
    isLoading = false
}: TariffSearchProps) => {
    const router = useRouter();
    const { coData } = useListCompanyOwner();
    const companyName = coData?.strCompanyName;
    //search enter 
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onSearch();
        }
    };

    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const datePickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setShowDatePicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="w-full">
            {/* Title Header with Back Arrow */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => router.push(`${paths.content.agent}`)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-[#004b91]"
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
                            <option value="Boat">Transport</option>
                            <option value="Flight">Excursion</option>
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
                            onKeyDown={handleKeyDown}
                            placeholder="Nhập tên dịch vụ..."
                            className="w-full h-11 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 md:col-span-2">
                        <button
                            type="button"
                            onClick={onSearch}
                            className={`h-11 px-4 bg-[#004b91] hover:bg-[#003d76] text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            ) : (
                                <Filter size={16} />
                            )}
                            Lọc
                        </button>

                        <button
                            type="button"
                            onClick={onReset}
                            className="h-11 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                            <RotateCcw size={16} />
                            Reset
                        </button>
                        <button
                            type="button"
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
                            type="button"
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
                        <div className="relative md:col-span-2" ref={datePickerRef}>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowDatePicker((prev) => !prev);
                                }}
                                className="w-full h-11 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none flex items-center justify-between bg-white text-left cursor-pointer relative"
                            >
                                <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-medium text-gray-500">
                                    Date from - Date to <span className="text-red-500 font-bold">*</span>
                                </label>
                                <span className="text-gray-700">
                                    {dateFrom && dateTo ? `${dateFrom} — ${dateTo}` : "Chọn khoảng ngày..."}
                                </span>
                            </button>

                            {showDatePicker && (
                                <div
                                    className="absolute top-12 left-0 z-50"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <DateRangePopup
                                        isOpen={showDatePicker}
                                        value={{
                                            startDate: dateFrom ? new Date(dateFrom) : null,
                                            endDate: dateTo ? new Date(dateTo) : null
                                        }}
                                        minDate={null} // Cho phép chọn mọi ngày (bao gồm cả ngày quá khứ)
                                        onApply={(val) => {
                                            if (val.startDate) {
                                                const formattedStart = val.startDate.toLocaleDateString("sv-SE"); //sv-SE format: yyyy-MM-dd
                                                setDateFrom(formattedStart);
                                            }
                                            if (val.endDate) {
                                                const formattedEnd = val.endDate.toLocaleDateString("sv-SE");
                                                setDateTo(formattedEnd);
                                            }
                                            setShowDatePicker(false);
                                        }}
                                    />
                                </div>
                            )}
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
        </div>
    );
};

export default TariffSearch;
