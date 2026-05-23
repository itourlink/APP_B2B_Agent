import { useState } from "react";
import { Info, Plus, Search } from "lucide-react";
import { useForm } from "react-hook-form";

import { Field, Form } from "@/components/hook-form";
import { useListCity } from "@/hooks/actions/useCity";
import { useTranslate } from "@/locales";
import { STARS2_OPTIONS } from "@/utils/option-data";

import AddSupAccommodationD from "./add-sup-accommodation-d";
import DetailAccommodationD from "./detail-accommodation-d";

const AddAccommodationD = () => {
  const { t } = useTranslate("tourcustomize");
  const [open, setOpen] = useState({
    detail: false,
    add: false,
  });

  const methods = useForm({
    defaultValues: {
      type: "Hotel",
      country: "",
      displayName: "",
    },
  });

  const fakeAccommodationData = [
    {
      No: 1,
      strSupplierMappingPriceGUID: "1",
      strSupplierName: t("sampleHotelName"),
      strItemTypeName: t("sampleVillaSuperior"),
      dblPriceView: 604800,
      strMealIncludedTypeName: t("breakfastIncluded"),
    },
    {
      No: 2,
      strSupplierMappingPriceGUID: "2",
      strSupplierName: t("sampleHotelName"),
      strItemTypeName: t("sampleVillaFamily"),
      dblPriceView: 846720,
      strMealIncludedTypeName: t("breakfastIncluded"),
    },
    {
      No: 3,
      strSupplierMappingPriceGUID: "3",
      strSupplierName: t("sampleHotelName"),
      strItemTypeName: t("sampleSuperior"),
      dblPriceView: 725760,
      strMealIncludedTypeName: t("breakfastIncluded"),
    },
  ];

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

  const onSubmit = methods.handleSubmit((values) => {
    console.log("values", values);
  });

  return (
    <div>
      <Form methods={methods} onSubmit={onSubmit}>
        <div className="space-y-5 px-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {t("addAccommodationForDay", { day: 1 })}
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              {t("chooseAccommodationTypeAndSearch")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Field.Select
                name="type"
                options={[
                  {
                    label: t("hotel"),
                    value: "1",
                  },
                  {
                    label: t("boat"),
                    value: "2",
                  },
                ]}
              />
            </div>

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
              <Field.Select name="type" options={STARS2_OPTIONS} />
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

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full border-collapse">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    {t("serialNumber")}
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    {t("serviceName")}
                  </th>

                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    {t("meal")}
                  </th>

                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    {t("price")}
                  </th>

                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    {t("action")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {fakeAccommodationData.map((item) => (
                  <tr
                    key={item.strSupplierMappingPriceGUID}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-center">{item.No}</td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-800">
                        {item.strItemTypeName}
                      </div>

                      <div className="text-xs text-gray-400">
                        {item.strSupplierName}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center">
                      {item.strMealIncludedTypeName}
                    </td>

                    <td className="px-4 py-3 text-center font-semibold text-[#004b91]">
                      {item.dblPriceView?.toLocaleString()} {t("currencyVnd")}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setOpen((prev) => ({
                              ...prev,
                              detail: true,
                            }))
                          }
                          className="cursor-pointer rounded-lg bg-[#004b91] px-3 py-1 text-sm text-white hover:opacity-90"
                        >
                          <Info size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setOpen((prev) => ({
                              ...prev,
                              add: true,
                            }))
                          }
                          className="cursor-pointer rounded-lg bg-[#004b91] px-3 py-1 text-sm text-white hover:opacity-90"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Form>

      <DetailAccommodationD
        open={open.detail}
        onClose={() =>
          setOpen((prev) => ({
            ...prev,
            detail: false,
          }))
        }
      />

      <AddSupAccommodationD
        open={open.add}
        onClose={() =>
          setOpen((prev) => ({
            ...prev,
            add: false,
          }))
        }
      />
    </div>
  );
};

export default AddAccommodationD;
