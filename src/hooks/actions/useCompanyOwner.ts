import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./query-keys";
import { useUser } from "./useAuth";
import apiClient from "@/axios";
import { useSearchParams } from "react-router-dom";

const fetchListCompanyOwner = async (body: any) => {
    const res = await apiClient.post("user/GetListCompanyOwner", body);
    return res.data;
};

export const listCompanyOwner = async (body: any) => {
    const res = await apiClient.post("user/GetListCompanyOwner", body);
    return res.data;
};

export const useListCompanyOwner = () => {
    const { user } = useUser();
    const [searchParams] = useSearchParams();

    const companyNameUrl =
        searchParams.get("company") ||
        "cong-ty-tnhh-ket-noi-du-lich-8F620";

    const query = useQuery({
        queryKey: [
            QUERY_KEYS.COMPANY_OWNER.LIST_COMPANY_OWNER,
            user?.strUserGUID,
            user?.strCompanyGUID,
            companyNameUrl, 
        ],
        queryFn: () =>
            fetchListCompanyOwner({
                strUserPartnerGUID: user?.strUserGUID,
                strCompanyPartnerGUID: user?.strCompanyGUID,
                strCompanyOwnerGUID: null,
                intCurPage: 1,
                intPageSize: 1,
                strOrder: null,
                strFilterCompanyName: null,
                strCompanyNameUrl: companyNameUrl,
                IsOwnerFriend: true,
                tblsReturn: "[0]"
            }),
        enabled: !!user,
        placeholderData: keepPreviousData,
    });

    return {
        coData: query.data?.[0]?.[0] ?? [],
        coLoading: query.isLoading,
        coError: query.isError,
    };
};


export const useListCompanyPartner = (filters?: { page?: number; pageSize?: number }) => {
    const { user } = useUser();
    const { coData } = useListCompanyOwner();

    const query = useQuery({
        queryKey: [QUERY_KEYS.TOUR.LIST_PARTNER, filters, coData?.strCompanyGUID],
        queryFn: () =>
            fetchListCompanyOwner({
                strUserPartnerGUID: user?.strUserGUID,
                strCompanyPartnerGUID: user?.strCompanyGUID,
                strCompanyOwnerGUID: coData?.strCompanyGUID,
                intCurPage: filters?.page ?? 1,
                intPageSize: filters?.pageSize ?? 10,
                strOrder: null,
                strFilterCompanyName: "",
                strCompanyNameUrl: null,
                IsOwnerFriend: true,
                tblsReturn: "[0]"
            }),
        enabled: !!user && !!coData,
        placeholderData: keepPreviousData,
    });

    const listData = query.data?.[0] ?? [];
    const totalRecords = listData?.[0]?.intTotalRecords || 0;
    // const totalPages = Math.ceil(totalRecords / filters?.pageSize);

    return {
        tpData: listData,
        totalRecords,
        // totalPages,
        tpLoading: query.isLoading,
        tpError: query.isError,
    };
};


const fetchCompanyDes = async (body: any) => {
    const res = await apiClient.post("user/GetListCompanyDestinationByPtn", body);
    return res.data;
};

export const useCompanyDes = (filters?: {
    page?: number;
    pageSize?: number;
    intFilterByCateID?: number
}) => {
    const { user } = useUser();
    const { coData } = useListCompanyOwner();

    const { page = 1, pageSize = 10, intFilterByCateID = 18 } = filters || {};

    const query = useQuery({
        queryKey: [QUERY_KEYS.COMPANY_OWNER.LIST_COMPANY_DES_DAY, filters, coData?.strCompanyGUID],
        queryFn: () =>
            fetchCompanyDes({
                strCompanyOwnerGUID: coData?.strCompanyGUID,
                strDestinationGUID: null,
                strFilterSearchText: null,
                intFilterByCateID: intFilterByCateID,
                IsTopDestination: true,
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
        tcdData: listData,
        totalRecords,
        totalPages,
        tcdLoading: query.isLoading,
        tcdError: query.isError,
    };
};



const fetchListAgentHost = async (body: any) => {
    const res = await apiClient.post("user/GetListAgentHostNoAddByAgent", body);
    return res.data;
};

export const useListAgentHost = (filters?: {
    page?: number | null;
    pageSize?: number | null;
    strFilterCompanyName?: string | null;
    strFilterLocationCode?: string | null;
    intCateID?: string | null;

}) => {
    const { user } = useUser();

    const page = filters?.page;
    const pageSize = filters?.pageSize;
    const query = useQuery({
        queryKey: [QUERY_KEYS.COMPANY_OWNER.LIST_COMPANY_DES_DAY, filters],
        queryFn: () =>
            fetchListAgentHost({
                strCompanyGUID: user?.strCompanyGUID,
                strFilterCompanyName: filters?.strFilterCompanyName ?? null,
                strFilterLocationCode: filters?.strFilterLocationCode ?? null,
                intCateID: filters?.intCateID ?? null,
                intCurPage: page ?? null,
                intPageSize: pageSize ?? null,
                strOrder: null,
                tblsReturn: "[0]",
            }),
        enabled: !!user,
        placeholderData: keepPreviousData,
    });

    const listData = query.data?.[0] ?? [];
    const totalRecords = listData?.[0]?.intTotalRecords || 0;
    const totalPages = pageSize
        ? Math.ceil(totalRecords / pageSize)
        : 0;

    return {
        ahData: listData,
        totalRecords,
        totalPages,
        ahLoading: query.isLoading,
        ahError: query.isError,
    };
};


