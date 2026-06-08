import { useTranslate } from "@/locales";
import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";
import { getUrlImage } from "@/utils/format-image";
import { formatPrice } from "@/utils/format-number";
import { Clock, Flag, MapPin } from "lucide-react";

export const TourCard = ({ tour }: any) => {
    const { t } = useTranslate("tour")
    const router = useRouter();

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={getUrlImage(tour?.strTourImageUrl)}
                    alt={tour?.strTourName}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-[#1a4a8d] font-bold text-lg leading-tight uppercase mb-4 h-14 line-clamp-2">
                    {tour?.strTourName}
                </h3>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Flag size={14} className="text-gray-400" />
                        <span className="truncate">{t("by")}: {tour?.strOwnerCompanyName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-400" />
                        <span>{t("duration")}: {tour?.intNoOfDay} {t("day")} / {Number(tour?.intNoOfDay) - 1} {t("night")}</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-gray-400 mt-1 shrink-0" />
                        <span className="line-clamp-2 leading-snug">
                            {t("destinations")}: {tour?.strListTourDestinationName}
                        </span>
                    </div>
                </div>

                <div className="mb-4">
                    <span className="bg-[#e6f0ff] text-[#3b82f6] text-xs font-medium px-3 py-1 rounded-full">
                        {tour?.strLangCode === "CATEID_SETTOUR" ? t("dailyTour") : t("package")}
                    </span>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500">{t("priceFrom")}</p>
                        <p className="text-[#2563eb] font-bold text-xl">
                            {formatPrice(tour?.dblPriceFrom)}
                        </p>
                    </div>
                    <button
                        onClick={() => router.replaceParams(paths.shop.tour.detail, { item: tour })}
                        className="cursor-pointer text-[#2566b0] border border-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    >
                        {t("viewDetails")}
                    </button>
                </div>
            </div>
        </div>
    );
};
