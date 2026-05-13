import apiClient from "@/axios";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { QUERY_KEYS } from "./query-keys";
import { useUserStore } from "@/zustand/useUserStore";

const fetchListMedia = async (body: any) => {
    const res = await apiClient.post("system/GetListMedia", body);
    return res.data;
};

export const useListMedia = () => {
    const { user } = useUserStore()
    const query = useQuery({
        queryKey: [
            QUERY_KEYS.MEDIA.LIST_MEDIA, user?.strCompanyCode],
        queryFn: () =>
            fetchListMedia({
                pathRoot: `Agent/${user?.strCompanyCode}`,
                path: "/"
            }
            ),
        enabled: !!user?.strCompanyCode,
        placeholderData: keepPreviousData,
    });

    const listData = query.data ?? [];

    return {
        mediaData: listData,
        mediaLoading: query.isLoading,
        mediaError: query.isError,
    };
};