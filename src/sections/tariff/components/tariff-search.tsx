import React, { useState, useRef, useEffect, useMemo } from "react";
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
import { useListCity } from "@/hooks/actions/useCity";
import { useListSQLData } from "@/hooks/actions/useSql";
import { twMerge } from "tailwind-merge";
import { useTranslate } from "@/locales";

type Option = {
    label: string;
    value: string;
    flag?: string;
};

interface SearchSelectProps {
    value: string;
    onChange: (val: string) => void;
    options: Option[];
    placeholder?: string;
    disabled?: boolean;
    loading?: boolean;
}

const getFlagClass = (flag?: string) => {
    if (!flag) return "";
    return flag.replaceAll("flag-icon", "fi");
};

const SearchSelect = ({
    value,
    onChange,
    options,
    placeholder = "-- Chọn --",
    disabled = false,
    loading = false,
}: SearchSelectProps) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (disabled && open) setOpen(false);
    }, [disabled, open]);

    useEffect(() => {
        if (!open) setSearch("");
    }, [open]);

    const selectedOption = options.find((opt) => opt.value === value);
    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-1 w-full" ref={ref}>
            <div className="relative w-full">
                <div
                    className={twMerge(
                        "flex items-center justify-between px-3 h-11 rounded-lg border border-gray-300 text-sm focus-within:border-blue-500",
                        disabled
                            ? "bg-gray-100 cursor-not-allowed opacity-70"
                            : "cursor-pointer bg-white"
                    )}
                    onClick={() => {
                        if (disabled) return;
                        setOpen(!open);
                    }}
                >
                    <div className="flex items-center gap-2 overflow-hidden">
                        {loading ? (
                            <span className="text-gray-400">Loading...</span>
                        ) : selectedOption ? (
                            <div className="flex items-center gap-2 truncate">
                                {selectedOption.flag && (
                                    <span
                                        className={twMerge(
                                            getFlagClass(selectedOption.flag),
                                            "rounded-sm w-5 h-4.5 bg-cover bg-center inline-block flex-shrink-0"
                                        )}
                                    />
                                )}
                                <span className="text-gray-700 truncate">{selectedOption.label}</span>
                            </div>
                        ) : (
                            <span className="text-gray-400">{placeholder}</span>
                        )}
                    </div>
                    <ChevronDown
                        size={16}
                        className={twMerge("text-gray-500 transition-transform duration-200 flex-shrink-0", open && !disabled && "rotate-180")}
                    />
                </div>

                {open && !disabled && (
                    <div className="absolute top-full left-0 w-full mt-1 z-[99] bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                        <div className="p-2 border-b border-gray-100">
                            <input
                                autoFocus
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Tìm kiếm..."
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="max-h-52 overflow-auto">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt) => (
                                    <div
                                        key={opt.value}
                                        className={twMerge(
                                            "px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 flex items-center gap-2",
                                            opt.value === value && "bg-blue-50/50 font-medium text-[#004b91]"
                                        )}
                                        onClick={() => {
                                            onChange(opt.value);
                                            setOpen(false);
                                            setSearch("");
                                        }}
                                    >
                                        {opt.flag && (
                                            <span
                                                className={twMerge(
                                                    getFlagClass(opt.flag),
                                                    "rounded-sm w-5 h-4.5 bg-cover bg-center inline-block flex-shrink-0"
                                                )}
                                            />
                                        )}
                                        <span>{opt.label}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="px-3 py-2 text-sm text-gray-400">
                                    Không tìm thấy
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

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
    onExport: () => void;
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
    onExport,
    isLoading = false
}: TariffSearchProps) => {
    const { t } = useTranslate("tariff");
    useTranslate("genericFilter");

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

    // country 
    const { ctData: countryData = [], ctLoading: isCountryLoading } = useListCity({
        strTableName: "MC02",
        strFeildSelect:
            "MC02_CountryCode AS code, MC02_CountryGUID AS intID, MC02_CountryName AS strName, MC02_CountryGUID AS id, MC02_CountryName AS text, MC02_CountryName AS strCountryName, MC02_CountryFlagIcon strCountryFlagIcon",
        strWhere: "WHERE (IsActive=1) ORDER BY MC02_CountryName ASC",
    });

    // region
    const { ctData: regionData = [], ctLoading: isRegionLoading } = useListSQLData({
        strTableName: "MC03",
        strFeildSelect:
            "MC03_RegionCode AS strRegionCode, MC03_RegionName AS strRegionName",
        strWhere: country
            ? `WHERE IsActive=1
                AND MC03_RegionCode LIKE '%${country}%'
                AND MC03.IsActive=1
                ORDER BY MC03_RegionName`
            : "",
    });

    // city
    const { ctData: cityData = [], ctLoading: isCityLoading } = useListSQLData({
        strTableName: "MC04",
        strFeildSelect:
            "MC04_CityCode AS strCityCode, MC04_CityName AS strCityName",
        strWhere: region
            ? `WHERE IsActive=1
            AND MC04_CityCode LIKE '%${region}%'
            AND MC04.IsActive=1
            ORDER BY MC04_CityName`
            : "",
    });

    const countryOptions = useMemo<Option[]>(
        () =>
            (countryData || []).map((item: any) => ({
                label: item.strName || "",
                value: item.code || "",
                flag: item.strCountryFlagIcon || "",
            })),
        [countryData]
    );

    const regionOptions = useMemo<Option[]>(
        () =>
            (regionData || []).map((item: any) => ({
                label: item.strRegionName || "",
                value: item.strRegionCode || "",
            })),
        [regionData]
    );

    const cityOptions = useMemo<Option[]>(
        () =>
            (cityData || []).map((item: any) => ({
                label: item.strCityName || "",
                value: item.strCityCode || "",
            })),
        [cityData]
    );


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
                        <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-medium text-gray-500 capitalize">
                            {t("supplierType")}
                        </label>
                        <select
                            value={supplierType}
                            onChange={(e) => setSupplierType(e.target.value)}
                            className="w-full h-11 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500 bg-white"
                        >
                            <option value="Hotel">{t("hotel")}</option>
                            <option value="Transport">{t("transport")}</option>
                            <option value="Excursion">{t("excursion")}</option>
                        </select>
                    </div>

                    {/* Service Name */}
                    <div className="relative">
                        <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-medium text-gray-500">
                            {t("serviceName")}
                        </label>
                        <input
                            type="text"
                            value={serviceName}
                            onChange={(e) => setServiceName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t("enterServiceName")}
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
                            {t("filter")}
                        </button>

                        <button
                            type="button"
                            onClick={onReset}
                            className="h-11 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                            <RotateCcw size={16} />
                            {t("reset")}
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
                            onClick={onExport}
                            className="h-11 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 ml-auto shadow-sm transition-colors cursor-pointer"
                        >
                            <Download size={16} />
                            {t("exportExcel")}
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
                                    {t("dateFromDateTo")} <span className="text-red-500 font-bold">*</span>
                                </label>
                                <span className="text-gray-700">
                                    {dateFrom && dateTo ? `${dateFrom} — ${dateTo}` : t("selectDateRange")}
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
                        {supplierType === "Hotel" && (
                            <div className="relative">
                                <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-medium text-gray-500">
                                    {t("category")}
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full h-11 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500 bg-white"
                                >
                                    <option value="">--- Select ---</option>
                                    <option value="1">★</option>
                                    <option value="2">★★</option>
                                    <option value="3">★★★</option>
                                    <option value="4">★★★★</option>
                                    <option value="5">★★★★★</option>
                                    <option value="6">★★★★★★</option>
                                </select>
                            </div>
                        )}

                        {/* Country */}
                        <div className="relative">
                            <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-medium text-gray-500 z-10">
                                {t("selectCountry")}
                            </label>
                            <SearchSelect
                                value={country}
                                onChange={(val) => {
                                    setCountry(val);
                                    setRegion("");
                                    setDestination("");
                                }}
                                options={countryOptions}
                                loading={isCountryLoading}
                                placeholder={t("selectCountry")}
                            />
                        </div>

                        {/* Region */}
                        <div className="relative">
                            <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-medium text-gray-500 z-10">
                                {t("selectRegion")}
                            </label>
                            <SearchSelect
                                value={region}
                                onChange={(val) => {
                                    setRegion(val);
                                    setDestination("");
                                }}
                                options={regionOptions}
                                loading={isRegionLoading}
                                disabled={!country}
                                placeholder={t("selectRegion")}
                            />
                        </div>

                        {/* Destination */}
                        <div className="relative">
                            <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-medium text-gray-500 z-10">
                                {t("selectDestination")}
                            </label>
                            <SearchSelect
                                value={destination}
                                onChange={(val) => setDestination(val)}
                                options={cityOptions}
                                loading={isCityLoading}
                                disabled={!region}
                                placeholder={t("selectDestination")}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TariffSearch;
