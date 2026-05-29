import PanelPopup from "@/components/popup/panel-popup";
import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";
import { fDateTime } from "@/utils/format-time";

type Props = {
    open: boolean;
    onClose: () => void;
    data: any;
};

const BookingHotelPopup = ({ open, onClose, data }: Props) => {
    const router = useRouter()
    if (!data) return null;

    return (
        <PanelPopup open={open} onClose={onClose} title="Xác nhận đặt phòng">
            <div className="p-5 space-y-4 text-sm">

                {/* GUEST INFO */}
                <div className="rounded-xl border p-4 bg-amber-50">
                    <div className="text-xs text-amber-600 mb-2">
                        Thông tin khách
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div>
                            <div className="text-slate-500">
                                Người lớn
                            </div>

                            <div className="font-semibold text-slate-900">
                                {data.adultCount || 0} người
                            </div>
                        </div>

                        <div>
                            <div className="text-slate-500">
                                Trẻ em
                            </div>

                            <div className="font-semibold text-slate-900">
                                {data.childCount || 0} trẻ
                            </div>
                        </div>
                    </div>
                </div>

                {/* HOTEL */}
                <div className="rounded-xl border p-4 bg-slate-50">
                    <div className="text-xs text-slate-500">Khách sạn</div>
                    <div className="font-semibold text-slate-900">
                        {data.hotel?.strSupplierName}
                    </div>
                </div>

                {/* ROOM INFO */}
                <div className="rounded-xl border p-4 space-y-1">
                    <div className="text-xs text-slate-500">Phòng</div>
                    <div className="font-semibold text-slate-900">
                        {data.strItemTypeName}
                    </div>

                    {data.meal && (
                        <div className="text-xs text-emerald-600 flex items-center gap-1">
                            🍽 {data.meal}
                        </div>
                    )}
                </div>

                {/* DATE */}
                <div className="rounded-xl border p-4 bg-blue-50">
                    <div className="text-xs text-blue-500 mb-2">
                        Thời gian lưu trú
                    </div>

                    <div className="flex justify-between text-sm">
                        <div>
                            <div className="font-semibold text-slate-900">
                                {fDateTime(data.checkIn)}
                            </div>
                            <div className="text-xs text-slate-500">
                                {fDateTime(data.checkIn)}
                            </div>
                        </div>

                        <div className="text-slate-400">→</div>

                        <div>
                            <div className="font-semibold text-slate-900">
                                {fDateTime(data.checkOut)}
                            </div>
                            <div className="text-xs text-slate-500">
                                {fDateTime(data.checkOut)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* TOTAL */}
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 flex justify-between">
                    <div>
                        <div className="text-xs text-blue-500">
                            Tổng thanh toán
                        </div>
                        <div className="text-xs text-slate-500">
                            Bao gồm tất cả dịch vụ
                        </div>
                    </div>

                    <div className="text-lg font-bold text-blue-600">
                        ₫{data.totalAmount?.toLocaleString()}
                    </div>
                </div>

                {/* ITEMS */}
                <div className="space-y-2">
                    <div className="font-semibold text-slate-800">
                        Chi tiết
                    </div>

                    {data.items?.map((item: any, idx: number) => (
                        <div
                            key={idx}
                            className="flex justify-between border p-3 rounded-lg"
                        >
                            <div>
                                <div className="font-medium">
                                    {item.label}
                                </div>
                                <div className="text-xs text-slate-500">
                                    Số lượng: {item.qty}
                                </div>
                            </div>

                            <div className="font-semibold">
                                ₫{item.total.toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ACTION */}
                <div className="flex gap-2 pt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 h-10 rounded-lg border"
                    >
                        Huỷ
                    </button>

                    <button
                        onClick={() => {
                            router.replaceParams(
                                paths.booking.paymentBookingHotel,
                                {
                                    bookingPayload: data,
                                }
                            );
                        }}
                        className="flex-1 h-10 rounded-lg bg-[#2566b0] text-white"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </PanelPopup>
    );
};

export default BookingHotelPopup;