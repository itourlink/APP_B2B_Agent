import { useUser } from '@/hooks/actions/useAuth';
import { addBookingForTour, useDetailAGTransTMSMutation, useListAGTransTMSMutation, useListBankAccount } from '@/hooks/actions/useBooking';
import { useListCity } from '@/hooks/actions/useCity';
import { useListCompanyOwner } from '@/hooks/actions/useCompanyOwner';
import { useCompanyOwnerListInfo } from '@/hooks/actions/useCompanyOwnerInfo';
import { useRouter } from '@/routes/hooks/use-router';
import { paths } from '@/routes/paths';
import { TITLES_OPTIONS } from '@/utils/option-data';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// --- MOCK DATA TYPE ---
interface BookingDetail {
    No: number;
    strServiceName: string;
    dateRange: string;
    totalGuests: number;
    commissionPrice: number;
    totalPrice: number;
    paymentTotal: number;
}

const PaymentBookingView: React.FC = () => {
    const router = useRouter();
    const location = useLocation();
    const item = location.state?.item;
    const price = location.state?.price;
    const payloadItem = location.state?.payload;
    const { bankAccountData } = useListBankAccount();
    const { user } = useUser()
    const { coData } = useListCompanyOwner();
    const [serviceItemGUID, setServiceItemGUID] = useState<string | null>(null);
    const [isBookingSuccess, setIsBookingSuccess] = useState(false);
    const [isShowTravellerForm, setIsShowTravellerForm] = useState(false);
    console.log("PAYMENT VIEW ITEM", item);

    const [timeLeft, setTimeLeft] = useState(100000); // 4
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0) {
            setIsExpired(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins}m ${secs}s`;
    };

    const bankAccountInfo = {
        accountName: 'Công Ty Itourlink',
        accountNumber: '123456789',
        bankName: 'Ngân hàng Thương mại cổ phần Kỹ thương Việt Nam',
        bankAddress: 'Nguyễn Xiển, Hà Nội',
        swiftCode: 'ABC',
        qrPlaceholder: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ItourlinkPaymentMock',
    };

    // --- STATE FOR FORMS ---
    const [paymentMethod, setPaymentMethod] = useState('Bank transfer');

    // Helper định dạng tiền tệ Việt Nam (đ)
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
            .format(amount)
            .replace('₫', 'đ');
    };

    const [selectedBankAccount, setSelectedBankAccount] = useState<any>(null);

    useEffect(() => {
        if (bankAccountData?.length > 0) {
            setSelectedBankAccount(bankAccountData[0]);
        }
    }, [bankAccountData]);

    const { mutate: addBookingForTourApi, isPending: isLoading } = useMutation({
        mutationFn: addBookingForTour,
    });

    const { mutateAsync: listAGTMS } =
        useListAGTransTMSMutation();

    const { mutateAsync: detailAGTMS } =
        useDetailAGTransTMSMutation();


    const handleBooking = () => {

        const payload = {

            strCompanyAgentGUID: user?.strCompanyGUID,
            strCompanyOwnerGUID: coData?.strCompanyGUID,

            strTourGUID: item?.strTourGUID,
            strTourPriceItemLevelGUID: price?.strTourPriceItemLevelGUID,

            strDepartureTourLevelGUID: null,

            intAdult: payloadItem?.intAdult || 0,
            strListChildAge: payloadItem?.strListChildAge || "15,9,9",

            intSGL: payloadItem?.intSGL || 0,
            intDBL: payloadItem?.intDBL || 0,
            intTWN: payloadItem?.intTWN || 0,
            intTPL: payloadItem?.intTPL || 0,

            dtmDateFrom: payloadItem?.dtmDateFrom || null,
            dtmDateTo: null,

            intCurrencyID: user?.intCurrencyID,

            strPaidRemark: null,

            intSaluteID: null,
            intAgeID: null,
            intPassengerAges: null,

            strPassengerFirstName: null,
            strPassengerLastName: null,

            dtmPassengerBirthday: null,
            dtmPasspostExpirationDate: null,

            strPassengerEmail: null,
            strPassengerPhone: null,
            strPassengerRemark: null,

            strPassport: null,
            strCountryGUID: null,

            IsTraveller: false,

            intPaymentMethodID: null,

            strCompanyBankAccountGUID:
                selectedBankAccount?.strCompanyBankAccountGUID || null,

            VoucherCode: null,
        };

        addBookingForTourApi(payload, {
            onSuccess: async (res) => {
                try {
                    const serviceGUID =
                        res?.[1]?.[0]?.strListAgentHostServiceItemGUID;

                    console.log("serviceGUID", serviceGUID);

                    if (serviceGUID) {

                        await listAGTMS({
                            strCompanyGUID: coData?.strCompanyGUID,
                            strListAgentHostServiceItemGUID: serviceGUID,
                        });

                        await detailAGTMS({
                            strAgentHostCompanyGUID:
                                coData?.strCompanyGUID,

                            strListAgentHostServiceItemGUID:
                                serviceGUID,
                        });
                    }
                    router.replaceParams(paths.content.service, {
                        activeTab: "booked",
                    });

                } catch (err) {
                    console.log("TMS ERROR", err);
                }
            },

            onError: (err) => {
                console.log("BOOKING ERROR", err);
            },
        });
    };


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



    const { data } = useCompanyOwnerListInfo({
        "strCompanyOwnerGUID": null,
        "intCurPage": 1,
        "intPageSize": 1,
        "strOrder": null,
        "strFilterCompanyName": null,
        "strCompanyNameUrl": "cong-ty-tnhh-ket-noi-du-lich-8F620",
        "IsOwnerFriend": 1,
        "tblsReturn": "[0]"
    });

    if (isExpired) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-b from-[#f4f8fc] to-white flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">

                    {/* Header */}
                    <div className="bg-[#0f4c81] px-6 py-5 text-center">
                        <div className="w-14 h-14 mx-auto rounded-full bg-white/15 flex items-center justify-center text-white text-2xl font-bold border border-white/20">
                            !
                        </div>

                        <h2 className="text-white text-xl font-semibold mt-4">
                            Hết thời gian thanh toán
                        </h2>

                        <p className="text-white/80 text-sm mt-1">
                            Phiên thanh toán đã kết thúc
                        </p>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-8 text-center">
                        <p className="text-slate-600 text-sm leading-6">
                            Đơn hàng của bạn đã tự động hủy do quá thời gian giữ chỗ.
                        </p>

                        <div className="mt-6 bg-[#f4f8fc] border border-slate-200 rounded-xl p-4">
                            <p className="text-xs text-slate-500">
                                Vui lòng thực hiện đặt lại nếu bạn vẫn muốn tiếp tục thanh toán.
                            </p>
                        </div>

                        <button
                            onClick={() => router.back()}
                            className="mt-6 w-full bg-[#0f4c81] hover:bg-[#0c3d68] text-white py-3 rounded-xl text-sm font-medium transition"
                        >
                            Quay lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-100 font-sans text-gray-800 pb-12">
            {/* 1. Thanh thông báo đếm ngược màu vàng phía trên */}
            <div className="w-full bg-[#f19f1b] text-white text-center text-xs md:text-sm py-2 px-4 shadow-sm font-medium flex items-center justify-center gap-1">
                <span className="inline-block w-4 h-4 rounded-full border border-white text-center text-[10px] leading-[14px] font-bold">!</span>
                Nếu quý khách không thực hiện thanh toán, đơn hàng sẽ tự động hủy sau {formatTime(timeLeft)}
            </div>

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
                                        className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 bg-white"
                                    >
                                        {TITLES_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
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
                                        className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
                                        placeholder="Nhập họ và đệm"
                                    />
                                </div>

                                {/* Quốc tịch */}
                                <div
                                    className="relative"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsOpenCountry(true);
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
                                        <span className={countrySearch ? "text-black" : "text-gray-400"}>
                                            {countrySearch || "--- Chọn quốc gia ---"}
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
                                        className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 bg-gray-100"
                                    >
                                        <option value="Adults">Adults</option>
                                        <option value="Children">Children</option>
                                        <option value="Infants">Infants</option>
                                    </select>
                                </div>

                                {/* Ngày sinh */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Ngày sinh</label>
                                    <input
                                        type="date"
                                        name="dtmPassengerBirthday"
                                        className="w-full border border-gray-300 rounded px-3 py-1.5 outline-none focus:border-blue-500"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="strPassengerEmail"
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
                                        className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
                                        placeholder="Nhập số điện thoại"
                                    />
                                </div>
                            </div>

                            {/* Ghi chú hành khách */}
                            <div className="mt-4 text-xs">
                                <textarea
                                    name="strPassengerRemark"
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

                    {/* Bảng chi tiết dịch vụ */}
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
                            {/* <tbody className="divide-y divide-gray-100 text-center text-gray-700">
                                {bookingItems.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <tr className="hover:bg-gray-50">
                                            <td className="py-3 px-3 align-top border-r border-gray-100">{item.No}</td>
                                            <td className="py-3 px-4 text-left align-top border-r border-gray-100">
                                                <div className="font-semibold text-gray-800">{item?.strServiceName}</div>
                                                <div className="text-gray-500 text-[11px] mt-0.5">{item.dateRange}</div>
                                            </td>
                                            <td className="py-3 px-3 align-top border-r border-gray-100">{item.intPaxMax}</td>
                                            <td className="py-3 px-3 align-top border-r border-gray-100">{formatCurrency(item.commissionPrice)}</td>
                                            <td className="py-3 px-3 align-top border-r border-gray-100 font-medium">{formatCurrency(item.totalPrice)}</td>
                                            <td className="py-3 px-3 align-top font-medium">{formatCurrency(item.paymentTotal)}</td>
                                        </tr>
                                        <tr className="bg-gray-50/50 font-semibold">
                                            <td className="py-2 px-3 border-r border-gray-100"></td>
                                            <td className="py-2 px-4 text-left border-r border-gray-100">Total Price</td>
                                            <td className="py-2 px-3 border-r border-gray-100"></td>
                                            <td className="py-2 px-3 border-r border-gray-100">{formatCurrency(0)}</td>
                                            <td className="py-2 px-3 border-r border-gray-100">{formatCurrency(item.totalPrice)}</td>
                                            <td className="py-2 px-3">{formatCurrency(0)}</td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody> */}
                        </table>
                    </div>

                    {/* Section Voucher & Chi tiết đợt thanh toán bên dưới table */}
                    <div className="p-5 border-t border-gray-100 space-y-4">
                        {/* Nút Voucher */}
                        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                            <span>🎟️</span> Voucher
                        </button>

                        {/* Thông tin các đợt thanh toán và Alert */}
                        <div className="text-xs space-y-2 pt-2">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">Thanh toán đợt 1</span>
                                <span className="font-semibold text-[#1e5bb4] underline">{formatCurrency(0)}</span>
                            </div>

                            {/* Alert Đỏ */}
                            <div className="text-red-600 text-[11px] font-medium leading-relaxed">
                                The prepayment is not due yet. You can order the product
                            </div>

                            <div className="flex justify-between items-center pt-1 border-t border-dashed border-gray-200">
                                <span className="font-medium text-gray-700">Thanh toán đợt 2</span>
                                <span className="font-semibold text-gray-800">{formatCurrency(14031360)}</span>
                            </div>
                        </div>

                        {/* Khu vực Chọn Phương thức & Ngân hàng */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs">
                            <div>
                                <label className="block font-medium text-gray-700 mb-1.5">Phương Thức Thanh Toán</label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full bg-white border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 transition-colors"
                                >
                                    <option value="Bank transfer">Bank transfer</option>
                                    <option value="Cash">Cash</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-medium text-gray-700 mb-1.5">Tài khoản ngân hàng</label>
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
                        </div>

                        {/* Thông tin chuyển khoản và QR Code */}
                        <div className="flex flex-col items-center text-center text-xs space-y-1.5 py-6 bg-gray-50/50 rounded-lg border border-dashed border-gray-200 mt-4">
                            <p><span className="font-medium text-gray-600">Tên tài khoản:</span> <span className="font-semibold text-gray-800">{bankAccountInfo.accountName}</span></p>
                            <p><span className="font-medium text-gray-600">Mã tài khoản:</span> <span className="font-semibold text-gray-800">{bankAccountInfo.accountNumber}</span></p>
                            <p><span className="font-medium text-gray-600">Bank Name:</span> <span className="font-semibold text-gray-800">{bankAccountInfo.bankName}</span></p>
                            <p><span className="font-medium text-gray-600">Bank Add:</span> <span className="text-gray-700">{bankAccountInfo.bankAddress}</span></p>
                            <p><span className="font-medium text-gray-600">SwiftCode:</span> <span className="font-semibold text-gray-800">{bankAccountInfo.swiftCode}</span></p>

                            {/* Vùng hiển thị ảnh QR Code */}
                            <div className="pt-4 flex flex-col items-center">
                                <div className="w-32 h-32 bg-white border border-gray-200 p-2 rounded flex items-center justify-center shadow-inner">
                                    <img src={bankAccountInfo.qrPlaceholder} alt="QR Code Thanh Toán" className="w-full h-full object-contain" />
                                </div>
                                <span className="text-[10px] text-gray-400 mt-1">QR Code</span>
                            </div>
                        </div>

                        {/* Ô nhập ghi chú */}
                        <div className="pt-2 text-xs">
                            <textarea
                                placeholder="Ghi chú"
                                rows={3}
                                className="w-full border border-gray-300 rounded p-3 outline-none focus:border-blue-500 transition-colors resize-none placeholder-gray-400"
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={handleBooking}
                                disabled={isLoading}
                                className="cursor-pointer bg-[#0f4c81] hover:bg-[#0b3a63] text-white font-medium text-xs py-2 px-6 rounded shadow transition-colors duration-150 disabled:opacity-50"
                            >
                                {isLoading ? "Đang đặt..." : "Đặt Ngay"}
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default PaymentBookingView;