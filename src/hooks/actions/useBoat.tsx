import apiClient from "@/axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useUser } from "./useAuth";
import { useListCompanyOwner } from "./useCompanyOwner";
import { QUERY_KEYS } from "./query-keys";

const fetchListBoat = async (body: any) => {
  const res = await apiClient.post("supplier/GetListSupplierByAgent", body);
  return res.data;
};

export const useListBoat = (filters: {
  page?: number;
  pageSize?: number;
  strSupplierGUID?: string | null;
  tblsReturn?: string;
}) => {
  const { user } = useUser();
  const { coData } = useListCompanyOwner();
  const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? 10;
  const query = useQuery({
    queryKey: [
      QUERY_KEYS.BOAT.LIST_BOAT,
      filters,
      user?.strCompanyGUID,
      coData?.strCompanyGUID,
      user?.intCurrencyID,
    ],
    queryFn: () =>
      fetchListBoat({
        strCompanyPartnerGUID: user?.strCompanyGUID,
        strCompanyOwnerGUID: coData?.strCompanyGUID,
        intCurrencyID: user?.intCurrencyID,
        strSupplierGUID: filters?.strSupplierGUID || null,
        strFilterSupplierName: null,
        strFilterLocationCode: null,
        strPriceFromRange: null,
        dtmDateStart: null,
        intCateID: 3,
        strListEasiaCateID: null,
        intCurPage: page,
        intPageSize: pageSize,
        strOrder: null,
        tblsReturn: filters?.tblsReturn || "[0]",
      }),
    enabled: !!user && !!coData,
    placeholderData: keepPreviousData,
  });

  const listData = query.data ?? [];
  const totalRecords = listData?.[0]?.intTotalRecords || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);

  return {
    boatData: listData,
    totalRecords,
    totalPages,
    boatLoading: query.isLoading,
    boatError: query.isError,
  };
};

const fetchListImage = async (body: any) => {
  const res = await apiClient.post("supplier/GetListSupplierImageFile", body);
  return res.data;
};

export const useListImage = (filters?: {
  page?: number;
  pageSize?: number;
  strSupplierGUID?: string;
}) => {
  const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? 10;

  const query = useQuery({
    queryKey: [QUERY_KEYS.BOAT.LIST_IMAGE, filters],
    queryFn: () =>
      fetchListImage({
        strSupplierGUID: filters?.strSupplierGUID,
        strItemTypeGUID: null,
        intCurPage: page,
        intPageSize: pageSize,
        strOrder: null,
        tblsReturn: "[0]",
      }),
    placeholderData: keepPreviousData,
  });

  const listData = query.data?.[0] ?? [];
  const totalRecords = listData?.[0]?.intTotalRecords || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);

  return {
    imgData: listData,
    totalRecords,
    totalPages,
    imgLoading: query.isLoading,
    imgError: query.isError,
  };
};

const fetchMappingPrice = async (body: any) => {
  const res = await apiClient.post(
    "supplier/GetListSupplierMappingPriceForBoatByAgent",
    body,
  );
  return res.data;
};

export const useListMappingPrice = (filters?: {
  page?: number | null;
  pageSize?: number | null;
  strSupplierGUID?: string | null;
  tblsReturn?: string | null;
}) => {
  const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? 10;
  const { user } = useUser();
  const { coData } = useListCompanyOwner();
  const query = useQuery({
    queryKey: [QUERY_KEYS.BOAT.LIST_MAPPING_PRICE, filters],
    queryFn: () =>
      fetchMappingPrice({
        strSupplierMappingPriceGUID: null,
        strCompanyPartnerGUID: user?.strCompanyGUID,
        strSupplierGUID: filters?.strSupplierGUID || null,
        strPriceLevelGUID: coData?.strPriceLevelGUID,
        strCompanyOwnerGUID: coData?.strCompanyGUID,
        dtmDateStart: null,
        strFilterLocationCode: null,
        strFilterItemTypeName: null,
        strFilterItineraryName: null,
        intTotalPax: 1,
        strPriceRange: null,
        intCurPage: page,
        intPageSize: pageSize,
        intCurrencyView: user?.intCurrencyID,
        strOrder: null,
        tblsReturn: filters?.tblsReturn,
      }),
    placeholderData: keepPreviousData,
  });

  const listData = query.data?.[0] ?? [];
  const totalRecords = listData?.[0]?.intTotalRecords || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);

  return {
    mpData: listData,
    totalRecords,
    totalPages,
    mpLoading: query.isLoading,
    mpError: query.isError,
  };
};

