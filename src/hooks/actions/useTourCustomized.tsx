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
