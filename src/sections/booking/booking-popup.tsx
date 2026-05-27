import PanelPopup from "@/components/popup/panel-popup";

type Props = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
    finalDeposit?: number;
    finalDebt?: number;
    totalVoucherAmount?: number;
    paymentMethod?: string;
    totalPrice?: number;
};

export default function BookingPopup({
    open,
    onClose,
    onConfirm,
    isLoading,
    finalDeposit,
    finalDebt,
    totalVoucherAmount,
    paymentMethod,
    totalPrice,
}: Props) {

    const formatCurrency = (amount?: any) => {
        const value =
            typeof amount === "number" || typeof amount === "string"
                ? Number(amount)
                : 0;

        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        })
            .format(isNaN(value) ? 0 : value)
            .replace("₫", "đ");
    };

    return (
        <PanelPopup
            open={open}
            onClose={onClose}
            title="Xác nhận đặt"
            className="max-w-md"
        >
            <div className="space-y-5 text-sm">

                <div className="text-gray-700 leading-relaxed">
                    Bạn có chắc chắn muốn đặt này không?
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2 text-xs">

                    <div className="flex justify-between">
                        <span>Thanh toán đợt 1:</span>

                        <span className="font-semibold text-[#0f4c81]">
                            {formatCurrency(finalDeposit)}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>Thanh toán đợt 2:</span>

                        <span className="font-semibold text-orange-600">
                            {formatCurrency(finalDebt)}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>Voucher:</span>

                        <span className="font-semibold text-red-500">
                            -{formatCurrency(totalVoucherAmount)}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>Phương thức:</span>

                        <span className="font-medium">
                            {paymentMethod}
                        </span>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">

                    <button
                        onClick={onClose}
                        className="cursor-pointer px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
                    >
                        Huỷ
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="cursor-pointer px-4 py-2 rounded bg-[#0f4c81] text-white hover:bg-[#0b3a63] transition disabled:opacity-50"
                    >
                        {isLoading ? "Đang đặt..." : "Xác nhận đặt"}
                    </button>

                </div>
            </div>
        </PanelPopup>
    );
}