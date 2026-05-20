import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";

import { Field, Form } from "@/components/hook-form";
import { useListCity } from "@/hooks/actions/useCity";
import { useGetlistTourPublish } from "@/hooks/actions/useTourCustomized";
import { useTranslate } from "@/locales";
import { STARS2_OPTIONS } from "@/utils/oprion-data";

const AddShippingServicesD = () => {
  const { t } = useTranslate("tourcustomize");
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
  });

  const methods = useForm({
    defaultValues: {
      type: "1",
      country: "",
      displayName: "",
      star: "",
      from: "",
      to: "",
    },
  });

  const { watch } = methods;
  const values = watch();

  const { ctData } = useListCity({
    strTableName: "MC02",
    strFeildSelect:
      "MC02_CountryCode AS code, MC02_CountryName AS strName",
    strWhere: "WHERE (IsActive=1) ORDER BY MC02_CountryName ASC",
  });

  const countryOptions =
    ctData?.map((item: any) => ({
      label: item.strName,
      value: item.code,
    })) || [];

  const payload = useMemo(
    () => ({
      strUserGUID: "97d664c3-375c-42d6-b039-3d2a72414f60",
      strTourGUID: null,
      strCompanyOwnerGUID: null,
      strCompanyPartnerGUID: "e824fd66-a3ca-46f4-a1be-ab7a0d1f6137",
      strMemberPartnerGUID: "97d664c3-375c-42d6-b039-3d2a72414f60",
      intLangID: 18,
      strPriceLevelGUID: null,
      intCateID: 19,
      intProductID: 101,
      strNoOfDayRange: null,
      strFilterServiceName: null,
      strListEasiaCateID: null,
      strListTransportOptionID: null,
      dtmFilterDateStart: "1/1/2025",
      dtmFilterDateValidFrom: null,
      dtmFilterDateValidTo: null,
      strOrder: null,
      strPriceFromRange: "",
      intCurrencyView: null,
      strLocationCode: "VN00010001,",
      intCurPage: 1,
      intPageSize: 10,
      tblsReturn: "[0]",
      intTotalPax: 15,
    }),
    [filters, values]
  );

  const { tourData, isLoading } = useGetlistTourPublish(payload);

  const onSubmit = methods.handleSubmit(() => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
    }));
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <div className="space-y-5 px-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {t("addExcursionForDay", { day: 1 })}
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            {t("chooseExcursionTypeAndSearch")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Field.Text
              name="displayName"
              placeholder={t("searchPlaceholder")}
            />
          </div>

          <div>
            <Field.MultiSelect
              name="country"
              placeholder={t("selectCountry")}
              options={countryOptions}
            />
          </div>

          <div>
            <Field.Select name="star" options={STARS2_OPTIONS} />
          </div>

          <div>
            <Field.Text name="from" placeholder={t("from")} />
          </div>

          <div>
            <Field.Text name="to" placeholder={t("to")} />
          </div>

          <button
            type="submit"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-blue-200 bg-white text-[#004b91] transition hover:bg-blue-50"
          >
            <Search size={18} />
          </button>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div>{t("loading")}</div>
          ) : (
            tourData?.map((item: any, index: number) => (
              <div key={index} className="rounded-xl border p-4">
                <div className="font-semibold">{item.strTourName}</div>
                <div className="text-sm text-gray-500">{item.strPlaceName}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </Form>
  );
};

export default AddShippingServicesD;
