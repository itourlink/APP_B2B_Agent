import { useUser } from '@/hooks/actions/useAuth';
import { addBookingForHotel, fetchGetEmailSendAGHByAGB, fetchGetSendEmail, markUsedVoucher, useDetailAGTransTMSMutation, useListAGTransTMSMutation, useListBankAccount, useListSupplierPaymentTerm } from '@/hooks/actions/useBooking';
import { useListCity } from '@/hooks/actions/useCity';
import { useListCompanyOwner } from '@/hooks/actions/useCompanyOwner';
import { statusTabMap, TITLES_OPTIONS } from '@/utils/option-data';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PaymentCountdown from '../components/payment-countdown';
import VoucherList from '../components/voucher-list';
import BookingPopup from '../components/booking-popup';
import { useToastStore } from '@/zustand/useToastStore';
import { useGlobalLoading } from '@/zustand/useGlobalLoading';
import { fDateTime } from '@/utils/format-time';
import { useTranslate } from '@/locales';
import { useCurrency } from '@/components/currency/useCurrency';
import { fCurrency } from '@/utils/format-number';
import { useListCurrency } from '@/components/currency/useListCurrency';
import { twMerge } from "tailwind-merge";
import { getFlagClass } from '@/utils/utilts';
import i18next from 'i18next';
import { z } from "zod";

const PaymentBookingHotelView: React.FC = () => {
    const { selectedCurrency } = useListCurrency();
    const { t } = useTranslate("booking")
    const { currencyId } = useCurrency();
    const { setGlobalLoading } = useGlobalLoading();
    const getTitleLabel = (label: string) => {
        switch (label) {
            case "Mr":
                return t("mr");
            case "Ms":
                return t("ms");
            case "Mrs":
                return t("mrs");
            default:
                return label;
        }
    };

    const location = useLocation();

    const bookingPayload = location.state?.bookingPayload;

    const dateBooking = location.state?.dateBooking

    const items = bookingPayload?.items || [];

    const room = bookingPayload?.room || {}
    const totalPrice =
        Number(
            bookingPayload?.totalAmount || 0
        );

    const totalCommission =
        Number(location.state?.totalCommission || 0);

    const { showToast } = useToastStore();
    const { bankAccountData } = useListBankAccount();
    const { user } = useUser()
    const { coData } = useListCompanyOwner();
    const [isShowTravellerForm, setIsShowTravellerForm] = useState(false);
    const [isShowVoucher, setIsShowVoucher] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
    const [isExpired, setIsExpired] = useState(false);
    const [paidRemark, setPaidRemark] = useState("");
    const [travellerForm, setTravellerForm] =
        useState<any>({
            intSaluteID: "2",
            strPassengerFirstName: "",
            strPassengerLastName: "",
            strCountryGUID: "",
            dtmPassengerBirthday: "",
            strPassengerEmail: "",
            strPassengerPhone: "",
            strPassengerRemark: "",
        });
    const [travellerErrors, setTravellerErrors] = useState<any>({});

    // --- STATE FOR FORMS ---
    const [paymentMethod, setPaymentMethod] = useState('Bank transfer');

    const [selectedBankAccount, setSelectedBankAccount] = useState<any>(null);

    useEffect(() => {
        if (bankAccountData?.length > 0) {
            setSelectedBankAccount(bankAccountData[0]);
        }
    }, [bankAccountData]);

    const { mutateAsync: addBookingForHotelApi, isPending: isLoading } = useMutation({
        mutationFn: addBookingForHotel,
    });

    const { mutateAsync: markUsedVoucherApi, isPending: isVcPending } = useMutation({
        mutationFn: markUsedVoucher,
    });

    const { mutateAsync: fetchGetEmailSendAGHByAGBApi } = useMutation({
        mutationFn: fetchGetEmailSendAGHByAGB,
    });
    const { mutateAsync: fetchGetSendEmailApi } = useMutation({
        mutationFn: fetchGetSendEmail,
    });

    const { mutateAsync: listAGTMS, isPending: isListAGTMSPending } =
        useListAGTransTMSMutation();

    const { mutateAsync: detailAGTMS, isPending: isDetailAGTMSPending } =
        useDetailAGTransTMSMutation();

    const { supPaytermData } = useListSupplierPaymentTerm({
        dtmCheckInDate: dateBooking?.start?.toISOString(),
        strSupplierGUID: bookingPayload?.strSupplierGUID,
    });

    const { ctData } = useListCity({
        strTableName: "MC02",
        strFeildSelect: "MC02_CountryCode AS code, MC02_CountryGUID AS intID,MC02_CountryName AS strName,MC02_CountryGUID AS id,MC02_CountryName AS text,MC02_CountryName AS strCountryName, MC02_CountryFlagIcon strCountryFlagIcon",
        strWhere: "WHERE (IsActive=1)  ORDER BY MC02_CountryName ASC ",
    })

    const COUNTRY_OPTIONS = ctData.map((item: any) => ({
        label: item.strName,
        value: item.id,
        flag: item.strCountryFlagIcon
    }));

    const [countrySearch, setCountrySearch] = useState("");
    const [isOpenCountry, setIsOpenCountry] = useState(false);
    const [isOpenConfirm, setIsOpenConfirm] = useState(false);

    const selectedCountry = COUNTRY_OPTIONS.find(
        (item: any) => item.value === travellerForm.strCountryGUID
    );

    const filteredCountries = COUNTRY_OPTIONS.filter((item: any) =>
        item.label.toLowerCase().includes(countrySearch.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = () => {
            setIsOpenCountry(false);
        };

        window.addEventListener("click", handleClickOutside);

        return () => {
            window.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const extractNumber = (value?: string) => {
        if (!value) return 0;

        const parser = new DOMParser();
        const doc = parser.parseFromString(value, "text/html");
        const text = doc.body.textContent || "";

        const match = text.match(/(\d+)/);
        return match ? Number(match[1]) : 0;
    };

    const totalGuests = items.reduce(
        (sum: number, item: any) =>
            sum + extractNumber(item?.intQuantity),
        0
    );

    const rawPercentage = (supPaytermData || []).reduce(
        (sum: number, item: any) =>
            sum + (Number(item?.dblPaymentPercentage) || 0),
        0
    );

    const totalPercentage =
        rawPercentage > 100 ? 0 : rawPercentage;

    // giá trị deposit chung

    const totalDeposit =
        Number(totalPrice || 0) * (totalPercentage / 100);

    const totalDebt =
        totalPrice - totalDeposit;

    const [finalVoucherPayment] =
        useState(totalPrice);

    const [totalVoucherAmount, setTotalVoucherAmount] = useState(0);

    const finalDeposit =
        Math.max(totalDeposit - totalVoucherAmount, 0);

    const finalDebt =
        Math.max(totalDebt - totalVoucherAmount, 0);

    const bankInfo = {
        accountName:
            selectedBankAccount?.strCompanyBankAccountName || "---",

        accountNumber:
            selectedBankAccount?.strCompanyBankAccountCode || "---",

        bankName:
            selectedBankAccount?.strCompanyBankAccountInfo || "---",

        bankAddress:
            selectedBankAccount?.strBankAddress || "---",

        swiftCode:
            selectedBankAccount?.strSwiftCode || "---",

        qrPlaceholder:
            typeof selectedBankAccount?.strLinkQRCode === "string" &&
                selectedBankAccount?.strLinkQRCode
                ? selectedBankAccount?.strLinkQRCode
                : "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=NoQRCode",
    };

    if (isExpired) {
        return <div className="w-full min-h-screen bg-white"></div>;
    }

    useEffect(() => {

        const isPending =
            isLoading ||
            isVcPending ||
            isListAGTMSPending ||
            isDetailAGTMSPending;

        setGlobalLoading(isPending);

    }, [
        isLoading,
        isVcPending,
        isListAGTMSPending,
        isDetailAGTMSPending,
    ]);

    const handleBooking = async () => {
        if (isShowTravellerForm) {
            const travellerSchema = z.object({
                intSaluteID: z.string().min(1, t("pleaseSelectTitle") || "Vui lòng chọn danh xưng"),
                strPassengerFirstName: z.string().trim().min(1, t("pleaseEnterFirstName") || "Vui lòng nhập tên"),
                strPassengerLastName: z.string().trim().min(1, t("pleaseEnterLastName") || "Vui lòng nhập họ và tên đệm"),
                strCountryGUID: z.string().min(1, t("pleaseSelectCountry") || "Vui lòng chọn quốc tịch"),
                dtmPassengerBirthday: z.string().min(1, t("pleaseEnterDateOfBirth") || "Vui lòng chọn ngày sinh"),
                strPassengerEmail: z.string()
                    .trim()
                    .min(1, t("pleaseEnterEmail") || "Vui lòng nhập email")
                    .email(t("pleaseEnterValidEmail") || "Email không hợp lệ"),
                strPassengerPhone: z.string().trim().min(1, t("pleaseEnterPhoneNumber") || "Vui lòng nhập số điện thoại"),
            });

            const validation = travellerSchema.safeParse(travellerForm);

            if (!validation.success) {
                const newErrors: any = {};
                validation.error.issues.forEach((issue) => {
                    newErrors[issue.path[0]] = issue.message;
                });
                setTravellerErrors(newErrors);

                const firstError = validation.error.issues[0]?.message;
                showToast("error", firstError);
                return;
            }
            setTravellerErrors({});
        }

        // const bookingTab = window.open("http://localhost:5173/service?activeTab=loading", "_blank");
        const bookingTab = window.open("https://myagentmember.itourlink.com/service?activeTab=loading", "_blank");

        try {

            // apply voucher trước
            if (selectedVoucher?.length > 0) {
                await Promise.all(
                    selectedVoucher.map((voucher: any) =>
                        new Promise((resolve, reject) => {

                            markUsedVoucherApi(
                                {
                                    VoucherCode: voucher?.voucherCode,
                                    updatedBy: user?.strUserGUID || null,
                                },
                                {
                                    onSuccess: () => {
                                        resolve(true);
                                    },

                                    onError: (err) => {

                                        showToast(
                                            "error",
                                            t("voucherApplyFailed"),
                                        );

                                        reject(err);
                                    },
                                }
                            );

                        })
                    )
                );
                showToast(
                    "success",
                    t("voucherApplySuccess"),
                );
            }

            // payload booking
            const payload = {
                strUserGUID:
                    user?.strUserGUID || null,

                strCompanyAgentGUID:
                    user?.strCompanyGUID || null,

                strCompanyOwnerGUID:
                    coData?.strCompanyGUID || null,

                // HOTEL
                strSupplierGUID:
                    bookingPayload?.strSupplierGUID || null,

                strPriceLevelGUID:
                    bookingPayload?.strPriceLevelGUID || null,

                strPriceListGUID:
                    bookingPayload?.strPriceListGUID || null,

                // ROOM INFO
                intAdult:
                    bookingPayload?.intAdult || 0,

                strListChildAge:
                    bookingPayload?.strListChildAge || "",

                strListItemTypeGUID:
                    bookingPayload?.strListItemTypeGUID || "",

                strListSupplierChildAgeGUID:
                    bookingPayload?.strListSupplierChildAgeGUID || "",

                strListSurchargeDateGUID: "",

                // DATE
                dtmDateFrom: bookingPayload?.dtmDateFrom
                    ? new Date(bookingPayload.dtmDateFrom).toISOString()
                    : null,

                dtmDateTo: bookingPayload?.dtmDateTo
                    ? new Date(bookingPayload.dtmDateTo).toISOString()
                    : null,

                // CURRENCY
                intCurrencyID: currencyId,

                // PAYMENT
                intPaymentMethodID:
                    paymentMethod === "Bank transfer"
                        ? 1
                        : 2,

                strCompanyBankAccountGUID:
                    selectedBankAccount?.strCompanyBankAccountGUID || null,

                strPaidRemark:
                    paidRemark || null,

                // TRAVELLER
                intSaluteID:
                    isShowTravellerForm
                        ? travellerForm?.intSaluteID || null
                        : null,

                intAgeID:
                    isShowTravellerForm
                        ? "3"
                        : null,

                intPassengerAges:
                    null,

                strPassengerFirstName:
                    isShowTravellerForm
                        ? travellerForm?.strPassengerFirstName || null
                        : null,

                strPassengerLastName:
                    isShowTravellerForm
                        ? travellerForm?.strPassengerLastName || null
                        : null,

                dtmPassengerBirthday:
                    isShowTravellerForm
                        ? travellerForm?.dtmPassengerBirthday || null
                        : null,

                dtmPasspostExpirationDate:
                    null,

                strPassengerEmail:
                    isShowTravellerForm
                        ? travellerForm?.strPassengerEmail || null
                        : null,

                strPassengerPhone:
                    isShowTravellerForm
                        ? travellerForm?.strPassengerPhone || null
                        : null,

                strPassengerRemark:
                    isShowTravellerForm
                        ? travellerForm?.strPassengerRemark || null
                        : null,

                strPassport:
                    null,

                strCountryGUID:
                    isShowTravellerForm
                        ? travellerForm?.strCountryGUID || null
                        : null,

                IsTraveller:
                    isShowTravellerForm,

                // VOUCHER
                VoucherCode:
                    selectedVoucher?.length > 0
                        ? selectedVoucher
                            .map((item: any) => item?.voucherCode)
                            .filter(Boolean)
                            .join(",")
                        : null,
            };

            try {
                const res = await addBookingForHotelApi(payload);

                showToast(
                    "success",
                    t("bookingSuccess")
                );

                const serviceGUID =
                    res?.[0]?.[0]?.strListAgentHostServiceItemGUID;

                const intBK =
                    res?.[0]?.[0]?.intStatusBk;

                const activeTab =
                    statusTabMap[intBK] ?? "hold";

                try {

                    if (serviceGUID) {

                        const emailTemplateRes =
                            await fetchGetEmailSendAGHByAGBApi({
                                strBookingGUID: null,
                                strCompanyGUID: coData?.strCompanyGUID,
                                strListAgentHostServiceItemGUID: serviceGUID,
                                intLangID: user?.intLangID,
                                strEmailTemplateCode: "BKK",
                            });

                        if (emailTemplateRes) {

                            await fetchGetSendEmailApi({
                                strEmailsSendTo:
                                    emailTemplateRes?.strEmailsSendTo || null,

                                strEmailsCC:
                                    emailTemplateRes?.strEmailsCC || null,

                                strEmailsBCC:
                                    emailTemplateRes?.strEmailsBCC || null,

                                strAttachments: null,

                                strSubject:
                                    emailTemplateRes?.strEmailTemplateSubject || null,

                                IsBodyHtml: true,

                                strBody:
                                    emailTemplateRes?.strEmailTemplateContent || null,

                                intEmailConfigID: null,
                            });
                        }

                        await listAGTMS({
                            strCompanyGUID:
                                coData?.strCompanyGUID,

                            strListAgentHostServiceItemGUID:
                                serviceGUID,
                        });

                        await detailAGTMS({
                            strAgentHostCompanyGUID:
                                coData?.strCompanyGUID,

                            strListAgentHostServiceItemGUID:
                                serviceGUID,
                        });
                    }

                } catch (e) {
                    console.error("after booking error", e);
                }

                // bookingTab?.location.replace(
                //     `http://localhost:5173/service?activeTab=${activeTab}`
                // );
                bookingTab?.location.replace(
                    `https://myagentmember.itourlink.com/service?activeTab=${activeTab}`
                );

            } catch (err) {

                console.error(err);

                showToast(
                    "error",
                    t("bookingFailed")
                );

                bookingTab?.close();
            }

        } catch (err) {

            showToast(
                "error",
                t("invalidVoucher")
            );

        }
    };



    return (
        <div className="w-full min-h-screen bg-gray-100 font-sans text-gray-800 pb-12">

            <PaymentCountdown onExpire={() => setIsExpired(true)} />

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
                                        onChange={(e) => {
                                            setTravellerForm(
                                                (prev: any) => ({
                                                    ...prev,
                                                    intSaluteID:
                                                        e.target.value,
                                                })
                                            );
                                            if (travellerErrors.intSaluteID) {
                                                setTravellerErrors((prev: any) => ({ ...prev, intSaluteID: "" }));
                                            }
                                        }}
                                        className={twMerge(
                                            "w-full border rounded px-3 py-2 outline-none focus:border-blue-500 bg-white",
                                            travellerErrors.intSaluteID ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
                                        )}
                                    >
                                        {TITLES_OPTIONS.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {getTitleLabel(option.label)}
                                            </option>
                                        ))}
                                    </select>
                                    {travellerErrors.intSaluteID && (
                                        <div className="text-red-500 text-[10px] mt-1.5 flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                                <line x1="9" y1="9" x2="15" y2="15"></line>
                                            </svg>
                                            <span>{travellerErrors.intSaluteID}</span>
                                        </div>
                                    )}
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
                                        onChange={(e) => {
                                            setTravellerForm(
                                                (prev: any) => ({
                                                    ...prev,
                                                    strPassengerFirstName:
                                                        e.target.value,
                                                })
                                            );
                                            if (travellerErrors.strPassengerFirstName) {
                                                setTravellerErrors((prev: any) => ({ ...prev, strPassengerFirstName: "" }));
                                            }
                                        }}
                                        className={twMerge(
                                            "w-full border rounded px-3 py-2 outline-none focus:border-blue-500",
                                            travellerErrors.strPassengerFirstName ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
                                        )}
                                        placeholder={t("enterFirstName")}
                                    />
                                    {travellerErrors.strPassengerFirstName && (
                                        <div className="text-red-500 text-[10px] mt-1.5 flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                                <line x1="9" y1="9" x2="15" y2="15"></line>
                                            </svg>
                                            <span>{travellerErrors.strPassengerFirstName}</span>
                                        </div>
                                    )}
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
                                        onChange={(e) => {
                                            setTravellerForm(
                                                (prev: any) => ({
                                                    ...prev,
                                                    strPassengerLastName:
                                                        e.target.value,
                                                })
                                            );
                                            if (travellerErrors.strPassengerLastName) {
                                                setTravellerErrors((prev: any) => ({ ...prev, strPassengerLastName: "" }));
                                            }
                                        }}
                                        className={twMerge(
                                            "w-full border rounded px-3 py-2 outline-none focus:border-blue-500",
                                            travellerErrors.strPassengerLastName ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
                                        )}
                                        placeholder={t("enterLastName")}
                                    />
                                    {travellerErrors.strPassengerLastName && (
                                        <div className="text-red-500 text-[10px] mt-1.5 flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                                <line x1="9" y1="9" x2="15" y2="15"></line>
                                            </svg>
                                            <span>{travellerErrors.strPassengerLastName}</span>
                                        </div>
                                    )}

                                </div>

                                {/* Quốc tịch */}
                                <div
                                    className="relative"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <label className="block text-gray-700 font-medium mb-1">
                                        {t("nationality")} <span className="text-red-500">*</span>
                                    </label>

                                    {/* Select box */}
                                    <div
                                        onClick={() => setIsOpenCountry(!isOpenCountry)}
                                        className={twMerge(
                                            "w-full border rounded px-3 py-2 bg-white cursor-pointer flex items-center justify-between",
                                            travellerErrors.strCountryGUID ? "border-red-500" : "border-gray-300"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            {selectedCountry?.flag && (
                                                <span
                                                    className={twMerge(
                                                        getFlagClass(selectedCountry.flag),
                                                        "rounded-sm shrink-0"
                                                    )}
                                                />
                                            )}

                                            <span
                                                className={selectedCountry ? "text-black" : "text-gray-400"}
                                            >
                                                {selectedCountry?.label || t("selectCountry")}
                                            </span>
                                        </div>

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
                                                    filteredCountries.map((item: any) => (
                                                        <div
                                                            key={item.value}
                                                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                                            onClick={() => {
                                                                setTravellerForm((prev: any) => ({
                                                                    ...prev,
                                                                    strCountryGUID: item.value,
                                                                }));

                                                                setIsOpenCountry(false);
                                                            }}
                                                        >
                                                            {item.flag && (
                                                                <span
                                                                    className={twMerge(
                                                                        getFlagClass(item.flag),
                                                                        "rounded-sm shrink-0"
                                                                    )}
                                                                />
                                                            )}

                                                            <span>{item.label}</span>
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
                                    {travellerErrors.strCountryGUID && (
                                        <div className="text-red-500 text-[10px] mt-1.5 flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                                <line x1="9" y1="9" x2="15" y2="15"></line>
                                            </svg>
                                            <span>{travellerErrors.strCountryGUID}</span>
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
                                    <label className="block text-gray-700 font-medium mb-1">{t("dateOfBirth")} <span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        name="dtmPassengerBirthday"
                                        value={
                                            travellerForm.dtmPassengerBirthday
                                        }
                                        onChange={(e) => {
                                            setTravellerForm(
                                                (prev: any) => ({
                                                    ...prev,
                                                    dtmPassengerBirthday:
                                                        e.target.value,
                                                })
                                            );
                                            if (travellerErrors.dtmPassengerBirthday) {
                                                setTravellerErrors((prev: any) => ({ ...prev, dtmPassengerBirthday: "" }));
                                            }
                                        }}
                                        className={twMerge(
                                            "cursor-pointer w-full border rounded px-3 py-1.5 outline-none focus:border-blue-500",
                                            travellerErrors.dtmPassengerBirthday ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
                                        )}
                                    />
                                    {travellerErrors.dtmPassengerBirthday && (
                                        <div className="text-red-500 text-[10px] mt-1.5 flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                                <line x1="9" y1="9" x2="15" y2="15"></line>
                                            </svg>
                                            <span>{travellerErrors.dtmPassengerBirthday}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">{t("email")} <span className="text-red-500">*</span></label>
                                    <input
                                        type="email"
                                        name="strPassengerEmail"
                                        value={
                                            travellerForm.strPassengerEmail
                                        }
                                        onChange={(e) => {
                                            setTravellerForm(
                                                (prev: any) => ({
                                                    ...prev,
                                                    strPassengerEmail:
                                                        e.target.value,
                                                })
                                            );
                                            if (travellerErrors.strPassengerEmail) {
                                                setTravellerErrors((prev: any) => ({ ...prev, strPassengerEmail: "" }));
                                            }
                                        }}
                                        className={twMerge(
                                            "w-full border rounded px-3 py-2 outline-none focus:border-blue-500",
                                            travellerErrors.strPassengerEmail ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
                                        )}
                                        placeholder="example@gmail.com"
                                    />
                                    {travellerErrors.strPassengerEmail && (
                                        <div className="text-red-500 text-[10px] mt-1.5 flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                                <line x1="9" y1="9" x2="15" y2="15"></line>
                                            </svg>
                                            <span>{travellerErrors.strPassengerEmail}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Số điện thoại */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">{t("phoneNumber")} <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="strPassengerPhone"
                                        value={
                                            travellerForm.strPassengerPhone
                                        }
                                        onChange={(e) => {
                                            setTravellerForm(
                                                (prev: any) => ({
                                                    ...prev,
                                                    strPassengerPhone:
                                                        e.target.value,
                                                })
                                            );
                                            if (travellerErrors.strPassengerPhone) {
                                                setTravellerErrors((prev: any) => ({ ...prev, strPassengerPhone: "" }));
                                            }
                                        }}
                                        className={twMerge(
                                            "w-full border rounded px-3 py-2 outline-none focus:border-blue-500",
                                            travellerErrors.strPassengerPhone ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
                                        )}
                                        placeholder={t("enterPhoneNumber")}
                                    />
                                    {travellerErrors.strPassengerPhone && (
                                        <div className="text-red-500 text-[10px] mt-1.5 flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                                <line x1="9" y1="9" x2="15" y2="15"></line>
                                            </svg>
                                            <span>{travellerErrors.strPassengerPhone}</span>
                                        </div>
                                    )}
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
                                    <th className="py-2 px-3 border border-[#1a52a3] w-12">
                                        {t("no")}
                                    </th>

                                    <th className="py-2 px-4 border border-[#1a52a3] text-left">
                                        {t("serviceName")}
                                    </th>

                                    <th className="py-2 px-3 border border-[#1a52a3]">
                                        {t("totalGuests")}
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
                                {items?.map((item: any, index: number) => {

                                    return (

                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="py-3 px-3 align-top border-r border-gray-100">
                                                {index + 1}
                                            </td>

                                            <td className="py-3 px-4 text-left align-top border-r border-gray-100">
                                                <div className="font-semibold text-gray-800">
                                                    {room?.strSupplierName} - {room?.strItemTypeName} - {bookingPayload?.includedBreak}
                                                </div>

                                                <div className="text-gray-500 text-[11px] mt-0.5">
                                                    {fDateTime(bookingPayload?.dtmDateFrom)} -
                                                    {fDateTime(bookingPayload?.dtmDateTo)}
                                                </div>
                                            </td>

                                            <td className="py-3 px-3 align-top border-r border-gray-100">
                                                {(item?.qty)}
                                            </td>

                                            <td className="py-3 px-3 align-top border-r border-gray-100">
                                                {fCurrency(
                                                    0,
                                                    selectedCurrency?.label
                                                )}

                                            </td>

                                            <td className="py-3 px-3 align-top border-r border-gray-100 font-medium">
                                                {fCurrency(
                                                    item?.total,
                                                    selectedCurrency?.label
                                                )}
                                            </td>

                                            <td className="py-3 px-3 align-top font-medium">

                                                {/* Giá trị deposit tính toán từng hàng trong table */}

                                                {fCurrency(
                                                    Number(item?.total || 0) * (totalPercentage / 100),
                                                    selectedCurrency?.label
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}

                                <tr className="bg-gray-50/50 font-semibold">
                                    <td className="py-2 px-3 border-r border-gray-100"></td>

                                    <td className="py-2 px-4 text-left border-r border-gray-100">
                                        {t("totalPrice")}
                                    </td>

                                    <td className="py-2 px-3 border-r border-gray-100">
                                        {totalGuests}
                                    </td>

                                    <td className="py-2 px-3 border-r border-gray-100">
                                        {fCurrency(
                                            totalCommission,
                                            selectedCurrency?.label
                                        )}
                                    </td>

                                    <td className="py-2 px-3 border-r border-gray-100">
                                        {fCurrency(
                                            totalPrice,
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

                    <div className="p-5 border-t border-gray-100 space-y-4">
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

                        <div className="text-xs space-y-2 pt-2">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">{t("paymentFirstInstallment")}</span>
                                <span className="font-semibold text-[#1e5bb4] underline">
                                    {fCurrency(
                                        finalDeposit,
                                        selectedCurrency?.label
                                    )}
                                </span>
                            </div>

                            <div className="text-red-600 text-[11px] font-medium leading-relaxed">
                                {t("paymentNoticePrefix")}{" "}
                                {new Date().toLocaleString(
                                    i18next.language === "vi" ? "vi-VN" : "en-US",
                                    {
                                        weekday: "short",
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                    }
                                )}{' '}
                                {t("paymentNoticeSuffix")}
                            </div>

                            <div className="flex justify-between items-center pt-1 border-t border-dashed border-gray-200">
                                <span className="font-medium text-gray-700">{t("paymentSecondInstallment")}</span>
                                <span className="font-semibold text-gray-800">
                                    {fCurrency(
                                        finalDebt,
                                        selectedCurrency?.label
                                    )}
                                </span>
                            </div>
                        </div>

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
                                    <option value="Bank transfer">{t("bankTransfer")}</option>
                                    <option value="Payment online">{t("paymentOnline")}</option>
                                </select>
                            </div>

                            {/* Chỉ hiện khi Bank transfer */}

                            {paymentMethod === "Bank transfer" && (
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

                        {/* Chỉ hiện thông tin ngân hàng khi thanh toán chuyển khoản */}
                        {paymentMethod === "Bank transfer" && (
                            <div className="grid grid-cols-1 md:grid-cols-12 border border-gray-200 rounded-xl overflow-hidden mt-4 bg-white shadow-sm">
                                {/* Cột bên trái: Thông tin tài khoản */}
                                <div className="md:col-span-6 p-6 space-y-4 text-xs bg-white">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">{t("bankTransferInfo") || "Thông tin chuyển khoản"}</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">{t("bankTransferDesc") || "Vui lòng sử dụng thông tin bên dưới để thực hiện giao dịch."}</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{t("accountName") || "Tên tài khoản"}</span>
                                            <span className="text-base font-bold text-gray-900 uppercase leading-snug">{bankInfo.accountName}</span>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{t("accountNumber") || "Số tài khoản"}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-bold text-blue-600 tracking-wider">{bankInfo.accountNumber}</span>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(bankInfo.accountNumber);
                                                        showToast("success", t("copied") || "Đã sao chép vào bộ nhớ tạm");
                                                    }}
                                                    className="p-1 hover:bg-gray-100 rounded text-blue-600 transition-colors"
                                                    title={t("copy") || "Sao chép"}
                                                >
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{t("bankName") || "Ngân hàng"}</span>
                                            <span className="text-sm font-semibold text-gray-900 leading-snug">{bankInfo.bankName}</span>
                                        </div>

                                        {bankInfo.bankAddress && (
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{t("bankAddress") || "Địa chỉ ngân hàng"}</span>
                                                <span className="text-sm text-gray-700 leading-relaxed">{bankInfo.bankAddress}</span>
                                            </div>
                                        )}

                                        {bankInfo.swiftCode && (
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{t("swiftCode") || "Mã SWIFT"}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-gray-900 uppercase">{bankInfo.swiftCode}</span>
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(bankInfo.swiftCode);
                                                            showToast("success", t("copied") || "Đã sao chép vào bộ nhớ tạm");
                                                        }}
                                                        className="p-1 hover:bg-gray-100 rounded text-blue-600 transition-colors"
                                                        title={t("copy") || "Sao chép"}
                                                    >
                                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Cột bên phải: Quét mã QR */}
                                <div className="md:col-span-6 bg-gray-50 p-6 flex flex-col items-center justify-center text-center border-t md:border-t-0 md:border-l border-gray-200">
                                    <div className="mb-4">
                                        <h3 className="text-sm font-semibold text-gray-900">{t("quickPayment") || "Thanh toán nhanh"}</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">{t("scanQrDesc") || "Quét mã QR để thanh toán."}</p>
                                    </div>

                                    <div className="relative group mb-4">
                                        <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md">
                                            <div className="w-48 h-48 bg-slate-50 flex items-center justify-center overflow-hidden rounded-lg">
                                                <img
                                                    className="w-full h-full object-contain mix-blend-multiply"
                                                    src={bankInfo.qrPlaceholder}
                                                    alt={t("qrCodePayment")}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <a
                                        href={bankInfo.qrPlaceholder}
                                        download="qr-code-payment.png"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full max-w-[200px] py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                        </svg>
                                        {t("downloadQR") || "Tải mã QR về máy"}
                                    </a>
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
                totalPrice={totalPrice}
            />
        </div>
    );
};

export default PaymentBookingHotelView;
