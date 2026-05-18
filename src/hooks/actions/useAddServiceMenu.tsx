import apiClient from "@/axios";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useUser } from "./useAuth";
import { QUERY_KEYS } from "./query-keys";


const fetchAddServiceMenuMappingPrice = async (body: any) => {
  const res = await apiClient.post(
    "supplier/GetListSupplierMappingPrice",
    body,
  );
  return res.data;
};
export const useFetchAddServiceMenuMappingPrice = (filters: { page: number; pageSize: number }) => {
  const { user } = useUser();

  const query = useQuery({
    queryKey: [
      QUERY_KEYS.VEHICLE.LIST_VEHICLE,
      filters,
      user?.strUserGUID,
      user?.strCompanyGUID,
      user?.intCurrencyID,
    ],
    queryFn: () =>
      fetchAddServiceMenuMappingPrice({
        strUserGUID: "97d664c3-375c-42d6-b039-3d2a72414f60",

        strSupplierMappingPriceGUID: null,
        strCompanyGUID: "054439c4-b825-49e4-864e-f14d626dd15e",
        strSupplierGUID: null,

        strPriceListGUID: null,
        strPriceLevelGUID: null,

        intComTypeID: 0,
        intCateID: 3,
        intBoatPriceTypeID: 1,
        intEasiaCateID: null,

        strPriceRange: "",

        dtmFilterDateFrom: "8/25/2025",
        dtmFilterDateTo: "8/25/2025",

        strFilterSupplierName: null,
        strFilterItemTypeName: null,

        strListCityCode: "VN02110000,VN00070001,",

        intCurrencyView: 3,
        intPaxCount: 11,

        intCurPage: 1,
        intPageSize: 10,

        strOrder: null,

        tblsReturn: "[0]",

        intTypeID: 1,


      }),
    enabled: !!user,
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