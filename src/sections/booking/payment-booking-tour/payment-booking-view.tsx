import { useUser } from "@/hooks/actions/useAuth";
import {
  addBookingForTour,
  fetchGetEmailSendAGHByAGB,
  fetchGetSendEmail,
  markUsedVoucher,
  useDetailAGTransTMSMutation,
  useListAGTransTMSMutation,
  useListBankAccount,
  useListTourPaymentTerm,
} from "@/hooks/actions/useBooking";
import { useListCity } from "@/hooks/actions/useCity";
import { useListCompanyOwner } from "@/hooks/actions/useCompanyOwner";
import { statusTabMap, TITLES_OPTIONS } from "@/utils/option-data";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import PaymentCountdown from "../components/payment-countdown";
import { getFlagClass, isValidValue } from "@/utils/utilts";
import BookingPopup from "../components/booking-popup";
import { useToastStore } from "@/zustand/useToastStore";
import { useGlobalLoading } from "@/zustand/useGlobalLoading";
import { fDate } from "@/utils/format-time";
import { addDays } from "date-fns";
import { useTranslate } from "@/locales";
import { useListCurrency } from "@/components/currency/useListCurrency";
import { useCurrency } from "@/components/currency/useCurrency";
import { fCurrency } from "@/utils/format-number";
import i18next from "i18next";
import PaymentTableBooking from "./components/payment-table-booking";
import PaymentVouBank from "./components/payment-vou-bank-booking";
import PaymentFormBooking from "./components/payment-form-booking";

const PaymentBookingView: React.FC = () => {
  const { t } = useTranslate("booking");
  const { currencyId } = useCurrency();

  const { setGlobalLoading } = useGlobalLoading();
  const location = useLocation();
  const item = location?.state?.item;
  const price = location?.state?.price;
  const payloadItem = location.state?.payload;
  const childPrices = location?.state?.childPrices
  const { showToast } = useToastStore();
  const { bankAccountData } = useListBankAccount();
  const { user } = useUser();
  const { coData } = useListCompanyOwner();
  const { selectedCurrency } = useListCurrency();
  const [isShowTravellerForm, setIsShowTravellerForm] = useState(false);
  const [isShowVoucher, setIsShowVoucher] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [paidRemark, setPaidRemark] = useState("");
  const [travellerForm, setTravellerForm] = useState<any>({
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
  const [paymentMethod, setPaymentMethod] = useState("Bank transfer");

  const [selectedBankAccount, setSelectedBankAccount] = useState<any>(null);

  useEffect(() => {
    if (bankAccountData?.length > 0) {
      setSelectedBankAccount(bankAccountData[0]);
    }
  }, [bankAccountData]);

  const { mutateAsync: addBookingForTourApi, isPending: isLoading } =
    useMutation({
      mutationFn: addBookingForTour,
    });

  const { mutateAsync: markUsedVoucherApi, isPending: isVcPending } =
    useMutation({
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

  const { paytermData } = useListTourPaymentTerm({
    strTourGUID: item?.strTourGUID,
  });

  const { ctData } = useListCity({
    strTableName: "MC02",
    strFeildSelect:
      "MC02_CountryCode AS code, MC02_CountryGUID AS intID,MC02_CountryName AS strName,MC02_CountryGUID AS id,MC02_CountryName AS text,MC02_CountryName AS strCountryName, MC02_CountryFlagIcon strCountryFlagIcon",
    strWhere: "WHERE (IsActive=1)  ORDER BY MC02_CountryName ASC ",
  });

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
    item.label.toLowerCase().includes(countrySearch.toLowerCase()),
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

  const totalDeposit =
    Number(price?.dblTotalPrice || 0) *
    ((Number(paytermData?.dblPaymentPercentage) || 0) / 100);

  const totalDebt = Number(price?.dblTotalPrice || 0) - Number(totalDeposit);
  const [finalVoucherPayment] = useState(Number(price?.dblTotalPrice || 0));
  const [totalVoucherAmount, setTotalVoucherAmount] = useState(0);

  const finalDeposit = Math.max(totalDeposit - totalVoucherAmount, 0);

  const finalDebt = Math.max(totalDebt - totalVoucherAmount, 0);

  const paymentDeadline = useMemo(() => {
    const holdHours = Number(paytermData?.intHourInHold ?? 24);

    const date = new Date();

    date.setHours(date.getHours() + holdHours);

    return date.toLocaleString(i18next.language === "vi" ? "vi-VN" : "en-US",
      {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

    { ' ' }
  }, [paytermData?.intHourInHold]);

  const childPriceSummary = useMemo(() => {
    const ages =
      payloadItem?.strListChildAge
        ?.split(",")
        .map(Number)
        .filter((n: any) => !Number.isNaN(n)) ?? [];

    return childPrices.map((child: any) => {
      const quantity = ages.filter(
        (age: any) => age >= child.ageFrom && age <= child.ageTo
      ).length;

      return {
        ...child,
        quantity,
      };
    });
  }, [childPrices, payloadItem?.strListChildAge]);

  const bankInfo = {
    accountName: selectedBankAccount?.strCompanyBankAccountName || "---",

    accountNumber: selectedBankAccount?.strCompanyBankAccountCode || "---",

    bankName: selectedBankAccount?.strCompanyBankAccountInfo || "---",

    bankAddress: selectedBankAccount?.strBankAddress || "---",

    swiftCode: selectedBankAccount?.strSwiftCode || "---",

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
      isLoading || isVcPending || isListAGTMSPending || isDetailAGTMSPending;

    setGlobalLoading(isPending);
  }, [isLoading, isVcPending, isListAGTMSPending, isDetailAGTMSPending]);

  const hasPayterm =
    paytermData &&
    !Array.isArray(paytermData) &&
    Object.keys(paytermData).length > 0;

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

    const bookingTab = window.open(
      "https://myagentmember.itourlink.com/service?activeTab=loading",
      "_blank",
    );

    try {
      // apply voucher trước
      if (selectedVoucher?.length > 0) {
        await Promise.all(
          selectedVoucher.map(
            (voucher: any) =>
              new Promise((resolve, reject) => {
                markUsedVoucherApi(
                  {
                    VoucherCode: voucher?.voucherCode,
                    updatedBy: user?.strUserGUID || null,
                  },
                  {
                    onSuccess: () => resolve(true),

                    onError: (err) => {
                      showToast("error", t("voucherApplyFailed"));
                      reject(err);
                    },
                  },
                );
              }),
          ),
        );

        showToast("success", t("voucherApplySuccess"));
      }

      const companyGUID = coData?.strCompanyGUID || null;

      const payload = {
        strUserGUID: user?.strUserGUID || null,

        strCompanyAgentGUID: user?.strCompanyGUID || null,

        strCompanyOwnerGUID: companyGUID,

        strTourGUID: item?.strTourGUID || null,

        strTourPriceItemLevelGUID: price?.strTourPriceItemLevelGUID || null,

        strDepartureTourLevelGUID: null,

        intAdult: payloadItem?.intAdult || 0,

        strListChildAge: payloadItem?.strListChildAge || null,

        intSGL: payloadItem?.intSGL || 0,

        intDBL: payloadItem?.intDBL || 0,

        intTWN: payloadItem?.intTWN || 0,

        intTPL: payloadItem?.intTPL || 0,

        dtmDateFrom: payloadItem?.dtmDateFrom || null,

        dtmDateTo: null,

        intCurrencyID: currencyId || 3,

        strPaidRemark: paidRemark || null,

        intSaluteID: isShowTravellerForm
          ? travellerForm?.intSaluteID || null
          : null,

        intAgeID: isShowTravellerForm ? "3" : null,

        intPassengerAges: null,

        strPassengerFirstName: isShowTravellerForm
          ? travellerForm?.strPassengerFirstName || null
          : null,

        strPassengerLastName: isShowTravellerForm
          ? travellerForm?.strPassengerLastName || null
          : null,

        dtmPassengerBirthday: isShowTravellerForm
          ? travellerForm?.dtmPassengerBirthday || null
          : null,

        dtmPasspostExpirationDate: null,

        strPassengerEmail: isShowTravellerForm
          ? travellerForm?.strPassengerEmail || null
          : null,

        strPassengerPhone: isShowTravellerForm
          ? travellerForm?.strPassengerPhone || null
          : null,

        strPassengerRemark: isShowTravellerForm
          ? travellerForm?.strPassengerRemark || null
          : null,

        strPassport: null,

        strCountryGUID: isShowTravellerForm
          ? travellerForm?.strCountryGUID || null
          : null,

        IsTraveller: isShowTravellerForm,

        intPaymentMethodID: paymentMethod === "Bank transfer" ? 1 : 2,

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
          showToast("success", t("bookingSuccess"));

          const intBK = res?.[1]?.[0]?.intStatusBk;

          const activeTab = statusTabMap[intBK] ?? "booked";

          try {
            const serviceGUID =
              res?.[1]?.[0]?.strListAgentHostServiceItemGUID;

            if (serviceGUID) {
              const emailData = await fetchGetEmailSendAGHByAGBApi({
                strBookingGUID: null,

                strCompanyGUID: companyGUID,

                strListAgentHostServiceItemGUID: serviceGUID,

                intLangID: user?.intLangID,

                strEmailTemplateCode: "BKK",
              });

              if (emailData) {
                await fetchGetSendEmailApi({
                  strEmailsSendTo: emailData?.strEmailsSendTo || null,

                  strEmailsCC: emailData?.strEmailsCC || null,

                  strEmailsBCC: emailData?.strEmailsBCC || null,

                  strAttachments: null,

                  strSubject: emailData?.strEmailTemplateSubject || null,

                  IsBodyHtml: true,

                  strBody: emailData?.strEmailTemplateContent || null,

                  intEmailConfigID: null,
                });
              }

              await Promise.all([
                listAGTMS({
                  strCompanyGUID: companyGUID,

                  strListAgentHostServiceItemGUID: serviceGUID,
                }),

                detailAGTMS({
                  strAgentHostCompanyGUID: companyGUID,

                  strListAgentHostServiceItemGUID: serviceGUID,
                }),
              ]);
            }
          } catch (err) {
            console.error("after booking error", err);
          }

          // Luôn đá trang, kể cả email/TMS lỗi
          bookingTab?.location.replace(
            `https://myagentmember.itourlink.com/service?activeTab=${activeTab}`,
          );
        },

        onError: () => {
          showToast("error", t("bookingFailed"));

          bookingTab?.close();
        },
      });
    } catch (err) {
      showToast("error", t("invalidVoucher"));

      bookingTab?.close();
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
            <h2 className="text-base font-semibold text-gray-700">
              {t("mainContact")}
            </h2>
          </div>
          <div className="p-5 space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="font-medium text-gray-600 min-w-[90px]">
                {t("fullName")}
              </span>

              <span className="text-gray-800">{user?.strFullName}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-gray-600 min-w-[90px]">
                {t("email")}
              </span>

              <span className="text-gray-800 font-light">{user?.strEmail}</span>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center gap-3 pt-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isShowTravellerForm}
                  onChange={(e) => setIsShowTravellerForm(e.target.checked)}
                />

                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>

              <span className="text-sm font-medium text-gray-600">
                {t("isTraveller")}
              </span>
            </div>
          </div>

          {isShowTravellerForm && (
            <PaymentFormBooking
              t={t}
              travellerForm={travellerForm}
              setTravellerForm={setTravellerForm}
              travellerErrors={travellerErrors}
              setTravellerErrors={setTravellerErrors}

              isOpenCountry={isOpenCountry}
              setIsOpenCountry={setIsOpenCountry}

              countrySearch={countrySearch}
              setCountrySearch={setCountrySearch}

              filteredCountries={filteredCountries}
              selectedCountry={selectedCountry}

              getFlagClass={getFlagClass}

              TITLES_OPTIONS={TITLES_OPTIONS}
            />
          )}
        </div>

        {/* 3. Khối Nội dung thanh toán tour */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {/* Header công ty */}
          <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center gap-2">
            <span className="text-gray-600 text-lg">💼</span>
            <h2 className="text-base font-bold text-gray-700 uppercase tracking-wide">
              {t("travelConnectionCompany")}
            </h2>
          </div>

          <PaymentTableBooking
            t={t}
            price={price}
            payloadItem={payloadItem}
            item={item}
            childPriceSummary={childPriceSummary}
            selectedCurrency={selectedCurrency}
            totalDeposit={totalDeposit}
            fCurrency={fCurrency}
            fDate={fDate}
            addDays={addDays}
            isValidValue={isValidValue}
          />

          {/* Section Voucher & Chi tiết đợt thanh toán bên dưới table */}
          <PaymentVouBank

            t={t}

            isShowVoucher={isShowVoucher}
            setIsShowVoucher={setIsShowVoucher}

            selectedVoucher={selectedVoucher}
            setSelectedVoucher={setSelectedVoucher}

            finalVoucherPayment={finalVoucherPayment}
            totalDeposit={totalDeposit}
            setTotalVoucherAmount={setTotalVoucherAmount}


            hasPayterm={hasPayterm}
            finalDeposit={finalDeposit}
            finalDebt={finalDebt}
            paymentDeadline={paymentDeadline}


            fCurrency={fCurrency}
            selectedCurrency={selectedCurrency}


            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}


            bankAccountData={bankAccountData}
            selectedBankAccount={selectedBankAccount}
            setSelectedBankAccount={setSelectedBankAccount}


            bankInfo={bankInfo}


            paidRemark={paidRemark}
            setPaidRemark={setPaidRemark}

            showToast={showToast}

            isLoading={isLoading}
            setIsOpenConfirm={setIsOpenConfirm}

          />
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
