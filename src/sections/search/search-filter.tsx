import { Star } from "lucide-react";
import { useState } from "react";
import ReactSlider from "react-slider";
import { useTranslate } from "@/locales";

const transportList = [
    { label: "Vietnam Airline", value: "1" },
    { label: "VietJet", value: "2" },
    { label: "Bamboo", value: "3" },
    { label: "Motorbike", value: "4" },
    { label: "Car", value: "5" },
    { label: "Limousine", value: "6" },
    { label: "Flight", value: "7" },
    { label: "Canoe", value: "8" },
    { label: "Boat", value: "9" },
];

const starList = [
    { label: 5, value: "5" },
    { label: 4, value: "4" },
    { label: 3, value: "3" },
    { label: 2, value: "2" },
    { label: 1, value: "1" },
];

type Props = {
    isSeries?: boolean;
    isHotel?: boolean;
    isQuick?: boolean;
    tourFilter: any;
    setTourFilter: any;
    seriesFilter: any;
    setSeriesFilter: any;
    onApply?: () => void;
};

export default function SearchFilter({
    isSeries,
    isHotel,
    isQuick,
    tourFilter,
    setTourFilter,
    seriesFilter,
    setSeriesFilter,
    onApply,
}: Props) {
    const { t } = useTranslate("search");
    const [priceRange, setPriceRange] = useState([0, 250]);
    const [dayRange, setDayRange] = useState([1, 10]);

    const currentFilter = isSeries ? seriesFilter : tourFilter;
    const setCurrentFilter = isSeries ? setSeriesFilter : setTourFilter;

    const resetFilter = () => {
        setPriceRange([0, 250]);
        setDayRange([1, 10]);

        const resetData = {
            intCateID: null,
            intProductID: null,
            strNoOfDayRange: null,
            strFilterServiceName: null,
            strFilterSupplierName: null,
            strListEasiaCateID: null,
            strListTransportOptionID: null,
            strPriceFromRange: null,
            strLocationCode: currentFilter?.strLocationCode ?? "VN0000",
            dtmFilterDateValidFrom: null,
            dtmFilterDateValidTo: null,
            intNoOfAdult: 2,
            strListNoOfChild: null,
            intNoOfSGLSup: 0,
            intNoOfTPLRec: 0,
        };

        setCurrentFilter((prev: any) => ({
            ...prev,
            ...resetData,
        }));
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sticky top-58 h-fit text-sm">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">{t("filterResults")}</h3>

                <button
                    onClick={() => resetFilter()}
                    className="text-xs text-blue-500 hover:underline cursor-pointer"
                >
                    {t("reset")}
                </button>
            </div>

            <div className="border-b mb-3" />

            <div className="mb-3">
                <label className="text-xs font-medium mb-1 block">
                    {t("tourOrHotelName")}
                </label>

                <input
                    type="text"
                    value={
                        isHotel
                            ? currentFilter?.strFilterSupplierName || ""
                            : currentFilter?.strFilterServiceName || ""
                    }
                    onChange={(e) =>
                        setCurrentFilter((prev: any) => ({
                            ...prev,
                            ...(isHotel
                                ? { strFilterSupplierName: e.target.value }
                                : { strFilterServiceName: e.target.value }),
                        }))
                    }
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            onApply?.();
                        }
                    }}
                    placeholder={t("enterKeyword")}
                    className="w-full border border-slate-300 rounded-md h-8 px-2 text-xs"
                />
            </div>

            {(!isHotel || !isQuick) && (
                <div className="mb-4">
                    <h4 className="text-xs font-medium mb-2">{t("priceUsd")}</h4>

                    <ReactSlider
                        className="w-full h-2"
                        thumbClassName="h-4 w-4 bg-blue-600 rounded-full cursor-pointer -top-1"
                        trackClassName="h-2 rounded"
                        value={priceRange}
                        min={0}
                        max={500}
                        step={5}
                        onChange={(value: any) => {
                            setPriceRange(value);

                            setCurrentFilter((prev: any) => ({
                                ...prev,
                                strPriceFromRange: `${value[0]},${value[1]}`,
                            }));
                        }}
                        renderTrack={(props: any, state: any) => (
                            <div
                                {...props}
                                className={`h-2 rounded ${state.index === 1 ? "bg-blue-600" : "bg-slate-200"}`}
                            />
                        )}
                    />

                    <div className="flex justify-between text-[10px] mt-2 text-gray-500">
                        <span>{priceRange[0]}</span>
                        <span>{priceRange[1]}</span>
                    </div>
                </div>
            )}

            {!isHotel && (
                <div className="mb-4">
                    <h4 className="text-xs font-medium mb-2">{t("numberOfDays")}</h4>

                    <ReactSlider
                        className="w-full h-2"
                        thumbClassName="h-4 w-4 bg-blue-600 rounded-full cursor-pointer -top-1"
                        trackClassName="h-2 rounded"
                        value={dayRange}
                        min={1}
                        max={30}
                        step={1}
                        onChange={(value: any) => {
                            setDayRange(value);

                            setCurrentFilter((prev: any) => ({
                                ...prev,
                                strNoOfDayRange: `${value[0]},${value[1]}`,
                            }));
                        }}
                        renderTrack={(props: any, state: any) => (
                            <div
                                {...props}
                                className={`h-2 rounded ${state.index === 1 ? "bg-blue-600" : "bg-slate-200"}`}
                            />
                        )}
                    />

                    <div className="flex justify-between text-[10px] mt-2 text-gray-500">
                        <span>{dayRange[0]} {t("days")}</span>
                        <span>{dayRange[1]} {t("days")}</span>
                    </div>
                </div>
            )}

            {!isHotel && (
                <div className="mb-4">
                    <h4 className="text-xs font-medium mb-2">{t("transportation")}</h4>

                    <div className="space-y-1 max-h-30 overflow-auto">
                        {transportList.map((item) => {
                            const selected =
                                currentFilter?.strListTransportOptionID
                                    ?.split(",")
                                    ?.includes(item.value) || false;

                            return (
                                <label
                                    key={item.value}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selected}
                                        onChange={(e) => {
                                            const current =
                                                currentFilter?.strListTransportOptionID
                                                    ?.split(",")
                                                    ?.filter(Boolean) || [];

                                            const updated = e.target.checked
                                                ? [...current, item.value]
                                                : current.filter((x: string) => x !== item.value);

                                            setCurrentFilter((prev: any) => ({
                                                ...prev,
                                                strListTransportOptionID: updated.join(","),
                                            }));
                                        }}
                                        className="w-3 h-3"
                                    />

                                    <span className="text-xs">{item.label}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="mb-4">
                <h4 className="text-xs font-medium mb-2">{t("stars")}</h4>

                <div className="space-y-1">
                    {starList.map((item) => {
                        const selected =
                            currentFilter?.strListEasiaCateID
                                ?.split(",")
                                ?.includes(item.value) || false;

                        return (
                            <label
                                key={item.value}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={selected}
                                    onChange={(e) => {
                                        const current =
                                            currentFilter?.strListEasiaCateID
                                                ?.split(",")
                                                ?.filter(Boolean) || [];

                                        const updated = e.target.checked
                                            ? [...current, item.value]
                                            : current.filter((x: string) => x !== item.value);

                                        setCurrentFilter((prev: any) => ({
                                            ...prev,
                                            strListEasiaCateID: updated.join(","),
                                        }));
                                    }}
                                    className="w-3 h-3"
                                />

                                <div className="flex">
                                    {Array.from({ length: item.label }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={12}
                                            className="fill-orange-400 text-orange-400"
                                        />
                                    ))}
                                </div>
                            </label>
                        );
                    })}
                </div>
            </div>

            <button
                onClick={onApply}
                className="w-full h-9 rounded-lg bg-[#4a6fa5] hover:bg-[#3b5b7e] text-white text-sm transition cursor-pointer"
            >
                {t("apply")}
            </button>
        </div>
    );
}
