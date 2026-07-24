import React from "react";

interface PaymentTableProps {
    t: any;
    price: any;
    payloadItem: any;
    item: any;
    childPriceSummary: any[];
    selectedCurrency: any;
    totalDeposit: number;

    fCurrency: (
        value: number,
        currency?: string
    ) => string;

    fDate: (value: any, format?: string) => string | null;

    addDays: (date: Date, days: number) => Date;

    isValidValue: (value: any) => any;
}

const PaymentTableBooking: React.FC<PaymentTableProps> = ({
    t,
    price,
    payloadItem,
    item,
    childPriceSummary,
    selectedCurrency,
    totalDeposit,
    fCurrency,
    fDate,
    addDays,
    isValidValue,
}) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
                <thead>
                    <tr className="bg-[#1e5bb4] text-white font-medium text-center">
                        <th className="py-2 px-3 border border-[#1a52a3] w-12">
                            {t("no")}
                        </th>

                        <th className="py-2 px-4 border border-[#1a52a3] text-left">
                            {t("serviceName")}
                        </th>

                        <th className="py-2 px-3 border border-[#1a52a3]">
                            {t("guestQuantity")}
                        </th>

                        <th className="py-2 px-3 border border-[#1a52a3]">
                            {t("pricePerPax")}
                        </th>

                        <th className="py-2 px-3 border border-[#1a52a3]">
                            {t("totalCommissionPrice")}
                        </th>

                        <th className="py-2 px-3 border border-[#1a52a3]">
                            {t("totalPrice")}
                        </th>

                        <th className="py-2 px-3 border border-[#1a52a3]">
                            {t("totalDeposit")}
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-center text-gray-700">
                    <tr className="hover:bg-gray-50">
                        {/* No */}
                        <td className="py-3 px-3 align-top border-r border-gray-100">
                            {price.No}
                        </td>

                        {/* Service */}
                        <td className="py-3 px-4 text-left align-top border-r border-gray-100">
                            <div className="font-semibold text-gray-800">
                                {price?.strServiceName}
                            </div>

                            <div className="text-gray-500 text-[11px] mt-0.5">
                                {fDate(isValidValue(payloadItem?.dtmDateFrom))} -{" "}
                                {fDate(
                                    addDays(
                                        new Date(isValidValue(payloadItem?.dtmDateFrom)),
                                        item?.intNoOfDay || 0
                                    )
                                )}
                            </div>
                        </td>

                        {/* Guest */}
                        <td className="py-3 px-3 align-top border-r border-gray-100">
                            <div className="space-y-2 text-left">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-semibold">
                                        {t("adults")}
                                    </span>

                                    <span className="font-semibold">
                                        {payloadItem?.intAdult}
                                    </span>
                                </div>

                                {childPriceSummary.map((child: any) => (
                                    <div
                                        key={child.order}
                                        className="flex items-center justify-between border-t border-gray-100 pt-2"
                                    >
                                        <span className="text-[11px] font-semibold">
                                            {child.label}{" "}
                                            <span className="font-semibold">
                                                ({child.ageFrom}-{child.ageTo})
                                            </span>
                                        </span>

                                        <span className="font-semibold">
                                            {child.quantity}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </td>

                        {/* Unit price */}
                        <td className="py-3 px-3 align-top border-r border-gray-100">
                            <div className="space-y-2 text-center">
                                <div className="min-h-5">
                                    <span className="font-semibold text-gray-900">
                                        {fCurrency(
                                            price?.dblUnitPrice,
                                            selectedCurrency?.label
                                        )}
                                    </span>
                                </div>

                                {childPriceSummary.map((child: any) => (
                                    <div
                                        key={child.order}
                                        className="min-h-5 border-t border-gray-100 pt-2"
                                    >
                                        <span className="font-semibold text-gray-900">
                                            {fCurrency(
                                                child.price,
                                                selectedCurrency?.label
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </td>

                        {/* Commission */}
                        <td className="py-3 px-3 align-top border-r border-gray-100 font-semibold">
                            {fCurrency(
                                price?.dblTotalPriceCom,
                                selectedCurrency?.label
                            )}
                        </td>

                        {/* Total */}
                        <td className="py-3 px-3 align-top border-r border-gray-100 font-semibold">
                            {fCurrency(
                                price?.dblTotalPrice,
                                selectedCurrency?.label
                            )}
                        </td>

                        {/* Payment */}
                        <td className="py-3 px-3 align-top font-semibold">
                            {fCurrency(
                                totalDeposit,
                                selectedCurrency?.label
                            )}
                        </td>
                    </tr>

                    {/* Total row */}
                    <tr className="bg-gray-50/60 font-semibold">
                        <td className="py-2 px-3 border-r border-gray-100" />

                        <td className="py-2 px-4 text-left border-r border-gray-100">
                            {t("totalPrice")}
                        </td>

                        <td className="py-2 px-3 border-r border-gray-100" />

                        <td className="py-2 px-3 border-r border-gray-100" />

                        <td className="py-2 px-3 border-r border-gray-100" />

                        <td className="py-2 px-3 border-r border-gray-100">
                            {fCurrency(
                                price?.dblTotalPrice,
                                selectedCurrency?.label
                            )}
                        </td>

                        <td className="py-2 px-3">
                            {fCurrency(
                                totalDeposit,
                                selectedCurrency?.label
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default PaymentTableBooking;