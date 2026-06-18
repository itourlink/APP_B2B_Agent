import PanelPopup from "@/components/popup/panel-popup";
import { useListCurrency } from "@/components/currency/useListCurrency";
import { useTranslate } from "@/locales";
import { fCurrency } from "@/utils/format-number";

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
}: Props) {
    const { selectedCurrency } = useListCurrency();
    const { t } = useTranslate("booking")
    return (
        <PanelPopup
            open={open}
            onClose={onClose}
            title={t("bookingConfirm")}
            className="max-w-md"
        >
            <div className="space-y-5 text-sm">

                <div className="text-gray-700 leading-relaxed">
                    {t("bookingConfirmQuestion")}
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2 text-xs">

                    <div className="flex justify-between">
                        <span>{t("firstPayment")}:</span>

                        <span className="font-semibold text-[#0f4c81]">

                            {fCurrency(
                                finalDeposit,
                                selectedCurrency?.label
                            )}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>{t("secondPayment")}:</span>

                        <span className="font-semibold text-orange-600">
                            {fCurrency(
                                finalDebt,
                                selectedCurrency?.label
                            )}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>{t("voucher")}:</span>

                        <span className="font-semibold text-red-500">
                            -{fCurrency(
                                totalVoucherAmount,
                                selectedCurrency?.label
                            )}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>{t("paymentMethod")}:</span>

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
                        {t("cancel")}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="cursor-pointer px-4 py-2 rounded bg-[#0f4c81] text-white hover:bg-[#0b3a63] transition disabled:opacity-50"
                    >
                        {isLoading ? t("bookingProcessing") : t("confirmBooking")}
                    </button>

                </div>
            </div>
        </PanelPopup>
    );
}