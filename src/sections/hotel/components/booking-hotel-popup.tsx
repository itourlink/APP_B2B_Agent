import PanelPopup from "@/components/popup/panel-popup";
import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";
import { fDateTime } from "@/utils/format-time";
import { useTranslation } from "react-i18next";
import SurFoc from "./sur-foc";
import { useListSupplierPaymentTerm, useListSurchargeDateForAgent } from "@/hooks/actions/useBooking";
import { fCurrency } from "@/utils/format-number";
import { useListCurrency } from "@/components/currency/useListCurrency";

type Props = {
    open: boolean;
    onClose: () => void;
    data: any;
    focData: any;
    dateBooking: any
};

const BookingHotelPopup = ({ open, onClose, data, focData, dateBooking }: Props) => {
    const { t } = useTranslation("hotel")
    const router = useRouter()
    const { selectedCurrency } = useListCurrency();

    useListSupplierPaymentTerm({
        strSupplierGUID: data?.submitPayload?.strSupplierGUID,
    });

    useListSurchargeDateForAgent({
        strSupplierGUID: data?.submitPayload?.strSupplierGUID,
    });

    const totalQty =
        data?.items?.reduce(
            (sum: number, item: any) => sum + (item.qty || 0),
            0,
        ) || 0;

    if (!data) return null;

    return (
        <PanelPopup
            open={open}
            onClose={onClose}
            title={t("confirmBookingRoom")}
            className="w-[1000px]"
        >
            <div>
                {/* HOTEL */}
                <div className="mb-5">
                    <h3 className="font-semibold text-lg text-slate-900">
                        {data.hotel?.strSupplierName}
                    </h3>

                    <p className="text-sm text-slate-500">
                        {data.strItemTypeName}
                        {data?.includedBreak &&
                            ` • ${data?.includedBreak}`}
                    </p>
                </div>

                {/* SUMMARY */}
                <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-sm">
                        <tbody>
                            <tr className="border-b border-slate-200">
                                <td className="bg-slate-50 px-4 py-3 font-medium w-40">
                                    {t("adult")}
                                </td>

                                <td className="px-4 py-3">
                                    {data.adultCount || 0} {t("personUnit")}
                                </td>
                            </tr>

                            <tr className="border-b border-slate-200">
                                <td className="bg-slate-50 px-4 py-3 font-medium">
                                    {t("child")}
                                </td>

                                <td className="px-4 py-3">
                                    {data.childCount || 0} {t("childUnit")}
                                </td>
                            </tr>

                            <tr className="border-b border-slate-200">
                                <td className="bg-slate-50 px-4 py-3 font-medium">
                                    {t("stayTime")}
                                </td>

                                <td className="px-4 py-3">
                                    {fDateTime(data.dtmDateFrom)}
                                    {" → "}
                                    {fDateTime(data.dtmDateTo)}
                                </td>
                            </tr>

                            <tr>
                                <td className="bg-slate-50 px-4 py-3 font-medium">
                                    {t("room")}
                                </td>

                                <td className="px-4 py-3">
                                    {data.strItemTypeName}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* DETAIL */}
                <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="text-left px-4 py-3">
                                    {t("detail")}
                                </th>

                                <th className="text-center px-4 py-3 w-24">
                                    {t("quantity")}
                                </th>

                                <th className="text-right px-4 py-3 w-40">
                                    {t("totalPayment")}
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.items?.map(
                                (item: any, idx: number) => (
                                    <tr
                                        key={idx}
                                        className="border-b border-slate-100 last:border-b-0"
                                    >
                                        <td className="px-4 py-3">
                                            {item.label}
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            {item.qty}
                                        </td>

                                        <td className="px-4 py-3 text-right font-medium">
                                            {fCurrency(
                                                item.total,
                                                selectedCurrency?.label
                                            )}
                                        </td>
                                    </tr>
                                ),
                            )}
                        </tbody>

                        <tfoot>
                            <tr className="bg-blue-50 border-t border-blue-200">
                                <td
                                    colSpan={2}
                                    className="px-4 py-4 text-right font-semibold"
                                >
                                    {t("totalPayment")}
                                </td>

                                <td className="px-4 py-4 text-right text-lg font-bold text-blue-600">
                                    {fCurrency(
                                        data.totalAmount,
                                        selectedCurrency?.label
                                    )}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {totalQty >= 5 && (
                    <SurFoc
                        items={data?.items}
                        focData={focData}
                    />
                )}

                {/* ACTION */}
                <div className="flex gap-3 mt-5">
                    <button
                        onClick={onClose}
                        className="cursor-pointer flex-1 h-11 rounded-lg border border-slate-300 hover:bg-slate-50"
                    >
                        {t("cancel")}
                    </button>

                    <button
                        onClick={() => {
                            router.replaceParams(
                                paths.booking.paymentBookingHotel,
                                {
                                    bookingPayload: data,
                                    dateBooking: dateBooking
                                },
                            );
                        }}
                        className="cursor-pointer flex-1 h-11 rounded-lg bg-[#004b91] hover:bg-[#003d76] text-white"
                    >
                        {t("confirm")}
                    </button>
                </div>
            </div>
        </PanelPopup>
    );
};

export default BookingHotelPopup;