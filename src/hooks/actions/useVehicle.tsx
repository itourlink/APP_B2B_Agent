import apiClient from "@/axios";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useUser } from "./useAuth";
import { useListCompanyOwner } from "./useCompanyOwner";
import { QUERY_KEYS } from "./query-keys";
import { useCurrency } from "@/zustand/useCurrency";

const fetchListVehicle = async (body: any) => {
  const res = await apiClient.post("supplier/GetListSupplierByAgent", body);
  return res.data;
};

export const useListVehicle = (filters: { page: number; pageSize: number }) => {
  const { user } = useUser();
  const { coData } = useListCompanyOwner();
  const { currencyId } = useCurrency();

  const query = useQuery({
    queryKey: [
      QUERY_KEYS.VEHICLE.LIST_VEHICLE,
      filters,
      user?.strUserGUID,
      user?.strCompanyGUID,
      coData?.strCompanyGUID,
      currencyId,
    ],
    queryFn: () =>
      fetchListVehicle({
        strCompanyPartnerGUID: user?.strCompanyGUID,
        strCompanyOwnerGUID: coData?.strCompanyGUID,
        intCurrencyID: currencyId,
        strSupplierGUID: null,
        strFilterSupplierName: null,
        strFilterLocationCode: null,
        strPriceFromRange: null,
        dtmDateStart: "2026-04-16",
        intCateID: 31,
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
    vehicleData: listData,
    totalRecords,
    totalPages,
    vehicleLoading: query.isLoading,
    vehicleError: query.isError,
  };
};

const fetchDetailVehicle = async (body: any) => {
  const res = await apiClient.post("supplier/GetListSupplierByAgent", body);
  return res.data;
};

export const useDetailVehicle = (filters?: {
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
      QUERY_KEYS.VEHICLE.DETAI_VEHICLE,
      filters,
      user?.strCompanyGUID,
      coData?.strCompanyGUID,
      currencyId,
    ],
    queryFn: () =>
      fetchDetailVehicle({
        strCompanyPartnerGUID: user?.strCompanyGUID ?? null,
        strCompanyOwnerGUID: coData?.strCompanyGUID ?? null,
        strSupplierGUID: filters?.strSupplierGUID ?? null,
        intCurrencyID: currencyId ?? null,
        strFilterSupplierName: null,
        strFilterLocationCode: null,
        strPriceFromRange: null,
        dtmDateStart: null,
        intCateID: 31,
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
    vdData: listData,
    totalPages,
    totalRecords,
    dvdLoading: query.isLoading,
    dvdError: query.isError,
    refetch: query.refetch,
  };
};

const fetchVehicleMappingPrice = async (body: any) => {
  const res = await apiClient.post(
    "supplier/GetListSupplierMappingPriceForTransportByAgent",
    body,
  );
  return res.data;
};

export const useListVehicleMappingPrice = (filters?: {
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
    queryKey: [QUERY_KEYS.VEHICLE.LIST_MAPPING_PRICE, filters],
    queryFn: () =>
      fetchVehicleMappingPrice({
        strSupplierGUID: filters?.strSupplierGUID || null,
        strCompanyPartnerGUID: user?.strCompanyGUID,

        strListCarTypeID: null,
        strFilterLocationCode: null,

        strSupplierMappingPriceGUID: null,

        strPriceLevelGUID: coData?.strPriceLevelGUID,
        strCompanyOwnerGUID: coData?.strCompanyGUID,

        strItineraryGUID: null,
        dtmDateStart: null,

        strFilterItineraryName: null,
        strDurationRange: null,
        strPriceRange: null,

        intCurPage: page,
        intPageSize: pageSize,

        strOrder: null,
        tblsReturn: filters?.tblsReturn,
      }),
    placeholderData: keepPreviousData,
    enabled: !!user?.strUserGUID && !!coData?.strCompanyGUID,
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
