import { useUser } from '@/hooks/actions/useAuth';
import { addBookingForTour, fetchGetEmailSendAGHByAGB, fetchGetSendEmail, markUsedVoucher, useDetailAGTransTMSMutation, useListAGTransTMSMutation, useListBankAccount } from '@/hooks/actions/useBooking';
import { useListCity } from '@/hooks/actions/useCity';
import { useListCompanyOwner } from '@/hooks/actions/useCompanyOwner';
import { useRouter } from '@/routes/hooks/use-router';
import { paths } from '@/routes/paths';
import { TITLES_OPTIONS } from '@/utils/option-data';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PaymentCountdown from './payment-countdown';
import { isValidValue } from '@/utils/utilts';
import VoucherList from './voucher-list';
import BookingPopup from './booking-popup';
import { useToastStore } from '@/zustand/useToastStore';
import { useGlobalLoading } from '@/zustand/useGlobalLoading';

const PaymentBookingView: React.FC = () => {
    const { setGlobalLoading } = useGlobalLoading();
    const router = useRouter();
    const location = useLocation();
    const item = location.state?.item;
    const price = location.state?.price;
    const payloadItem = location.state?.payload;
    const { showToast } = useToastStore();
    const { bankAccountData } = useListBankAccount();
    const { user } = useUser()
    const { coData } = useListCompanyOwner();
    const [isShowTravellerForm, setIsShowTravellerForm] = useState(false);
    const [isShowVoucher, setIsShowVoucher] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
    const [isExpired, setIsExpired] = useState(false);
    const [paidRemark, setPaidRemark] = useState("");
    const [selectedCountry, setSelectedCountry] = useState<any>(null);
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

    // --- STATE FOR FORMS ---
    const [paymentMethod, setPaymentMethod] = useState('Bank transfer');

    // Helper định dạng tiền tệ Việt Nam (đ)
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

    const [selectedBankAccount, setSelectedBankAccount] = useState<any>(null);

    useEffect(() => {
        if (bankAccountData?.length > 0) {
            setSelectedBankAccount(bankAccountData[0]);
        }
    }, [bankAccountData]);

    const { mutateAsync: addBookingForTourApi, isPending: isLoading } = useMutation({
        mutationFn: addBookingForTour,
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



    const { ctData } = useListCity({
        strTableName: "MC02",
        strFeildSelect: "MC02_CountryCode AS code, MC02_CountryGUID AS intID,MC02_CountryName AS strName,MC02_CountryGUID AS id,MC02_CountryName AS text,MC02_CountryName AS strCountryName, MC02_CountryFlagIcon strCountryFlagIcon",
        strWhere: "WHERE (IsActive=1)  ORDER BY MC02_CountryName ASC ",
    })

    const COUNTRY_OPTIONS = ctData.map((item: any) => ({
        label: item.strName,
        value: item.id,
    }));

    const [countrySearch, setCountrySearch] = useState("");
    const [isOpenCountry, setIsOpenCountry] = useState(false);
    const [isOpenConfirm, setIsOpenConfirm] = useState(false);

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

    const totalChildren =
        payloadItem?.strListChildAge
            ? payloadItem.strListChildAge.split(",").filter(Boolean).length
            : 0;

    const totalGuests =
        (payloadItem?.intAdult || 0) + totalChildren;

    const totalDeposit = Number(price?.dblTotalPrice || 0) * 0.3;

    const totalDebt = Number(price?.dblTotalPrice || 0) - Number(totalDeposit);
    const [finalVoucherPayment] = useState(
        Number(price?.dblTotalPrice || 0)
    );
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
                                    onSuccess: () => resolve(true),

                                    onError: (err) => {

                                        showToast(
                                            "error",
                                            "Áp dụng voucher thất bại",
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
                    "Áp dụng voucher thành công",
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

                strTourGUID:
                    item?.strTourGUID || null,

                strTourPriceItemLevelGUID:
                    price?.strTourPriceItemLevelGUID || null,

                strDepartureTourLevelGUID:
                    null,

                intAdult:
                    payloadItem?.intAdult || 0,

                strListChildAge:
                    payloadItem?.strListChildAge || null,

                intSGL:
                    payloadItem?.intSGL || 0,

                intDBL:
                    payloadItem?.intDBL || 0,

                intTWN:
                    payloadItem?.intTWN || 0,

                intTPL:
                    payloadItem?.intTPL || 0,

                dtmDateFrom:
                    payloadItem?.dtmDateFrom || null,

                dtmDateTo:
                    null,

                intCurrencyID:
                    user?.intCurrencyID || 3,

                strPaidRemark:
                    paidRemark || null,

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

                intPaymentMethodID:
                    paymentMethod === "Bank transfer"
                        ? 1
                        : 2,

                strCompanyBankAccountGUID:
                    selectedBankAccount?.strCompanyBankAccountGUID || null,

                VoucherCode:
                    selectedVoucher?.length > 0
                        ? selectedVoucher
                            .map((item: any) => item?.voucherCode)
                            .filter(Boolean)
                            .join(",")
                        : null,
            };

            addBookingForTourApi(payload, {

                onSuccess: async (res) => {

                    showToast(
                        "success",
                        "Đặt thành công"
                    );

                    try {

                        const serviceGUID =
                            res?.[1]?.[0]?.strListAgentHostServiceItemGUID;

                        const intStatusBk = res?.[1]?.[0]?.intStatusBk;

                        // call email template
                        if (serviceGUID) {

                            const emailTemplateRes =
                                await fetchGetEmailSendAGHByAGBApi({
                                    strBookingGUID: null,
                                    strCompanyGUID: coData?.strCompanyGUID,
                                    strListAgentHostServiceItemGUID: serviceGUID,
                                    intLangID: user?.intLangID,
                                    strEmailTemplateCode: "BKK",
                                });

                            const emailData = emailTemplateRes;

                            // send email
                            if (emailData) {

                                await fetchGetSendEmailApi({

                                    strEmailsSendTo:
                                        emailData?.strEmailsSendTo || null,

                                    strEmailsCC:
                                        emailData?.strEmailsCC || null,

                                    strEmailsBCC:
                                        emailData?.strEmailsBCC || null,

                                    strAttachments:
                                        null,

                                    strSubject:
                                        emailData?.strEmailTemplateSubject || null,

                                    IsBodyHtml:
                                        true,

                                    strBody:
                                        emailData?.strEmailTemplateContent || null,

                                    intEmailConfigID:
                                        null,
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

                        const mapStatusToTab = (status?: number) => {
                            switch (status) {
                                case 1:
                                    return "hold";
                                case 2:
                                    return "booked";
                                default:
                                    return "suggest";
                            }
                        };

                        const activeTab = mapStatusToTab(intStatusBk);

                        router.push(`${paths.content.service}?activeTab=${activeTab}`);

                    } catch (err) {

                        console.log("TMS ERROR", err);
                    }
                },

                onError: (err) => {

                    showToast(
                        "error",
                        "Đặt thất bại"
                    );

                    console.log("BOOKING ERROR", err);
                },
            });

        } catch (err) {

            showToast(
                "error",
                "Voucher không hợp lệ hoặc đã được sử dụng"
            );

            console.log("VOUCHER ERROR", err);
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
                        <h2 className="text-base font-semibold text-gray-700">Liên Hệ Chính</h2>
                    </div>
                    <div className="p-5 space-y-2 text-sm">
                        <div className="flex gap-2">
                            <span className="font-medium text-gray-600 min-w-[90px]">Họ và tên:</span>
                            <span className="text-gray-800">{user?.strFullName}</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-medium text-gray-600 min-w-[90px]">Email:</span>
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
                                Có phải khách du lịch
                            </span>
                        </div>
                    </div>

                    {isShowTravellerForm && (
                        <div className="mt-4 p-4 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                                {/* Danh xưng */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Danh xưng <span className="text-red-500">*</span></label>
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
                                        {TITLES_OPTIONS.map((option) => (
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
                                    <label className="block text-gray-700 font-medium mb-1">Tên <span className="text-red-500">*</span></label>
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
                                        placeholder="Nhập tên"
                                    />
                                </div>

                                {/* Họ và đệm */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Họ và đệm <span className="text-red-500">*</span></label>
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
                                        placeholder="Nhập họ và đệm"
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
                                        Quốc tịch <span className="text-red-500">*</span>
                                    </label>

                                    {/* Select box */}
                                    <div
                                        onClick={() => setIsOpenCountry(!isOpenCountry)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 bg-white cursor-pointer flex items-center justify-between"
                                    >
                                        <span className={selectedCountry ? "text-black" : "text-gray-400"}>
                                            {selectedCountry?.label || "--- Chọn quốc gia ---"}
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
                                                    placeholder="Search..."
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
                                                        Không tìm thấy quốc gia
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Độ tuổi */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Độ tuổi <span className="text-red-500">*</span></label>
                                    <select
                                        name="intAgeID"
                                        disabled
                                        className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 bg-gray-100"
                                    >
                                        <option value="3">Adults</option>
                                    </select>
                                </div>

                                {/* Ngày sinh */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Ngày sinh</label>
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
                                    <label className="block text-gray-700 font-medium mb-1">Email</label>
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
                                    <label className="block text-gray-700 font-medium mb-1">Số điện thoại</label>
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
                                        placeholder="Nhập số điện thoại"
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
                                    placeholder="Ghi chú"
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
                        <h2 className="text-base font-bold text-gray-700 uppercase tracking-wide">CÔNG TY KẾT NỐI DU LỊCH</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-[#1e5bb4] text-white font-medium text-center">
                                    <th className="py-2 px-3 border border-[#1a52a3] w-12">STT</th>
                                    <th className="py-2 px-4 border border-[#1a52a3] text-left">Tên dịch vụ</th>
                                    <th className="py-2 px-3 border border-[#1a52a3]">Tổng số khách</th>
                                    <th className="py-2 px-3 border border-[#1a52a3]">Tổng giá hoa hồng dư</th>
                                    <th className="py-2 px-3 border border-[#1a52a3]">Tổng giá</th>
                                    <th className="py-2 px-3 border border-[#1a52a3]">Tổng Tiền Thanh Toán</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-center text-gray-700">
                                <React.Fragment>
                                    <tr className="hover:bg-gray-50">
                                        <td className="py-3 px-3 align-top border-r border-gray-100">{price.No}</td>
                                        <td className="py-3 px-4 text-left align-top border-r border-gray-100">
                                            <div className="font-semibold text-gray-800">{price?.strServiceName}</div>
                                            <div className="text-gray-500 text-[11px] mt-0.5">{isValidValue(price?.strDtmDateFrom)} - {isValidValue(price?.strDtmDateTo)}</div>
                                        </td>
                                        <td className="py-3 px-3 align-top border-r border-gray-100">{totalGuests}</td>
                                        <td className="py-3 px-3 align-top border-r border-gray-100">{formatCurrency(price?.dblTotalPriceCom)}</td>
                                        <td className="py-3 px-3 align-top border-r border-gray-100 font-medium">{formatCurrency(price?.dblTotalPrice)}</td>
                                        <td className="py-3 px-3 align-top font-medium">{formatCurrency(totalDeposit)}</td>
                                    </tr>
                                    <tr className="bg-gray-50/50 font-semibold">
                                        <td className="py-2 px-3 border-r border-gray-100"></td>
                                        <td className="py-2 px-4 text-left border-r border-gray-100">Total Price</td>
                                        <td className="py-2 px-3 border-r border-gray-100"></td>
                                        <td className="py-2 px-3 border-r border-gray-100">{formatCurrency(price?.dblTotalPriceCom)}</td>
                                        <td className="py-2 px-3 border-r border-gray-100">{formatCurrency(price?.dblTotalPrice)}</td>
                                        <td className="py-2 px-3">{formatCurrency(totalDeposit)}</td>
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
                                Voucher
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
                                    Đã chọn voucher: {selectedVoucher?.VoucherCode}
                                </div>
                            )}
                        </div>

                        {/* Thông tin các đợt thanh toán và Alert */}
                        <div className="text-xs space-y-2 pt-2">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">Thanh toán đợt 1</span>
                                <span className="font-semibold text-[#1e5bb4] underline">
                                    {formatCurrency(finalDeposit)}
                                </span>
                            </div>

                            {/* Alert Đỏ */}
                            <div className="text-red-600 text-[11px] font-medium leading-relaxed">
                                Bạn sẽ thanh toán trước T3, 26 Thg 05, 2026 23:59:59 để hoàn thành quá trình book đặt
                            </div>

                            <div className="flex justify-between items-center pt-1 border-t border-dashed border-gray-200">
                                <span className="font-medium text-gray-700">Thanh toán đợt 2</span>
                                <span className="font-semibold text-gray-800">
                                    {formatCurrency(finalDebt)}
                                </span>
                            </div>
                        </div>

                        {/* Khu vực Chọn Phương thức & Ngân hàng */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs">
                            <div>
                                <label className="block font-medium text-gray-700 mb-1.5">
                                    Phương Thức Thanh Toán
                                </label>

                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full bg-white border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 transition-colors"
                                >
                                    <option value="Bank transfer">Bank transfer</option>
                                    <option value="Payment online">Payment online</option>
                                </select>
                            </div>

                            {/* Chỉ hiện khi Bank transfer */}
                            {paymentMethod === "Bank transfer" && (
                                <div>
                                    <label className="block font-medium text-gray-700 mb-1.5">
                                        Tài khoản ngân hàng
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
                        {paymentMethod === "Bank transfer" && (
                            <div className="flex flex-col items-center text-center text-xs space-y-1.5 py-6 bg-gray-50/50 rounded-lg border border-dashed border-gray-200 mt-4">
                                <p>
                                    <span className="font-medium text-gray-600">
                                        Tên tài khoản:
                                    </span>{" "}
                                    <span className="font-semibold text-gray-800">
                                        {bankInfo.accountName}
                                    </span>
                                </p>

                                <p>
                                    <span className="font-medium text-gray-600">
                                        Mã tài khoản:
                                    </span>{" "}
                                    <span className="font-semibold text-gray-800">
                                        {bankInfo.accountNumber}
                                    </span>
                                </p>

                                <p>
                                    <span className="font-medium text-gray-600">
                                        Bank Name:
                                    </span>{" "}
                                    <span className="font-semibold text-gray-800">
                                        {bankInfo.bankName}
                                    </span>
                                </p>

                                <p>
                                    <span className="font-medium text-gray-600">
                                        Bank Add:
                                    </span>{" "}
                                    <span className="text-gray-700">
                                        {bankInfo.bankAddress}
                                    </span>
                                </p>

                                <p>
                                    <span className="font-medium text-gray-600">
                                        SwiftCode:
                                    </span>{" "}
                                    <span className="font-semibold text-gray-800">
                                        {bankInfo.swiftCode}
                                    </span>
                                </p>

                                <div className="pt-4 flex flex-col items-center">
                                    <div className="w-32 h-32 bg-white border border-gray-200 p-2 rounded flex items-center justify-center shadow-inner">
                                        <img
                                            src={bankInfo.qrPlaceholder}
                                            alt="QR Code Thanh Toán"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>

                                    <span className="text-[10px] text-gray-400 mt-1">
                                        QR Code
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
                                placeholder="Ghi chú"
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
                                {isLoading ? "Đang đặt..." : "Đặt Ngay"}
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