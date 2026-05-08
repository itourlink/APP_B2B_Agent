import apiClient from "@/axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useUser } from "./useAuth";
import { useListCompanyOwner } from "./useCompanyOwner";
import { QUERY_KEYS } from "./query-keys";

// list
const fetchListRestaurant = async (body: any) => {
  const res = await apiClient.post("supplier/GetListSupplierByAgent", body);
  return res.data;
};

export const useListRestaurant = (filters: {
  page: number;
  pageSize: number;
}) => {
  const { user } = useUser();
  const { coData } = useListCompanyOwner();

  const query = useQuery({
    queryKey: [
      QUERY_KEYS.RESTAURANT.LIST_RESTAURANT,
      filters,
      user?.strCompanyGUID,
      coData?.strCompanyGUID,
      user?.intCurrencyID,
    ],
    queryFn: () =>
      fetchListRestaurant({
        strCompanyPartnerGUID: user?.strCompanyGUID,
        strCompanyOwnerGUID: coData?.strCompanyGUID,
        intCurrencyID: user?.intCurrencyID,
        strSupplierGUID: null,
        strFilterSupplierName: null,
        strFilterLocationCode: null,
        strPriceFromRange: null,
        dtmDateStart: null,
        intCateID: 2,
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
    restaurantData: listData,
    totalRecords,
    totalPages,
    restaurantLoading: query.isLoading,
    restaurantError: query.isError,
  };
};

// detail 
const fetchDetailRestaurant = async (body: any) => {
  const res = await apiClient.post("supplier/GetListSupplierByAgent", body);
  return res.data;
};
export const useDetailRestaurant = (filters?: {
  page?: number;
  pageSize?: number;
  strSupplierGUID?: string;
}) => {
  const { user } = useUser();
  const { coData } = useListCompanyOwner();

  const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? 1;

  const query = useQuery({
    queryKey: [
      QUERY_KEYS.RESTAURANT.DETAIL_RESTAURANT,
      filters,
      user?.strCompanyGUID,
      coData?.strCompanyGUID,
      user?.intCurrencyID,
    ],
    queryFn: () =>
      fetchDetailRestaurant({
        strCompanyPartnerGUID: user?.strCompanyGUID ?? null,
        strCompanyOwnerGUID: coData?.strCompanyGUID ?? null,
        strSupplierGUID: filters?.strSupplierGUID ?? null,
        intCurrencyID: user?.intCurrencyID ?? null,
        strFilterSupplierName: null,
        strFilterLocationCode: null,
        strPriceFromRange: null,
        dtmDateStart: null,
        intCateID: 2,
        strListEasiaCateID: null,
        intCurPage: page,
        intPageSize: pageSize,
        strOrder: null,
        tblsReturn: "[0][1]",
      }),
    enabled:
      !!user?.strCompanyGUID &&
      !!coData?.strCompanyGUID &&
      !!user?.intCurrencyID &&
      !!filters?.strSupplierGUID,
    placeholderData: keepPreviousData,
  });

  //   const restaurant = query.data ?? null;
  //   const companyOwner = query.data?.[1]?.[0] ?? null;

  const listData = query.data ?? [];

  const totalRecords = listData?.[0]?.intTotalRecords || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);
  return {
    rdlData: listData,
    totalRecords,
    totalPages,
    rdLoading: query.isLoading,
    rdError: query.isError,
  };
};

// image

// const fetchListImageRestaurant = async(body: any) => {
//   const res = await apiClient.post("supplier/GetListSupplierImageFile", body);
//   return  res.data
// }

// export const  useListImageRestaurant = (filters?: {
//   page?: number;
//   pageSize?: number;
//   strSupplierGUID?: string;
// }) =>  {
//   const page = filters?.page ?? 1;
//   const pageSize  = filters?.pageSize ?? 10;

//   const query = useQuery({
//     queryKey: [QUERY_KEYS.RESTAURANT.LIST_IMAGE],
//     queryFn: () => 
//     fetchListImageRestaurant({
//       strSupplierImageFileGUID: null,
//       strSupplierGUID: filters?.strSupplierGUID,
//       strItemTypeGUID: null,

//       intCurPage: null,
//       intPageSize: null,

//       strOrder: null,

//       tblsReturn: [0]
//     }),
//     placeholderData: keepPreviousData,
//   })

//   const listData = query.data?.[0] ?? [];
//   const totalRecords = listData?.[0]?.intTotalRecords || 0;
//   const totalPages = Math.ceil(totalRecords / pageSize);

//   return {
//     imgData: listData,
//     totalPages,
//     totalRecords,
//     imgLoading: query.isLoading,
//     imgError: query.isError,
//   }
// }


const fetchListImage = async (body: any) => {
  const res = await apiClient.post("supplier/GetListSupplierImageFile", body);
  return res.data;
};

export const useListImage = (filters?: {
  page?: number;
  pageSize?: number;
  strSupplierGUID?: string;
}) => {
  // const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? 10;

  const query = useQuery({
    queryKey: [QUERY_KEYS.BOAT.LIST_IMAGE, filters],
    queryFn: () =>
      fetchListImage({
        strSupplierImageFileGUID: null,
        strSupplierGUID: filters?.strSupplierGUID,
        strItemTypeGUID: null,
        intCurPage: null,
        intPageSize: null,
        strOrder: null,
        tblsReturn: [0],
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