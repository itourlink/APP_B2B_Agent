import apiClient from "../../axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useUser } from "./useAuth"
import { QUERY_KEYS } from "./query-keys"
import { useListCompanyOwner } from "./useCompanyOwner"

const fetchListSupplierVoucherByAgent = async (body: any) => {
    const res = await apiClient.post("supplier/GetListSupplierVoucherByAgent", body)
    return res.data
}

export const useListSupplierVoucherByAgent = (filters?: {
    page?: number,
    pageSize?: number,
    strSupplierGUID?: string | null,
    dtmFilterDatePlan?: Date | null
}) => {
    const { user } = useUser()
    const { coData } = useListCompanyOwner();
    const {
        page = 1,
        pageSize = 10,
    } = filters || {}
    const query = useQuery({
        queryKey: [QUERY_KEYS.VOUCHER.LIST_VOUCHER, filters],
        queryFn: () =>
            fetchListSupplierVoucherByAgent({
                strCompanyPartnerGUID: user?.strCompanyGUID,
                strCompanyOwnerGUID: coData?.strCompanyGUID,
                strSupplierVoucherGUID: null,
                strFilterVoucherName: null,
                strFilterLocationCode: null,
                strPriceFromRange: null,
                intCurPage: page,
                intPageSize: pageSize,
                strOrder: null,
                tblsReturn: "[0]",
                dtmFilterDatePlan: filters?.dtmFilterDatePlan || null
            }),
        enabled: !!user,
        placeholderData: keepPreviousData,
    })

    const listData = query.data?.[0] ?? []
    const totalRecords = listData?.[0]?.intTotalRecords || 0
    const totalPages = Math.ceil(totalRecords / pageSize)

    return {
        voucherData: listData,
        voucherLoading: query.isLoading,
        voucherError: query.isError,
        totalRecords,
        totalPages,
    }
}