import { useEffect, useMemo, useState } from "react";

import { useListVouchers } from "@/hooks/actions/useBooking";
import { formatCurrency } from "@/utils/format-number";
import { isValidValue } from "@/utils/utilts";

type Props = {
    isOpen: boolean;
    totalPaymentAmount?: number;
    onSelectVoucher?: (voucher: any[]) => void;
    onFinalPaymentChange?: (amount: number) => void;
};

export default function VoucherList({
    isOpen,
    onSelectVoucher,
    totalPaymentAmount,
    onFinalPaymentChange
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


    const totalVoucherAmount = useMemo(() => {
        return selectedVouchers.reduce(
            (total, item) =>
                total +
                Number(
                    item?.voucherAmountBalance || 0
                ),
            0
        );
    }, [selectedVouchers]);


    const finalPayment = (totalPaymentAmount || 0) - totalVoucherAmount;

    useEffect(() => {
        onFinalPaymentChange?.(
            Math.max(finalPayment, 0)
        );
    }, [finalPayment]);

    const isAllSelected = voucherData.length > 0 && selectedVouchers.length === voucherData.length;

    if (!isOpen) return null;

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
        <div className="">
            {/* Vùng hiển thị voucher đã chọn */}
            {selectedVouchers.length > 0 && (
                <div className="mt-3 border border-gray-200 rounded-lg bg-gray-50 p-4 text-sm">
                    <div className="text-green-600 font-semibold mb-3">
                        ✓ Voucher đã áp dụng:
                    </div>

                    <div className="space-y-2">
                        {selectedVouchers.map(
                            (
                                voucher,
                                index
                            ) => (
                                <div
                                    key={
                                        voucher?.voucherCode ||
                                        index
                                    }
                                    className="flex items-center justify-between border-b border-gray-200 pb-2"
                                >
                                    <div className="text-gray-700">
                                        -{" "}
                                        <span className="font-semibold text-red-500">
                                            {
                                                voucher?.voucherCode
                                            }
                                        </span>{" "}
                                        -{" "}
                                        {
                                            voucher?.voucherName
                                        }
                                    </div>

                                    <div className="font-semibold text-red-500">
                                        -
                                        {formatCurrency(
                                            voucher?.voucherAmountBalance ||
                                            0
                                        )}
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    <div className="mt-4 space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">
                                Tổng tiền sau
                                voucher:
                            </span>

                            <span className="font-semibold text-green-600">
                                {formatCurrency(
                                    totalPaymentAmount || 0
                                )}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">
                                Phí thanh toán
                                sau voucher:
                            </span>

                            <span className="font-semibold text-green-600">
                                {formatCurrency(
                                    Math.max(
                                        finalPayment,
                                        0
                                    )
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                        <div className="text-xs text-gray-500">
                            Tổng tiết kiệm:{" "}
                            <span className="text-red-500 font-semibold">
                                {formatCurrency(
                                    totalVoucherAmount
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            )}

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
        </div>
    );
}