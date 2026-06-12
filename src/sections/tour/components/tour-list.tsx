import { useListTour } from '@/hooks/actions/useTour';
import { useTranslate } from '@/locales';
import { useRouter } from '@/routes/hooks/use-router';
import { paths } from '@/routes/paths';
import { getUrlImage } from '@/utils/format-image';
import { Flag, Clock, MapPin, LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';
import imgDefault from "@/assets/images/default-image.jpg"
import { useListCurrency } from '@/components/currency/useListCurrency';
import { fCurrency } from '@/utils/format-number';

const TourList = () => {
    const { t } = useTranslate("tour")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const [filters] = useState({
        page: 1,
        pageSize: 15,
    });
    const { tourData, tourLoading, tourError } = useListTour(filters);

    if (tourLoading) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <TourCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    if (tourError) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500 text-sm">
                    {t("tourLoadingError")}
                </p>
            </div>
        );
    }

    if (!tourData || tourData.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500 text-sm">
                    {t("noTours")}
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">
                    {t("featuredTours")}
                </h2>

                <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg border border-gray-200">
                    <span className="text-[12px] text-gray-500 ml-2">
                        {t("displayMode")}:
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
            {tourLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[...Array(8)].map((_, i) => (
                        <TourCardSkeleton key={i} />
                    ))}
                </div>
            )}
            {tourError && <TourError />}

            {!tourLoading && !tourError && (
                <div
                    className={
                        viewMode === "grid"
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                            : "flex flex-col gap-4"
                    }
                >
                    {tourData?.map((tour: any) => (
                        <TourItem
                            key={tour.strTourGUID}
                            tour={tour}
                            viewMode={viewMode}
                        />
                    ))}
                </div>
            )}

        </div>
    );
};

export default TourList;

const TourCardSkeleton = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm animate-pulse">
            <div className="h-48 bg-gray-200" />

            <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />

                <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                </div>

                <div className="h-6 bg-gray-200 rounded-full w-24 mb-4" />

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                        <div className="h-3 bg-gray-200 rounded w-12 mb-2" />
                        <div className="h-5 bg-gray-200 rounded w-20" />
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-24" />
                </div>
            </div>
        </div>
    );
};

const TourError = () => {
    const { t } = useTranslate("tour")
    return (
        <div className="text-center py-20 text-red-500">
            {t("tourListLoadError")}
        </div>
    )
};


type TourItemProps = {
    tour: any;
    viewMode: "grid" | "list";
};

const TourItem = ({ tour, viewMode }: TourItemProps) => {
    const { t } = useTranslate("tour");
    const router = useRouter();
    const { selectedCurrency } = useListCurrency()

    const isGrid = viewMode === "grid";

    return (
        <div
            className={
                isGrid
                    ? "bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full"
                    : "bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex h-56 group"
            }
        >
            {/* Image */}
            <div
                className={
                    isGrid
                        ? "relative h-48 overflow-hidden"
                        : "relative w-80 overflow-hidden shrink-0"
                }
            >
                <img
                    src={
                        tour?.strTourImageUrl === "" ||
                            (typeof tour?.strTourImageUrl === "object" &&
                                Object.keys(tour?.strTourImageUrl).length === 0)
                            ? imgDefault
                            : getUrlImage(tour?.strTourImageUrl)
                    }
                    alt={tour?.strTourName}
                    className="w-full h-full object-cover hover:scale-105 transition-all duration-500"
                />
            </div>

            {/* Content */}
            <div
                className={
                    isGrid
                        ? "p-4 flex flex-col flex-grow"
                        : "p-5 flex flex-col flex-grow justify-between min-w-0"
                }
            >
                <div>
                    {isGrid ? (
                        <h3 className="text-[#1a4a8d] font-bold text-lg leading-tight uppercase mb-4 h-14 line-clamp-2">
                            {tour?.strTourName}
                        </h3>
                    ) : (
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <h3 className="text-gray-900 font-bold text-lg leading-tight uppercase line-clamp-2">
                                {tour?.strTourName}
                            </h3>

                            <span className="shrink-0 bg-[#e6f0ff] text-[#2563eb] text-xs font-semibold px-3 py-1 rounded-full">
                                {tour?.strLangCode === "CATEID_SETTOUR"
                                    ? t("dailyTour")
                                    : t("package")}
                            </span>
                        </div>
                    )}

                    <div
                        className={
                            isGrid
                                ? "space-y-2 mb-4 text-sm text-gray-600"
                                : "space-y-2.5 text-[14px] text-gray-600"
                        }
                    >
                        <div className="flex items-center gap-2">
                            <Flag
                                size={isGrid ? 14 : 16}
                                className="text-gray-400 shrink-0"
                            />
                            <span className="truncate">
                                {t("by")}: {tour?.strOwnerCompanyName || "--"}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Clock
                                size={isGrid ? 14 : 16}
                                className="text-gray-400 shrink-0"
                            />
                            <span>
                                {t("duration")}: {tour?.intNoOfDay} {t("day")} /
                                {" "}
                                {Number(tour?.intNoOfDay) - 1} {t("night")}
                            </span>
                        </div>

                        <div className="flex items-start gap-2">
                            <MapPin
                                size={isGrid ? 14 : 16}
                                className="text-gray-400 mt-0.5 shrink-0"
                            />
                            <span className="line-clamp-2 leading-relaxed">
                                {t("destinations")}:
                                {" "}
                                {tour?.strListTourDestinationName || "--"}
                            </span>
                        </div>
                    </div>

                    {isGrid && (
                        <div className="mb-4">
                            <span className="bg-[#e6f0ff] text-[#3b82f6] text-xs font-medium px-3 py-1 rounded-full">
                                {tour?.strLangCode === "CATEID_SETTOUR"
                                    ? t("dailyTour")
                                    : t("package")}
                            </span>
                        </div>
                    )}
                </div>

                <div
                    className={
                        isGrid
                            ? "mt-auto pt-4 border-t border-gray-100 flex items-center justify-between"
                            : "flex items-end justify-between pt-4 border-t border-gray-50"
                    }
                >
                    <div>
                        <p className="text-xs text-gray-500">
                            {t("priceFrom")}
                        </p>

                        <p
                            className={
                                isGrid
                                    ? "text-[#2563eb] font-bold text-xl"
                                    : "text-[#2563eb] font-bold text-2xl leading-none"
                            }
                        >

                            {fCurrency(
                                tour?.dblPriceFrom,
                                selectedCurrency?.strCurrencyCode
                            )}

                        </p>
                    </div>

                    <button
                        onClick={() =>
                            router.replaceParams(paths.shop.tour.detail, {
                                item: tour,
                            })
                        }
                        className={
                            isGrid
                                ? "cursor-pointer text-[#2566b0] border border-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                : "cursor-pointer bg-[#2563eb] text-white hover:bg-[#1d4ed8] px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                        }
                    >
                        {t("viewDetails")}
                    </button>
                </div>
            </div>
        </div>
    );
};