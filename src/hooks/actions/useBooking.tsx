import apiClient from "@/axios";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { QUERY_KEYS } from "./query-keys";
import { useListCompanyOwner } from "./useCompanyOwner";

const fetchListPrice = async (body: any) => {
    const res = await apiClient.post("tour/GetListPriceLevelTour", body);
    return res.data;
};

export const useListPrice = (filters?: {
    strTourGUID?: string;
    intNoOfAdult?: number;
    intNoOfSGLSup?: number;
    intNoOfTPLRec?: number;
    dtmFilterDateFrom?: string | null;
    intEasiaCateID?: number | null;
    intJoinTypeID?: number | null;
    enabled?: boolean;
}) => {
    const { coData } = useListCompanyOwner();

    const query = useQuery({
        queryKey: [
            QUERY_KEYS.BOOKING.LIST_PRICE,
            filters
        ],
        queryFn: () =>
            fetchListPrice({
                strTourPriceItemLevelGUID: null,
                strTourGUID: filters?.strTourGUID,
                strPriceLevelGUID: "",
                intNoOfAdult: filters?.intNoOfAdult,
                xmlNoOfChild: "",
                intNoOfSGLSup: filters?.intNoOfSGLSup,
                intNoOfTPLRec: filters?.intNoOfTPLRec,
                dtmFilterDateFrom: filters?.dtmFilterDateFrom,
                dtmFilterDateTo: null,
                intCurrencyView: 3,
                strCompanyOwnerGUID: coData?.strCompanyGUID,
                IsHasPriceKid: false,
                intEasiaCateID: filters?.intEasiaCateID,
                intCateID: 18,
                intJoinTypeID: filters?.intJoinTypeID,
                intTransportOptionID: null,
                intCurPage: null,
                intPageSize: null,
                strOrder: null,
                tblsReturn: "[0]",
            }),
        enabled: !!coData?.strCompanyGUID && !!filters?.enabled,
        placeholderData: keepPreviousData,
    });

    return {
        priceData: query.data?.[0] ?? [],
        priceLoading: query.isLoading,
        priceError: query.isError,
    };
};