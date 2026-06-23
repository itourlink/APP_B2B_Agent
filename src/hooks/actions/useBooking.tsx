import apiClient from "@/axios";
import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "./query-keys";
import { useListCompanyOwner } from "./useCompanyOwner";
import { useCurrency } from "@/components/currency/useCurrency";

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
    IsHasPriceKid?: boolean | false;
}) => {
    const { coData } = useListCompanyOwner();
    const { currencyId } = useCurrency();
    const query = useQuery({
        queryKey: [
            QUERY_KEYS.BOOKING.LIST_PRICE,
            filters,
            currencyId
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
                intCurrencyView: currencyId,
                strCompanyOwnerGUID: coData?.strCompanyGUID,
                IsHasPriceKid: filters?.IsHasPriceKid,
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

export const fetchTourPaymentTerm = async (body: any) => {
    const res = await apiClient.post(
        "tour/GetListTourPaymentTerm",
        body
    );
    return res.data;
};


export const useListTourPaymentTerm = (filters?: {
    strTourGUID?: string;
}) => {

    const query = useQuery({
        queryKey: [
            QUERY_KEYS.BOOKING.PAYMENT_TERM, filters],
        queryFn: () =>
            fetchTourPaymentTerm({
                strTourPaymentTermGUID: null,
                strTourGUID: filters?.strTourGUID,
                IsActive: null,
                intCurPage: null,
                intPageSize: null,
                strOrder: "IsDepositOnBook desc,intDayTo desc",
                tblsReturn: "[0]"
            }),
        enabled: !!filters?.strTourGUID,
        placeholderData: keepPreviousData,
    });

    return {
        paytermData: query.data?.[0]?.[0] ?? [],
        paytermtLoading: query.isLoading,
        paytermError: query.isError,
    };
};



const fetchSupplierPaymentTerm = async (body: any) => {
    const res = await apiClient.post(
        "supplier/GetListSupplierPaymentTerm",
        body
    );
    return res.data;
};

export const useListSupplierPaymentTerm = (filters?: {
    strSupplierGUID?: string;
}) => {
    const { coData } = useListCompanyOwner();

    const query = useQuery({
        queryKey: [
            QUERY_KEYS.BOOKING.PAYMENT_TERM, filters],
        queryFn: () =>
            fetchSupplierPaymentTerm({
                strSupplierPaymentTermGUID: null,
                strCompanyGUID: coData?.strCompanyGUID,
                strSupplierGUID: filters?.strSupplierGUID,

                dtmCheckInDate: null,

                intProductIDForBook: null,

                intCurPage: null,
                intPageSize: null,

                strOrder: "IsDepositOnBook desc,intDayTo desc",

                tblsReturn: "[0]"
            }),
        enabled: !!filters?.strSupplierGUID,
        placeholderData: keepPreviousData,
    });

    return {
        supPaytermData: query.data?.[0]?.[0] ?? [],
        supPaytermtLoading: query.isLoading,
        supPaytermError: query.isError,
    };
};


const fetchSurchargeDateForAgent = async (body: any) => {
    const res = await apiClient.post(
        "supplier/GetListSurchargeDateForAgent",
        body
    );
    return res.data;
};

export const useListSurchargeDateForAgent = (filters?: {
    strSupplierGUID?: string;
}) => {
    const { coData } = useListCompanyOwner();
    const { currencyId } = useCurrency();

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const query = useQuery({
        queryKey: [
            QUERY_KEYS.BOOKING.SURCHARGE_DATE,
            filters,
            currencyId
        ],
        queryFn: () =>
            fetchSurchargeDateForAgent({
                strSupplierGUID: filters?.strSupplierGUID,
                strCompanyOwnerGUID: coData?.strCompanyGUID,
                dtmFilterDateFrom: today.toISOString(),
                dtmFilterDateTo: tomorrow.toISOString(),
                intCurPage: null,
                intPageSize: null,
                strOrder: null,
                tblsReturn: "[0][1]",
                intCurrencyView: currencyId
            }),
        enabled: !!filters?.strSupplierGUID,
        placeholderData: keepPreviousData,
    });

    return {
        surDateData: query.data?.[0]?.[0] ?? [],
        surDateLoading: query.isLoading,
        surDateError: query.isError,
    };
};

const fetchFOC = async (body: any) => {
    const res = await apiClient.post(
        "supplier/GetListFoc",
        body
    );
    return res.data;
};

export const useListFOC = (filters?: {
    strSupplierGUID?: string;
    strPriceListGUID?: string;
}) => {
    const { coData } = useListCompanyOwner();
    const { currencyId } = useCurrency();

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const query = useQuery({
        queryKey: [
            QUERY_KEYS.BOOKING.LIST_FOC,
            filters,
            currencyId
        ],
        queryFn: () =>
            fetchFOC({
                strSupplierGUID: filters?.strSupplierGUID,
                strCompanyGUID: coData?.strCompanyGUID,
                strFocGUID: null,
                strPriceListGUID: filters?.strPriceListGUID,
                intFOCTypeID: null,
                dtmFilterDateFrom: today.toISOString(),
                dtmFilterDateTo: tomorrow.toISOString(),
                intCurPage: null,
                intPageSize: null,
                strOrder: null,
                tblsReturn: "[0]"
            }),
        enabled: !!filters?.strSupplierGUID || !!coData,
        placeholderData: keepPreviousData,
    });

    return {
        focData: query.data?.[0] ?? [],
        focLoading: query.isLoading,
        focError: query.isError,
    };
};

const fetchTourChildAge = async (body: any) => {
    const res = await apiClient.post(
        "Tour/GetListTourChildAge",
        body
    );
    return res.data;
};

export const useListTourChildAge = (filters?: {
    strTourGUID?: string;
}) => {

    const query = useQuery({
        queryKey: [
            QUERY_KEYS.BOOKING.LIST_CHILD_AGE, filters
        ],
        queryFn: () =>
            fetchTourChildAge({
                strTourGUID: filters?.strTourGUID,
                strTourChildAgeGUID: null,
                strListMakupTypeID: "0,2",
                intCurPage: null,
                intPageSize: null,
                strOrder: null,
                tblsReturn: "[0]"
            }),
        enabled: !!filters?.strTourGUID,
        placeholderData: keepPreviousData,
    });

    return {
        tourChildAgeData: query.data?.[0] ?? [],
        tourChildAgeLoading: query.isLoading,
        tourChildAgeError: query.isError,
    };
};