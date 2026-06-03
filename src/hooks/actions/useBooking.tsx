import apiClient from "@/axios";
import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "./query-keys";
import { useListCompanyOwner } from "./useCompanyOwner";
import { useUser } from "./useAuth";

export const fetchListPrice = async (body: any) => {
    const res = await apiClient.post("tour/GetListPriceLevelTour", body);
    return res.data;
};

export const useListPrice = (filters?: {
    strTourGUID?: string;
    intNoOfAdult?: number;
    intNoOfSGLSup?: number;
    intNoOfTPLRec?: number;
    dtmFilterDateFrom?: string | null;
    xmlNoOfChild?: string | null;
    strPriceLevelGUID?: string | null;
    intEasiaCateID?: number | null;
    intJoinTypeID?: number | null;
    enabled?: boolean;
}) => {
    const { coData } = useListCompanyOwner();
    const { user } = useUser()
    const query = useQuery({
        queryKey: [
            QUERY_KEYS.BOOKING.LIST_PRICE,
            filters
        ],
        queryFn: () =>
            fetchListPrice({
                strTourPriceItemLevelGUID: null,
                strTourGUID: filters?.strTourGUID,
                strPriceLevelGUID: filters?.strPriceLevelGUID ?? "",
                intNoOfAdult: filters?.intNoOfAdult,
                xmlNoOfChild: filters?.xmlNoOfChild ?? "",
                intNoOfSGLSup: filters?.intNoOfSGLSup,
                intNoOfTPLRec: filters?.intNoOfTPLRec,
                dtmFilterDateFrom: filters?.dtmFilterDateFrom,
                dtmFilterDateTo: null,
                intCurrencyView: user?.intCurrencyID,
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
    const res = await apiClient.post(
        "connectto/tour/GetListAgentHostServiceTransToTMS",
        body
    );

    return res.data;
};

export const useListAGTransTMSMutation = () => {
    return useMutation({
        mutationFn: fetchListAgentHostServiceTransToTMS,
    });
};

const fetchDetailAgentHostServiceTransToTMS = async (body: any) => {
    const res = await apiClient.post(
        "connectto/tour/GetDetailBookingServiceTransToTMS",
        body
    );

    return res.data;
};

export const useDetailAGTransTMSMutation = () => {
    return useMutation({
        mutationFn: fetchDetailAgentHostServiceTransToTMS,
    });
};


const fetchVouchers = async () => {
    const res = await apiClient.get(
        "voucher/GetVouchers"
    );
    return res || [];
};

export const useListVouchers = (isOpen: boolean) => {
    const query = useQuery({
        queryKey: [QUERY_KEYS.BOOKING.VOUCHER],

        queryFn: fetchVouchers,

        enabled: isOpen,
        placeholderData: keepPreviousData,
    }) as any;

    return {
        voucherData: query.data || [],
        voucherLoading: query.isLoading,
        voucherError: query.error,
    };
};

export const markUsedVoucher = async (body: any) => {
    const res = await apiClient.post("voucher/MarkUsed", body);
    return res.data;
};


export const fetchGetEmailSendAGHByAGB = async (body: any) => {
    const res = await apiClient.post("system/GetEmailSendAgentHostByAgentBook", body);
    return res.data;
};
export const fetchGetSendEmail = async (body: any) => {
    const res = await apiClient.post("public/GetSendEmail", body);
    return res.data;
};

export const addBookingForCart = async (body: any) => {
    const res = await apiClient.post(
        "booking/AddBookingForCart",
        body
    );
    return res.data;
};
export const addBookingForHotel = async (body: any) => {
    const res = await apiClient.post(
        "booking/AddBookingForHotel",
        body
    );
    return res.data;
};
export const addCartForHotel = async (body: any) => {
    const res = await apiClient.post(
        "booking/AddCartForHotel",
        body
    );
    return res.data;
};


const fetchListCurrency = async (body: any) => {
    const res = await apiClient.post("public/GetListCurrency", body);
    return res.data;
};

export const useListCurrency = () => {
    const { user } = useUser();
    const query = useQuery({
        queryKey: [
            QUERY_KEYS.BOOKING.CURRENCY],
        queryFn: () =>
            fetchListCurrency({
                intCurrencyID: user?.intCurrencyID,
                tblsReturn: "[0]"
            }),
        enabled: !!user?.intCurrencyID,
        placeholderData: keepPreviousData,
    });

    return {
        currencyData: query.data?.[0]?.[0] ?? [],
        currencyLoading: query.isLoading,
        currencyError: query.isError,
    };
};