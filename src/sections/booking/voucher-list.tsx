import { useListVouchers } from "@/hooks/actions/useBooking";
import { formatCurrency } from "@/utils/format-number";
import { isValidValue } from "@/utils/utilts";

type Props = {
    isOpen: boolean;
    onSelectVoucher?: (voucher: any) => void;
};

export default function VoucherList({
    isOpen,
    onSelectVoucher,
}: Props) {
    const {
        voucherData,
        voucherLoading,
    } = useListVouchers(isOpen);

    if (!isOpen) return null;

    return (
        <div className="mt-3 border border-gray-200 rounded-lg overflow-hidden bg-white">
            <div className="max-h-[350px] overflow-auto">
                <table className="w-full text-xs">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr className="text-left text-gray-700">
                            <th className="px-3 py-2 border-b">#</th>

                            <th className="px-3 py-2 border-b">
                                Mã Voucher
                            </th>

                            <th className="px-3 py-2 border-b">
                                Tên Voucher
                            </th>

                            <th className="px-3 py-2 border-b">
                                Hiệu lực
                            </th>

                            <th className="px-3 py-2 border-b">
                                Đơn vị phát hành
                            </th>

                            <th className="px-3 py-2 border-b text-right">
                                Số dư
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {voucherLoading ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="text-center py-6 text-gray-400"
                                >
                                    Đang tải voucher...
                                </td>
                            </tr>
                        ) : voucherData.length > 0 ? (
                            voucherData.map(
                                (voucher: any, index: number) => (
                                    <tr
                                        key={
                                            voucher?.voucherCode ||
                                            index
                                        }
                                        onClick={() =>
                                            onSelectVoucher?.(voucher)
                                        }
                                        className="hover:bg-gray-50 border-b cursor-pointer transition-colors"
                                    >
                                        <td className="px-3 py-2">
                                            {index + 1}
                                        </td>

                                        <td className="px-3 py-2 font-semibold text-red-500">
                                            {voucher?.voucherCode ||
                                                "---"}
                                        </td>

                                        <td className="px-3 py-2">
                                            {voucher?.voucherName ||
                                                "---"}
                                        </td>

                                        <td className="px-3 py-2 whitespace-nowrap">
                                            {isValidValue(
                                                voucher?.dateValidFrom
                                            )}{" "}
                                            -{" "}
                                            {isValidValue(
                                                voucher?.dateValidTo
                                            )}
                                        </td>

                                        <td className="px-3 py-2">
                                            {voucher?.fromCompanyName ||
                                                "---"}
                                        </td>

                                        <td className="px-3 py-2 text-right font-semibold text-green-600">
                                            {formatCurrency(
                                                voucher?.voucherAmountBalance ||
                                                0
                                            )}
                                        </td>
                                    </tr>
                                )
                            )
                        ) : (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="text-center py-6 text-gray-400"
                                >
                                    Không có voucher
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}