import { useEffect, useMemo, useState } from "react";
import { Info, Plus, Search } from "lucide-react";
import { useForm } from "react-hook-form";

import { Field, Form } from "@/components/hook-form";
import { useListCity } from "@/hooks/actions/useCity";
import { useGetListSupplierMappingPrice } from "@/hooks/actions/useTourCustomized";
import { useTranslate } from "@/locales";
import { useUserStore } from "@/zustand/useUserStore";

import AddSupAccommodationD from "./add-sup-accommodation-d";
import DetailAccommodationD from "./detail-accommodation-d";
import { STARS2_OPTIONS } from "@/utils/option-data";

type AddAccommodationDProps = {
  strUserGUID?: string | null;
  strCompanyGUID?: string | null;
  dtmDateFrom?: string | null;
  dtmDateTo?: string | null;
  intPaxCount?: number | null;
  itemListour?: any;
};
const AddAccommodationD = ({
  strUserGUID,
  strCompanyGUID,
  dtmDateFrom,
  dtmDateTo,
  intPaxCount,
  itemListour,
}: AddAccommodationDProps) => {
  const { t } = useTranslate("tourcustomize");
  const { user } = useUserStore();

  const [open, setOpen] = useState({
    detail: false,
    add: false,
  });

  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [filters, setFilters] = useState<any>({
    page: 1,
    pageSize: 10,
    dtmFilterDateFrom: dtmDateFrom || null,
    dtmFilterDateTo: dtmDateTo || null,
    searchKey: 0,
  });

  const { supListMapData, isLoading } = useGetListSupplierMappingPrice(
    {
      ...filters,
      strUserGUID: strUserGUID || user?.strUserGUID,
      strCompanyGUID: strCompanyGUID || user?.strCompanyGUID,
      intPaxCount,
    },
  );

  const methods = useForm({
    defaultValues: {
      type: "1",
      country: "",
      city: [],
      displayName: "",
      star: "",
      priceFrom: "",
      priceTo: "",
    },
  });
  const selectedCountry = methods.watch("country");
  const { ctData: cityData } = useListCity({
    strTableName: "MC04",
    strFeildSelect: "MC04_CityCode AS code, MC04_CityName AS strName",
    strWhere: selectedCountry
      ? `WHERE IsActive=1 AND MC04_CityCode LIKE '%${selectedCountry}%' ORDER BY MC04_CityName ASC`
      : "WHERE 1=0",
  });

  const cityOptions =
    cityData?.map((item: any) => ({
      label: item.strName,
      value: item.code,
    })) || [];

  useEffect(() => {
    methods.setValue("city", []);
  }, [selectedCountry, methods]);

  useEffect(() => {
    setFilters((prev: any) => ({
      ...prev,
      dtmFilterDateFrom: dtmDateFrom || null,
      dtmFilterDateTo: dtmDateTo || null,
    }));
  }, [dtmDateFrom, dtmDateTo]);

  const { ctData } = useListCity({
    strTableName: "MC02",
    strFeildSelect: "MC02_CountryCode AS code, MC02_CountryName AS strName",
    strWhere: "WHERE (IsActive=1) ORDER BY MC02_CountryName ASC",
  });

  const countryOptions =
    ctData?.map((item: any) => ({
      label: item.strName,
      value: item.code,
    })) || [];

  const selectedDayOrder = useMemo(() => {
    return itemListour?.intDayOrder || "";
  }, [itemListour?.intDayOrder]);
  const accommodationData = Array.isArray(supListMapData) ? supListMapData : [];

  const renderAccommodationStars = (item: any) => {
    if (item?.strEasiaCateName) {
      return item.strEasiaCateName;
    }

    const starCount = Number(item?.intEasiaCateID || 0);

    return starCount > 0 ? "★".repeat(starCount) : "";
  };

  const onSubmit = methods.handleSubmit((values) => {
    const priceFrom = values.priceFrom?.trim();
    const priceTo = values.priceTo?.trim();
    const selectedCityCodes =
      Array.isArray(values.city) && values.city.length > 0
        ? values.city.join(",")
        : null;
    const selectedLocationCode = selectedCityCodes || values.country || null;

    const priceRange =
      priceFrom || priceTo ? `${priceFrom || 0}-${priceTo || 0}` : "";

    setFilters((prev: any) => ({
      ...prev,
      page: 1,

      // tăng searchKey để queryKey đổi, đảm bảo bấm search sẽ gọi lại API
      searchKey: (prev.searchKey || 0) + 1,

      // tìm theo tên
      strFilterSupplierName: values.displayName?.trim() || null,

      // tìm theo tỉnh/thành, API web gốc thường có dấu phẩy cuối
      strListCityCode: selectedLocationCode,

      // tìm theo số sao
      intEasiaCateID: values.star ? Number(values.star) : null,

      // loại lưu trú
      intCateID: Number(values.type) || 1,

      // khoảng giá
      strPriceRange: priceRange,

      // ngày lấy từ tour/day đang chọn
      dtmFilterDateFrom: dtmDateFrom || null,
      dtmFilterDateTo: dtmDateTo || null,
    }));
  });
  
  return (
    <div>
      <Form methods={methods} onSubmit={onSubmit}>
        <div className="space-y-5 px-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {t("addAccommodationForDay", { day: selectedDayOrder })}
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              {t("chooseAccommodationTypeAndSearch")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field.Select
              name="type"
              options={[
                { label: t("hotel"), value: "1" },
                { label: t("boat"), value: "3" },
              ]}
            />

            <Field.Text
              name="displayName"
              placeholder={t("searchPlaceholder")}
            />

            <Field.Select
              name="country"
              placeholder={t("selectCountry")}
              options={[
                { label: t("selectCountry"), value: "" },
                ...countryOptions,
              ]}
            />
            <Field.MultiSelect
              name="city"
              placeholder={
                selectedCountry
                  ? "-- Chọn tỉnh/thành --"
                  : "Chọn quốc gia trước"
              }
              options={cityOptions}
            />

            <Field.Select name="star" options={STARS2_OPTIONS} />

            <Field.Text name="priceFrom" placeholder={t("from")} />
            <Field.Text name="priceTo" placeholder={t("to")} />

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
                    {t("price")}
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    {t("action")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : accommodationData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  accommodationData.map((item: any, index: number) => (
                    <tr
                      key={
                        item.strSupplierMappingPriceGUID ||
                        item.strSupplierGUID ||
                        index
                      }
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-center">
                        {item.No || index + 1}
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-medium text-[#1b4f9b]">
                          {item.strItemTypeName}
                        </div>

                        {!!renderAccommodationStars(item) && (
                          <div className="mt-1 text-xs tracking-wide text-[#9a7b2f]">
                            {renderAccommodationStars(item)}
                          </div>
                        )}

                        <div className="mt-1 text-[11px] uppercase text-gray-500">
                          by {item.strSupplierName}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-right font-semibold text-[#004b91]">
                        ${Number(item.dblPriceView || 0).toLocaleString()}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedItem(item);
                              setOpen((prev) => ({ ...prev, detail: true }));
                            }}
                            className="flex cursor-pointer justify-center rounded-lg bg-[#004b91] px-3 py-1 text-sm text-white hover:opacity-90"
                          >
                            <Info size={18} />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedItem(item);
                              setOpen((prev) => ({ ...prev, add: true }));
                            }}
                            className="flex cursor-pointer justify-center rounded-lg bg-[#004b91] px-3 py-1 text-sm text-white hover:opacity-90"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Form>

      <DetailAccommodationD
        open={open.detail}
        onClose={() => setOpen((prev) => ({ ...prev, detail: false }))}
        detailData={selectedItem}
        isLoading={isLoading}
      />

      <AddSupAccommodationD
        open={open.add}
        onClose={() => setOpen((prev) => ({ ...prev, add: false }))}
        item={selectedItem}
      />
    </div>
  );
};

export default AddAccommodationD;
