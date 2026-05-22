import apiClient from "@/axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useUser } from "./useAuth";
import { useListCompanyOwner } from "./useCompanyOwner";
import { QUERY_KEYS } from "./query-keys";

const fetchListCart = async (body: any) => {
  const res = await apiClient.post("booking/GetListCartServiceItem", body);
  return res.data;
};
/// 
export const useListCart = (filters: {
  page: number;
  pageSize: number;
}) => {
  const { user } = useUser();
  const { coData } = useListCompanyOwner();

  const query = useQuery({
    queryKey: [
      QUERY_KEYS.CART.LIST_CART,
      user?.strUserGUID,
      user?.strCompanyGUID,
      user?.intCurrencyID,
    ],
    queryFn: () =>
      fetchListCart({
        strCompanyAgentGUID: user?.strCompanyGUID,
        strCartServiceItemGUID: null,
        strListCartServiceItemGUID: null,
        strOnlineCartGUID: null,
        strBuyFromAgentHostGUID: null,
        intCurrencyID: user?.intCurrencyID,
        intCurPage: null,
        intPageSize: null,
        strOrder: null,
        tblsReturn: "[0]",
      }),
    enabled: !!user && !!coData,
    placeholderData: keepPreviousData,
  });

  const listData = query.data ?? [];
  const totalRecords = listData?.[0]?.intTotalRecords || listData.length || 0;
  const totalPages = Math.ceil(totalRecords / filters.pageSize);

  return {
    cartData: listData,
    totalRecords,
    totalPages,
    cartLoading: query.isLoading,
    cartError: query.isError,
  };

};

export const addCartForTour = async (body: any) => {
  const res = await apiClient.post(
    "booking/AddCartForTour",
    body
  );
  return res.data;
};