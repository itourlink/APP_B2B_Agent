import { useUser } from '@/hooks/actions/useAuth';
import { addBookingForTour, fetchGetEmailSendAGHByAGB, fetchGetSendEmail, markUsedVoucher, useDetailAGTransTMSMutation, useListAGTransTMSMutation, useListBankAccount, useListCurrency, useListTourPaymentTerm } from '@/hooks/actions/useBooking';
import { useListCity } from '@/hooks/actions/useCity';
import { useListCompanyOwner } from '@/hooks/actions/useCompanyOwner';
import { statusTabMap, TITLES_OPTIONS } from '@/utils/option-data';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PaymentCountdown from './payment-countdown';
import { isValidValue } from '@/utils/utilts';
import VoucherList from './voucher-list';
import BookingPopup from './booking-popup';
import { useToastStore } from '@/zustand/useToastStore';
import { useGlobalLoading } from '@/zustand/useGlobalLoading';
import { fDate } from '@/utils/format-time';
import { addDays } from 'date-fns';
import { useTranslate } from '@/locales';

const PaymentBookingView: React.FC = () => {
    const { t } = useTranslate("booking")
    const PAYMENT_METHOD_BANK_TRANSFER = "bankTransfer";
    const PAYMENT_METHOD_ONLINE = "paymentOnline";
    const titleOptions = TITLES_OPTIONS.map((option) => ({
        ...option,
        label:
            option.value === "2"
                ? t("mr")
                : option.value === "3"
                    ? t("ms")
                    : option.value === "4"
                        ? t("mrs")
                        : option.label,
    }));
    const { setGlobalLoading } = useGlobalLoading();S            // chỉ xử lý TMS khi có serviceGUID
                        if (serviceGUID) {
                            // get email template
                            const emailData =
                                await fetchGetEmailSendAGHByAGBApi(
                                    {
                                        strBookingGUID:
                                            null,

                                        strCompanyGUID:
                                            companyGUID,

                                        strListAgentHostServiceItemGUID:
                                            serviceGUID,

                                        intLangID:
                                            user?.intLangID,

                                        strEmailTemplateCode:
                                            "BKK",
                                    }
                                );

                            // send email
                            if (emailData) {
                                await fetchGetSendEmailApi(
                                    {
                                        strEmailsSendTo:
                                            emailData?.strEmailsSendTo ||
                                            null,

                                        strEmailsCC:
                                            emailData?.strEmailsCC ||
                                            null,

                                        strEmailsBCC:
                                            emailData?.strEmailsBCC ||
                                            null,

                                        strAttachments:
                                            null,

                                        strSubject:
                                            emailData?.strEmailTemplateSubject ||
                                            null,

                                        IsBodyHtml:
                                            true,

                                        strBody:
                                            emailData?.strEmailTemplateContent ||
                                            null,

                                        intEmailConfigID:
                                            null,
                                    }
                                );
                            }

                            // call TMS APIs song song
                            await Promise.all([
                                listAGTMS({
                                    strCompanyGUID:
                                        companyGUID,

                                    strListAgentHostServiceItemGUID:
                                        serviceGUID,
                                }),

                                detailAGTMS({
                                    strAgentHostCompanyGUID:
                                        companyGUID,

                                    strListAgentHostServiceItemGUID:
                                        serviceGUID,
                                }),
                            ]);
                        }

                        const intBK = res?.[1]?.[0]?.intStatusBk;

                        const activeTab =
                            statusTabMap[intBK] ?? "hold";

                        serviceUrl =
                            `https://myagentmember.itourlink.com/service?activeTab=${activeTab}`;

                        // luôn đá trang
                        window.open(
                            serviceUrl,
                            "_blank"
                        );
                    } catch (err) {
                        console.log(
                            "TMS ERROR",
                            err
                        );

                        // lỗi TMS vẫn cho đá trang
                        window.open(
                            serviceUrl,
                            "_blank"SeSeSeSeaSeaSeSeSear
                        );
                    }
                },

                onError: (_) => {
                    showToast(
                        "error",
                        t("bookingFailed")
                    );

                },
            });
        } catch (err) {
            showToast(
                "error",
                t("invalidVoucher")
            );

        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-100 font-sans text-gray-800 pb-12">

            <PaymentCountdown
                isExpired={isExpired}
                onExpire={() => setIsExpired(true)}
            />

            <div className="max-w-5xl mx-auto px-4 mt-6 space-y-5">

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-gray-50 border-b border-gray-200 px-5 py-3">
                        <h2 className="text-base font-semibold text-gray-700">{t("mainContact")}</h2>
                    </div>
                    <div className="p-5 space-y-2 text-sm">
                        <div className="flex gap-2">
                            <span className="font-medium text-gray-600 min-w-[90px]">{t("fullName")}</span>
                            <span className="text-gray-800">{user?.strFullName}</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-medium text-gray-600 min-w-[90px]">{t("email")}</span>
                            <span className="text-gray-800 font-light">{user?.strEmail}</span>
                        </div>

                        {/* Toggle Switch */}
                        <div className="flex items-center gap-3 pt-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={isShowTravellerForm}
                                    onChange={(e) =>
                                        setIsShowTravellerForm(e.target.checked)
                                    }
                                />

                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>

                            <span className="text-sm font-medium text-gray-600">
                                {t("isTraveller")}
                            </span>
                        </div>
                    </div>

                    {isShowTravellerForm && (
                        <div className="mt-4 p-4 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                                {/* Danh xưng */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">{t("title")} <span className="text-red-500">*</span></label>
                                    <select
                                        name="intSaluteID"
                                        value={
                                            travellerForm.intSaluteID
                                        }
                                        onChange={(e) =>
                                            setTravellerForm(
                                                (prev: any) => ({
                                                    ...prev,
                                                    intSaluteID:
                                                        e.target.value,
                                                })
                                            )
                                        }
                                        className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 bg-white"
                                    >
                                        {titleOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Tên */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">{t("firstName")} <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="strPassengerFirstName"
                                        value={
                                            travellerForm.strPassengerFirstName
                                        }
                                        onChange={(e) =>
                                            setTravellerForm(
                                                (prev: any) => ({
                                                    ...prev,
                                                    strPassengerFirstName:
                                                        e.target.value,
                                                })
                                            )
                                        }
                                        className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
                                        placeholder={t("enterFirstName")}
                                    />
                                </div>

                                {/* Họ và đệm */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">{t("lastName")} <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="strPassengerLastName"
                                        value={
                                            travellerForm.strPassengerLastName
                                        }
                                        onChange={(e) =>
                                            setTravellerForm(
                                                (prev: any) => ({
                                                    ...prev,
                                                    strPassengerLastName:
                                                        e.target.value,
                                                })
                                            )
                                        }
                                        className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
                                        placeholder={t("enterLastName")}
                                    />

                                </div>

                                {/* Quốc tịch */}
                                <div
                                    className="relative"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // setIsOpenCountry(true);
                                    }}
                                >
                                    <label className="block text-gray-700 font-medium mb-1">
                                        {t("nationality")} <span className="text-red-500">*</span>
                                    </label>

                                    {/* Select box */}
                                    <div
                                        onClick={() => setIsOpenCountry(!isOpenCountry)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 bg-white cursor-pointer flex items-center justify-between"
                                    >
                                        <span className={selectedCountry ? "text-black" : "text-gray-400"}>
                                            {selectedCountry?.label || t("selectCountry")}
                                        </span>

                                        <span className="text-gray-500 text-sm">⌄</span>
                                    </div>

                                    {/* Popup dropdown */}
                                    {isOpenCountry && (
                                        <div className="absolute z-50 mt-1 w-full bg-white border border-blue-400 rounded shadow-lg">

                                            {/* Search */}
                                            <div className="p-2 border-b border-gray-200">
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    value={countrySearch}
                                                    onChange={(e) => setCountrySearch(e.target.value)}
                                                    placeholder={t("search")}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500"
                                                />
                                            </div>

                                            {/* List */}
                                            <div className="max-h-60 overflow-y-auto">
                                                {filteredCountries.length > 0 ? (
                                                    filteredCountries.map((option: any) => (
                                                        <div
                                                            key={option.value}
                                                            onClick={() => {
                                                                setCountrySearch(option.label);
                                                                setSelectedCountry(option);
                                                                setTravellerForm((prev: any) => ({
                                                                    ...prev,
                                                                    strCountryGUID: option.value,
                                                                }));
                                                                setIsOpenCountry(false);
                                                            }}
                                                            className="px-3 py-2 text-sm hover:bg-blue-500 hover:text-white cursor-pointer"
                                                        >
                                                            {option.label}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-3 py-2 text-sm text-gray-400">
                                                        {t("countryNotFound")}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Độ tuổi */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">{t("age")} <span className="text-red-500">*</span></label>
                                    <select
                                        name="intAgeID"
                                        disabled
                                        className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 bg-gray-100"
                                    >
                                        <option value="3">{t("adult")}</option>
                                    </select>
                                </div>

                                {/* Ngày sinh */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">{t("dateOfBirth")}</label>
                                    <input
                                        type="date"
                                        name="dtmPassengerBirthday"
                                        value={
                                            travellerForm.dtmPassengerBirthday
                                        }
                                        onChange={(e) =>
                                            setTravellerForm(
                                                (prev: any) => ({
                                                    ...prev,
                                                    dtmPassengerBirthday:
                                                        e.target.value,
                                                })
                                            )
                                        }
                                        className="cursor-pointer w-full border border-gray-300 rounded px-3 py-1.5 outline-none focus:border-blue-500"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">{t("email")}</label>
                                    <input
                                        type="email"
                                        name="strPassengerEmail"
                                        value={
                                            travellerForm.strPassengerEmail
                                        }
                                        onChange={(e) =>
                                            setTravellerForm(
                                                (prev: any) => ({
                                                    ...prev,
                                                    strPassengerEmail:
                                                        e.target.value,
                                                })
                                            )
                                        }
                                        className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
                                        placeholder="example@gmail.com"
                                    />
                                </div>

                                {/* Số điện thoại */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">{t("phoneNumber")}</label>
                                    <input
                                        type="text"
                                        name="strPassengerPhone"
                                        value={
                                            travellerForm.strPassengerPhone
                                        }
                                        onChange={(e) =>
                                            setTravellerForm(
                                                (prev: any) => ({
                                                    ...prev,
                                                    strPassengerPhone:
                                                        e.target.value,
                                                })
                                            )
                                        }
                                        className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
                                        placeholder={t("enterPhoneNumber")}
                                    />
                                </div>
                            </div>

                            {/* Ghi chú hành khách */}
                            <div className="mt-4 text-xs">
                                <textarea
                                    name="strPassengerRemark"
                                    value={
                                        travellerForm.strPassengerRemark
                                    }
                                    onChange={(e) =>
                                        setTravellerForm(
                                            (prev: any) => ({
                                                ...prev,
                                                strPassengerRemark:
                                                    e.target.value,
                                            })
                                        )
                                    }
                                    placeholder={t("note")}
                                    rows={3}
                                    className="w-full border border-gray-300 rounded p-3 outline-none focus:border-blue-500 transition-colors resize-none placeholder-gray-400"
                                />
                            </div>
                        </div>
                    )}

                </div>

                {/* 3. Khối Nội dung thanh toán tour */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    {/* Header công ty */}
                    <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center gap-2">
                        <span className="text-gray-600 text-lg">💼</span>
                        <h2 className="text-base font-bold text-gray-700 uppercase tracking-wide">{t("travelConnectionCompany")}</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-[#1e5bb4] text-white font-medium text-center">
                                    <th className="py-2 px-3 border border-[#1a52a3] w-12">{t("no")}</th>
                                    <th className="py-2 px-4 border border-[#1a52a3] text-left">{t("serviceName")}</th>
                                    <th className="py-2 px-3 border border-[#1a52a3]">{t("totalGuests")}</th>
                                    <th className="py-2 px-3 border border-[#1a52a3]">{t("totalCommissionPrice")}</th>
                                    <th className="py-2 px-3 border border-[#1a52a3]">{t("totalPrice")}</th>
                                    <th className="py-2 px-3 border border-[#1a52a3]">{t("totalPaymentAmount")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-center text-gray-700">
                                <React.Fragment>
                                    <tr className="hover:bg-gray-50">
                                        <td className="py-3 px-3 align-top border-r border-gray-100">{price.No}</td>
                                        <td className="py-3 px-4 text-left align-top border-r border-gray-100">
                                            <div className="font-semibold text-gray-800">{price?.strServiceName}</div>
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
                                        <td className="py-3 px-3 align-top border-r border-gray-100">{totalGuests}</td>
                                        <td className="py-3 px-3 align-top border-r border-gray-100">{isValidValue(price?.dblTotalPriceCom)}</td>
                                        <td className="py-3 px-3 align-top border-r border-gray-100 font-medium">{currencyData?.strCurrencySymbol} {isValidValue(price?.dblTotalPrice)}</td>
                                        <td className="py-3 px-3 align-top font-medium">{currencyData?.strCurrencySymbol} {isValidValue(totalDeposit)}</td>
                                    </tr>
                                    <tr className="bg-gray-50/50 font-semibold">
                                        <td className="py-2 px-3 border-r border-gray-100"></td>
                                        <td className="py-2 px-4 text-left border-r border-gray-100">{t("totalPrice")}</td>
                                        <td className="py-2 px-3 border-r border-gray-100"></td>
                                        <td className="py-2 px-3 border-r border-gray-100">{isValidValue(price?.dblTotalPriceCom)}</td>
                                        <td className="py-2 px-3 border-r border-gray-100">{currencyData?.strCurrencySymbol} {isValidValue(price?.dblTotalPrice)}</td>
                                        <td className="py-2 px-3">{currencyData?.strCurrencySymbol} {isValidValue(totalDeposit)}</td>
                                    </tr>
                                </React.Fragment>
                            </tbody>
                        </table>
                    </div>

                    {/* Section Voucher & Chi tiết đợt thanh toán bên dưới table */}
                    <div className="p-5 border-t border-gray-100 space-y-4">
                        {/* Nút Voucher */}
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
                                onSelectVoucher={(voucher) => {
                                    setSelectedVoucher(voucher);
                                }}
                                totalPaymentAmount={finalVoucherPayment}
                                depositAmount={totalDeposit}
                                onVoucherAmountChange={(amount) => {
                                    setTotalVoucherAmount(amount);
                                }}
                            />

                            {selectedVoucher && (
                                <div className="mt-2 text-xs text-green-600 font-medium">
                                        {t("selectedVoucher")}: {selectedVoucher?.VoucherCode}
                                </div>
                            )}
                        </div>

                        {/* Thông tin các đợt thanh toán và Alert */}
                        <div className="text-xs space-y-2 pt-2">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">{t("paymentFirstInstallment")}</span>
                                <span className="font-semibold text-[#1e5bb4] underline">
                                    {currencyData?.strCurrencySymbol} {isValidValue(finalDeposit)}
                                </span>
                            </div>

                            {/* Alert Đỏ */}
                            <div className="text-red-600 text-[11px] font-medium leading-relaxed">
                                {t("paymentNotice")}{" "}
                                {new Date().toLocaleString("vi-VN", {
                                    weekday: "short",
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                })}{" "}
                            </div>

                            <div className="flex justify-between items-center pt-1 border-t border-dashed border-gray-200">
                                <span className="font-medium text-gray-700">{t("paymentSecondInstallment")}</span>
                                <span className="font-semibold text-gray-800">
                                    {currencyData?.strCurrencySymbol} {isValidValue(finalDebt)}
                                </span>
                            </div>
                        </div>

                        {/* Khu vực Chọn Phương thức & Ngân hàng */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs">
                            <div>
                                <label className="block font-medium text-gray-700 mb-1.5">
                                    {t("paymentMethod")}
                                </label>

                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full bg-white border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 transition-colors"
                                >
                                    <option value={PAYMENT_METHOD_BANK_TRANSFER}>{t("bankTransfer")}</option>
                                    <option value={PAYMENT_METHOD_ONLINE}>{t("paymentOnline")}</option>
                                </select>
                            </div>

                            {/* Chỉ hiện khi Bank transfer */}
                            {paymentMethod === PAYMENT_METHOD_BANK_TRANSFER && (
                                <div>
                                    <label className="block font-medium text-gray-700 mb-1.5">
                                        {t("bankAccount")}
                                    </label>

                                    <select
                                        value={selectedBankAccount?.strCompanyBankAccountGUID || ""}
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

                        {/* Chỉ hiện info bank khi Bank transfer */}
                        {paymentMethod === PAYMENT_METHOD_BANK_TRANSFER && (
                            <div className="flex flex-col items-center text-center text-xs space-y-1.5 py-6 bg-gray-50/50 rounded-lg border border-dashed border-gray-200 mt-4">
                                <p>
                                    <span className="font-medium text-gray-600">
                                        {t("accountName")}
                                    </span>{" "}
                                    <span className="font-semibold text-gray-800">
                                        {bankInfo.accountName}
                                    </span>
                                </p>

                                <p>
                                    <span className="font-medium text-gray-600">
                                        {t("accountNumber")}
                                    </span>{" "}
                                    <span className="font-semibold text-gray-800">
                                        {bankInfo.accountNumber}
                                    </span>
                                </p>

                                <p>
                                    <span className="font-medium text-gray-600">
                                        {t("bankName")}
                                    </span>{" "}
                                    <span className="font-semibold text-gray-800">
                                        {bankInfo.bankName}
                                    </span>
                                </p>

                                <p>
                                    <span className="font-medium text-gray-600">
                                        {t("bankAddress")}
                                    </span>{" "}
                                    <span className="text-gray-700">
                                        {bankInfo.bankAddress}
                                    </span>
                                </p>

                                <p>
                                    <span className="font-medium text-gray-600">
                                        {t("swiftCode")}
                                    </span>{" "}
                                    <span className="font-semibold text-gray-800">
                                        {bankInfo.swiftCode}
                                    </span>
                                </p>

                                <div className="pt-4 flex flex-col items-center">
                                    <div className="w-32 h-32 bg-white border border-gray-200 p-2 rounded flex items-center justify-center shadow-inner">
                                        <img
                                            src={bankInfo.qrPlaceholder}
                                            alt={t("qrCodePayment")}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>

                                    <span className="text-[10px] text-gray-400 mt-1">
                                        {t("qrCode")}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Ô nhập ghi chú */}
                        <div className="pt-2 text-xs">
                            <textarea
                                value={paidRemark}
                                onChange={(e) =>
                                    setPaidRemark(
                                        e.target.value
                                    )
                                }
                                    placeholder={t("note")}
                                rows={3}
                                className="w-full border border-gray-300 rounded p-3 outline-none focus:border-blue-500 transition-colors resize-none placeholder-gray-400"
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={() => setIsOpenConfirm(true)}
                                disabled={isLoading}
                                className="cursor-pointer bg-[#0f4c81] hover:bg-[#0b3a63] text-white font-medium text-xs py-2 px-6 rounded shadow transition-colors duration-150 disabled:opacity-50"
                            >
                                {isLoading ? t("bookingProcessing") : t("bookingNow")}
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <BookingPopup
                open={isOpenConfirm}
                onClose={() => setIsOpenConfirm(false)}
                onConfirm={() => {
                    handleBooking();
                    setIsOpenConfirm(false);
                }}
                isLoading={isLoading}
                finalDeposit={finalDeposit}
                finalDebt={finalDebt}
                totalVoucherAmount={totalVoucherAmount}
                paymentMethod={paymentMethod}
                totalPrice={price?.dblUnitPrice}
            />
        </div>
    );
};

export default PaymentBookingView;
