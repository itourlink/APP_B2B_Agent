import { paths } from "@/routes/paths";
import { getUrlImage } from "@/utils/format-image";
import { fCurrency } from "@/utils/format-number";
import { isValidValue } from "@/utils/utilts";
import { Clock, Flag, MapPin, Users } from "lucide-react";
import imgDefault from "@/assets/images/default-image.jpg";
import { useListPrice, useListTourChildAge } from "@/hooks/actions/useBooking";

type TourSeriesCardProps = {
    item: any;
    index: number;

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
};

const TourSeriesCard = ({
    item,
    index,

    payloadSearch,
    searchTourPayload,
    seriesFilter,

    selectedDates,
    setSelectedDates,

    selectedCurrency,

    router,
    t,

    getDateRange,
}: TourSeriesCardProps) => {

    // console.log("item", item)
    // const tourGUID = item?.strTourGUID;

    // const { tourChildAgeData } = useListTourChildAge({
    //     strTourGUID: item?.strTourGUID
    // });
    // const formatStarToNumber = (star: string) => {
    //     return String(star?.length ?? 0);
    // };

    // console.log("searchTourPayload.dtmFilterDateValidFrom", searchTourPayload.dtmFilterDateValidFrom)
    // ================= PRICE API =================
    // const { priceData, priceLoading } = useListPrice({
    //     IsHasPriceKid: item?.IsHasPriceKid,
    //     strTourGUID: item?.strTourGUID,
    //     enabled: !!item?.strTourGUID,
    //     intNoOfAdult: searchTourPayload.intNoOfAdult,
    //     intNoOfSGLSup: searchTourPayload.intNoOfSGLSup,
    //     intNoOfTPLRec: searchTourPayload.intNoOfTPLRec,
    //     dtmFilterDateFrom: searchTourPayload.dtmFilterDateValidFrom
    //         ? new Date(searchTourPayload.dtmFilterDateValidFrom).toISOString()
    //         : null,
    //     xmlNoOfChild: searchTourPayload?.strListNoOfChild,
    //     intEasiaCateID: formatStarToNumber(item?.strEasiaCateName),
    //     intJoinTypeID: 1,
    //     strPriceLevelGUID: item?.strTourPriceItemLevelGUID ?? "",
    // });

    // const price1 = priceData?.[0] ?? [];
    // console.log("price1", price1)


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

                        <select
                            className="border border-gray-300 rounded px-3 py-1 text-sm bg-white w-48 cursor-pointer"
                        >
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
                                )}
                                {' '}
                                {t("days")}
                                /
                                {" "}
                                {isValidValue(
                                    Number(item?.intNoOfDay) - 1
                                )}
                                {" "}
                                {t("nights")}
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


                <div className="flex gap-1 items-center justify-between rounded-md bg-gray-50 px-3 py-2 text-sm">

                    <span className="text-gray-500">
                        {t("adults")}:
                    </span>


                    <span className="font-semibold text-gray-900">

                        {fCurrency(
                            item?.dblUnitPrice,
                            selectedCurrency?.label
                        )}

                    </span>

                </div>



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
};

export default TourSeriesCard;