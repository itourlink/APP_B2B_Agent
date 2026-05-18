import apiClient from "@/axios";
import type { ITourCustomizedCustomer } from "@/hooks/interfaces/user";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useUser } from "./useAuth";
import { QUERY_KEYS } from "./query-keys";

const fetchGetListCustomer = async (body: any) => {
  const res = await apiClient.post("tourcustomized/GetListCustomer", body);
  return res.data;
};

export const addTourCustomizedCustomer = async (body: any) => {
  const res = await apiClient.post("tourcustomized/AddCustomer", body);
  return res.data;
};

export const deleteTourCustomizedCustomer = async (body: any) => {
  const res = await apiClient.post("tourcustomized/DelCustomer", body);
  return res.data;
};

export const updateTourCustomizedCustomer = async (body: any) => {
  const res = await apiClient.post("tourcustomized/UpdCustomer", body);
  return res.data;
};

export interface UseGetListCustomerFilters {
  strTourCode: string;
  page?: number;
  pageSize?: number;
  searchText?: string | null;
}

export const useGetlistCustomer = (filters: UseGetListCustomerFilters) => {
  const { user } = useUser();
  const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? 10;
  const normalizedSearchText = filters?.searchText?.trim() || null;

  const query = useQuery({
    queryKey: [
      QUERY_KEYS.TOUR_CUSTOMER.LIST_TOUR_CUSTOMER,
      filters?.strTourCode,
      page,
      pageSize,
      normalizedSearchText,
    ],
    queryFn: () =>
      fetchGetListCustomer({
        strUserGUID: user?.strUserGUID,
        strCustomerGUID: null,
        strTourCode: filters?.strTourCode,
        // Backend sample does not expose the search key, so send common aliases.
        strFilter: normalizedSearchText,
        strFilterCustomerName: normalizedSearchText,
        strCustomerName: normalizedSearchText,
        intTypeID: null,
        intCurPage: page,
        intPageSize: pageSize,
        strOrder: null,
        tblsReturn: null,
      }),
    enabled: !!user?.strUserGUID && !!filters?.strTourCode,
    placeholderData: keepPreviousData,
  });

  const listData = (query.data?.[0] ?? []) as ITourCustomizedCustomer[];
  const totalRecords = listData?.[0]?.intTotalRecords || 0;
  const totalPages = totalRecords > 0 ? Math.ceil(totalRecords / pageSize) : 0;

  return {
    tourCustomer: listData,
    totalRecords,
    totalPages,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};



const fetchGetListSupplierMappingPrice = async (body: any) => {
  const res = await apiClient.post(
    "supplier/GetListSupplierMappingPrice",
    body
  );
  return res.data;
};


export const useGetlistSupplierMappingPrice = (filters?: any) => {

  const { user } = useUser();

  const page = filters?.page ?? 1;

  const pageSize = filters?.pageSize ?? 10;
  const strSupplierMappingPriceGUID = filters?.strSupplierMappingPriceGUID || null;
  const strSupplierGUID = filters?.strSupplierGUID || null;
  const tblsReturn = filters?.tblsReturn || null;

  const query = useQuery({
    queryKey: [
      QUERY_KEYS.TOUR_CUSTOMER.LIST_SUP_MAP_PRICE,
      filters,
    ],

    queryFn: () =>
      fetchGetListSupplierMappingPrice({
        strSupplierMappingPriceGUID: strSupplierMappingPriceGUID,
        strCompanyGUID: null,
        strSupplierGUID: strSupplierGUID,
        strPriceListGUID: null,
        strPriceLevelGUID: null,
        intComTypeID: 0,
        intCateID: 1,
        intBoatPriceTypeID: null,
        intEasiaCateID: null,
        strPriceRange: "",
        dtmFilterDateFrom: "1/1/2025",
        dtmFilterDateTo: "1/1/2025",
        strFilterSupplierName: null,
        strFilterItemTypeName: null,
        strListCityCode: "VN00010001,",
        intCurrencyView: 3,
        intPaxCount: 15,
        intCurPage: page,
        intPageSize: pageSize,
        strOrder: null,
        tblsReturn: tblsReturn ?? "[0]",
        intTypeID: 1,
      }),

    enabled: !!user?.strUserGUID,

    placeholderData: keepPreviousData,
  });

  const listData = query.data?.[0] ?? [];

  const totalRecords =
    listData?.[0]?.intTotalRecords || 0;

  const totalPages = Math.ceil(
    totalRecords / pageSize
  );

  return {
    supListMapData: listData,
    totalRecords,
    totalPages,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};


export const fetchGetListTourPublish = async (body: any) => {
  const res = await apiClient.post("Tour/GetListTourPublish", body);
  return res.data;
};


export const useGetlistTourPublish = (filters?: any) => {

  const { user } = useUser();

  const page = filters?.page ?? 1;

  const pageSize = filters?.pageSize ?? 10;

  const query = useQuery({
    queryKey: [
      QUERY_KEYS.TOUR_CUSTOMER.LIST_TOUR_PUBLISH,
      page,
      pageSize,
      filters,
    ],

    queryFn: () =>
      fetchGetListTourPublish({
        strTourGUID: null,
        strCompanyOwnerGUID: null,
        strCompanyPartnerGUID: "e824fd66-a3ca-46f4-a1be-ab7a0d1f6137",
        strMemberPartnerGUID: "97d664c3-375c-42d6-b039-3d2a72414f60",
        intLangID: 18,
        strPriceLevelGUID: null,
        intCateID: 19,
        intProductID: 100,
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

    enabled: !!user?.strUserGUID,

    placeholderData: keepPreviousData,
  });

  const listData = query.data?.[0] ?? [];

  const totalRecords =
    listData?.[0]?.intTotalRecords || 0;

  const totalPages = Math.ceil(
    totalRecords / pageSize
  );

  return {
    tourData: listData,
    totalRecords,
    totalPages,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};