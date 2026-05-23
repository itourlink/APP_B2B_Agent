import { useEffect, useState } from "react";

import { useListVouchers } from "@/hooks/actions/useBooking";
import { formatCurrency } from "@/utils/format-number";
import { isValidValue } from "@/utils/utilts";

type Props = {
    isOpen: boolean;
    onSelectVoucher?: (voucher: any[]) => void;
};

export default function VoucherList({
    isOpen,
    onSelectVoucher,
}: Props) {
    const {
        voucherData,
        voucherLoading,
    } = useListVouchers(isOpen);

    const [selectedVouchers, setSelectedVouchers] =
        useState<any[]>([]);

    useEffect(() => {
        onSelectVoucher?.(selectedVouchers);
    }, [selectedVouchers]);

    if (!isOpen) return null;

    const isAllSelected =
        voucherData.length > 0 &&
        selectedVouchers.length ===
        voucherData.length;

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedVouchers([]);
            return;
        }

        setSelectedVouchers(voucherData);
    };

    const handleSelectVoucher = (
        voucher: any
    ) => {
        const isSelected =
            selectedVouchers.some(
                (item) =>
                    item?.voucherCode ===
                    voucher?.voucherCode
            );

        if (isSelected) {
            setSelectedVouchers((prev) =>
                prev.filter(
                    (item) =>
                        item?.voucherCode !==
                        voucher?.voucherCode
                )
            );

            return;
        }

        setSelectedVouchers((prev) => [
            ...prev,
            voucher,
        ]);
    };

    return (
        <div
            className="mt-3 border border-gray-200 rounded-lg overflow-hidden bg-white"
            onClick={(e) =>
                e.stopPropagation()
            }
        >
            <div className="max-h-[350px] overflow-auto">
                <table className="w-full text-xs">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr className="text-left text-gray-700">
                            <th className="px-3 py-2 border-b w-10">
                                <input
                                    type="checkbox"
                                    checked={
                                        isAllSelected
                                    }
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        handleSelectAll();
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    className="cursor-pointer"
                                />
                            </th>

                            <th className="px-3 py-2 border-b">
                                #
                            </th>

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
                                    colSpan={7}
                                    className="text-center py-6 text-gray-400"
                                >
                                    Đang tải voucher...
                                </td>
                            </tr>
                        ) : voucherData.length >
                            0 ? (
                            voucherData.map(
                                (
                                    voucher: any,
                                    index: number
                                ) => {
                                    const isSelected =
                                        selectedVouchers.some(
                                            (
                                                item
                                            ) =>
                                                item?.voucherCode ===
                                                voucher?.voucherCode
                                        );

                                    return (
                                        <tr
                                            key={
                                                voucher?.voucherCode ||
                                                index
                                            }
                                            onClick={(
                                                e
                                            ) => {
                                                e.stopPropagation();
                                                handleSelectVoucher(
                                                    voucher
                                                );
                                            }}
                                            className="hover:bg-gray-50 border-b cursor-pointer transition-colors"
                                        >
                                            <td className="px-3 py-2">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        isSelected
                                                    }
                                                    onChange={(
                                                        e
                                                    ) => {
                                                        e.stopPropagation();
                                                        handleSelectVoucher(
                                                            voucher
                                                        );
                                                    }}
                                                    onClick={(
                                                        e
                                                    ) => {
                                                        e.stopPropagation();
                                                    }}
                                                    className="cursor-pointer"
                                                />
                                            </td>

                                            <td className="px-3 py-2">
                                                {index +
                                                    1}
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
                                    );
                                }
                            )
                        ) : (
                            <tr>
                                <td
                                    colSpan={7}
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