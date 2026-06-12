import apiClient from "@/axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useUser } from "./useAuth";
import { useListCompanyOwner } from "./useCompanyOwner";
import { QUERY_KEYS } from "./query-keys";
import { useCurrency } from "@/components/currency/useCurrency";

const fetchListGuideFee = async (body: any) => {
  const res = await apiClient.post("supplier/GetListSupplierByAgent", body);
  return res.data;
};

export const useListGuideFee = (filters: {
  page: number;
  pageSize: number;
}) => {
  const { user } = useUser();
  const { coData } = useListCompanyOwner();
  const { currencyId } = useCurrency();
  const query = useQuery({
    queryKey: [
      QUERY_KEYS.GUIDE_FEE.LIST_GUIDE_FEE,
      filters,
      user?.strCompanyGUID,
      coData?.strCompanyGUID,
      currencyId,
    ],
    queryFn: () =>
      fetchListGuideFee({
        strCompanyPartnerGUID: user?.strCompanyGUID,
        strCompanyOwnerGUID: coData?.strCompanyGUID,
        intCurrencyID: currencyId,
        strSupplierGUID: null,
        strFilterSupplierName: null,
        strFilterLocationCode: null,
        strPriceFromRange: null,
        dtmDateStart: null,
        intCateID: 8,
        strListEasiaCateID: null,
        intCurPage: filters.page,
        intPageSize: filters.pageSize,
        strOrder: null,
        tblsReturn: "[0]",
      }),
    enabled: !!user && !!coData,
    placeholderData: keepPreviousData,
  });

  const listData = query.data?.[0] ?? [];
  const totalRecords = listData?.[0]?.intTotalRecords || 0;
  const totalPages = Math.ceil(totalRecords / filters.pageSize);

  return {
    guideFeeData: listData,
    totalRecords,
    totalPages,
    guideFeeLoading: query.isLoading,
    guideFeeError: query.isError,
  };
};

const fetchDetailGuideFee = async (body: any) => {
  const res = await apiClient.post("supplier/GetListSupplierByAgent", body);
  return res.data;
};

export const useDetailGuideFee = (filters?: {
  page?: number;
  pageSize?: number;
  strSupplierGUID?: string | null;
}) => {
  const { user } = useUser();
  const { coData } = useListCompanyOwner();
  const { currencyId } = useCurrency();

  const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? 1;

  const query = useQuery({
    queryKey: [
      QUERY_KEYS.GUIDE_FEE.DETAIL_GUIDE_FEE,
      filters,
      user?.strCompanyGUID,
      coData?.strCompanyGUID,
      currencyId,
    ],
    queryFn: () =>
      fetchDetailGuideFee({
        strCompanyPartnerGUID: user?.strCompanyGUID ?? null,
        strCompanyOwnerGUID: coData?.strCompanyGUID ?? null,
        strSupplierGUID: filters?.strSupplierGUID ?? null,
        intCurrencyID: currencyId ?? null,
        strFilterSupplierName: null,
        strFilterLocationCode: null,
        strPriceFromRange: null,
        dtmDateStart: null,
        intCateID: 8,
        strListEasiaCateID: null,
        intCurPage: page,
        intPageSize: pageSize,
        strOrder: null,
        tblsReturn: "[0][1]",
      }),
    enabled: !!user && !!coData,
    placeholderData: keepPreviousData,
  });

  const listData = query.data ?? [];
  const totalRecords = listData?.[0]?.[0]?.intTotalRecords || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);


  return {
    gfData: listData,
    totalPages,
    totalRecords,
    dgfLoading: query.isLoading,
    dgfError: query.isError,
    refetch: query.refetch,
  };
};


// tabe 

const fetchMappingPrice = async (body: any) => {
  const res = await apiClient.post(
    "supplier/GetListSupplierMappingPriceForGuideByAgent",
    body,
  );
  return res.data;
};

export const useListMappingPrice = (filters?: {
  page?: number | null;
  pageSize?: number | null;
  strSupplierGUID?: string | null;
  tblsReturn?: any;
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
        dtmDateStart: "2026-04-16",
        strFilterLocationCode: null,
        strFilterItemTypeName: null,
        intTotalPax: 1,
        strPriceRange: null,
        intCurPage: page,
        intPageSize: pageSize,
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