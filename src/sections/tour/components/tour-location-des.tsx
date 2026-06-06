import { useTranslate } from "@/locales";
import { MapPin, Flag, Map } from "lucide-react";

type Props = {
    data: any[];
    isLoading: boolean;
    onSelectDestination?: (item: any) => void;
};

const TourLocationDes = ({
    data = [],
    isLoading,
    onSelectDestination,
}: Props) => {

    const { t } = useTranslate("tour")
    /**
     * API đôi khi trả:
     * [[...]]
     * nên flatten về [...]
     */
    const flatData = Array.isArray(data?.[0])
        ? data[0]
        : data;

    /**
     * Check value hợp lệ
     * Bắt luôn:
     * null
     * undefined
     * {}
     */


    const isRealString = (v: any) =>
        typeof v === "string" && v.trim().length > 0;

    const destination = flatData.filter(
        (item) =>
            !isRealString(item?.strTourGUID) &&
            !isRealString(item?.strServiceNameUrl)
    );

    const tours = flatData.filter(
        (item) =>
            isRealString(item?.strTourGUID) &&
            isRealString(item?.strServiceNameUrl)
    );

    console.log("destination", destination)
    console.log("tours", tours)
    if (isLoading) {
        return (
            <div className="w-105 bg-white rounded-xl shadow-lg border border-gray-300 text-sm">
                <div className="p-6 flex flex-col items-center text-gray-400">

                    <div className="mb-2 w-6 h-6 border-4 border-gray-300 border-t-[#4a6fa5] rounded-full animate-spin"></div>

                    {t("searchingSuitableTours")}
                </div>
            </div>
        );
    }

    if (!flatData.length) {
        return (
            <div className="w-105 bg-white rounded-xl shadow-lg border border-gray-300 text-sm">
                <div className="p-6 flex flex-col items-center text-gray-400">

                    <MapPin
                        size={24}
                        className="mb-2"
                    />

                    {t("noMatchingResults")}
                </div>
            </div>
        );
    }

    return (
        <div className="w-105 bg-white rounded-xl shadow-lg border border-gray-300 text-sm max-h-100 overflow-y-auto pb-4">

            {/* DESTINATION */}
            {destination?.length > 0 && (
                <div className="border-b border-gray-300">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold p-4">
                        <MapPin size={14} />
                        {t("destination")}
                    </div>

                    {destination.map((item) => (
                        <button
                            key={item.strDestinationCode}
                            onClick={() =>
                                onSelectDestination?.({
                                    ...item,
                                    __type: "destination",
                                })
                            }
                            className="flex items-start gap-3 w-full hover:bg-[#e9e9e981] px-4 py-3 transition cursor-pointer"
                        >
                            <MapPin
                                className="text-[#2566b0] mt-0.5 shrink-0"
                                size={18}
                            />

                            <div className="text-left">
                                <div className="font-semibold text-gray-900">
                                    {item.strDestinationName}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* TOURS */}
            {tours.length > 0 && (
                <div>

                    <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold p-4">

                        <Map size={14} />

                        TOURS
                    </div>

                    <div className="flex flex-col">
                        {tours.map((tour, index) => (
                            <button
                                key={index}
                                onClick={() =>
                                    onSelectDestination?.({
                                        ...tour,
                                        __type: "tour",
                                    })
                                }
                                className="flex gap-3 hover:bg-[#e9e9e981] px-4 py-3 cursor-pointer"
                            >
                                <div
                                    className=" w-5 cursor-pointer"
                                >
                                    <Flag
                                        className="text-[#2566b0] mt-1"
                                        size={18}
                                    />
                                </div>

                                <div className="font-medium text-left">
                                    {tour?.strDestinationName}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TourLocationDes;