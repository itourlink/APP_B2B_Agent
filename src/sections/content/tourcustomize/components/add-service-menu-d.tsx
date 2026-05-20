import { useEffect, useState } from "react";
import { Funnel, MapPin, X } from "lucide-react";
import { useForm } from "react-hook-form";

import { Field, Form } from "@/components/hook-form";
import { useListCity } from "@/hooks/actions/useCity";
import { useTranslate } from "@/locales";

const AddServiceMenuD = () => {
  const { t } = useTranslate("tourcustomize");
  const methods = useForm({
    defaultValues: {
      serviceType: "1",
      displayName: "",
      category: "",
      from: "",
      to: "",
      country: "",
      cities: "",
    },
  });

  const { watch, setValue } = methods;
  const selectedCountryCode = watch("country");

  const { ctData: countryData = [] } = useListCity({
    strTableName: "MC02",
    strWhere: "WHERE IsActive=1 ORDER BY MC02_CountryName",
    strFeildSelect:
      "MC02_CountryCode AS code, MC02_CountryName AS strName",
  });

  const [isEditLoc, setIsEditLoc] = useState(false);

  const selectedCountry = countryData.find(
    (item: any) => item.code === selectedCountryCode
  );

  const countryOptions = countryData.map((item: any) => ({
    label: item.strName,
    value: item.code,
  }));

  const { ctData: cityData = [] } = useListCity({
    strTableName: "MC04",
    strWhere: selectedCountryCode
      ? `WHERE IsActive=1 AND MC04_CityCode LIKE '%${selectedCountryCode}%' ORDER BY MC04_CityName`
      : "WHERE 1=0",
    strFeildSelect: "MC04_CityCode AS code, MC04_CityName AS strName",
  });

  const cityOptions = cityData.map((item: any) => ({
    label: item.strName,
    value: item.code,
  }));

  useEffect(() => {
    setValue("cities", "");
  }, [selectedCountryCode, setValue]);

  const selectedCitiesCodes = (watch("cities") ?? "").split(",").filter(Boolean);

  const selectedCitiesNames =
    cityData
      ?.filter((city: any) => selectedCitiesCodes.includes(city.code))
      .map((city: any) => city.strName) || [];

  return (
    <Form methods={methods}>
      <div className="bg-white px-2 pb-4 pt-1 text-[13px] text-gray-700">
        <div className="mb-3 flex items-center justify-between border-b border-gray-200 pb-2">
          <h2 className="text-[20px] font-normal text-gray-800">
            {t("addSingleServiceForDay", { day: 1 })}
          </h2>

          <button
            type="button"
            className="text-[#0d4d92] transition hover:opacity-80"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Field.Select
              name="serviceType"
              options={[
                { label: t("boatDayCruise"), value: "1" },
                { label: t("restaurant"), value: "2" },
                { label: t("transportation"), value: "3" },
              ]}
            />
          </div>

          <div>
            <Field.Text name="displayName" placeholder={t("name")} />
          </div>

          <button
            type="button"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded bg-[#0d4d92] text-white"
          >
            <Funnel size={18} />
          </button>
        </div>

        {isEditLoc ? (
          <div className="mb-2 flex items-center gap-2">
            <div className="w-[180px]">
              <Field.SearchSelect name="country" options={countryOptions} />
            </div>

            <div className="flex-1">
              <Field.MultiSelect name="cities" options={cityOptions} />
            </div>

            <button
              type="button"
              onClick={() => setIsEditLoc(false)}
              className="text-gray-400 transition hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div
            className="mb-2 flex cursor-pointer items-center gap-1 text-[12px] text-[#0d4d92] transition hover:opacity-80"
            onClick={() => setIsEditLoc(true)}
          >
            <MapPin size={13} className="fill-[#0d4d92]" />
            <span>
              {selectedCountry ? selectedCountry.strName : t("defaultCountry")}:
              {" "}
              {selectedCitiesNames.length > 0
                ? selectedCitiesNames.join(", ")
                : t("defaultCity")}
            </span>
          </div>
        )}

        <div className="mb-3 grid grid-cols-[190px_1fr_1fr] gap-2">
          <Field.Select
            name="category"
            placeholder={t("selectCategory")}
            options={[
              { label: "*", value: "1" },
              { label: "**", value: "2" },
              { label: "***", value: "3" },
              { label: "****", value: "4" },
              { label: "*****", value: "5" },
              { label: "******", value: "6" },
              { label: "*******", value: "7" },
            ]}
          />

          <div>
            <Field.Text name="from" placeholder={t("from")} />
          </div>

          <div>
            <Field.Text name="to" placeholder={t("to")} />
          </div>
        </div>

        <div className="overflow-hidden">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-gray-200 text-[#3b6ea8]">
                <th className="py-2 text-left font-normal">{t("serialNumber")}</th>
                <th className="py-2 text-left font-normal">{t("serviceName")}</th>
                <th className="py-2 text-left font-normal">{t("price")}</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-2 py-2 text-gray-700">1</td>
                <td className="px-2 py-2 font-medium">{t("service")}</td>
                <td className="px-2 py-2 font-semibold text-[#0d4d92]">10000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Form>
  );
};

export default AddServiceMenuD;
