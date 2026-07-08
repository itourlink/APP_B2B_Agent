import type { ToastType } from "@/zustand/useToastStore";
import VoucherList from "./voucher-list";

interface PaymentDetailSectionProps {
    t: any;
    isShowVoucher: boolean;
    setIsShowVoucher: (value: boolean) => void;

    selectedVoucher: any;
    setSelectedVoucher: (value: any) => void;

    finalVoucherPayment: number;
    totalDeposit: number;
    setTotalVoucherAmount: (value: number) => void;

    hasPayterm: boolean;
    finalDeposit: number;
    finalDebt: number;
    paymentDeadline: string;

    fCurrency: (value: number, currency?: string) => string;
    selectedCurrency: any;

    paymentMethod: string;
    setPaymentMethod: (value: string) => void;

    bankAccountData: any[];
    selectedBankAccount: any;
    setSelectedBankAccount: (value: any) => void;

    bankInfo: any;

    paidRemark: string;
    setPaidRemark: (value: string) => void;

    showToast: (
        type: ToastType,
        message: string
    ) => void;

    isLoading: boolean;
    setIsOpenConfirm: (value: boolean) => void;
}


const PaymentVouBank = ({
    t,
    isShowVoucher,
    setIsShowVoucher,

    selectedVoucher,
    setSelectedVoucher,

    finalVoucherPayment,
    totalDeposit,
    setTotalVoucherAmount,

    hasPayterm,
    finalDeposit,
    finalDebt,
    paymentDeadline,

    fCurrency,
    selectedCurrency,

    paymentMethod,
    setPaymentMethod,

    bankAccountData,
    selectedBankAccount,
    setSelectedBankAccount,

    bankInfo,

    paidRemark,
    setPaidRemark,

    showToast,

    isLoading,
    setIsOpenConfirm,

}: PaymentDetailSectionProps) => {


    return (
        <div className="p-5 border-t border-gray-100 space-y-4">


            {/* Voucher */}
            <div>
                <button
                    onClick={() => setIsShowVoucher(!isShowVoucher)}
                    className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    <span>🎟️</span>
                    {t("voucher")}
                </button>


                <VoucherList
                    isOpen={isShowVoucher}
                    onSelectVoucher={(voucher: any) => {
                        setSelectedVoucher(voucher);
                    }}
                    totalPaymentAmount={finalVoucherPayment}
                    depositAmount={totalDeposit}
                    onVoucherAmountChange={(amount: number) => {
                        setTotalVoucherAmount(amount);
                    }}
                />


                {selectedVoucher && (
                    <div className="mt-2 text-xs text-green-600 font-medium">
                        {t("selectedVoucher")}: {selectedVoucher?.VoucherCode}
                    </div>
                )}

            </div>



            {/* Payment detail */}

            {
                hasPayterm ? (

                    <div className="text-xs space-y-2 pt-2">

                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-700">
                                {t("paymentFirstInstallment")}
                            </span>

                            <span className="font-semibold text-[#1e5bb4] underline">
                                {fCurrency(
                                    finalDeposit,
                                    selectedCurrency?.label
                                )}
                            </span>
                        </div>


                        <div className="text-red-600 text-[11px] font-medium leading-relaxed">
                            {t("paymentNoticePrefix")} {paymentDeadline}{" "}
                            {t("paymentNoticeSuffix")}
                        </div>


                        <div className="flex justify-between items-center pt-1 border-t border-dashed border-gray-200">

                            <span className="font-medium text-gray-700">
                                {t("paymentSecondInstallment")}
                            </span>

                            <span className="font-semibold text-gray-800">
                                {fCurrency(
                                    finalDebt,
                                    selectedCurrency?.label
                                )}
                            </span>

                        </div>

                    </div>


                ) : (

                    <div className="text-xs space-y-2 pt-2">

                        <div className="text-red-600 text-[11px] font-medium leading-relaxed">
                            {t("prepaymentNotDue")}
                        </div>


                        <div className="flex justify-between items-center pt-1 border-t border-dashed border-gray-200">

                            <span className="font-medium text-gray-700">
                                {t("payment")}
                            </span>

                            <span className="font-semibold text-gray-800">
                                {fCurrency(
                                    finalDebt,
                                    selectedCurrency?.label
                                )}
                            </span>

                        </div>

                    </div>

                )
            }



            {/* Payment method */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs">

                <div>

                    <label className="block font-medium text-gray-700 mb-1.5">
                        {t("paymentMethod")}
                    </label>


                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded px-3 py-2"
                    >

                        <option value="Bank transfer">
                            {t("bankTransfer")}
                        </option>

                        <option value="Payment online">
                            {t("paymentOnline")}
                        </option>

                    </select>


                </div>



                {paymentMethod === "Bank transfer" && (
                    <div>
                        <label className="block font-medium text-gray-700 mb-1.5">
                            {t("bankAccount")}
                        </label>

                        <select
                            value={
                                selectedBankAccount?.strCompanyBankAccountGUID || ""
                            }
                            onChange={(e) => {
                                const bank = bankAccountData?.find(
                                    (x: any) =>
                                        x.strCompanyBankAccountGUID === e.target.value
                                );

                                setSelectedBankAccount(bank);
                            }}
                            className="w-full bg-white border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 transition-colors"
                        >
                            {bankAccountData?.map((bank: any) => (
                                <option
                                    key={bank.strCompanyBankAccountGUID}
                                    value={bank.strCompanyBankAccountGUID}
                                >
                                    {bank.strCompanyBankAccountName} -{" "}
                                    {bank.strCompanyBankAccountCode}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

            </div>



            {/* Bank info */}

            {
                paymentMethod === "Bank transfer" && (

                    <div className="border border-slate-200 rounded-lg mt-4 bg-white">

                        <div className="grid grid-cols-1 md:grid-cols-2">

                            <div className="p-6 text-xs space-y-4">

                                <div>
                                    <label>
                                        {t("accountName")}
                                    </label>

                                    <div className="font-bold">
                                        {bankInfo.accountName}
                                    </div>
                                </div>


                                <div>
                                    <label>
                                        {t("accountNumber")}
                                    </label>

                                    <div className="font-bold">
                                        {bankInfo.accountNumber}

                                        <button
                                            className="ml-2"
                                            onClick={() => {

                                                navigator.clipboard.writeText(
                                                    bankInfo.accountNumber
                                                );

                                                showToast(
                                                    "success",
                                                    t("copied")
                                                );

                                            }}
                                        >
                                            📋
                                        </button>

                                    </div>

                                </div>



                                <div>

                                    <label>
                                        {t("bankName")}
                                    </label>

                                    <div>
                                        {bankInfo.bankName}
                                    </div>

                                </div>


                            </div>



                            <div className="bg-gray-50 flex items-center justify-center p-6">

                                <img
                                    src={bankInfo.qrPlaceholder}
                                    className="w-52 h-52 object-contain"
                                    alt="QR"
                                />

                            </div>


                        </div>

                    </div>

                )
            }



            {/* Remark */}

            <textarea

                value={paidRemark}

                onChange={(e) =>
                    setPaidRemark(e.target.value)
                }

                placeholder={t("note")}

                rows={3}

                className="
          w-full 
          border 
          border-gray-300 
          rounded 
          p-3 
          text-xs
        "

            />



            <div className="flex justify-end">

                <button

                    onClick={() =>
                        setIsOpenConfirm(true)
                    }

                    disabled={isLoading}

                    className="
            bg-[#0f4c81]
            text-white
            px-6
            py-2
            rounded
            text-xs
            disabled:opacity-50
          "

                >

                    {
                        isLoading
                            ? t("bookingProcessing")
                            : t("bookingNow")
                    }

                </button>


            </div>


        </div>
    );
};


export default PaymentVouBank;