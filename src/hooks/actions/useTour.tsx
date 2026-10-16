import apiClient from "@/axios";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useUser } from "./useAuth";
import { useListCompanyOwner } from "./useCompanyOwner";
import { QUERY_KEYS } from "./query-keys";
import { useCurrency } from "@/components/currency/useCurrency";

const fetchListTour = async (body: Record<string, unknown>) => {
    const res = await apiClient.post("tour/GetListTourPublishInTopForHmPgTour", body);
    return res.data;
};

export const useListTour = (filters?: { page?: number; pageSize?: number }) => {
    const { user } = useUser();
    const { coData } = useListCompanyOwner();
    const { currencyId } = useCurrency();

    const { page = 1, pageSize = 10 } = filters || {};

    const query = useQuery({
        queryKey: [QUERY_KEYS.TOUR.LIST_TOUR, filters, coData?.strCompanyGUID, currencyId],
        queryFn: () =>
            fetchListTour({
                strCompanyOwnerGUID: coData?.strCompanyGUID,
                strCompanyPartnerGUID: user?.strCompanyGUID,
                strPriceLevelGUID: coData?.strPriceLevelGUID,
                intLangID: user?.intLangID,
                intCurrencyID: currencyId,
                strOrder: null,
                intCurPage: page,
                intPageSize: pageSize,
                tblsReturn: "[0]",
            }),
        enabled: !!user && !!coData,
        placeholderData: keepPreviousData,
    });

    const listData = query.data?.[0] ?? [];
    const totalRecords = listData?.[0]?.intTotalRecords || 0;
    const totalPages = Math.ceil(totalRecords / pageSize);

    return {
        tourData: listData,
        totalRecords,
        totalPages,
        tourLoading: query.isLoading,
        tourError: query.isError,
    };
};

export const fetchDetailTour = async (body: Record<string, unknown>) => {
    const res = await apiClient.post("tour/GetListTourDetailByPtn", body);
    return res.data;
};

export const useDetailTour = (filters?: {
    page?: number;
    pageSize?: number;
    strServiceNameUrl?: string;
}) => {
    const { user } = useUser();

    const { page = 1, pageSize = 10, strServiceNameUrl } = filters || {};

    const query = useQuery({
        queryKey: [QUERY_KEYS.TOUR.DETAIL_TOUR, filters],
        queryFn: () =>
            fetchDetailTour({
                strTourGUID: null,
                strServiceNameUrl,
                intLangID: user?.intLangID,
                intCurPage: page,
                intPageSize: pageSize,
                strOrder: null,
                tblsReturn: "[0][2]",
            }),
        enabled: !!user,
        placeholderData: keepPreviousData,
    });

    const listData = query.data ?? [];
    const totalRecords = listData?.[0]?.intTotalRecords || 0;
    const totalPages = Math.ceil(totalRecords / pageSize);

    return {
        tdData: listData,
        totalRecords,
        totalPages,
        tdLoading: query.isLoading || query.isFetching,
        tdError: query.isError,
    };
};

const toNullableNumber = (val: unknown): number | null => {
    if (val === null || val === undefined || val === "" || val === "all") return null;
    const num = Number(val);
    return isNaN(num) ? null : num;
};

const fetchListTourPublish = async (body: Record<string, unknown>) => {
    const res = await apiClient.post("tour/GetListTourPublish", body);
    return res.data;
};

export const useListTourPublish = (filters?: {
    page?: number | null;
    pageSize?: number | null;
    intCateID?: number | string | null;
    intProductID?: number | string | null;
    strNoOfDayRange?: string | null;
    strFilterServiceName?: string | null;
    strListEasiaCateID?: string | null;
    strListTransportOptionID?: string | null;
    strLocationCode?: string | null;
    dtmFilterDateValidFrom?: string | null;
    dtmFilterDateValidTo?: string | null;
    strPriceFromRange?: string | null;
}) => {
    const { user } = useUser();
    const { coData } = useListCompanyOwner();
    const { currencyId } = useCurrency();

    const {
        page = filters?.page ?? null,
        pageSize = filters?.pageSize ?? null,
        intCateID,
        intProductID,
        strNoOfDayRange,
        strFilterServiceName,
        strListEasiaCateID,
        strListTransportOptionID,
        strLocationCode,
        dtmFilterDateValidFrom,
        dtmFilterDateValidTo,
        strPriceFromRange,
    } = filters || {};

    const query = useQuery({
        queryKey: [QUERY_KEYS.TOUR.LIST_TOUR_PUBLISH, filters, coData?.strCompanyGUID, currencyId],
        queryFn: () =>
            fetchListTourPublish({
                strUserGUID: user?.strUserGUID,
                strTourGUID: null,
                strCompanyOwnerGUID: coData?.strCompanyGUID,
                strCompanyPartnerGUID: user?.strCompanyGUID,
                strMemberPartnerGUID: user?.strUserGUID,
                intLangID: user?.intLangID,
                strPriceLevelGUID: null,

                intCateID: toNullableNumber(intCateID),
                intProductID: toNullableNumber(intProductID),
                strNoOfDayRange: strNoOfDayRange ?? null,
                strFilterServiceName: strFilterServiceName ?? null,
                strListEasiaCateID: strListEasiaCateID ?? null,
                strListTransportOptionID: strListTransportOptionID ?? null,
                dtmFilterDateStart: null,
                dtmFilterDateValidFrom: dtmFilterDateValidFrom ?? null,
                dtmFilterDateValidTo: dtmFilterDateValidTo ?? null,
                strOrder: null,
                strPriceFromRange: strPriceFromRange ?? null,
                intCurrencyView: currencyId,
                strLocationCode: strLocationCode ?? null,
                intCurPage: page ?? 1,
                intPageSize: pageSize ?? 12,
                tblsReturn: "[0]",
                intTotalPax: null,
            }),
        enabled: !!user && !!coData,
        placeholderData: keepPreviousData,
    });

    const listData = query.data?.[0] ?? [];
    const totalRecords = listData?.[0]?.intTotalRecords || 0;

    const totalPages =
        typeof pageSize === "number" && pageSize > 0
            ? Math.ceil(totalRecords / pageSize)
            : 0;

    return {
        tdpData: listData,
        totalRecords,
        totalPages,
        tdpLoading: query.isLoading || query.isFetching,
        tdpError: query.isError,
    };
};

const fetchListTourDay = async (body: Record<string, unknown>) => {
    const res = await apiClient.post("tour/GetListTourDayByPtn", body);
    return res.data;
};

export const useListTourDay = (filters?: { strTourGUID?: string }) => {
    const { user } = useUser();

    const { strTourGUID } = filters || {};

    const query = useQuery({
        queryKey: [QUERY_KEYS.TOUR.LIST_TOUR_DAY, filters],
        queryFn: () =>
            fetchListTourDay({
                strTourDayGUID: null,
                strTourGUID,
                intLangID: user?.intLangID,
                intCurPage: null,
                intPageSize: null,
                strOrder: null,
                tblsReturn: "[0][2]",
            }),
        enabled: !!user,
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
    });

    const listData = query.data?.[0] ?? [];

    return {
        tddData: listData,
        tddLoading: query.isLoading || query.isFetching,
        tddError: query.isError,
    };
};
const fetchSearchTour = async (body: Record<string, unknown>) => {
    const res = await apiClient.post("system/GetListDirectorySearchingForTourByAgent", body);
    return res.data;
};

export const useSearchTour = (filters?: {
    page?: number,
    pageSize?: number,
    strFilterDestinationName?: string
    isTourSeries?: boolean
}) => {
    const { user } = useUser();
    const { coData } = useListCompanyOwner();
    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 10;

    const query = useQuery({
        queryKey: [QUERY_KEYS.TOUR.LIST_SEARCH_TOUR, filters],
        queryFn: () =>
            fetchSearchTour({
                strCompanyPartnerGUID: user?.strCompanyGUID,
                strCompanyOwnerGUID: coData?.strCompanyGUID,
                intCateID: null,
                strFilterDestinationName: filters?.strFilterDestinationName,
                isTourSeries: filters?.isTourSeries,
                intCurPage: page,
                intPageSize: pageSize,
                strOrder: null,
                tblsReturn: "[0]"
            }),
        enabled: !!user,
        placeholderData: keepPreviousData,
    });

    const listData = query.data?.[0] ?? [];
    const totalRecords = listData?.[0]?.intTotalRecords || 0;
    const totalPages = Math.ceil(totalRecords / pageSize);
    return {
        searchData: listData,
        totalRecords,
        totalPages,
        searchLoading: query.isLoading || query.isFetching,
        searchError: query.isError,
    };
};
const fetchListTourSeries = async (body: Record<string, unknown>) => {
    const res = await apiClient.post("Tour/GetListTourSeriesPublish", body);
    return res.data;
};

export const fetchListPaxBookingTourForBooking = async (
    body: Record<string, unknown>
) => {
    const res = await apiClient.post("tour/GetListPaxBookingTourForBkByPtn", body);
    return res.data;
};

const toPaxBookingDate = (value?: number | null, endOfDay = false) => {
    if (value === null || value === undefined || !Number.isFinite(value)) {
        return null;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    return new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        endOfDay ? 23 : 0,
        endOfDay ? 59 : 0,
        endOfDay ? 59 : 0,
        endOfDay ? 999 : 0
    )).toISOString();
};

export const useListFixedTourDepartures = (filters?: {
    strTourGUID?: string;
    intEasiaCateID?: number | string | null;
    dtmDateValidFrom?: number | null;
    dtmDateValidTo?: number | null;
    intNoOfAdult?: number;
    strListNoOfChild?: string | null;
    intNoOfSGLSup?: number;
    intNoOfTPLRec?: number;
    IsHasPriceKid?: boolean;
    viewMode?: "calendar" | "list";
    page?: number;
    pageSize?: number;
    enabled?: boolean;
}) => {
    const { user } = useUser();
    const { coData } = useListCompanyOwner();
    const { currencyId } = useCurrency();

    const easiaCateID =
        filters?.intEasiaCateID === "" ||
        filters?.intEasiaCateID === null ||
        filters?.intEasiaCateID === undefined
            ? null
            : Number(filters.intEasiaCateID);
    const normalizedEasiaCateID =
        easiaCateID !== null && Number.isInteger(easiaCateID)
            ? easiaCateID
            : null;
    const isListView = filters?.viewMode === "list";
    const currentPage = Math.max(Number(filters?.page ?? 1), 1);
    const pageSize = Math.max(Number(filters?.pageSize ?? 10), 1);

    const payload = {
        strUserGUID: user?.strUserGUID ?? null,
        strPriceLevelGUID: null,
        strCompanyOwnerGUID: coData?.strCompanyGUID ?? null,
        strTourGUID: filters?.strTourGUID ?? null,
        strPaxBookingTourCode: null,
        intEasiaCateID: normalizedEasiaCateID,
        intTransportOptionID: null,
        intNoOfAdult: Number(filters?.intNoOfAdult ?? 2),
        strListNoOfChild: filters?.strListNoOfChild ?? "",
        intNoOfSGLSup: Number(filters?.intNoOfSGLSup ?? 0),
        intNoOfTPLRec: Number(filters?.intNoOfTPLRec ?? 0),
        IsHasPriceKid: Boolean(filters?.IsHasPriceKid),
        dtmDateValidFrom: isListView
            ? null
            : toPaxBookingDate(filters?.dtmDateValidFrom),
        dtmDateValidTo: isListView
            ? null
            : toPaxBookingDate(filters?.dtmDateValidTo, true),
        intCurrencyView:
            currencyId === null || currencyId === undefined
                ? null
                : Number(currencyId),
        intCurPage: isListView ? currentPage : null,
        intPageSize: isListView ? pageSize : null,
        strOrder: null,
        tblsReturn: "[0]",
    };

    const query = useQuery({
        queryKey: [
            QUERY_KEYS.TOUR.LIST_FIXED_TOUR_DEPARTURES,
            payload,
        ],
        queryFn: () => fetchListPaxBookingTourForBooking(payload),
        enabled:
            filters?.enabled === true &&
            !!filters?.strTourGUID &&
            !!user?.strUserGUID &&
            !!coData?.strCompanyGUID &&
            !!currencyId &&
            (isListView ||
                (!!payload.dtmDateValidFrom && !!payload.dtmDateValidTo)),
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
    });

    const departureData = query.data?.[0] ?? [];
    const totalRecords = Number(
        departureData?.[0]?.intTotalRecords ?? departureData.length ?? 0
    );

    return {
        departureData,
        totalRecords,
        totalPages: Math.max(Math.ceil(totalRecords / pageSize), 1),
        departureLoading: query.isLoading || query.isFetching,
        departureError: query.isError,
        refetchDepartures: query.refetch,
    };
};

export const useListTourSeries = (filters?: {
    page?: number;
    pageSize?: number;

    intCateID?: string | null;
    intProductID?: string | null;

    strNoOfDayRange?: string | null;
    strFilterServiceName?: string | null;
    strListEasiaCateID?: string | null;
    strListTransportOptionID?: string | null;
    strPriceFromRange?: string | null;

    intNoOfAdult?: number;
    strListNoOfChild?: string;

    intNoOfSGLSup?: number;
    intNoOfTPLRec?: number;

    strLocationCode?: string | null;

    dtmFilterDateValidFrom?: string | null;
    dtmFilterDateValidTo?: string | null;
}) => {
    const { user } = useUser();
    const { coData } = useListCompanyOwner();
    const { currencyId } = useCurrency();

    const {
        page = 1,
        pageSize = 10,

        intCateID,
        intProductID,

        strNoOfDayRange,
        strFilterServiceName,
        strListEasiaCateID,
        strListTransportOptionID,
        strPriceFromRange,

        intNoOfAdult,
        strListNoOfChild,

        intNoOfSGLSup,
        intNoOfTPLRec,

        strLocationCode,

        dtmFilterDateValidFrom,
        dtmFilterDateValidTo,
    } = filters || {};

    const query = useQuery({
        queryKey: [QUERY_KEYS.TOUR.LIST_TOUR_SERIES, filters, currencyId],
        queryFn: () =>
            fetchListTourSeries({
                strTourGUID: null,

                strCompanyOwnerGUID:
                    coData?.strCompanyGUID,

                strCompanyPartnerGUID:
                    user?.strCompanyGUID,

                strMemberPartnerGUID:
                    user?.strUserGUID,

                intLangID:
                    user?.intLangID,

                strPriceLevelGUID: null,

                intCateID: toNullableNumber(intCateID),
                intProductID: toNullableNumber(intProductID),

                strNoOfDayRange,
                strFilterServiceName,
                strListEasiaCateID,
                strListTransportOptionID,

                dtmFilterDateStart: null,

                dtmFilterDateValidFrom,
                dtmFilterDateValidTo,

                intNoOfAdult,
                strListNoOfChild,

                intNoOfSGLSup,
                intNoOfTPLRec,

                strOrder: null,

                strPriceFromRange,

                intCurrencyView: currencyId,

                strLocationCode,

                intCurPage: page,

                intPageSize: pageSize,

                tblsReturn: "[0]",
            }),
        enabled: !!user && !!coData,
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
    });

    const listData = query.data?.[0] ?? [];
    const totalRecords = listData?.[0]?.intTotalRecords || 0;
    const totalPages = Math.ceil(totalRecords / pageSize);

    return {
        tsData: listData,
        totalRecords,
        totalPages,
        tsLoading: query.isPending || query.isFetching,
        tsError: query.isError,
    };
};


export const addNewTourCustomized = async (body: Record<string, unknown>) => {
    const res = await apiClient.post("tourcustomized/AddTourCustomized", body);
    return res.data;
};

