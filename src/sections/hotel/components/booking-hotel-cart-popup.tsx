import PanelPopup from "@/components/popup/panel-popup";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useUser } from "@/hooks/actions/useAuth";
import { addCartForHotel } from "@/hooks/actions/useBooking";
import { useListCompanyOwner } from "@/hooks/actions/useCompanyOwner";
import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";
import { fDateTime } from "@/utils/format-time";
import { useToastStore } from "@/zustand/useToastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
    open: boolean;
    onClose: () => void;
    data: {
        displayData: any;
        submitPayload: any;
    };
};

const BookingHotelCartPopup = ({
    open,
    onClose,
    data,
}: Props) => {
    const router = useRouter();

    const { user } = useUser();

    const { coData } = useListCompanyOwner();

    const { showToast } = useToastStore();

    const queryClient = useQueryClient();

    const { mutate: addCartForHotelApi, isPending } = useMutation({
        mutationFn: addCartForHotel,
    });

    if (!data) return null;

    const { displayData, submitPayload } = data;

    const handleAddtoCart = () => {
        const finalPayload = {
            ...submitPayload,

            strCompanyPartnerGUID:
                submitPayload?.strCompanyPartnerGUID ||
                user?.strCompanyGUID,

            strCompanyOwnerGUID:
                submitPayload?.strCompanyOwnerGUID ||
                coData?.strCompanyGUID,

            intCurrencyID:
                submitPayload?.intCurrencyID ||
                user?.intCurrencyID,
        };

        addCartForHotelApi(finalPayload, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.CART.LIST_CART],
                });

                showToast(
                    "success",
                    "Thêm vào giỏ thành công"
                );

                onClose();

                router.push(paths.cart.list);
            },

            onError: () => {
                showToast(
                    "error",
                    "Thêm vào giỏ thất bại"
                );
            },
        });
    };

    return (
        <PanelPopup
            open={open}
            onClose={onClose}
            title="Xác nhận thêm vào giỏ hàng"
        >
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
                                {displayData?.adultCount || 0} người
                            </div>
                        </div>

                        <div>
                            <div className="text-slate-500">
                                Trẻ em
                            </div>

                            <div className="font-semibold text-slate-900">
                                {displayData?.childCount || 0} trẻ
                            </div>
                        </div>
                    </div>
                </div>

                {/* HOTEL */}
                <div className="rounded-xl border p-4 bg-slate-50">
                    <div className="text-xs text-slate-500">
                        Khách sạn
                    </div>

                    <div className="font-semibold text-slate-900">
                        {displayData?.hotel?.strSupplierName}
                    </div>
                </div>

                {/* ROOM INFO */}
                <div className="rounded-xl border p-4 space-y-1">
                    <div className="text-xs text-slate-500">
                        Phòng
                    </div>

                    <div className="font-semibold text-slate-900">
                        {displayData?.strItemTypeName}{" "}
                        {displayData?.includedBreak
                            ? `- ${displayData?.includedBreak}`
                            : ""}
                    </div>

                    {displayData?.includedBreak && (
                        <div className="text-xs text-emerald-600 flex items-center gap-1">
                            🍽 {displayData?.includedBreak}
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
                                {fDateTime(displayData?.dtmDateFrom)}
                            </div>
                        </div>

                        <div className="text-slate-400">
                            →
                        </div>

                        <div>
                            <div className="font-semibold text-slate-900">
                                {fDateTime(displayData?.dtmDateTo)}
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
                        ₫
                        {displayData?.totalAmount?.toLocaleString()}
                    </div>
                </div>

                {/* ITEMS */}
                <div className="space-y-2">
                    <div className="font-semibold text-slate-800">
                        Chi tiết
                    </div>

                    {displayData?.items?.map(
                        (item: any, idx: number) => (
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
                                    ₫
                                    {item.total?.toLocaleString()}
                                </div>
                            </div>
                        )
                    )}
                </div>

                {/* ACTION */}
                <div className="flex gap-2 pt-2">
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="cursor-pointer flex-1 h-10 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
                    >
                        Huỷ
                    </button>

                    <button
                        onClick={handleAddtoCart}
                        disabled={isPending}
                        className="cursor-pointer flex-1 h-10 rounded-lg bg-[#004b91] hover:bg-[#003d76] text-white disabled:opacity-50"
                    >
                        {isPending
                            ? "Đang xử lý..."
                            : "Xác nhận"}
                    </button>
                </div>
            </div>
        </PanelPopup>
    );
};

export default BookingHotelCartPopup;