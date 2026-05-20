import { Star } from "lucide-react";

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

    tourFilter: any;
    setTourFilter: any;

    seriesFilter: any;
    setSeriesFilter: any;

    onApply?: () => void;
};

export default function SearchFilter({
    isSeries,

    tourFilter,
    setTourFilter,

    seriesFilter,
    setSeriesFilter,

    onApply,
}: Props) {

    const currentFilter =
        isSeries ? seriesFilter : tourFilter;

    const setCurrentFilter =
        isSeries ? setSeriesFilter : setTourFilter;

    const priceValue =
        Number(
            currentFilter?.strPriceFromRange?.split(",")?.[1]
        ) || 250;

    const dayValue =
        Number(
            currentFilter?.strNoOfDayRange?.split(",")?.[1]
        ) || 10;

    const resetFilter = () => {
        setCurrentFilter({
            intCateID: null,
            intProductID: null,

            strNoOfDayRange: null,
            strFilterServiceName: null,
            strListEasiaCateID: null,
            strListTransportOptionID: null,

            strLocationCode: null,

            dtmFilterDateValidFrom: null,
            dtmFilterDateValidTo: null,

            strPriceFromRange: null,

            ...(isSeries && {
                intNoOfAdult: undefined,
                strListNoOfChild: undefined,
                intNoOfSGLSup: undefined,
                intNoOfTPLRec: undefined,
            }),
        });
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sticky top-31 h-fit text-sm">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">
                    Lọc kết quả
                </h3>

                <button
                    onClick={resetFilter}
                    className="text-xs text-blue-500 hover:underline cursor-pointer"
                >
                    Đặt lại
                </button>
            </div>

            <div className="border-b mb-3" />

            {/* KEYWORD */}
            <div className="mb-3">
                <label className="text-xs font-medium mb-1 block">
                    Tên tour / khách sạn
                </label>

                <input
                    type="text"
                    value={currentFilter?.strFilterServiceName || ""}
                    onChange={(e) =>
                        setCurrentFilter((prev: any) => ({
                            ...prev,
                            strFilterServiceName: e.target.value,
                        }))
                    }
                    placeholder="Nhập từ khóa..."
                    className="w-full border border-slate-300 rounded-md h-8 px-2 text-xs"
                />
            </div>

            {/* PRICE */}
            <div className="mb-4">
                <h4 className="text-xs font-medium mb-2">
                    Giá tối đa (USD)
                </h4>

                <input
                    type="range"
                    min={0}
                    max={500}
                    step={5}
                    value={priceValue}
                    onChange={(e) =>
                        setCurrentFilter((prev: any) => ({
                            ...prev,
                            strPriceFromRange: `0,${e.target.value}`,
                        }))
                    }
                    className="w-full accent-blue-600 cursor-pointer"
                />

                <div className="flex justify-between text-[10px] mt-1 text-gray-500">
                    <span>0</span>

                    <span>
                        {priceValue}
                    </span>

                    <span>500</span>
                </div>
            </div>

            {/* DAY */}
            <div className="mb-4">
                <h4 className="text-xs font-medium mb-2">
                    Số ngày
                </h4>

                <input
                    type="range"
                    min={1}
                    max={30}
                    step={1}
                    value={dayValue}
                    onChange={(e) =>
                        setCurrentFilter((prev: any) => ({
                            ...prev,
                            strNoOfDayRange: `1,${e.target.value}`,
                        }))
                    }
                    className="w-full accent-blue-600 cursor-pointer"
                />

                <div className="flex justify-between text-[10px] mt-1 text-gray-500">
                    <span>1</span>

                    <span>
                        {dayValue}
                    </span>

                    <span>30</span>
                </div>
            </div>

            {/* TRANSPORT */}
            <div className="mb-4">
                <h4 className="text-xs font-medium mb-2">
                    Phương tiện
                </h4>

                <div className="space-y-1 max-h-30 overflow-auto">
                    {transportList.map((item) => {

                        const selected =
                            currentFilter?.strListTransportOptionID
                                ?.split(",")
                                ?.includes(item.value);

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

                                        const updated =
                                            e.target.checked
                                                ? [...current, item.value]
                                                : current.filter(
                                                    (x: string) => x !== item.value
                                                );

                                        setCurrentFilter((prev: any) => ({
                                            ...prev,
                                            strListTransportOptionID:
                                                updated.join(","),
                                        }));
                                    }}
                                    className="w-3 h-3"
                                />

                                <span className="text-xs">
                                    {item.label}
                                </span>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* STAR */}
            <div className="mb-4">
                <h4 className="text-xs font-medium mb-2">
                    Số sao
                </h4>

                <div className="space-y-1">
                    {starList.map((item) => {

                        const selected =
                            currentFilter?.strListEasiaCateID
                                ?.split(",")
                                ?.includes(item.value);

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

                                        const updated =
                                            e.target.checked
                                                ? [...current, item.value]
                                                : current.filter(
                                                    (x: string) => x !== item.value
                                                );

                                        setCurrentFilter((prev: any) => ({
                                            ...prev,
                                            strListEasiaCateID:
                                                updated.join(","),
                                        }));
                                    }}
                                    className="w-3 h-3"
                                />

                                <div className="flex">
                                    {Array.from({
                                        length: item.label,
                                    }).map((_, i) => (
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

            {/* APPLY */}
            <button
                onClick={onApply}
                className="w-full h-9 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
            >
                Chấp nhận
            </button>
        </div>
    );
}