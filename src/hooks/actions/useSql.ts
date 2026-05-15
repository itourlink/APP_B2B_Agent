import apiClient from "@/axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const fetchListSQLData = async (body: any) => {
    const res = await apiClient.post("public/GetSQLDataByTableConfig", body);
    return res.data;
};

export const useListSQLData = (filters?: {
    strTableName?: string;
    strFeildSelect?: string;
    strWhere?: string;
}) => {
    const query = useQuery({
        queryKey: ["list-city", filters],
        queryFn: () =>
            fetchListSQLData({
                strTableName: filters?.strTableName,
                strFeildSelect: filters?.strFeildSelect,
                strWhere: filters?.strWhere,
            }),
        enabled: !!filters?.strTableName,
        placeholderData: keepPreviousData,
    });

    const listData = query.data ?? [];

    return {
        ctData: listData,
        ctLoading: query.isLoading,
        ctError: query.isError,
    };
};