import { Star } from "lucide-react";
import { useEffect, useState } from "react";

const transportList = [
    "Vietnam Airline",
    "VietJet",
    "Bamboo",
    "Motorbike",
    "Car",
    "Limousine",
    "Flight",
    "Canoe",
    "Boat",
];

type Props = {
    filters: any;
    setFilters: any;
};

export default function SearchFilter({
    filters,
    setFilters,
}: Props) {
    const [localFilter, setLocalFilter] = useState(filters);

    useEffect(() => {
        setLocalFilter(filters);
    }, [filters]);

    const toggleTransport = (value: string) => {
        setLocalFilter((prev: any) => {
            const exists = prev.transport.includes(value);

            return {
                ...prev,
                transport: exists
                    ? prev.transport.filter((x: string) => x !== value)
                    : [...prev.transport, value],
            };
        });
    };

    const toggleStar = (value: number) => {
        setLocalFilter((prev: any) => {
            const exists = prev.star.includes(value);

            return {
                ...prev,
                star: exists
                    ? prev.star.filter((x: number) => x !== value)
                    : [...prev.star, value],
            };
        });
    };

    const resetFilter = () => {
        const resetValue = {
            keyword: "",
            price: 500,
            day: 30,
            star: [],
            transport: [],
        };

        setLocalFilter(resetValue);
        setFilters(resetValue);
    };

    const applyFilter = () => {
        setFilters(localFilter);
    };

    return (
        <div className="rounded-xl border bg-white p-3 shadow-sm sticky top-24 h-fit text-sm">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Lọc kết quả</h3>

                <button
                    onClick={resetFilter}
                    className="text-xs text-blue-500 hover:underline"
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
                    value={localFilter.keyword}
                    onChange={(e) =>
                        setLocalFilter((prev: any) => ({
                            ...prev,
                            keyword: e.target.value,
                        }))
                    }
                    className="w-full border rounded-md h-8 px-2 text-xs"
                />
            </div>

            {/* STAR */}
            <div className="mb-3">
                <h4 className="text-xs font-medium mb-2">Số sao</h4>

                <div className="space-y-1">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <label key={star} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={localFilter.star.includes(star)}
                                onChange={() => toggleStar(star)}
                                className="w-3 h-3"
                            />

                            <div className="flex">
                                {Array.from({ length: star }).map((_, i) => (
                                    <Star
                                        key={i}
                                        size={12}
                                        className="fill-orange-400 text-orange-400"
                                    />
                                ))}
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* PRICE */}
            <div className="mb-3">
                <h4 className="text-xs font-medium mb-2">
                    Giá tối đa (USD)
                </h4>

                <input
                    type="range"
                    min={0}
                    max={500}
                    step={5}
                    value={localFilter.price}
                    onChange={(e) =>
                        setLocalFilter((prev: any) => ({
                            ...prev,
                            price: Number(e.target.value),
                        }))
                    }
                    className="w-full"
                />

                <div className="flex justify-between text-[10px] mt-1 text-gray-500">
                    <span>0</span>
                    <span>{localFilter.price}</span>
                </div>
            </div>

            {/* DAY */}
            <div className="mb-3">
                <h4 className="text-xs font-medium mb-2">Số ngày</h4>

                <input
                    type="range"
                    min={1}
                    max={30}
                    value={localFilter.day}
                    onChange={(e) =>
                        setLocalFilter((prev: any) => ({
                            ...prev,
                            day: Number(e.target.value),
                        }))
                    }
                    className="w-full"
                />

                <div className="flex justify-between text-[10px] mt-1 text-gray-500">
                    <span>1</span>
                    <span>{localFilter.day}</span>
                </div>
            </div>

            {/* TRANSPORT */}
            <div className="mb-4">
                <h4 className="text-xs font-medium mb-2">Phương tiện</h4>

                <div className="space-y-1 max-h-40 overflow-auto">
                    {transportList.map((item) => (
                        <label key={item} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={localFilter.transport.includes(item)}
                                onChange={() => toggleTransport(item)}
                                className="w-3 h-3"
                            />
                            <span className="text-xs">{item}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* APPLY */}
            <button
                onClick={applyFilter}
                className="w-full h-9 rounded-lg bg-blue-600 text-white text-sm"
            >
                Chấp nhận
            </button>
        </div>
    );
}