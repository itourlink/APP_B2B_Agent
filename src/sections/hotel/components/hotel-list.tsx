import { useListHotel } from '@/hooks/actions/useHotel';
import { useRouter } from '@/routes/hooks/use-router';
import { paths } from '@/routes/paths';
import { getUrlImage } from '@/utils/format-image';
import { formatPrice } from '@/utils/format-number';
import { isValidValue } from '@/utils/utilts';
import { Building2, MapPin, Star, LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import imgDefault from "@/assets/images/default-image.jpg"

const HotelList = () => {
    const [filters] = useState({
        page: 1,
        pageSize: 15,
        strSupplierGUID: null,
        tblsReturn: "[0]",
    });
    const { t } = useTranslation("hotel")
    const { hotelData, hotelLoading, hotelError } =
        useListHotel(filters);

    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">
                    {t("featuredHotels")}
                </h2>

                <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg border border-gray-200">
                    <span className="text-[12px] text-gray-500 ml-2">
                        {t("displayMode")}
                    </span>

                    <div className="flex gap-1">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`cursor-pointer p-1.5 rounded-md transition-all ${viewMode === "grid"
                                ? "bg-[#2566b0] text-white shadow-sm"
                                : "text-gray-400 hover:bg-gray-200"
                                }`}
                        >
                            <LayoutGrid size={16} />
                        </button>

                        <button
                            onClick={() => setViewMode("list")}
                            className={`cursor-pointer p-1.5 rounded-md transition-all ${viewMode === "list"
                                ? "bg-[#2566b0] text-white shadow-sm"
                                : "text-gray-400 hover:bg-gray-200"
                                }`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {hotelLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[...Array(8)].map((_, i) => (
                        <HotelCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {hotelError && <HotelError />}

            {!hotelLoading && !hotelError && (
                <div
                    className={
                        viewMode === "grid"
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                            : "flex flex-col gap-4"
                    }
                >
                    {hotelData?.map((hotel: any) => (
                        <HotelItem
                            key={isValidValue(hotel?.strSupplierGUID)}
                            hotel={hotel}
                            viewMode={viewMode}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HotelList;

const HotelCardSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden p-4 animate-pulse">
        <div className="h-44 bg-gray-200 rounded mb-4" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="h-3 bg-gray-200 rounded w-full mb-2" />
        <div className="h-3 bg-gray-200 rounded w-5/6 mb-4" />

        <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
        </div>
    </div>
);

const HotelError = () => {
    const { t } = useTranslation("hotel");

    return (
        <div className="text-center py-20 text-red-500">
            {t("loadHotelListFailed")}
        </div>
    );
};


type HotelItemProps = {
    hotel: any;
    viewMode: "grid" | "list";
};

const HotelItem = ({ hotel, viewMode }: HotelItemProps) => {
    const router = useRouter();
    const { t } = useTranslation("hotel");

    const isGrid = viewMode === "grid";

    const imageSrc =
        hotel?.strSupplierImage === "" ||
            (typeof hotel?.strSupplierImage === "object" &&
                hotel?.strSupplierImage !== null &&
                Object.keys(hotel?.strSupplierImage).length === 0)
            ? imgDefault
            : getUrlImage(isValidValue(hotel?.strSupplierImage));

    return (
        <div
            className={
                isGrid
                    ? "bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group"
                    : "bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex h-48 group"
            }
        >
            {/* Image */}
            <div
                className={
                    isGrid
                        ? "relative h-44 overflow-hidden"
                        : "relative w-72 overflow-hidden shrink-0"
                }
            >
                <img
                    src={imageSrc}
                    alt={isValidValue(hotel?.strSupplierName)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
            </div>

            {/* Content */}
            <div
                className={
                    isGrid
                        ? "p-4 flex flex-col flex-grow"
                        : "p-5 flex flex-col flex-grow justify-between"
                }
            >
                <div>
                    {isGrid ? (
                        <h3 className="text-gray-800 font-bold text-[15px] leading-tight uppercase mb-4 h-12 line-clamp-2">
                            {isValidValue(hotel?.strSupplierName)}
                        </h3>
                    ) : (
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-gray-800 font-bold text-lg leading-tight uppercase line-clamp-1">
                                {isValidValue(hotel?.strSupplierName)}
                            </h3>

                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        className={
                                            i < Number(isValidValue(hotel?.intEasiaCateID))
                                                ? "fill-orange-400 text-orange-400"
                                                : "text-gray-300"
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div
                        className={
                            isGrid
                                ? "space-y-2.5 mb-4 text-[13px] text-gray-600"
                                : "space-y-2 text-[14px] text-gray-600"
                        }
                    >
                        <div className="flex items-center gap-2">
                            <Building2
                                size={isGrid ? 14 : 16}
                                className="text-gray-400 shrink-0"
                            />

                            <span>{t("hotel")}</span>

                            {isGrid && (
                                <div className="flex items-center ml-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={
                                                i < Number(isValidValue(hotel?.intEasiaCateID))
                                                    ? "fill-orange-400 text-orange-400"
                                                    : "text-gray-300"
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-start gap-2">
                            <MapPin
                                size={isGrid ? 14 : 16}
                                className="text-gray-400 mt-0.5 shrink-0"
                            />

                            <span
                                className={
                                    isGrid
                                        ? "line-clamp-3 leading-relaxed"
                                        : "line-clamp-2 leading-relaxed"
                                }
                            >
                                {isValidValue(hotel?.strSupplierAddr)}
                            </span>
                        </div>
                    </div>

                    {isGrid && (
                        <div className="mb-4 relative">
                            <div
                                className="absolute inset-0 flex items-center"
                                aria-hidden="true"
                            >
                                <div className="w-full border-t border-gray-100" />
                            </div>

                            <div className="relative flex justify-center">
                                <span className="bg-gray-50 px-3 text-[11px] font-bold text-gray-900 italic tracking-wider">
                                    {t("markupDiscount")}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <div
                    className={
                        isGrid
                            ? "mt-auto flex items-end justify-between"
                            : "flex items-end justify-between pt-4 border-t border-gray-50"
                    }
                >
                    <div>
                        <p className="text-[11px] text-gray-500 mb-0.5">
                            {t("priceFrom")}
                        </p>

                        <p
                            className={
                                isGrid
                                    ? "text-[#2563eb] font-bold text-xl leading-none"
                                    : "text-[#2563eb] font-bold text-2xl leading-none"
                            }
                        >
                            {formatPrice(isValidValue(hotel?.dblPriceFrom))}
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            router.replaceParams(paths.shop.hotel.detail, {
                                item: hotel,
                            })
                        }
                        className={
                            isGrid
                                ? "cursor-pointer text-[#2563eb] border border-blue-200 hover:border-[#2563eb] hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                                : "cursor-pointer bg-[#2563eb] text-white hover:bg-[#1d4ed8] px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                        }
                    >
                        {t("viewDetail")}
                    </button>
                </div>
            </div>
        </div>
    );
};