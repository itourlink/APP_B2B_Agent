import apiClient from "@/axios";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useUser } from "./useAuth";
import { useListCompanyOwner } from "./useCompanyOwner";
import { QUERY_KEYS } from "./query-keys";

const fetchListTour = async (body: any) => {
    const res = await apiClient.post("tour/GetListTourPublishInTopForHmPgTour", body);
    return res.data;
};

export const useListTour = (filters?: { page?: number; pageSize?: number }) => {
    const { user } = useUser();
    const { coData } = useListCompanyOwner();

    const { page = 1, pageSize = 10 } = filters || {};

    const query = useQuery({
        queryKey: [QUERY_KEYS.TOUR.LIST_TOUR, filters, coData?.strCompanyGUID],
        queryFn: () =>
            fetchListTour({
                strCompanyOwnerGUID: coData?.strCompanyGUID,
                strCompanyPartnerGUID: user?.strCompanyGUID,
                strPriceLevelGUID: coData?.strPriceLevelGUID,
                intLangID: user?.intLangID,
                intCurrencyID: user?.intCurrencyID,
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

const fetchDetailTour = async (body: any) => {
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
        tdLoading: query.isLoading,
        tdError: query.isError,
    };
};

const fetchListTourPublish = async (body: any) => {
    const res = await apiClient.post("tour/GetListTourPublish", body);
    return res.data;
};

export const useListTourPublish = (filters?: {
    page?: number | null;
    pageSize?: number | null;
    intCateID?: number | null;
    intProductID?: number | null;
    strLocationCode?: string | null,
    dtmFilterDateValidFrom?: string | null,
    dtmFilterDateValidTo?: string | null,
}) => {
    const { user } = useUser();
    const { coData } = useListCompanyOwner();

    const {
        page = filters?.page ?? null,
        pageSize = filters?.pageSize ?? null,
        intCateID,
        intProductID,
    } = filters || {};

    const query = useQuery({
        queryKey: [QUERY_KEYS.TOUR.LIST_TOUR_PUBLISH, filters, coData?.strCompanyGUID],
        queryFn: () =>
            fetchListTourPublish({
                strTourGUID: null,
                strCompanyOwnerGUID: coData?.strCompanyGUID,
                strCompanyPartnerGUID: user?.strCompanyGUID,
                strMemberPartnerGUID: user?.strUserGUID,
                intLangID: null,
                strPriceLevelGUID: null,
                intCateID,
                intProductID,
                strNoOfDayRange: null,
                strFilterServiceName: null,
                strListEasiaCateID: null,
                strListTransportOptionID: null,
                dtmFilterDateStart: null,
                dtmFilterDateValidFrom: filters?.dtmFilterDateValidFrom,
                dtmFilterDateValidTo: filters?.dtmFilterDateValidTo,
                strOrder: null,
                strPriceFromRange: null,
                intCurrencyView: 1,
                strLocationCode: filters?.strLocationCode,
                intCurPage: page,
                intPageSize: pageSize,
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
        tdpLoading: query.isLoading,
        tdpError: query.isError,
    };
};

const fetchListTourDay = async (body: any) => {
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
    });

    const listData = query.data?.[0] ?? [];

    return {
        tddData: listData,
        tddLoading: query.isLoading,
        tddError: query.isError,
    };
};
const fetchSearchTour = async (body: any) => {
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
        searchLoading: query.isLoading,
        searchError: query.isError,
    };
};
const fetchListTourSeries = async (body: any) => {
    const res = await apiClient.post("Tour/GetListTourSeriesPublish", body);
    return res.data;
};

export const useListTourSeries = (filters?: {
    page?: number,
    pageSize?: number,

    intCateID?: string | null
    intProductID?: string | null

    intNoOfAdult?: number
    strListNoOfChild?: string

    intNoOfSGLSup?: number
    intNoOfTPLRec?: number

    strLocationCode?: string | null

    dtmFilterDateValidFrom?: string
    dtmFilterDateValidTo?: string
}) => {
    const { user } = useUser();
    const { coData } = useListCompanyOwner();
    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 10;

    const query = useQuery({
        queryKey: [QUERY_KEYS.TOUR.LIST_TOUR_SERIES, filters],
        queryFn: () =>
            fetchListTourSeries({
                strTourGUID: null,

                strCompanyOwnerGUID:
                    coData?.strCompanyGUID,

                strCompanyPartnerGUID:
                    user?.strCompanyGUID,

                strMemberPartnerGUID:
                    user?.strUserGUID,

                intLangID: user?.intLangID,

                strPriceLevelGUID: null,

                intCateID:
                    filters?.intCateID ?? null,

                intProductID:
                    filters?.intProductID ?? null,

                strNoOfDayRange: null,

                strFilterServiceName: null,

                strListEasiaCateID: null,

                strListTransportOptionID: null,

                dtmFilterDateStart: null,

                dtmFilterDateValidFrom:
                    filters?.dtmFilterDateValidFrom,

                dtmFilterDateValidTo:
                    filters?.dtmFilterDateValidTo,

                intNoOfAdult:
                    filters?.intNoOfAdult,

                strListNoOfChild:
                    filters?.strListNoOfChild,

                intNoOfSGLSup:
                    filters?.intNoOfSGLSup,

                intNoOfTPLRec:
                    filters?.intNoOfTPLRec,

                strOrder: null,

                strPriceFromRange: null,

                intCurrencyView: 1,

                strLocationCode:
                    filters?.strLocationCode,

                intCurPage: page,

                intPageSize: pageSize,

                tblsReturn: "[0]"
            }),
        enabled: !!user && !!coData,
        placeholderData: keepPreviousData,
    });

    const listData = query.data?.[0] ?? [];
    const totalRecords = listData?.[0]?.intTotalRecords || 0;
    const totalPages = Math.ceil(totalRecords / pageSize);
    return {
        tsData: listData,
        totalRecords,
        totalPages,
        tsLoading: query.isLoading,
        tsError: query.isError,
    };
};


export const addNewTourCustomized = async (body: any) => {
    const res = await apiClient.post("tourcustomized/AddTourCustomized", body);
    return res.data;
};

