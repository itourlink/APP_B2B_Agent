import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { addTourCustomizedCustomer } from "@/hooks/actions/useTourCustomized";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useUser } from "@/hooks/actions/useAuth";
import { useListCity } from "@/hooks/actions/useCity";
import { TITLES_OPTIONS } from "@/utils/oprion-data";
import { useToastStore } from "@/zustand/useToastStore";

interface Props {
  formId?: string;
  onClose: () => void;
  onSuccess?: () => void;
  strTourCustomizedGUID: string;
  strTourCode: string;
}

const inputClassName =
  "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-700 outline-none transition focus:border-[#004b91]";

const textareaClassName =
  "min-h-[120px] w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-700 outline-none transition focus:border-[#004b91]";

const labelClassName = "mb-2 block text-sm font-semibold text-gray-700";

const schema = z.object({
  intSaluteID: z.string().default("2"),
  strFirstName: z.string().trim().min(1, "First name is required"),
  strLastName: z.string().trim().min(1, "Last name is required"),
  strEmail: z.union([z.string().trim().email("Invalid email"), z.literal("")]).default(""),
  strPhoneNumber: z.string().trim().default(""),
  strCountryGUID: z.string().default(""),
  dtmDateOfBirth: z.string().default(""),
  strPassNum: z.string().trim().default(""),
  dtmPassportExpireDate: z.string().default(""),
  strContactDetail: z.string().trim().default(""),
  strRemark: z.string().trim().default(""),
});

type SchemaType = z.infer<typeof schema>;

const normalizeEmpty = (value?: string | null) => {
  const normalized = value?.trim();
  return normalized ? normalized : null;
};

const DetailTourHeaderPopupAdd = ({
  formId = "customer-add-form",
  onClose,
  onSuccess,
  strTourCustomizedGUID,
  strTourCode,
}: Props) => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { showToast } = useToastStore();

  const { ctData } = useListCity({
    strTableName: "MC02",
    strFeildSelect:
      "MC02_CountryGUID AS id, MC02_CountryName AS text, MC02_CountryName AS strName",
    strWhere: "WHERE (IsActive=1) ORDER BY MC02_CountryName ASC",
  });

  const { mutate: addCustomerApi, isPending } = useMutation({
    mutationFn: addTourCustomizedCustomer,
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

  const onSubmit = handleSubmit((data) => {
    if (!user?.strUserGUID || !strTourCustomizedGUID) {
      showToast("error", "Missing user or tour information");
      return;
    }

    const payload = {
      strUserGUID: user.strUserGUID,
      strTourCustomizedGUID,
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

    addCustomerApi(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.TOUR_CUSTOMER.LIST_TOUR_CUSTOMER, strTourCode],
        });
        showToast("success", "Add customer successfully");
        reset();
        onSuccess?.();
        onClose();
      },
      onError: () => {
        showToast("error", "Add customer failed");
      },
    });
  });

  return (
    <form id={formId} onSubmit={onSubmit} className="w-full">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className={labelClassName}>Salute</label>
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
            First name <span className="text-red-500">*</span>
          </label>
          <input {...register("strFirstName")} className={inputClassName} />
          {errors.strFirstName && (
            <p className="mt-1 text-xs text-red-500">{errors.strFirstName.message}</p>
          )}
        </div>

        <div>
          <label className={labelClassName}>
            Last name <span className="text-red-500">*</span>
          </label>
          <input {...register("strLastName")} className={inputClassName} />
          {errors.strLastName && (
            <p className="mt-1 text-xs text-red-500">{errors.strLastName.message}</p>
          )}
        </div>

        <div>
          <label className={labelClassName}>Email</label>
          <input type="email" {...register("strEmail")} className={inputClassName} />
          {errors.strEmail && (
            <p className="mt-1 text-xs text-red-500">{errors.strEmail.message}</p>
          )}
        </div>

        <div>
          <label className={labelClassName}>Phone number</label>
          <input {...register("strPhoneNumber")} className={inputClassName} />
        </div>

        <div>
          <label className={labelClassName}>Country</label>
          <div className="relative">
            <select
              {...register("strCountryGUID")}
              className="h-10 w-full appearance-none rounded-lg border border-gray-300 px-3 pr-10 text-sm text-gray-700 outline-none transition focus:border-[#004b91]"
            >
              <option value="">Select country</option>
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
          <label className={labelClassName}>Date of birth</label>
          <input type="date" {...register("dtmDateOfBirth")} className={inputClassName} />
        </div>

        <div>
          <label className={labelClassName}>Passport</label>
          <input {...register("strPassNum")} className={inputClassName} />
        </div>

        <div>
          <label className={labelClassName}>Visa expiry date</label>
          <input
            type="date"
            {...register("dtmPassportExpireDate")}
            className={inputClassName}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClassName}>Contact detail</label>
          <textarea {...register("strContactDetail")} className={textareaClassName} />
        </div>

        <div className="md:col-span-2">
          <label className={labelClassName}>More info</label>
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

export default DetailTourHeaderPopupAdd;
