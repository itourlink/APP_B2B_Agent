import { useTranslate } from "@/locales";
import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";
import { getUrlImage } from "@/utils/format-image";
import { fCurrency } from "@/utils/format-number";
import { isValidValue } from "@/utils/utilts";
import { Building2, MapPin, Star } from "lucide-react";
import imgDefault from "@/assets/images/default-image.jpg"
import { useListCurrency } from "@/components/currency/useListCurrency";

export const HotelCard = ({ hotel }: any) => {
    const { t } = useTranslate("hotel")
    const { selectedCurrency } = useListCurrency();
    const router = useRouter();
    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group">
            <div className="relative h-44 overflow-hidden">
                <img
                    src={
                        hotel?.strSupplierImage === "" ||
                            (typeof hotel?.strSupplierImage === "object" &&
                                hotel?.strSupplierImage !== null &&
                                Object.keys(hotel?.strSupplierImage).length === 0)
                            ? imgDefault
                            : getUrlImage(isValidValue(hotel?.strSupplierImage))
                    }
                    alt={isValidValue(hotel?.strSupplierName)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-gray-800 font-bold text-[15px] leading-tight uppercase mb-4 h-12 line-clamp-2">
                    {isValidValue(hotel?.strSupplierName)}
                </h3>

                <div className="space-y-2.5 mb-4 text-[13px] text-gray-600">
                    <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-gray-400 shrink-0" />

                        <span>{t("hotel")}</span>

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
                    </div>

                    <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />

                        <span className="line-clamp-3 leading-relaxed">
                            {isValidValue(hotel?.strSupplierAddr)}
                        </span>
                    </div>
                </div>

                <div className="mb-4 relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-100"></div>
                    </div>

                    <div className="relative flex justify-center">
                        <span className="bg-gray-50 px-3 text-[11px] font-bold text-gray-900 italic tracking-wider">
                            {t("markupDiscount")}
                        </span>
                    </div>
                </div>

                <div className="mt-auto flex items-end justify-between">
                    <div>
                        <p className="text-[11px] text-gray-500 mb-0.5">
                            {t("priceFrom")}
                        </p>

                        <p className="text-[#2563eb] font-bold text-xl leading-none">
                            {fCurrency(
                                hotel?.dblPriceFrom,
                                selectedCurrency?.label
                            )}
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            router.replaceParams(paths.shop.hotel.detail, {
                                item: hotel,
                            })
                        }
                        className="cursor-pointer text-[#2563eb] border border-blue-200 hover:border-[#2563eb] hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    >
                        {t("viewDetail")}
                    </button>
                </div>
            </div>
        </div>
    );
};