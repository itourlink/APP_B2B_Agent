import { useTranslate } from "@/locales";
import { paths } from "@/routes/paths";
import { getUrlImage } from "@/utils/format-image";
import { fCurrency } from "@/utils/format-number";
import { isValidValue } from "@/utils/utilts";
import { Clock, Flag, MapPin } from "lucide-react";
import imgDefault from "@/assets/images/default-image.jpg"
import { useNavigate } from "react-router-dom";
import { useListCurrency } from "@/components/currency/useListCurrency";

export const TourCard = ({ tour }: any) => {
    const { t } = useTranslate("tour");
    const company = new URLSearchParams(location.search).get("company") || "";
    const navigate = useNavigate()
    const { selectedCurrency } = useListCurrency()

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">

            {/* IMAGE */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={
                        isValidValue(tour?.strTourImageUrl) !== "---" &&
                            typeof tour?.strTourImageUrl === "string"
                            ? getUrlImage(tour.strTourImageUrl)
                            : imgDefault
                    }
                    alt={isValidValue(tour?.strTourName)}
                    onError={(e) => {
                        e.currentTarget.src = imgDefault;
                    }}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
            </div>

            <div className="p-4 flex flex-col flex-grow">

                {/* TITLE */}
                <h3 className="text-[#1a4a8d] font-bold text-lg leading-tight uppercase mb-4 h-14 line-clamp-2">
                    {isValidValue(tour?.strTourName)}
                </h3>

                <div className="space-y-2 mb-4 text-sm text-gray-600">

                    {/* OWNER */}
                    <div className="flex items-center gap-2">
                        <Flag size={14} className="text-gray-400" />

                        <span className="truncate">
                            {t("by")}: {isValidValue(tour?.strOwnerCompanyName)}
                        </span>
                    </div>

                    {/* DURATION */}
                    <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-400" />

                        <span>
                            {t("duration")}:{" "}
                            {Number(isValidValue(tour?.intNoOfDay))} {t("day")} /{" "}
                            {Number(isValidValue(tour?.intNoOfDay)) - 1} {t("night")}
                        </span>
                    </div>

                    {/* DESTINATION */}
                    <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-gray-400 mt-1 shrink-0" />

                        <span className="line-clamp-2 leading-snug">
                            {t("destinations")}:{" "}
                            {isValidValue(tour?.strListTourDestinationName)}
                        </span>
                    </div>
                </div>

                {/* TYPE */}
                <div className="mb-4">
                    <span className="bg-[#e6f0ff] text-[#3b82f6] text-xs font-medium px-3 py-1 rounded-full">
                        {tour?.strLangCode === "CATEID_SETTOUR"
                            ? t("dailyTour")
                            : t("package")}
                    </span>
                </div>

                {/* PRICE + BUTTON */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">

                    <div>
                        <p className="text-xs text-gray-500">
                            {t("priceFrom")}
                        </p>

                        <p className="text-[#2563eb] font-bold text-xl">
                            {fCurrency(
                                tour?.dblPriceFrom,
                                selectedCurrency?.label
                            )}
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            const url = `${paths.shop.tour.detail}?company=${company}`;

                            navigate(url, {
                                state: {
                                    item: tour,
                                },
                            });
                        }}
                        className="cursor-pointer text-[#2566b0] border border-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    >
                        {t("viewDetails")}
                    </button>
                </div>
            </div>
        </div >
    );
};