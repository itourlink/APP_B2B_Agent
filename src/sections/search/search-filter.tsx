// components/search-filter.tsx

import { Star } from "lucide-react";
import { useState } from "react";

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

export default function SearchFilter() {
    const [price, setPrice] = useState(415);
    const [day, setDay] = useState(7);

    return (
        <div className="w-[260px] rounded-2xl border bg-white p-4 shadow-sm sticky top-24 h-fit">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">
                    Lọc các kết quả
                </h3>

                <button className="text-sm text-primary hover:underline">
                    Nhập lại
                </button>
            </div>

            <div className="border-b mb-4" />

            {/* TÊN TOUR */}
            <div className="mb-5">
                <label className="text-sm font-medium mb-2 block">
                    Tên tour
                </label>

                <input
                    type="text"
                    className="w-full border rounded-md h-9 px-3 outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* DANH MỤC */}
            <div className="mb-5">
                <h4 className="text-sm font-medium mb-3">
                    Danh mục
                </h4>

                <div className="space-y-2">
                    {[6, 5, 4, 3, 2, 1].map((star) => (
                        <label
                            key={star}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <input type="checkbox" />

                            <div className="flex">
                                {Array.from({ length: star }).map((_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        className="fill-orange-400 text-orange-400"
                                    />
                                ))}
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* GIÁ */}
            <div className="mb-6">
                <h4 className="text-sm font-medium mb-3">Giá</h4>

                <input
                    type="range"
                    min={0}
                    max={415}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full"
                />

                <div className="flex justify-between text-xs mt-2 text-gray-500">
                    <span>$0</span>
                    <span>${price}</span>
                </div>
            </div>

            {/* THỜI LƯỢNG */}
            <div className="mb-6">
                <h4 className="text-sm font-medium mb-3">
                    Thời lượng
                </h4>

                <input
                    type="range"
                    min={0}
                    max={7}
                    value={day}
                    onChange={(e) => setDay(Number(e.target.value))}
                    className="w-full"
                />

                <div className="flex justify-between text-xs mt-2 text-gray-500">
                    <span>0 Ngày</span>
                    <span>{day} Ngày</span>
                </div>
            </div>

            {/* PHƯƠNG TIỆN */}
            <div className="mb-6">
                <h4 className="text-sm font-medium mb-3">
                    Phương tiện
                </h4>

                <div className="space-y-2">
                    {transportList.map((item) => (
                        <label
                            key={item}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <input type="checkbox" />

                            <span className="text-sm">{item}</span>
                        </label>
                    ))}
                </div>
            </div>

            <button className="w-full bg-primary text-white rounded-lg py-2 font-medium hover:opacity-90">
                Chấp nhận
            </button>
        </div>
    );
}