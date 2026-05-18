import { Field, Form } from "@/components/hook-form";
import { useListCity } from "@/hooks/actions/useCity";
import { useGetlistTourPublish } from "@/hooks/actions/useTourCustomized";
import { STARS2_OPTIONS } from "@/utils/oprion-data";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const AddToursD = () => {
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

  // WATCH FORM
  const values = watch();

  // COUNTRY
  const { ctData } = useListCity({
    strTableName: "MC02",

    strFeildSelect:
      "MC02_CountryCode AS code, MC02_CountryName AS strName",

    strWhere:
      "WHERE (IsActive=1) ORDER BY MC02_CountryName ASC",
  });

  const COUNTRY_OPTIONS_LIST =
    ctData?.map((item: any) => ({
      label: item.strName,
      value: item.code,
    })) || [];

  // API
  const payload = useMemo(() => {
    return {
      page: filters.page,
      pageSize: filters.pageSize,

      strTourGUID: null,
      strCompanyOwnerGUID: null,
      strCompanyPartnerGUID:
        "e824fd66-a3ca-46f4-a1be-ab7a0d1f6137",
      strMemberPartnerGUID:
        "97d664c3-375c-42d6-b039-3d2a72414f60",

      intLangID: 18,
      strPriceLevelGUID: null,

      intCateID: 19,
      intProductID: 100,

      strNoOfDayRange: null,

      strFilterServiceName:
        values.displayName || null,

      strListEasiaCateID:
        values.type || null,

      strListTransportOptionID: null,

      dtmFilterDateStart: "1/1/2025",

      dtmFilterDateValidFrom:
        values.from || null,

      dtmFilterDateValidTo:
        values.to || null,

      strOrder: null,

      strPriceFromRange:
        values.star || "",

      intCurrencyView: null,

      strLocationCode: values.country || "",

      intCurPage: filters.page,

      intPageSize: filters.pageSize,

      tblsReturn: "[0]",

      intTotalPax: 15,
    };
  }, [filters, values]);

  const {
    tourData,
    isLoading,
  } = useGetlistTourPublish(payload);

  // SUBMIT
  const onSubmit = methods.handleSubmit(() => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
    }));
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <div className="px-4 space-y-5">
        {/* TITLE */}
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Add Excursion cho Ngày 1
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Chọn loại Excursion và tìm kiếm dịch vụ
          </p>
        </div>

        {/* FILTER */}
        <div className="grid grid-cols-2 gap-3">
          {/* NAME */}
          <div>
            <Field.Text
              name="displayName"
              placeholder="Search..."
            />
          </div>

          {/* COUNTRY */}
          <div>
            <Field.MultiSelect
              name="country"
              placeholder="Select country"
              options={
                COUNTRY_OPTIONS_LIST
              }
            />
          </div>

          {/* STAR */}
          <div>
            <Field.Select
              name="star"
              options={STARS2_OPTIONS}
            />
          </div>

          {/* FROM */}
          <div>
            <Field.Text
              name="from"
              placeholder="From..."
            />
          </div>

          {/* TO */}
          <div>
            <Field.Text
              name="to"
              placeholder="To..."
            />
          </div>

          {/* SEARCH */}
          <button
            type="submit"
            className="w-11 h-11 rounded-lg border border-blue-200 bg-white flex items-center justify-center text-[#004b91] hover:bg-blue-50 transition cursor-pointer"
          >
            <Search size={18} />
          </button>
        </div>
        {/* DATA */}
        <div className="space-y-3">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            tourData?.map(
              (item: any, index: number) => (
                <div
                  key={index}
                  className="border rounded-xl p-4"
                >
                  
                  <div className="font-semibold">
                    {
                      item.strTourName
                    }
                  </div>

                  <div className="text-sm text-gray-500">
                    {
                      item.strPlaceName
                    }
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>
    </Form>
  );
};

export default AddToursD;
