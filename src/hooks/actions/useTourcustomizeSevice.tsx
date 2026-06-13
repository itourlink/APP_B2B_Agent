import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./query-keys";
import { useUser } from "./useAuth";
import apiClient from "@/axios";
import { useCurrency } from "@/components/currency/useCurrency";

export const fetchGetListTourPublish = async (body: any) => {
  const res = await apiClient.post("Tour/GetListTourPublish", body);
  return res.data;
};

export const useGetlistTourPublish = (filters?: any) => {
  const { user } = useUser();
  const { currencyId } = useCurrency();

  const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? 10;
  const strFilterServiceName = filters?.strFilterServiceName ?? null;
  const strListEasiaCateID = filters?.strListEasiaCateID ?? null;
  const strLocationCode = filters?.strLocationCode ?? null;
  const intTotalPax = filters?.intTotalPax ?? null;
  const strPriceFromRange = filters?.strPriceFromRange ?? "";

  const query = useQuery({
    queryKey: [QUERY_KEYS.TOUR_CUSTOMER.LIST_TOUR_PUBLISH, page, pageSize, filters, currencyId],
    queryFn: () =>
      fetchGetListTourPublish({
        strTourGUID: null,
        strCompanyOwnerGUID: null,
        strCompanyPartnerGUID: user?.strCompanyGUID,
        strMemberPartnerGUID: user?.strUserGUID,
        intLangID: user?.intLangID,
        strPriceLevelGUID: null,
        intCateID: 19,
        intProductID: 101,
        strNoOfDayRange: null,
        strFilterServiceName: strFilterServiceName,
        strListEasiaCateID: strListEasiaCateID,
        strListTransportOptionID: null,
        dtmFilterDateStart: new Date(
          "2025-01-01"
        ).toISOString(),
        dtmFilterDateValidFrom: null,
        dtmFilterDateValidTo: null,
        strOrder: null,
        strPriceFromRange: strPriceFromRange,
        intCurrencyView: currencyId,
        strLocationCode: strLocationCode,
        intCurPage: page,
        intPageSize: pageSize,
        tblsReturn: "[0]",
        intTotalPax: intTotalPax,
      }),
    enabled: !!user?.strUserGUID && !!filters,
    placeholderData: keepPreviousData,
  });

  const listData = query.data?.[0] ?? [];
  const totalRecords = listData?.[0]?.intTotalRecords || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);

  return {
    tourData: listData,
    totalRecords,
    totalPages,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};



///  singlfe service add in tour customize

const fetchGetListSupplierMappingPrice = async (body: any) => {
  const res = await apiClient.post(
    "supplier/GetListSupplierMappingPrice",
    body,
  );

  return res.data;
};

const toIsoDateString = (value?: string | Date | null) => {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }

  const normalizedValue = value.trim();

  if (!normalizedValue) return null;

  const mmddyyyyMatch = normalizedValue.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
  );

  if (mmddyyyyMatch) {
    const [, month, day, year] = mmddyyyyMatch;

    return new Date(
      Date.UTC(Number(year), Number(month) - 1, Number(day)),
    ).toISOString();
  }

  const yyyymmddMatch = normalizedValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (yyyymmddMatch) {
    const [, year, month, day] = yyyymmddMatch;

    return new Date(
      Date.UTC(Number(year), Number(month) - 1, Number(day)),
    ).toISOString();
  }

  const parsedDate = new Date(normalizedValue);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString();
};

export const useGetListSupplierMappingPrice = (filters?: any) => {
  const { user } = useUser();
  const { currencyId } = useCurrency();

  const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? 10;

  const intCateID = Number(filters?.intCateID ?? 2);

  const payload = {
    strUserGUID: filters?.strUserGUID ?? user?.strUserGUID ?? null,

    strSupplierMappingPriceGUID: null,
    strCompanyGUID: filters?.strCompanyGUID ?? null,
    strSupplierGUID: filters?.strSupplierGUID ?? null,
    strPriceListGUID: filters?.strPriceListGUID ?? null,
    strPriceLevelGUID: filters?.strPriceLevelGUID ?? null,

    intComTypeID: filters?.intComTypeID ?? 0,
    intCateID,

    intBoatPriceTypeID: intCateID === 3 ? 1 : null,

    intEasiaCateID: filters?.intEasiaCateID
      ? Number(filters.intEasiaCateID)
      : null,

    strPriceRange: filters?.strPriceRange ?? "",

    dtmFilterDateFrom: toIsoDateString(filters?.dtmFilterDateFrom),
    dtmFilterDateTo: toIsoDateString(filters?.dtmFilterDateTo),

    strFilterSupplierName: filters?.strFilterSupplierName ?? "",
    strFilterItemTypeName: null,

    strListCityCode: filters?.strListCityCode ?? null,

    intCurrencyView: currencyId,

    intPaxCount: filters?.intPaxCount ?? filters?.intTotalPax ?? null,

    intCurPage: page,
    intPageSize: pageSize,

    strOrder: null,
    tblsReturn: "[0]",
    intTypeID: filters?.intTypeID ?? 1,
  };

  const query = useQuery({
    queryKey: [
      QUERY_KEYS.TOUR_CUSTOMER.LIST_SUP_MAP_PRICE,
      user?.strUserGUID,
      payload,
    ],
    queryFn: () => fetchGetListSupplierMappingPrice(payload),
    enabled: !!filters && !!user?.strUserGUID,
    placeholderData: keepPreviousData,
  });

  const listData = query.data?.[0] ?? [];
  const totalRecords = listData?.[0]?.intTotalRecords || 0;
  const totalPages = totalRecords > 0 ? Math.ceil(totalRecords / pageSize) : 0;

  return {
    supListMapData: listData,
    totalRecords,
    totalPages,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    payload,
  };
};
