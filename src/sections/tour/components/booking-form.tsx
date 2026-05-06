import { Calendar, Star, HelpCircle, Download } from "lucide-react";

const BookingForm = () => {
    return (
        <div className="w-[320px] sticky top-32">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">

                {/* HEADER */}
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">
                            Đặt tour
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            Nhập thông tin để hiển thị giá
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-full bg-[#2566b0] text-white flex items-center justify-center">
                            <HelpCircle size={16} />
                        </button>

                        <button className="w-8 h-8 rounded-full bg-[#2566b0] text-white flex items-center justify-center">
                            <Download size={16} />
                        </button>
                    </div>
                </div>

                {/* WARNING */}
                <div className="text-red-500 text-sm font-medium">
                    Bạn hãy chọn ngày bắt đầu
                </div>

                {/* DATE */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                        Ngày bắt đầu
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Chọn ngày"
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-[#2566b0] outline-none"
                        />
                        <Calendar className="absolute right-3 top-2.5 text-slate-400" size={16} />
                    </div>
                </div>

                {/* GUEST */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                        Số lượng khách
                    </label>
                    <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-[#2566b0] outline-none">
                        <option>2 N.Lớn - 0 T.Em - 1 Phòng</option>
                    </select>
                </div>

                {/* STAR + TYPE */}
                <div className="grid grid-cols-2 gap-3">

                    {/* STAR */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">
                            Hạng Tour
                        </label>
                        <div className="flex items-center justify-between border border-slate-300 rounded-lg px-3 py-2">
                            <div className="flex gap-1 text-yellow-400">
                                {[1, 2, 3, 4].map((i) => (
                                    <Star key={i} size={14} fill="currentColor" />
                                ))}
                            </div>
                            <span className="text-slate-400">▼</span>
                        </div>
                    </div>

                    {/* TYPE */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">
                            Loại hình
                        </label>
                        <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                            <option>Joined Tour</option>
                            <option>Private Tour</option>
                        </select>
                    </div>

                </div>

                {/* PRICE BUTTON */}
                <button className="w-full bg-[#2566b0] text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                    Xem giá
                </button>
            </div>
        </div>
    );
};

export default BookingForm;