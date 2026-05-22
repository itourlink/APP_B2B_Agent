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

export const addBookingForTour = async (body: any) => {
    const res = await apiClient.post(
        "booking/AddBookingForTour",
        body
    );
    return res.data;
};

const fetchListBankAccount = async (body: any) => {
    const res = await apiClient.post("user/GetFilterCompanyBankAccount", body);
    return res.data;
};

export const useListBankAccount = () => {
    const { coData } = useListCompanyOwner();

    const query = useQuery({
        queryKey: [
            QUERY_KEYS.BOOKING.LIST_PRICE],
        queryFn: () =>
            fetchListBankAccount({
                strAgentCode: null,
                strWhere: null,
                strOrder: null,
                strCompanyGUID: coData?.strCompanyGUID,
                intCurPage: null,
                intPageSize: null,
                tblsReturn: null
            }),
        enabled: !!coData?.strCompanyGUID,
        placeholderData: keepPreviousData,
    });

    return {
        bankAccountData: query.data?.[0] ?? [],
        bankAccountLoading: query.isLoading,
        bankAccountError: query.isError,
    };
};


const fetchListAgentHostServiceTransToTMS = async (body: any) => {
    const res = await apiClient.post("connectto/tour/GetListAgentHostServiceTransToTMS", body);
    return res.data;
};

export const useListAGTransTMS = (filters?: {
    strListAgentHostServiceItemGUID?: string;
}) => {
    const { coData } = useListCompanyOwner();

    const query = useQuery({
        queryKey: [
            QUERY_KEYS.BOOKING.AGH_TRANSTMS,
            filters
        ],
        queryFn: () =>
            fetchListAgentHostServiceTransToTMS({
                strCompanyGUID: coData?.strCompanyGUID,
                strListAgentHostServiceItemGUID: filters?.strListAgentHostServiceItemGUID
            }),
        enabled: !!coData?.strCompanyGUID && !!filters?.strListAgentHostServiceItemGUID,
        placeholderData: keepPreviousData,
    });

    return {
        AGTMSData: query.data?.[0] ?? [],
        AGTMSLoading: query.isLoading,
        AGTMSError: query.isError,
    };
};



const fetchDetailAgentHostServiceTransToTMS = async (body: any) => {
    const res = await apiClient.post("connectto/tour/GetDetailBookingServiceTransToTMS", body);
    return res.data;
};

export const useDetailAGTransTMS = (filters?: {
    strAgentHostCompanyGUID?: string;
    strListAgentHostServiceItemGUID?: string;
}) => {

    const query = useQuery({
        queryKey: [
            QUERY_KEYS.BOOKING.DAGH_TRANSTMS,
            filters
        ],
        queryFn: () =>
            fetchDetailAgentHostServiceTransToTMS({
                strAgentHostCompanyGUID: filters?.strAgentHostCompanyGUID,
                strListAgentHostServiceItemGUID: filters?.strListAgentHostServiceItemGUID
            }),
        enabled: !!filters?.strListAgentHostServiceItemGUID && !!filters?.strAgentHostCompanyGUID,
        placeholderData: keepPreviousData,
    });

    return {
        DAGTMSData: query.data?.[0] ?? [],
        DAGTMSLoading: query.isLoading,
        DAGTMSError: query.isError,
    };
};