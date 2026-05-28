import apiClient from "@/axios";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { QUERY_KEYS } from "./query-keys";
import { useListCompanyOwner } from "./useCompanyOwner";
import { useUser } from "./useAuth";

const fetchListMenu = async (body: any) => {
    const res = await apiClient.post("system/GetWebMenu", body);
    return res.data;
};

export const useListMenu = () => {
    const { user } = useUser();
    const { coData } = useListCompanyOwner();
    const companyGUID = coData?.strCompanyGUID;

    const query = useQuery({
        queryKey: [
            QUERY_KEYS.MENU.LIST_MENU,
            companyGUID,
            user?.strCompanyGUID
        ],
        queryFn: async () => {

            return fetchListMenu({
                strCompanyGUID: companyGUID,
                strCompanyPartnerGUID: user?.strCompanyGUID,
                intMenuType: 2
            });
        },
        enabled: !!companyGUID && !!user?.strCompanyGUID,
        placeholderData: keepPreviousData,
        refetchOnMount: true,
    });

    const listData = query.data?.[0] ?? [];

    return {
        menuData: listData,
        menuLoading: query.isLoading,
        menuError: query.isError,
    };
};