import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";

import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { updateTourCustomizedCustomer } from "@/hooks/actions/useTourCustomized";
import { useUser } from "@/hooks/actions/useAuth";
import { useListCity } from "@/hooks/actions/useCity";
import type { ITourCustomizedCustomer } from "@/hooks/interfaces/user";
import { useTranslate } from "@/locales";
import { useToastStore } from "@/zustand/useToastStore";
import { TITLES_OPTIONS } from "@/utils/option-data";

interface Props {
  formId?: string;
  onClose: () => void;
  onSuccess?: () => void;
  customer: ITourCustomizedCustomer | null;
  strTourCode: string;
}

const inputClassName =
  "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-700 outline-none transition focus:border-[#004b91]";

const textareaClassName =
  "min-h-[120px] w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-700 outline-none transition focus:border-[#004b91]";

const labelClassName = "mb-2 block text-sm font-semibold text-gray-700";

type SchemaType = {
  intSaluteID: string;
  strFirstName: string;
  strLastName: string;
  strEmail: string;
  strPhoneNumber: string;
  strCountryGUID: string;
  dtmDateOfBirth: string;
  strPassNum: string;
  dtmPassportExpireDate: string;
  strContactDetail: string;
  strRemark: string;
};

const normalizeEmpty = (value?: string | null) => {
  const normalized = value?.trim();
  return normalized ? normalized : null;
};

const formatDateForInput = (value?: string | number | null) => {
  if (!value) return "";

  if (typeof value === "string") {
    const match = value.match(/\/Date\((\d+)\)\//);
    if (match) {
      const dotNetDate = new Date(Number(match[1]));
      if (!Number.isNaN(dotNetDate.getTime())) {
        return dotNetDate.toISOString().slice(0, 10);
      }
    }
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

const UpdateCustomer = ({
  formId = "customer-update-form",
  onClose,
  onSuccess,
  customer,
  strTourCode,
}: Props) => {
  const { t } = useTranslate("tourcustomize");
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { showToast } = useToastStore();

  const schema = z.object({
    intSaluteID: z.string().default("2"),
    strFirstName: z.string().trim().min(1, t("firstNameRequired")),
    strLastName: z.string().trim().min(1, t("lastNameRequired")),
    strEmail: z
      .union([z.string().trim().email(t("invalidEmail")), z.literal("")])
      .default(""),
    strPhoneNumber: z.string().trim().default(""),
    strCountryGUID: z.string().default(""),
    dtmDateOfBirth: z.string().default(""),
    strPassNum: z.string().trim().default(""),
    dtmPassportExpireDate: z.string().default(""),
    strContactDetail: z.string().trim().default(""),
    strRemark: z.string().trim().default(""),
  });

  const { ctData } = useListCity({
    strTableName: "MC02",
    strFeildSelect:
      "MC02_CountryGUID AS id, MC02_CountryName AS text, MC02_CountryName AS strName",
    strWhere: "WHERE (IsActive=1) ORDER BY MC02_CountryName ASC",
  });

  const { mutate: updateCustomerApi, isPending } = useMutation({
    mutationFn: updateTourCustomizedCustomer,
  });

  const methods = useForm<SchemaType>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      intSaluteID: "2",
      strFirstName: "",
      strLastName: "",
      strEmail: "",
      strPhoneNumber: "",
      strCountryGUID: "",
      dtmDateOfBirth: "",
      strPassNum: "",
      dtmPassportExpireDate: "",
      strContactDetail: "",
      strRemark: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  useEffect(() => {
    if (!customer) return;

    reset({
      intSaluteID: String(customer?.intSaluteID || 2),
      strFirstName: customer?.strFirstName || "",
      strLastName: customer?.strLastName || "",
      strEmail: customer?.strEmail || "",
      strPhoneNumber: customer?.strPhoneNumber || "",
      strCountryGUID: customer?.strCountryGUID || "",
      dtmDateOfBirth: formatDateForInput(customer?.dtmDateOfBirth),
      strPassNum: customer?.strPassNum || "",
      dtmPassportExpireDate: formatDateForInput(customer?.dtmPassportExpireDate),
      strContactDetail: customer?.strContactDetail || "",
      strRemark: customer?.strRemark || "",
    });
  }, [customer, reset]);

  const onSubmit = handleSubmit((data) => {
    if (!user?.strUserGUID || !customer?.strCustomerGUID) {
      showToast("error", t("missingUserOrCustomerInfo"));
      return;
    }

    const payload = {
      strUserGUID: user.strUserGUID,
      strCustomerGUID: customer.strCustomerGUID,
      dtmPassportExpireDate: normalizeEmpty(data.dtmPassportExpireDate),
      strCountryGUID: normalizeEmpty(data.strCountryGUID),
      intSaluteID: Number(data.intSaluteID || 0),
      strFirstName: data.strFirstName.trim(),
      strLastName: data.strLastName.trim(),
      strPhoneNumber: normalizeEmpty(data.strPhoneNumber),
      strPassNum: normalizeEmpty(data.strPassNum),
      dtmDateOfBirth: normalizeEmpty(data.dtmDateOfBirth),
      strRemark: normalizeEmpty(data.strRemark),
      strContactDetail: normalizeEmpty(data.strContactDetail),
      strEmail: normalizeEmpty(data.strEmail),
    };

    updateCustomerApi(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.TOUR_CUSTOMER.LIST_TOUR_CUSTOMER, strTourCode],
        });
        showToast("success", t("updateCustomerSuccess"));
        onSuccess?.();
        onClose();
      },
      onError: (error: any) => {
        showToast("error", error?.message || t("updateCustomerError"));
      },
    });
  });

  return (
    <form id={formId} onSubmit={onSubmit} className="w-full">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className={labelClassName}>{t("salute")}</label>
          <select
            {...register("intSaluteID")}
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-700 outline-none transition focus:border-[#004b91] md:max-w-[110px]"
          >
            {TITLES_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClassName}>
            {t("firstName")} <span className="text-red-500">*</span>
          </label>
          <input {...register("strFirstName")} className={inputClassName} />
          {errors.strFirstName && (
            <p className="mt-1 text-xs text-red-500">{errors.strFirstName.message}</p>
          )}
        </div>

        <div>
          <label className={labelClassName}>
            {t("lastName")} <span className="text-red-500">*</span>
          </label>
          <input {...register("strLastName")} className={inputClassName} />
          {errors.strLastName && (
            <p className="mt-1 text-xs text-red-500">{errors.strLastName.message}</p>
          )}
        </div>

        <div>
          <label className={labelClassName}>{t("email")}</label>
          <input type="email" {...register("strEmail")} className={inputClassName} />
          {errors.strEmail && (
            <p className="mt-1 text-xs text-red-500">{errors.strEmail.message}</p>
          )}
        </div>

        <div>
          <label className={labelClassName}>{t("phoneNumber")}</label>
          <input {...register("strPhoneNumber")} className={inputClassName} />
        </div>

        <div>
          <label className={labelClassName}>{t("country")}</label>
          <div className="relative">
            <select
              {...register("strCountryGUID")}
              className="h-10 w-full appearance-none rounded-lg border border-gray-300 px-3 pr-10 text-sm text-gray-700 outline-none transition focus:border-[#004b91]"
            >
              <option value="">{t("selectCountryPlaceholder")}</option>
              {ctData.map((country: any) => (
                <option key={country.id} value={country.id}>
                  {country.text || country.strName}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>
        </div>

        <div>
          <label className={labelClassName}>{t("dateOfBirth")}</label>
          <input
            type="date"
            {...register("dtmDateOfBirth")}
            className={inputClassName}
          />
        </div>

        <div>
          <label className={labelClassName}>{t("passport")}</label>
          <input {...register("strPassNum")} className={inputClassName} />
        </div>

        <div>
          <label className={labelClassName}>{t("visaExpiryDate")}</label>
          <input
            type="date"
            {...register("dtmPassportExpireDate")}
            className={inputClassName}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClassName}>{t("contactDetail")}</label>
          <textarea {...register("strContactDetail")} className={textareaClassName} />
        </div>

        <div className="md:col-span-2">
          <label className={labelClassName}>{t("moreInfo")}</label>
          <textarea {...register("strRemark")} className={textareaClassName} />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isPending}
        className="hidden"
        aria-hidden="true"
      />
    </form>
  );
};

export default UpdateCustomer;
