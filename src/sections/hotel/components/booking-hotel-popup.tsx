import PanelPopup from "@/components/popup/panel-popup";

type Props = {
    open: boolean;
    onClose: () => void;
    data: any;
};

const BookingHotelPopup = ({ open, onClose, data }: Props) => {
    if (!data) return null;

    return (
        <PanelPopup open={open} onClose={onClose} title="Xác nhận đặt phòng">
            <div className="p-5 space-y-5 text-sm">

                {/* HOTEL */}
                <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                    <div className="text-xs text-slate-500">Khách sạn</div>
                    <div className="text-base font-semibold text-slate-900">
                        {data.hotel?.strSupplierName}
                    </div>
                </div>

                {/* TOTAL */}
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 flex items-center justify-between">
                    <div>
                        <div className="text-xs text-blue-500">Tổng thanh toán</div>
                        <div className="text-sm text-slate-600">
                            Đã bao gồm tất cả phòng đã chọn
                        </div>
                    </div>

                    <div className="text-lg font-bold text-blue-600">
                        ₫{data.totalAmount?.toLocaleString()}
                    </div>
                </div>

                {/* ROOM LIST */}
                <div className="space-y-2">
                    <div className="font-semibold text-slate-800">
                        Chi tiết phòng
                    </div>

                    <div className="space-y-2">
                        {data.items?.map((item: any, idx: number) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
                            >
                                {/* LEFT */}
                                <div className="flex flex-col">
                                    <span className="font-medium text-slate-900">
                                        {item.label}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        Số lượng: {item.qty}
                                    </span>
                                </div>

                                {/* RIGHT */}
                                <div className="text-right">
                                    <div className="text-xs text-slate-400">
                                        Thành tiền
                                    </div>
                                    <div className="font-semibold text-slate-900">
                                        ₫{item.total.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ACTION */}
                <div className="flex gap-2 pt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 h-10 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
                    >
                        Huỷ
                    </button>

                    <button
                        className="flex-1 h-10 rounded-lg bg-[#2566b0] text-white font-medium hover:bg-blue-700 transition"
                        onClick={() => console.log("CONFIRM BOOKING", data)}
                    >
                        Xác nhận đặt
                    </button>
                </div>

            </div>
        </PanelPopup>
    );
};

export default BookingHotelPopup;