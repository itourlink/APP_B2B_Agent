import apiClient from "@/axios";
import { useQuery } from "@tanstack/react-query";

const fetchListSQLData = async (body: any) => {
    const res = await apiClient.post("public/GetSQLDataByTableConfig", body);
    return res.data;
};

export const useListSQLData = (filters?: {
    strTableName?: string;
    strFeildSelect?: string;
    strWhere?: string;
    parameters?: number | string;
    enabled?: boolean;
}) => {
    const query = useQuery({
        queryKey: [
            "sql-table-config",
            filters?.strTableName ?? null,
            filters?.strFeildSelect ?? null,
            filters?.strWhere ?? null,
            filters?.parameters ?? null,
        ],
        queryFn: () =>
            fetchListSQLData({
                strTableName: filters?.strTableName,
                strFeildSelect: filters?.strFeildSelect,
                strWhere: filters?.strWhere,
                parameters: filters?.parameters,
            }),
        enabled: filters?.enabled ?? !!filters?.strTableName,
        staleTime: Infinity,
        gcTime: Infinity,
    });

    const listData = query.data ?? [];

    return {
        ctData: listData,
        ctLoading: query.isLoading,
        ctFetching: query.isFetching,
        ctError: query.isError,
    };
};
