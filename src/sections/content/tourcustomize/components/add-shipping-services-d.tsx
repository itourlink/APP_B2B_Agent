import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useForm } from "react-hook-form";

import { Field, Form } from "@/components/hook-form";
import Pagination from "@/components/pagination/pagination";
import { TableCore, type ColumnDef } from "@/components/table/table-core";
import { useUser } from "@/hooks/actions/useAuth";
import { useListCity } from "@/hooks/actions/useCity";
import { useTranslate } from "@/locales";

import AddServicePopupD from "./add-service-popup-d";
import { useGetlistTourPublish } from "@/hooks/actions/useTourcustomizeSevice";
import { STARS2_OPTIONS } from "@/utils/option-data";

interface AddShippingServicesProps {
  item?: any;
  itemListour?: any;
  strTourCustomizedDayGUID?: any;
}

type SearchFormValues = {
  type: string;
  country: string;
  city: string[];
  displayName: string;
  star: string;
  from: string;
  to: string;
};

const DEFAULT_FORM_VALUES: SearchFormValues = {
  type: "1",
  country: "",
  city: [],
  displayName: "",
  star: "",
  from: "",
  to: "",
};

const AddShippingServicesD = ({
  item,
  itemListour,
  strTourCustomizedDayGUID,
}: AddShippingServicesProps) => {
  const { user } = useUser();
  const { t } = useTranslate("tourcustomize");

  const [searchPayload, setSearchPayload] = useState<SearchFormValues | null>(
    null,
  );
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

    return parts[4] || "";
  }, [itemListour?.strListLocation]);

  const selectedDayOrder = useMemo(() => {
    return itemListour?.intDayOrder || item?.intDayOrder || "";
  }, [item?.intDayOrder, itemListour?.intDayOrder]);

  const methods = useForm<SearchFormValues>({
    defaultValues: {
      ...DEFAULT_FORM_VALUES,
      city: defaultLocationCode ? [defaultLocationCode] : [],
    },
  });

  const watchedCountry = methods.watch("country");

  useEffect(() => {
    if (!defaultLocationCode) return;

    const defaultSearchPayload: SearchFormValues = {
      ...DEFAULT_FORM_VALUES,
      city: [defaultLocationCode],
    };

    methods.reset(defaultSearchPayload);
    setSearchPayload(defaultSearchPayload);
  }, [defaultLocationCode, methods]);

  const { ctData } = useListCity({
    strTableName: "MC02",
    strFeildSelect:
      "MC02_CountryCode AS code, MC02_CountryGUID AS intID, MC02_CountryName AS strName, MC02_CountryGUID AS id, MC02_CountryName AS text, MC02_CountryName AS strCountryName, MC02_CountryFlagIcon strCountryFlagIcon",
    strWhere: "WHERE (IsActive=1) ORDER BY MC02_CountryName ASC",
  });

  const countryOptions = useMemo(
    () =>
      ctData?.map((entry: any) => ({
        label: entry.strName,
        value: entry.code,
      })) || [],
    [ctData],
  );

  const { ctData: ntData } = useListCity({
    strTableName: "MC04",
    strFeildSelect:
      "MC04_CityCode AS strCityCode, MC04_CityName AS strCityName",
    strWhere: watchedCountry
      ? `WHERE IsActive=1
         AND MC04_CityCode LIKE '%${watchedCountry}%'
         AND MC04.IsActive=1
         ORDER BY MC04_CityName`
      : "WHERE 1=0",
  });

  const cityOptions = useMemo(
    () =>
      ntData?.map((entry: any) => ({
        label: entry.strCityName,
        value: entry.strCityCode,
      })) || [],
    [ntData],
  );

  const payload = useMemo(() => {
    const fromPrice = searchPayload?.from || "";
    const toPrice = searchPayload?.to || "";

    return {
      page: filters.page,
      pageSize: filters.pageSize,
      strCompanyGUID: null,
      strSupplierGUID: null,

      strPriceLevelGUID: null,
      intCateID: 19,
      intProductID: 101,
      strNoOfDayRange: null,
      strFilterServiceName: searchPayload?.displayName || null,
      strListEasiaCateID: searchPayload?.star || null,
      strListTransportOptionID: null,
      dtmFilterDateStart: new Date("2025-01-01").toISOString(),
      dtmFilterDateValidFrom: null,
      dtmFilterDateValidTo: null,
      strOrder: null,
      strPriceFromRange:
        fromPrice || toPrice ? `${fromPrice || 0},${toPrice || 0}` : "",
      intCurrencyView: user?.intCurrencyID,
      strLocationCode:
        Array.isArray(searchPayload?.city) && searchPayload.city.length
          ? searchPayload.city.join(",")
          : searchPayload?.country || "",
      intCurPage: filters.page,
      intPageSize: filters.pageSize,
      tblsReturn: "[0]",
      intTotalPax: item?.intTotalPax,
    };
  }, [
    filters.page,
    filters.pageSize,
    item?.intTotalPax,
    searchPayload,
    user?.intCurrencyID,
    user?.intLangID,
    user?.strCompanyGUID,
    user?.strUserGUID,
  ]);

  const { tourData, isLoading, isFetching, isError, totalPages, totalRecords } =
    useGetlistTourPublish(searchPayload ? payload : null);

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
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
      ? String(row.strListEasiaCateID).split(",")
      : [];

    return (
      <div className="flex w-full flex-col items-start justify-start gap-2 text-left">
        <span className="block w-full text-left font-medium text-gray-700">
          {row.strServiceName || row.strTourName}
        </span>

        {row.strOwnerCompanyName && (
          <div className="flex w-full items-center justify-start gap-1 text-left">
            <span className="text-sm text-gray-400">{t("by")}</span>
            <span className="text-sm text-gray-600">
              {row.strOwnerCompanyName}
            </span>
          </div>
        )}

        {!!stars.length && (
          <select
            value={selectedStars[row.strServiceGUID] || stars[0] || ""}
            onChange={(event) => {
              setSelectedStars((prev) => ({
                ...prev,
                [row.strServiceGUID]: event.target.value,
              }));
            }}
            className="w-[120px] cursor-pointer self-start rounded-md border border-gray-300 px-2 py-1 text-left text-sm"
          >
            {stars.map((star: string, index: number) => (
              <option key={`${star}-${index}`} value={star}>
                {"★".repeat(Number(star))}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  },
},
      {
        field: "dblPriceFrom",
        headerName: t("price"),
        render: (value) => (
          <span className="font-medium text-gray-400">{value}</span>
        ),
      },
      {
        field: "No",
        headerName: t("action"),
        render: (_, row) => (
          <button
            type="button"
            onClick={() => {
              const firstStar = row.strListEasiaCateID?.split(",")?.[0] || "";

              setItemAdd({
                ...row,
                selectedStar: selectedStars[row.strServiceGUID] || firstStar,
              });

              setOpen((prev) => ({
                ...prev,
                add: true,
              }));
            }}
            className="flex h-9 w-11 cursor-pointer items-center justify-center rounded bg-[#004b91] text-white shadow-sm transition hover:bg-[#003d76]"
          >
            <Plus size={20} />
          </button>
        ),
      },
    ],
    [selectedStars, t],
  );

  const onSubmit = methods.handleSubmit((values) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
    }));
    setSearchPayload(values);
  });

  const onReset = () => {
    const resetValues: SearchFormValues = {
      ...DEFAULT_FORM_VALUES,
      city: defaultLocationCode ? [defaultLocationCode] : [],
    };

    methods.reset(resetValues);
    setFilters({
      page: 1,
      pageSize: 10,
    });
    setSelectedStars({});

    if (defaultLocationCode) {
      setSearchPayload(resetValues);
    } else {
      setSearchPayload(null);
    }
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
                options={countryOptions}
                placeholder={t("selectCountry")}
              />
            </div>

            <div>
              <Field.MultiSelect
                name="city"
                options={cityOptions}
                placeholder={t("city")}
                disabled={!watchedCountry}
              />
            </div>
          </div>

          <div>
            <Field.Select
              name="star"
              options={STARS2_OPTIONS}
              placeholder={t("selectStar")}
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
              className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white text-[#004b91] transition hover:bg-blue-50"
            >
              <span>{t("search")}</span>
              <Search size={18} />
            </button>
          </div>
        </div>
      </Form>

      <div className="pt-4">
        <TableCore
          rowData={tourData ?? []}
          columnDefs={columns}
          loading={isLoading || isFetching}
        />

        {!isError && (
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages || 1}
            totalRecords={totalRecords}
            recordsPerPage={filters.pageSize}
            onPageChange={(value) => {
              setFilters((prev) => ({
                ...prev,
                page: value,
              }));
            }}
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

      <AddServicePopupD
        item={itemAdd}
        strTourCustomizedDayGUID={strTourCustomizedDayGUID}
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

export default AddShippingServicesD;
