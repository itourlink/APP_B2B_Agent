// components/hotel/hotel-list-row-card.tsx

import { Building2, MapPin, Star } from "lucide-react";
import { getUrlImage } from "@/utils/format-image";
import { isValidValue } from "@/utils/utilts";
import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks/use-router";
import imgDefault from "@/assets/images/default-image.jpg"

type Props = {
    hotel: any;
};

const HotelListRowCard = ({ hotel }: Props) => {
    const router = useRouter();

    const imageSrc =
        hotel?.strSupplierImage === "" ||
            (typeof hotel?.strSupplierImage === "object" &&
                hotel?.strSupplierImage !== null &&
                Object.keys(hotel?.strSupplierImage).length === 0)
            ? imgDefault
            : getUrlImage(isValidValue(hotel?.strSupplierImage));

    return (
        <div className="flex border border-slate-300 rounded-xl p-4 bg-white shadow-sm gap-4">
            {/* IMAGE */}
            <img
                src={imageSrc}
                alt={isValidValue(hotel?.strSupplierName)}
                className="w-48 h-full object-cover rounded-lg"
            />

            {/* CONTENT */}
            <div className="flex-1">
                <button onClick={() =>
                    router.replaceParams(paths.shop.hotel.detail, {
                        item: hotel,
                    })
                } className="font-bold text-lg uppercase cursor-pointer hover:text-blue-500 transition-colors">
                    {hotel?.strSupplierName}
                </button>

                <div className="flex items-center gap-2 mt-1">
                    <Building2 size={14} className="text-gray-400 shrink-0" />

                    <span>Khách sạn</span>

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

                <div className="flex items-start gap-2 mt-2">
                    <MapPin
                        size={14}
                        className="text-gray-400 mt-0.5 shrink-0"
                    />

                    <span className="line-clamp-3 leading-relaxed">
                        {isValidValue(hotel?.strSupplierAddr)}
                    </span>
                </div>

                {/* PRICE */}
                <div className="flex items-center justify-between mt-4">
                    <div className="text-blue-600 font-bold text-xl">
                        đ{hotel?.dblPrice || 0}
                    </div>

                    <button onClick={() =>
                        router.replaceParams(paths.shop.hotel.detail, {
                            item: hotel,
                        })
                    } className="border rounded text-blue-600 px-3 py-1 cursor-pointer hover:bg-blue-50 transition-colors text-sm font-medium">
                        Xem chi tiết
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HotelListRowCard;