import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";

import { Field, Form } from "@/components/hook-form";
import BannerMediaField from "@/components/media/banner-media-field";

import { useToastStore } from "@/zustand/useToastStore";
import { useUserStore } from "@/zustand/useUserStore";

import { CONFIG } from "@/config-global";

import { useMutation } from "@tanstack/react-query";

import { useUpdCompanyInfo } from "@/hooks/actions/useUser";
import { useTranslate } from "@/locales";

const getDefaultValues = (user: ReturnType<typeof useUserStore.getState>["user"]) => ({
  companyLogo: user?.strCompanyLogo || "",
  companyName: user?.strCompanyName || "",
  phone: user?.strCompanyPhone || "",
  email: user?.strEmail || "",
  website: user?.strCompanyWeb || "",
  language: String(user?.intLangID || ""),
  currency: String(user?.intCurrencyID || ""),
  refCode: user?.strRefCode || "",
  address: user?.strCompanyAddr || "",
});

const InfoCompany = () => {
  const { t } = useTranslate("info");
  const { showToast } = useToastStore();

  const languageOptions = [
    { label: t("selectOption"), value: "" },
    { label: t("languageVietnamese"), value: "18" },
    { label: t("languageEnglish"), value: "19" },
    { label: t("languageFrench"), value: "20" },
  ];

  const currencyOptions = [
    { label: t("selectOption"), value: "" },
    { label: t("currencyVnd"), value: "1" },
    { label: t("currencyUsd"), value: "2" },
    { label: t("currencyEur"), value: "3" },
    { label: t("currencyJpy"), value: "4" },
    { label: t("currencyRub"), value: "5" },
    { label: t("currencyAud"), value: "6" },
    { label: t("currencyHkd"), value: "7" },
    { label: t("currencyGbp"), value: "8" },
  ];

  const Schema = zod.object({
    companyLogo: zod.string().default(""),
    companyName: zod.string().min(1, t("companyNameRequired")),
    phone: zod.string().min(1, t("companyPhoneRequired")),
    email: zod
      .string()
      .email(t("invalidEmail"))
      .min(1, t("emailRequired")),
    website: zod.string().default(""),
    language: zod.string().min(1, t("languageRequired")),
    currency: zod.string().min(1, t("currencyRequired")),
    refCode: zod.string().default(""),
    address: zod.string().min(1, t("addressRequired")),
  });
  type SchemaType = zod.input<typeof Schema>;

  const user = useUserStore((state) => state.user);

  const {
    mutate: updateCompanyInfoApi,
    isPending: isLoading,
  } = useMutation({
    mutationFn: useUpdCompanyInfo,
  });

  const defaultValues: SchemaType = getDefaultValues(user);

  const methods = useForm<SchemaType>({
    resolver: zodResolver(Schema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    reset,
  } = methods;

  const companyLogo = useWatch({
    control: methods.control,
    name: "companyLogo",
  });
  const preview = companyLogo
    ? `${CONFIG.serverUrlSP}${companyLogo.replace(/^\//, "")}`
    : "";

  useEffect(() => {
    if (!user) return;

    reset(getDefaultValues(user));
  }, [user, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      strCompanyGUID: user?.strCompanyGUID,
      strMemberGUID: user?.strUserGUID,
      strCompanyName: data?.companyName,
      strCompanyCode: null,
      strCompanyPhone: data?.phone,
      strCompanyEmail: data?.email,
      strCompanyAddr: data?.address,
      strCompanyLogo: data?.companyLogo,
      strCompanyWeb: data?.website,
      strCompanyTaxCode: null,
      strDescription: null,
      strAgentPolicy: null,
      intLangID: data?.language,
      intCurrencyID: data?.currency,
      strCompanyRefCode: "",
    };

    updateCompanyInfoApi(payload, {
      onSuccess: () => {
        showToast("success", t("updateSuccess"));
      },
      onError: () => {
        showToast("error", t("updateError"));
      },
    });
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <BannerMediaField
            title={t("logo")}
            value={preview}
            onChange={(path) => {
              setValue("companyLogo", path);
            }}
          />

          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-6">
            <div className="md:col-span-3 flex gap-2 items-end">
              <div className="flex-1">
                <Field.Text
                  name="companyName"
                  label={{
                    text: t("companyName"),
                    icon: <span className="text-red-500">*</span>,
                  }}
                  placeholder={t("enterCompanyName")}
                />
              </div>

              <span className="mb-3 text-gray-500 text-sm">
                {user?.strCompanyCode}
              </span>
            </div>

            <Field.Text
              name="phone"
              label={{
                text: t("companyPhone"),
                icon: <span className="text-red-500">*</span>,
              }}
              placeholder={t("enterCompanyPhone")}
            />

            <Field.Text
              name="email"
              label={{
                text: t("email"),
                icon: <span className="text-red-500">*</span>,
              }}
              placeholder={t("enterEmail")}
            />

            <Field.Text
              name="website"
              label={{
                text: t("website"),
              }}
              placeholder={t("enterWebsite")}
            />

            <Field.Select
              name="language"
              label={{
                text: t("language"),
                icon: <span className="text-red-500">*</span>,
              }}
              options={languageOptions}
            />

            <Field.Select
              name="currency"
              label={{
                text: t("currency"),
                icon: <span className="text-red-500">*</span>,
              }}
              options={currencyOptions}
            />

            <Field.Text
              name="refCode"
              label={{
                text: t("refCode"),
              }}
              placeholder={t("enterRefCode")}
            />

            <div className="md:col-span-3">
              <Field.Text
                name="address"
                label={{
                  text: t("address"),
                  icon: <span className="text-red-500">*</span>,
                }}
                placeholder={t("enterAddress")}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="cursor-pointer w-full px-16 py-2.5 bg-[#004b91] hover:bg-[#003d75] rounded-lg text-white transition-colors disabled:opacity-50"
          >
            {isSubmitting || isLoading ? t("saving") : t("save")}
          </button>
        </div>
      </div>
    </Form>
  );
};

export default InfoCompany;
