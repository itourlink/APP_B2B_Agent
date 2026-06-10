import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";
import { getUrlImage } from "@/utils/format-image";
import { formatPrice, truncateText } from "@/utils/format-number";
import { isValidValue } from "@/utils/utilts";
import { Clock, Flag, MapPin, Star } from "lucide-react";
import imgDefault from "@/assets/images/default-image.jpg";
import { useTranslate } from "@/locales";

export const TourListCard = ({ tour }: any) => {
    const router = useRouter();
    const { t } = useTranslate("search");

    const starList = String(isValidValue(tour?.strListEasiaCateID || ""))
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={
                        tour?.strTourImageUrl === "" ||
                        (typeof tour?.strTourImageUrl === "object" &&
                            Object.keys(tour?.strTourImageUrl).length === 0)
                            ? imgDefault
                            : getUrlImage(String(isValidValue(tour?.strTourImageUrl)))
                    }
                    alt={String(isValidValue(tour?.strTourName))}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />

                {starList.length > 0 && (
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        {starList.map((star, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-1 bg-white/95 px-2 py-1 rounded-full shadow border border-yellow-200"
                            >
                                <div className="flex items-center">
                                    {Array.from({ length: Number(star) }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={12}
                                            className="text-yellow-500 fill-yellow-500"
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-[#1a4a8d] font-bold text-lg leading-tight uppercase mb-4 h-14 line-clamp-2">
                    {truncateText(String(isValidValue(tour?.strTourName)), 40)}
                </h3>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Flag size={14} className="text-gray-400" />

                        <span className="truncate">
                            {t("by")}{" "}
                            {String(isValidValue(tour?.strOwnerCompanyName))}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-400" />

                        <span>
                            {t("duration")}{" "}
                            {String(isValidValue(tour?.intNoOfDay))} {t("days")} -{" "}
                            {Number(isValidValue(tour?.intNoOfDay) - 1)} {t("nights")}
                        </span>
                    </div>

                    <div className="flex items-start gap-2">
                        <MapPin
                            size={14}
                            className="text-gray-400 mt-1 shrink-0"
                        />

                        <span className="line-clamp-2 leading-snug">
                            {t("destinations")}{" "}
                            {String(isValidValue(tour?.strListTourDestinationName))}
                        </span>
                    </div>
                </div>

                <div className="relative flex justify-center mb-3">
                    <span className="px-3 py-1 text-[11px] font-bold text-gray-900 italic tracking-wider w-full text-center bg-gray-100">
                        {t("increaseDecreasePrice")}
                    </span>
                </div>

                <div className="mb-4">
                    <span className="bg-[#e6f0ff] text-[#3b82f6] text-xs font-medium px-3 py-1 rounded-full">
                        {String(isValidValue(tour?.strLangCode)) === "CATEID_SETTOUR"
                            ? t("dailyTour")
                            : t("packageTour")}{" "}
                        - {String(isValidValue(tour?.strProductName))}
                    </span>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500">{t("priceFrom")}</p>

                        <p className="text-[#2563eb] font-bold text-xl">
                            {formatPrice(Number(isValidValue(tour?.dblPriceFrom)))}
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            router.replaceParams(paths.shop.tour.detail, {
                                item: tour,
                            })
                        }
                        className="cursor-pointer text-[#2566b0] border border-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    >
                        {t("viewDetails")}
                    </button>
                </div>
            </div>
        </div>
    );
};
