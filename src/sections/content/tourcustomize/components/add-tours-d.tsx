import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useForm } from "react-hook-form";

import { Field, Form } from "@/components/hook-form";
import { useListCity } from "@/hooks/actions/useCity";
import { useGetlistTourPublish } from "@/hooks/actions/useTourCustomized";
import { useTranslate } from "@/locales";
import { useUser } from "@/hooks/actions/useAuth";
import { TableCore, type ColumnDef } from "@/components/table/table-core";
import Pagination from "@/components/pagination/pagination";
import AddSupTourD from "./add-sup-tour-d";
import { STARS2_OPTIONS } from "@/utils/option-data";

interface Props {
  item: any;
  itemListour?: any;
  strTourCustomizedDayGUID?: any;
}

const AddToursD = ({ item, itemListour, strTourCustomizedDayGUID }: Props) => {
  const { user } = useUser();
  const { t } = useTranslate("tourcustomize");
  const [searchPayload, setSearchPayload] = useState<any>(null);
  const [itemAdd, setItemAdd] = useState<any>(null);
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
  });

  const [open, setOpen] = useState({
    add: false,
  });

  const [selectedStars, setSelectedStars] = useState<Record<string, string>>(
    {},
  );

  const defaultLocationCode = useMemo(() => {
    const raw = itemListour?.strListLocation;

    if (!raw) return "";

    const firstItem = raw.split("#")[0];

    if (!firstItem) return "";

    const parts = firstItem.split("!");

    // VN00000000
    return parts[4] || "";
  }, [itemListour?.strListLocation]);

  const methods = useForm({
    defaultValues: {
      type: "1",
      country: "",
      city: defaultLocationCode ? [defaultLocationCode] : [],
      displayName: "",
      star: "",
      from: "",
      to: "",
    },
  });
      const selectedDayOrder = useMemo(() => {
        return itemListour?.intDayOrder || item?.intDayOrder || "";
      }, [item?.intDayOrder, itemListour?.intDayOrder]);
  console.log("itemList", itemListour)
  
  useEffect(() => {
    if (!defaultLocationCode) return;

    setSearchPayload({
      city: [defaultLocationCode],
      country: "",
      displayName: "",
      star: "",
      from: "",
      to: "",
    });
  }, [defaultLocationCode]);

  // =========================
  // WATCH COUNTRY
  // =========================

  const watchedCountry = methods.watch("country");

  // =========================
  // COUNTRY
  // =========================

  const { ctData } = useListCity({
    strTableName: "MC02",
    strFeildSelect:
      "MC02_CountryCode AS code, MC02_CountryGUID AS intID, MC02_CountryName AS strName, MC02_CountryGUID AS id, MC02_CountryName AS text, MC02_CountryName AS strCountryName, MC02_CountryFlagIcon strCountryFlagIcon",
    strWhere: "WHERE (IsActive=1) ORDER BY MC02_CountryName ASC",
  });

  const COUNTRY_OPTIONS =
    ctData?.map((item: any) => ({
      label: item.strName,
      value: item.code,
    })) || [];

  // =========================
  // CITY
  // =========================

  const { ctData: ntData } = useListCity({
    strTableName: "MC04",
    strFeildSelect:
      "MC04_CityCode AS strCityCode, MC04_CityName AS strCityName",
    strWhere: `WHERE IsActive=1
               AND MC04_CityCode LIKE '%${watchedCountry || ""}%'
               AND MC04.IsActive=1
               ORDER BY MC04_CityName`,
  });

  const CITY_OPTIONS =
    ntData?.map((item: any) => ({
      label: item.strCityName,
      value: item.strCityCode,
    })) || [];

  // =========================
  // PAYLOAD
  // =========================

  const payload = useMemo(
    () => ({
      page: filters.page,
      pageSize: filters.pageSize,

      strTourGUID: null,
      strCompanyOwnerGUID: null,

      strCompanyPartnerGUID: user?.strCompanyGUID,
      strMemberPartnerGUID: user?.strUserGUID,

      intLangID: user?.intLangID,

      strPriceLevelGUID: null,

      intCateID: 19,
      intProductID: 100,

      strNoOfDayRange: null,

      strFilterServiceName: searchPayload?.displayName || null,

      strListEasiaCateID: searchPayload?.star || null,

      strListTransportOptionID: null,

      dtmFilterDateStart: new Date("2025-01-01").toISOString(),

      dtmFilterDateValidFrom: null,
      dtmFilterDateValidTo: null,

      strOrder: null,

      strPriceFromRange:
        searchPayload?.from || searchPayload?.to
          ? `${searchPayload?.from || 0},${searchPayload?.to || 0}`
          : "",

      intCurrencyView: user?.intCurrencyID,

      strLocationCode:
        Array.isArray(searchPayload?.city) && searchPayload.city.length
          ? searchPayload.city.join(",")
          : searchPayload?.country || "",

      intCurPage: filters.page,
      intPageSize: filters.pageSize,

      tblsReturn: "[0]",

      intTotalPax: item?.intTotalPax,
    }),
    [
      filters,
      searchPayload,
      user?.strCompanyGUID,
      user?.strUserGUID,
      user?.intLangID,
      item?.intTotalPax,
    ],
  );

  // =========================
  // API
  // =========================

  const { tourData, isLoading, isFetching, isError, totalPages, totalRecords } =
    useGetlistTourPublish(searchPayload ? payload : null);

  // =========================
  // TABLE
  // =========================

  const defaultLocation = useMemo(() => {
    const raw = itemListour?.strListLocation;

    if (!raw || !ctData?.length) {
      return {
        country: "",
        city: [],
      };
    }

    const firstItem = raw.split("#")[0];

    if (!firstItem) {
      return {
        country: "",
        city: [],
      };
    }

    const parts = firstItem.split("!");

    const cityCode = parts[4] || "";
    const countryName = parts[5] || "";

    // tìm country code từ API
    const country = ctData.find(
      (x: any) => x.strName?.toLowerCase() === countryName.toLowerCase(),
    );

    return {
      country: country?.code || "",
      city: cityCode ? [cityCode] : [],
    };
  }, [itemListour?.strListLocation, ctData]);

  useEffect(() => {
    if (!defaultLocation.city.length) return;

    methods.reset({
      type: "1",
      country: defaultLocation.country,
      city: defaultLocation.city,
      displayName: "",
      star: "",
      from: "",
      to: "",
    });

    setSearchPayload({
      city: defaultLocation.city,
      country: defaultLocation.country,
      displayName: "",
      star: "",
      from: "",
      to: "",
    });
  }, [defaultLocation, methods]);

  const colDefs: ColumnDef<any>[] = [
    {
      field: "No",
      headerName: t("no"),
      render: (value) => (
        <span className="font-medium text-gray-400">{value}</span>
      ),
    },

    {
      field: "strServiceName",
      headerName: t("serviceName"),
      render: (_, row) => {
        const stars = row.strListEasiaCateID
          ? row.strListEasiaCateID.split(",")
          : [];

        return (
          <div className="flex flex-col gap-2">
            <span className="font-medium text-gray-700">
              {row.strServiceName}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-400">by</span>
              <span className="text-sm">{row.strOwnerCompanyName}</span>
            </div>

            {/* SELECT STAR */}
            <select
              value={selectedStars[row.strServiceGUID] || stars[0] || ""}
              onChange={(e) => {
                setSelectedStars((prev) => ({
                  ...prev,
                  [row.strServiceGUID]: e.target.value,
                }));
              }}
              className="cursor-pointer border border-gray-300 rounded-md px-2 py-1 text-sm w-[120px]"
            >
              {stars.map((star: any, index: any) => (
                <option className="cursor-pointer" key={index} value={star}>
                  {"⭐".repeat(Number(star))}
                </option>
              ))}
            </select>
          </div>
        );
      },
    },
    {
      field: "dblPriceFrom",
      headerName: t("priceFrom"),
      render: (value) => (
        <span className="font-medium text-gray-400">{value}</span>
      ),
    },
    {
      field: "No",
      headerName: t("action"),
      render: (_, row) => {
        return (
          <button
            type="button"
            onClick={() => {
              setOpen((prev) => ({
                ...prev,
                add: true,
              }));

              setItemAdd({
                ...row,
                selectedStar:
                  selectedStars[row.strServiceGUID] ||
                  row.strListEasiaCateID?.split(",")?.[0] ||
                  "",
              });
            }}
            className="cursor-pointer px-3 py-1 bg-[#004b91] text-white text-[13px] font-medium rounded hover:bg-[#003d76] transition-all shadow-sm"
          >
            <Plus />
          </button>
        );
      },
    },
  ];

  // =========================
  // SUBMIT
  // =========================

  const onSubmit = methods.handleSubmit((data) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
    }));

    setSearchPayload(data);
  });

  const onReset = () => {
    methods.reset({
      type: "1",
      country: "",
      city: [],
      displayName: "",
      star: "",
      from: "",
      to: "",
    });

    setFilters({
      page: 1,
      pageSize: 10,
    });

    setSearchPayload(null);
  };

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <div className="space-y-5 px-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {t("addExcursionForDay", { day: selectedDayOrder })}
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              {t("chooseExcursionTypeAndSearch")}
            </p>
          </div>

          <div>
            <Field.Text
              name="displayName"
              placeholder={t("searchPlaceholder")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Field.SearchSelect
                name="country"
                options={COUNTRY_OPTIONS}
                placeholder={t("Select Country")}
              />
            </div>

            <div>
              <Field.MultiSelect
                name="city"
                options={CITY_OPTIONS}
                placeholder={t("Select City")}
                disabled={!watchedCountry}
              />
            </div>
          </div>

          <div>
            <Field.Select
              placeholder={t("Select Star")}
              name="star"
              options={STARS2_OPTIONS}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Field.Text
                name="from"
                type="number"
                inputMode="numeric"
                placeholder={t("from")}
                InputProps={{
                  endTitle: "$",
                }}
              />
            </div>

            <div>
              <Field.Text
                name="to"
                type="number"
                inputMode="numeric"
                placeholder={t("to")}
                InputProps={{
                  endTitle: "$",
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onReset}
              className="flex h-11 w-full cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition hover:bg-gray-50"
            >
              {t("reset")}
            </button>

            <button
              type="submit"
              className="flex gap-2 h-11 w-full cursor-pointer items-center justify-center rounded-lg border border-blue-200 bg-white text-[#004b91] transition hover:bg-blue-50"
            >
              <div>{t("search")}</div>

              <Search size={18} />
            </button>
          </div>
        </div>
      </Form>

      {/* TABLE */}

      <div className="pt-4">
        <TableCore
          rowData={tourData ?? []}
          columnDefs={colDefs}
          loading={isLoading || isFetching}
        />

        {!isError && (
          <Pagination
            currentPage={filters.page}
            onPageChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                page: value,
              }))
            }
            totalPages={totalPages || 1}
            totalRecords={totalRecords}
            recordsPerPage={filters.pageSize}
            onRecordsPerPageChange={(value) => {
              setFilters((prev) => ({
                ...prev,
                page: 1,
                pageSize: value,
              }));
            }}
          />
        )}
      </div>

      <AddSupTourD
        item={itemAdd}
        strTourCustomizedDayGUID={strTourCustomizedDayGUID ?? ""}
        open={open.add}
        onClose={() =>
          setOpen((prev) => ({
            ...prev,
            add: false,
          }))
        }
      />
    </>
  );
};

export default AddToursD;
