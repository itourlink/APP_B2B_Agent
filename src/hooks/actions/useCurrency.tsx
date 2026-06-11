import apiClient from "@/axios";
import { useUser } from "./useAuth";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./query-keys";
import { useCurrency } from "@/zustand/useCurrency";

const fetchListCurrency = async (body: any) => {
    const res = await apiClient.post("public/GetListCurrency", body);
    return res.data;
};

export const useListCurrency = () => {
    const { currencyId } = useCurrency();
    const query = useQuery({
        queryKey: [
            QUERY_KEYS.CURRENCY.CURRENCY, currencyId],
        queryFn: () =>
            fetchListCurrency({
                intCurrencyID: currencyId,
                tblsReturn: "[0]"
            }),
        enabled: !!currencyId,
        placeholderData: keepPreviousData,
    });

    return {
        currencyData: query.data?.[0]?.[0] ?? [],
        currencyLoading: query.isLoading,
        currencyError: query.isError,
    };
};