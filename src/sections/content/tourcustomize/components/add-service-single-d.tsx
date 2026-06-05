import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Info, Plus, Search } from "lucide-react";
import { useForm } from "react-hook-form";

import { Field, Form } from "@/components/hook-form";
import { TableCore, type ColumnDef } from "@/components/table/table-core";

import { useUser } from "@/hooks/actions/useAuth";
import { useListCity } from "@/hooks/actions/useCity";
import { useGetListSupplierMappingPrice } from "@/hooks/actions/useTourcustomizeSevice";

import { useTranslate } from "@/locales";

import AddServiceSinglePopup from "./add-service-single-popup";
import DetailServiceSingleD from "./detail-service-single-d";
import { STARS2_OPTIONS } from "@/utils/option-data";

interface AddServiceSingleProps {
  item: any;
  itemListour?: any;
  strTourCustomizedDayGUID?: any;
  dtmDateFrom?: string | null;
  dtmDateTo?: string | null;
  intPaxCount?: number | null;
  intCurrencyView?: number | null;
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

type SelectOption = {
  label: string;
  value: string;
};

const DEFAULT_FORM_VALUES: SearchFormValues = {
  type: "2",
  country: "",
  city: [],
  displayName: "",
  star: "",
  from: "",
  to: "",
};

const DEFAULT_FILTERS = {
  page: 1,
  pageSize: 10,
};

const getFirstLocationCode = (value?: string) => {
  if (!value) return "";

  const firstItem = value.split("#")[0];
  if (!firstItem) return "";

  const parts = firstItem.split("!");

  return parts[4] || "";
};

const isValidValue = (value: any) => {
  if (value === null || value === undefined) return false;

  if (typeof value === "object" && !Array.isArray(value)) {
    return Object.keys(value).length > 0;
  }

  return String(value).trim() !== "";
};

const toText = (value: any) => {
  if (!isValidValue(value)) return "";

  return String(value).trim();
};

const formatPrice = (value: any) => {
  if (value === null || value === undefined) return "";

  if (typeof value === "object") return "";

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) return "";

  return `$${numberValue}`;
};

const getServiceName = (row: any) => {
  const supplierName = toText(row.strSupplierName);
  const itemTypeName = toText(row.strItemTypeName);
  const itemName = toText(row.strItemName);
  const serviceName = toText(row.strServiceName);
  const tourName = toText(row.strTourName);

  const name = itemTypeName || itemName;

  if (supplierName && name) {
    return `${supplierName}; ${name}`;
  }

  return supplierName || name || serviceName || tourName;
};

const getServiceStars = (row: any) => {
  return toText(row.strEasiaCateName);
};

const getServiceCompanyName = (row: any) => {
  return toText(row.strCompanyName) || toText(row.strOwnerCompanyName);
};

const getServicePrice = (row: any) => {
  const priceFields = [
    row.dblPriceFrom,
    row.dblPriceView,
    row.dblPrice,
    row.dblPrice1,
    row.dblPrice2,
  ];

  const validPrice = priceFields.find((price) => {
    if (price === null || price === undefined) return false;
    if (typeof price === "object") return false;

    const numberValue = Number(price);

    return !Number.isNaN(numberValue) && numberValue > 0;
  });

  return validPrice ?? 0;
};

const getRowDropdownOptions = (row: any, serviceType?: string) => {
  if (serviceType !== "2") {
    return [];
  }

  const options = [
    toText(row.strMealIncludedTypeName),
    toText(row.strItemTypeName),
    toText(row.strItemName),
  ].filter(Boolean);

  return Array.from(new Set(options));
};

const getTableRows = (data: any) => {
  if (!data) return [];

  if (Array.isArray(data?.[0])) {
    return data[0];
  }

  if (Array.isArray(data)) {
    return data;
  }

  return [];
};

const AddServiceSingleD = ({
  item,
  itemListour,
  strTourCustomizedDayGUID,
  dtmDateFrom,
  dtmDateTo,
  intPaxCount,
  intCurrencyView,
}: AddServiceSingleProps) => {
  const { t } = useTranslate("tourcustomize");
  const { user } = useUser();

  const SERVICE_TYPE_OPTIONS = useMemo<SelectOption[]>(
    () => [
      { label: t("restaurant"), value: "2" },
      { label: t("boatDayCruise"), value: "3" },
      { label: t("entranceFee"), value: "7" },
      { label: t("guide"), value: "8" },
    ],
    [t],
  );

  const [searchPayload, setSearchPayload] = useState<SearchFormValues | null>(
    null,
  );

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Pagination riêng cho popup detail, không dùng chung với table chính
  const [detailFilters, setDetailFilters] = useState(DEFAULT_FILTERS);

  const [open, setOpen] = useState({
    add: false,
    detail: false,
  });

  const [itemAdd, setItemAdd] = useState<any>(null);
  const [itemDetail, setItemDetail] = useState<any>(null);

  const defaultLocationCode = useMemo(() => {
    return getFirstLocationCode(itemListour?.strListLocation);
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

  const { ctData: countryData = [] } = useListCity({
    strTableName: "MC02",
    strFeildSelect:
      "MC02_CountryCode AS code, MC02_CountryGUID AS intID, MC02_CountryName AS strName, MC02_CountryGUID AS id, MC02_CountryName AS text, MC02_CountryName AS strCountryName, MC02_CountryFlagIcon strCountryFlagIcon",
    strWhere: "WHERE (IsActive=1) ORDER BY MC02_CountryName ASC",
  });

  const countryOptions = useMemo<SelectOption[]>(() => {
    return countryData.map((item: any) => ({
      label: item.strName,
      value: item.code,
    }));
  }, [countryData]);

  const { ctData: cityData = [] } = useListCity({
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

  const cityOptions = useMemo<SelectOption[]>(() => {
    return cityData.map((item: any) => ({
      label: item.strCityName,
      value: item.strCityCode,
    }));
  }, [cityData]);

  const payload = useMemo(() => {
    const fromPrice = searchPayload?.from || "";
    const toPrice = searchPayload?.to || "";
    const selectedCateID = Number(searchPayload?.type || DEFAULT_FORM_VALUES.type);
    const isBoat = selectedCateID === 3;

    const strPriceRange =
      fromPrice || toPrice ? `${fromPrice || 0},${toPrice || 0}` : "";

    const strListCityCode =
      Array.isArray(searchPayload?.city) && searchPayload.city.length
        ? searchPayload.city.join(",")
        : searchPayload?.country || "";

    return {
      page: filters.page,
      pageSize: filters.pageSize,

      strUserGUID: user?.strUserGUID ?? null,

      strSupplierMappingPriceGUID: null,
      strCompanyGUID: null,
      strSupplierGUID: null,
      strPriceListGUID: null,
      strPriceLevelGUID: null,

      intComTypeID: 0,
      intCateID: selectedCateID,
      intBoatPriceTypeID: isBoat ? 1 : null,
      intEasiaCateID: searchPayload?.star ? Number(searchPayload.star) : null,

      strPriceRange,
      dtmFilterDateFrom: dtmDateFrom || null,
      dtmFilterDateTo: dtmDateTo || null,

      strFilterSupplierName: searchPayload?.displayName?.trim() || "",
      strFilterItemTypeName: null,
      strListCityCode,

      intCurrencyView: intCurrencyView ?? user?.intCurrencyID ?? 1,
      intPaxCount: intPaxCount ?? item?.intTotalPax ?? 15,

      intCurPage: filters.page,
      intPageSize: filters.pageSize,

      strOrder: null,
      tblsReturn: "[0]",
      intTypeID: 1,
    };
  }, [
    dtmDateFrom,
    dtmDateTo,
    filters.page,
    filters.pageSize,
    intCurrencyView,
    intPaxCount,
    item?.intTotalPax,
    searchPayload,
    user?.intCurrencyID,
    user?.strUserGUID,
  ]);

  const {
    supListMapData,
    isLoading,
    isFetching,
    isError,
    totalPages,
    totalRecords,
  } = useGetListSupplierMappingPrice(searchPayload ? payload : null);

  const tableRows = useMemo(() => {
    return getTableRows(supListMapData);
  }, [supListMapData]);

  const activeServiceType = searchPayload?.type || methods.watch("type");
  const startRecord =
    totalRecords > 0 ? (filters.page - 1) * filters.pageSize + 1 : 0;
  const endRecord =
    totalRecords > 0
      ? Math.min(filters.page * filters.pageSize, totalRecords)
      : 0;

  const handleOpenAddPopup = (row: any) => {
    setItemAdd({
      ...row,
      selectedStar: getServiceStars(row),
      selectedServiceName: getServiceName(row),
      selectedCompanyName: getServiceCompanyName(row),
      selectedPrice: getServicePrice(row),
    });

    setOpen((prev) => ({
      ...prev,
      add: true,
    }));
  };

  const handleOpenDetailPopup = (row: any) => {
    setItemDetail({
      ...row,
      selectedStar: getServiceStars(row),
      selectedServiceName: getServiceName(row),
      selectedCompanyName: getServiceCompanyName(row),
      selectedPrice: getServicePrice(row),

      // Popup detail chỉ xem 1 item nên ép total = 1,
      // tránh trường hợp row có intTotalRecords = 75 làm pagination bị sai.
      intTotalRecords: 1,
    });

    setDetailFilters(DEFAULT_FILTERS);

    setOpen((prev) => ({
      ...prev,
      detail: true,
    }));
  };

  const colDefs: ColumnDef<any>[] = useMemo(
    () => [
      {
        field: "No",
        headerName: t("no"),
        render: (value) => (
          <span className="font-medium text-gray-700">{value}</span>
        ),
      },
      {
        field: "strSupplierName",
        headerName: t("serviceName"),
        render: (_, row) => {
          const serviceName = getServiceName(row);
          const stars = getServiceStars(row);
          const companyName = getServiceCompanyName(row);
          const dropdownOptions = getRowDropdownOptions(row, activeServiceType);

          return (
            <div className="flex w-full flex-col items-start justify-start gap-1 text-left">
              <span className="block w-full text-left text-xs font-semibold uppercase text-[#004b91]">
                {serviceName}
              </span>

              {stars && (
                <span className="block w-full text-left text-xs font-semibold text-[#004b91]">
                  {stars}
                </span>
              )}

              {companyName && (
                <div className="flex w-full items-center justify-start gap-1 text-left">
                  <span className="text-xs text-gray-500">{t("by")}</span>
                  <span className="text-xs uppercase text-gray-600">
                    {companyName}
                  </span>
                </div>
              )}

              {!!dropdownOptions.length && (
                <select
                  className="mt-1 h-8 w-[110px] cursor-pointer self-start rounded-md border border-gray-300 bg-white px-2 text-left text-xs text-gray-700"
                  defaultValue={dropdownOptions[0]}
                >
                  {dropdownOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
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
        render: (_, row) => {
          const price = getServicePrice(row);

          return (
            <span className="block text-right text-xs font-semibold text-[#004b91]">
              {formatPrice(price)}
            </span>
          );
        },
      },
      {
        field: "No",
        headerName: t("action"),
        render: (_, row) => (
          <div className="flex flex-col items-center justify-center gap-1">
            <button
              type="button"
              onClick={() => handleOpenDetailPopup(row)}
              className="flex cursor-pointer justify-center rounded-lg bg-[#004b91] px-3 py-1 text-sm text-white hover:opacity-90"
            >
              <Info size={14} />
            </button>

            <button
              type="button"
              onClick={() => handleOpenAddPopup(row)}
              className="flex cursor-pointer justify-center rounded-lg bg-[#004b91] px-3 py-1 text-sm text-white hover:opacity-90"
            >
              <Plus size={16} />
            </button>
          </div>
        ),
      },
    ],
    [activeServiceType, t],
  );

  const onSubmit = methods.handleSubmit((values) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
    }));

    setSearchPayload(values);
  });

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <div className="space-y-3 px-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {t("addSingleServiceForDay", { day: selectedDayOrder })}
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              {t("chooseServiceAndSearch")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
            <Field.Select
              name="type"
              options={SERVICE_TYPE_OPTIONS}
              placeholder={t("chooseServiceType")}
            />

            <Field.Text
              name="displayName"
              placeholder={t("searchPlaceholder")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
            <Field.SearchSelect
              name="country"
              options={countryOptions}
              placeholder={t("chooseCountry")}
            />

            <Field.MultiSelect
              name="city"
              options={cityOptions}
              placeholder={
                watchedCountry
                  ? t("selectDestinations")
                  : t("chooseCountryFirst")
              }
              disabled={!watchedCountry}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
            <Field.Select
              name="star"
              options={STARS2_OPTIONS}
              placeholder={t("selectPlaceholder")}
            />

            <Field.Text
              name="from"
              type="number"
              inputMode="numeric"
              placeholder={t("from")}
              InputProps={{
                startTitle: "$",
              }}
            />
          </div>

          <div className="grid grid-cols-[1fr_44px] gap-3">
            <Field.Text
              name="to"
              type="number"
              inputMode="numeric"
              placeholder={t("to")}
              InputProps={{
                startTitle: "$",
              }}
            />

            <button
              type="submit"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-blue-200 bg-white text-[#004b91] transition hover:bg-blue-50"
            >
              <Search size={18} />
            </button>
          </div>
        </div>
      </Form>

      <div className="px-4 pt-4">
        <TableCore
          rowData={tableRows}
          columnDefs={colDefs}
          loading={isLoading || isFetching}
        />

        {!isError && totalRecords > 0 && (
          <div className="mt-3 border-t border-gray-100 pt-3">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700">
              <select
                value={filters.pageSize}
                onChange={(event) => {
                  const value = Number(event.target.value);

                  setFilters((prev) => ({
                    ...prev,
                    page: 1,
                    pageSize: value,
                  }));
                }}
                className="h-8 min-w-[60px] rounded-md border border-slate-300 bg-white px-2 text-xs outline-none"
              >
                {[10, 20, 30, 40, 50].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <span className="font-medium text-slate-700">
                [{startRecord} - {endRecord} / {totalRecords}]
              </span>

              <div className="ml-auto flex items-center gap-2 max-sm:ml-0">
                <button
                  type="button"
                  onClick={() => {
                    if (filters.page > 1) {
                      setFilters((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                      }));
                    }
                  }}
                  disabled={filters.page === 1}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-600 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <ChevronLeft size={14} />
                  <span>{t("previous")}</span>
                </button>

                <span className="min-w-[44px] text-center font-medium text-slate-700">
                  {filters.page} / {Math.max(totalPages || 1, 1)}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    if (filters.page < Math.max(totalPages || 1, 1)) {
                      setFilters((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }));
                    }
                  }}
                  disabled={filters.page >= Math.max(totalPages || 1, 1)}
                  className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-600 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <span>{t("next")}</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <AddServiceSinglePopup
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

      <DetailServiceSingleD
        open={open.detail}
        onClose={() =>
          setOpen((prev) => ({
            ...prev,
            detail: false,
          }))
        }
        detailData={{
          data: [itemDetail ? [itemDetail] : [], [], []],
          isSuccess: true,
          message: null,
          errors: null,
        }}
        page={detailFilters.page}
        pageSize={detailFilters.pageSize}
        onPageChange={(value) => {
          setDetailFilters((prev) => ({
            ...prev,
            page: value,
          }));
        }}
        onPageSizeChange={(value) => {
          setDetailFilters((prev) => ({
            ...prev,
            page: 1,
            pageSize: value,
          }));
        }}
      />
    </>
  );
};

export default AddServiceSingleD;
