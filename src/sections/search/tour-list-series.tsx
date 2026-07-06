import Pagination from "@/components/pagination/pagination";
import { paths } from "@/routes/paths";
import { getUrlImage } from "@/utils/format-image";
import { fCurrency } from "@/utils/format-number";
import { isValidValue } from "@/utils/utilts";
import { Clock, Flag, MapPin, Users } from "lucide-react";
import imgDefault from "@/assets/images/default-image.jpg"
import { useListPrice } from "@/hooks/actions/useBooking";
import { useState } from "react";

type TourListSeriesProps = {
    loading: boolean;
    data: any[];
    pageSeries: number;
    setPageSeries: (page: number) => void;
    tsTotalPages: number;
    tsData: any[];
    handlePageSizeChange: (value: number) => void;

    payloadSearch: any;
    searchTourPayload: any;
    seriesFilter: any;

    selectedDates: Record<string, string>;
    setSelectedDates: React.Dispatch<
        React.SetStateAction<Record<string, string>>
    >;

    selectedCurrency: any;

    router: any;
    t: any;

    getDateRange: (from: string, to: string) => string[];

    isSeries: boolean;
};

const TourListSeries = ({
    loading,
    data,
    pageSeries,
    setPageSeries,
    tsTotalPages,
    tsData,
    handlePageSizeChange,
    payloadSearch,
    searchTourPayload,
    seriesFilter,
    selectedDates,
    setSelectedDates,
    selectedCurrency,
    router,
    t,
    getDateRange,
    isSeries,
}: TourListSeriesProps) => {

    console.log("searchTourPayload",searchTourPayload)
    const [canFetchPrice, setCanFetchPrice] = useState(false);

    const [startDate, setStartDate] = useState<Date | null>(null);

    // const xmlNoOfChild = useMemo(() => {
    //     if (!guestValue.childAges?.length) {
    //         return null;
    //     }

    //     return guestValue.childAges
    //         .map((age) => `<child>${age}</child>`)
    //         .join("");
    // }, [guestValue.childAges]);


    // ================= PRICE API =================
    const { priceData } = useListPrice({

        // IsHasPriceKid: item?.IsHasPriceKid,

        // enabled: canFetchPrice && !!startDate,

        // strTourGUID: item?.strTourGUID,

        // intNoOfAdult: guestValue.adults,

        // intNoOfSGLSup: guestValue.roomTypes?.sgl,

        // intNoOfTPLRec: guestValue.roomTypes?.tpl,

        // dtmFilterDateFrom: startDate
        //     ? startDate.toISOString()
        //     : null,

        // xmlNoOfChild,

        // intEasiaCateID: selectedStar,

        // intJoinTypeID: 1,

        // strPriceLevelGUID: item?.strPriceLevelGUID ?? "",
    });

    const price = priceData?.[0] ?? [];

    return (
        <div>
            {/* SERIES */}
            {loading && isSeries && (
                <div className="flex items-center justify-center py-20">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                </div>
            )}

            {!loading && isSeries && (
                <div className="grid gap-6">
                    {data?.map((item: any, index: number) => {

                        const price = {
                            dblTotalPrice: item?.dblTotalPrice,
                            strTourPriceItemLevelGUID:
                                item?.strTourPriceItemLevelGUID,
                            No: item?.No ?? index + 1,
                            strServiceName: item?.strServiceName,
                            dblUnitPrice: item?.dblTotalPrice,
                            dblTotalPriceCom: item?.dblTotalPriceCom,
                        };

                        const from = seriesFilter?.dtmFilterDateValidFrom;
                        const to = seriesFilter?.dtmFilterDateValidTo;

                        const dateOptions =
                            from && to
                                ? getDateRange(from, to)
                                : [item?.dtmRealStartDate];

                        const selectedDate =
                            selectedDates[item?.strTourGUID] ??
                            dateOptions?.[0];

                        const payload = {
                            ...payloadSearch,
                            dtmDateFrom: selectedDate,
                            dtmDateTo: selectedDate,
                            intAdult:
                                payloadSearch?.intAdult ??
                                searchTourPayload?.intNoOfAdult,
                            strTourGUID: item?.strTourGUID,
                            strCompanyOwnerGUID:
                                item?.strCompanyOwnerGUID,
                            strCompanyPartnerGUID:
                                item?.strCompanyPartnerGUID,
                        };

                        const imageSrc =
                            item?.strTourImageUrl === "" ||
                                (typeof item?.strTourImageUrl === "object" &&
                                    item?.strTourImageUrl !== null &&
                                    Object.keys(item?.strTourImageUrl).length === 0)
                                ? imgDefault
                                : getUrlImage(
                                    isValidValue(item?.strTourImageUrl)
                                );

                        return (
                            <div
                                key={item?.strTourGUID ?? index}
                                className="max-w-4xl mx-auto border border-gray-200 rounded-2xl p-6 flex gap-6 bg-white shadow-sm font-sans"
                            >
                                {/* IMAGE */}
                                <div className="w-1/3">
                                    <img
                                        src={imageSrc}
                                        alt={isValidValue(item?.strTourName)}
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                </div>

                                {/* CONTENT */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800 uppercase mb-4">
                                            {isValidValue(item?.strTourName)}
                                        </h2>

                                        <div className="flex gap-4 mb-4">
                                            <select className="border border-gray-300 rounded px-3 py-1 text-sm bg-white w-48 cursor-pointer">
                                                <option>
                                                    {isValidValue(
                                                        item?.strEasiaCateName
                                                    )}
                                                </option>
                                            </select>

                                            <select
                                                value={selectedDate}
                                                onChange={(e) =>
                                                    setSelectedDates(
                                                        (prev) => ({
                                                            ...prev,
                                                            [item.strTourGUID]:
                                                                e.target.value,
                                                        })
                                                    )
                                                }
                                                className="border border-gray-300 rounded px-3 py-1 text-sm bg-white w-48 cursor-pointer"
                                            >
                                                {dateOptions.map((date) => (
                                                    <option
                                                        key={date}
                                                        value={date}
                                                    >
                                                        {new Date(
                                                            date
                                                        ).toLocaleDateString()}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Flag size={16} />
                                                <span>
                                                    {t("by")}:
                                                    <span className="font-medium ml-1">
                                                        {isValidValue(
                                                            item?.strOwnerCompanyName
                                                        )}
                                                    </span>
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Users size={16} />
                                                <span>
                                                    {t("total")}:{" "}
                                                    {isValidValue(
                                                        item?.intPaxMax
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Clock size={16} />
                                                <span>
                                                    {t("duration")}:{" "}
                                                    {isValidValue(
                                                        item?.intNoOfDay
                                                    )}{" "}
                                                    {t("days")}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="font-bold">
                                                    {t("sold")} :{" "}
                                                    {isValidValue(
                                                        item?.intTotalPaxUsed
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} />
                                                <span>
                                                    {t("destinations")}:{" "}
                                                    {isValidValue(
                                                        item?.strListTourDestinationName
                                                    )}
                                                </span>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="text-blue-600 font-bold">
                                                    + {t("available")}:{" "}
                                                    {isValidValue(
                                                        item?.intTotalPaxRemain
                                                    )}
                                                </div>

                                                <div className="text-blue-600 font-bold">
                                                    + {t("hold")}:{" "}
                                                    {isValidValue(
                                                        item?.intTotalPaxHold
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <span className="inline-block mt-4 px-3 py-1 bg-blue-100 text-blue-500 rounded-full text-xs font-medium">
                                            {isValidValue(
                                                item?.strTourTypeName
                                            ) || t("dailyTour")}
                                        </span>
                                    </div>
                                </div>

                                {/* PRICE */}
                                <div className="w-1/4 flex flex-col items-center justify-center border-l border-gray-100 pl-6">
                                    <div className="text-gray-700 font-bold text-lg mb-1">
                                        {t("price")} :
                                    </div>

                                    <div className="text-blue-600 text-3xl font-extrabold mb-4">
                                        {fCurrency(
                                            item?.dblTotalPrice,
                                            selectedCurrency?.label
                                        )}
                                    </div>

                                    <button
                                        onClick={() =>
                                            router.replaceParams(
                                                paths.booking.paymentBooking,
                                                {
                                                    item,
                                                    price,
                                                    payload,
                                                    childPrices: [],
                                                }
                                            )
                                        }
                                        className="cursor-pointer w-full py-2 border border-gray-300 rounded-full text-blue-500 font-semibold hover:bg-blue-50 transition-colors"
                                    >
                                        {t("bookNow")}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {isSeries && !loading && (
                <Pagination
                    currentPage={pageSeries}
                    onPageChange={setPageSeries}
                    totalPages={tsTotalPages || 1}
                    totalRecords={tsData?.[0]?.intTotalRecords || 0}
                    onRecordsPerPageChange={handlePageSizeChange}
                />
            )}
        </div>
    );
};

export default TourListSeries;