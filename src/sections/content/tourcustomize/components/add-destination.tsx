import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { Field, Form } from "@/components/hook-form";
import PanelPopup from "@/components/popup/panel-popup";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useListCity } from "@/hooks/actions/useCity";
import { addTourCustomizedDayDestination } from "@/hooks/actions/useUser";
import { useTranslate } from "@/locales";
import { useToastStore } from "@/zustand/useToastStore";

interface Props {
  open: boolean;
  onClose: () => void;
  strUserGUID: string;
  strTourCustomizedDayGUID: string;
}

type SchemaType = {
  country: string;
  city: string;
  intNoOfDays: string;
};

const AddDestination = ({
  open,
  onClose,
  strUserGUID,
  strTourCustomizedDayGUID,
}: Props) => {
  const { t } = useTranslate("tourcustomize");
  const { showToast } = useToastStore();
  const queryClient = useQueryClient();

  const schema = z.object({
    country: z.string().min(1, t("selectCountry")),
    city: z.string().min(1, t("city")),
    intNoOfDays: z.string().min(1, t("noOfDays")),
  });

  const methods = useForm<SchemaType>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      country: "",
      city: "",
      intNoOfDays: "1",
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
  } = methods;

  const watchedCountry = watch("country");

  const {
    mutateAsync: addTourCustomizedDayDestinationApi,
    isPending: isLoading,
  } = useMutation({
    mutationFn: addTourCustomizedDayDestination,
  });

  const { ctData } = useListCity({
    strTableName: "MC02",
    strFeildSelect:
      "MC02_CountryCode AS code, MC02_CountryName AS strName",
    strWhere: "WHERE (IsActive=1) ORDER BY MC02_CountryName ASC",
  });

  const countryOptions = ctData.map((item: any) => ({
    label: item.strName,
    value: item.code,
  }));

  const { ctData: cityData } = useListCity({
    strTableName: "MC04",
    strFeildSelect:
      "MC04_CityCode AS strCityCode, MC04_CityName AS strCityName",
    strWhere: `WHERE IsActive=1
      AND MC04_CityCode LIKE '%${watchedCountry}%'
      ORDER BY MC04_CityName`,
  });

  const cityOptions = cityData.map((item: any) => ({
    label: item.strCityName,
    value: item.strCityCode,
  }));

  useEffect(() => {
    setValue("city", "");
  }, [setValue, watchedCountry]);

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      strUserGUID,
      strTourCustomizedDayGUID,
      intNoOfDays: values.intNoOfDays,
      strLocationCode: values.city,
    };

    try {
      await addTourCustomizedDayDestinationApi(payload);

      showToast("success", t("addDestinationSuccess"));

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER.LIST_SERVICE_TOUR_CUSTOMIZED],
      });

      reset();
      onClose();
    } catch (error) {
      showToast("error", t("addDestinationError"));
    }
  });

  return (
    <PanelPopup
      open={open}
      onClose={onClose}
      title={t("addDestination")}
      className="w-[500px]"
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <div className="space-y-4">
          <div>
            <div className="mb-1 text-sm font-medium">{t("country")}</div>

            <Field.SearchSelect name="country" options={countryOptions} />
          </div>

          <div>
            <div className="mb-1 text-sm font-medium">{t("city")}</div>

            <Field.SearchSelect
              name="city"
              options={cityOptions}
              disabled={!watchedCountry}
            />
          </div>

          <div>
            <div className="mb-1 text-sm font-medium">{t("noOfDays")}</div>

            <Field.Select
              name="intNoOfDays"
              options={Array.from({ length: 10 }, (_, index) => ({
                label: `${index + 1}`,
                value: `${index + 1}`,
              }))}
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg border px-4 py-2"
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer rounded-lg bg-[#4a6fa5] px-4 py-2 text-white hover:bg-[#3b5b7e] disabled:opacity-50"
            >
              {isLoading ? t("saving") : t("save")}
            </button>
          </div>
        </div>
      </Form>
    </PanelPopup>
  );
};

export default AddDestination;
