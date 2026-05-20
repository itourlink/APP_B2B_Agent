import { Star } from "lucide-react";

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
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sticky top-31 h-fit text-sm">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Lọc kết quả</h3>

                <button className="text-xs text-blue-500 hover:underline cursor-pointer">
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
                    placeholder="Nhập từ khóa..."
                    className="w-full border border-slate-300 rounded-md h-8 px-2 text-xs"
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
                    defaultValue={250}
                    className="w-full"
                />

                <div className="flex justify-between text-[10px] mt-1 text-gray-500">
                    <span>0</span>
                    <span>250</span>
                </div>
            </div>

            {/* DAY */}
            <div className="mb-3">
                <h4 className="text-xs font-medium mb-2">Số ngày</h4>

                <input
                    type="range"
                    min={1}
                    max={30}
                    defaultValue={10}
                    className="w-full"
                />

                <div className="flex justify-between text-[10px] mt-1 text-gray-500">
                    <span>1</span>
                    <span>10</span>
                </div>
            </div>

            {/* TRANSPORT */}
            <div className="mb-4">
                <h4 className="text-xs font-medium mb-2">Phương tiện</h4>

                <div className="space-y-1 max-h-30 overflow-auto">
                    {transportList.map((item) => (
                        <label key={item} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                className="w-3 h-3"
                            />
                            <span className="text-xs">{item}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* APPLY */}
            <button className="w-full h-9 rounded-lg bg-blue-600 text-white text-sm">
                Chấp nhận
            </button>
        </div>
    );
}