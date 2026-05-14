import apiClient from "@/axios"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useUser } from "./useAuth"
import { useListCompanyOwner } from "./useCompanyOwner"
import { QUERY_KEYS } from "./query-keys"


const fetchGetListCustomer = async (body: any) => {
    const res = await apiClient.post("tourcustomized/GetListCustomer", body)
    return res.data
}

export const useGetlistCustomer = (filters?: { page?: number; pageSize?: number})  => {
    const { user } = useUser();
    const { coData } = useListCompanyOwner();
    const { page = 1, pageSize = 10 } = filters || {};

    const query = useQuery({
        queryKey: [QUERY_KEYS.TOUR_CUSTOMER.LIST_TOUR_CUSTOMER, coData?.strCompanyGUID],
        queryFn:() => 
            fetchGetListCustomer({
                strUserGUID:user?.strUserGUID,
                strCustomerGUID: null,
                strTourCode: "98D2CBD",
                intTypeID: null,
                intCurPage: page,
                intPageSize: pageSize,
                strOrder: null,
                tblsReturn: null
            }),

            enabled: !!user && !!coData,
            placeholderData: keepPreviousData,
    });
    const listData = query.data?.[0] ??[];
    const totalRecords = listData?.[0]?.inTotalRecords || 0;
    const totalPages = Math.ceil(totalRecords / pageSize);

    return {
        tourCustomer: listData,
        totalRecords,
        totalPages,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
    }
}
