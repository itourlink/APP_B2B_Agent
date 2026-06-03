import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useUser } from "./useAuth";
import apiClient from "@/axios";

export const fetchCompanyOwnerList = async (body: any) => {
    const res = await apiClient.post("user/GetListCompanyOwner", body);
    return res.data;
};

export const useCompanyOwnerListInfo = (params: {
    strCompanyOwnerGUID?: string | null;
    page?: number;
    pageSize?: number;
    nameProvider?: string | null;
    strOrder?: string | null;
    strCompanyNameUrl?: string | null;
    tblsReturn?: string | null;
}) => {
    const { user } = useUser();

    const query = useQuery({
        queryKey: [
            QUERY_KEYS.USER.LIST_COMPANY_OWNER,
            params.page,
            params.nameProvider,
            user?.strUserGUID,
            user?.strCompanyGUID,
        ],
        queryFn: () =>
            fetchCompanyOwnerList({
                strUserPartnerGUID: user?.strUserGUID,
                strCompanyPartnerGUID: user?.strCompanyGUID,
                strCompanyOwnerGUID: params.strCompanyOwnerGUID || null,
                intCurPage: params.page,
                intPageSize: params.pageSize,
                strOrder: params.strOrder || null,
                strFilterCompanyName: params.nameProvider || null,
                strCompanyNameUrl: params.strCompanyNameUrl || null,
                IsOwnerFriend: true,
                tblsReturn: params.tblsReturn || "[0]",
            }),
        enabled: !!user?.strUserGUID && !!user?.strCompanyGUID,
        placeholderData: keepPreviousData,
    });

    const listData = query.data?.[0] ?? [];
    const totalRecords = listData?.[0]?.intTotalRecords || 0;

    return {
        data: listData,
        totalRecords,
        isLoading: query.isLoading,
        isError: query.isError,
    };
};