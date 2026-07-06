import apiClient from "@/axios";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useUser } from "./useAuth";
import { QUERY_KEYS } from "./query-keys";
import { useListCompanyOwner } from "./useCompanyOwner";

const fetchDetailCompanyTopup = async (body: {
    strUserGUID: string | null;
    strCompanyGUID: string | null;
}) => {
    const res = await apiClient.post("user/GetDetailCompanyTopup", body);
    return res.data;
};

export const useGetDetailCompanyTopup = (filters?: {
    strUserGUID?: string | null;
    strCompanyGUID?: string | null;
}) => {
    const { user } = useUser();

    const query = useQuery({
        queryKey: [
            QUERY_KEYS.TARIFF.DETAIL_COMPANY_TOPUP,
            filters?.strUserGUID ?? user?.strUserGUID,
            filters?.strCompanyGUID ?? user?.strCompanyGUID,
        ],
        queryFn: () =>
            fetchDetailCompanyTopup({
                strUserGUID: filters?.strUserGUID ?? user?.strUserGUID ?? null,
                strCompanyGUID: filters?.strCompanyGUID ?? user?.strCompanyGUID ?? null,
            }),
        enabled: !!(filters?.strUserGUID ?? user?.strUserGUID) && !!(filters?.strCompanyGUID ?? user?.strCompanyGUID),
        placeholderData: keepPreviousData,
    });

    return {
        data: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
    };
};





// supplier/GetListSupplierMappingPrice
const fetchListSupplierMappingPrice = async (body: any) => {
    const res = await apiClient.post("supplier/GetListSupplierMappingPrice", body);
    return res.data;
};

export const useGetListSupplierMappingPrice = (filters?: {
    strSupplierMappingPriceGUID?: string | null;
    strCompanyGUID?: string | null;
    strSupplierGUID?: string | null;
    strPriceListGUID?: string | null;
    strPriceLevelGUID?: string | null;
    intComTypeID?: number;
    intCateID?: any;
    intBoatPriceTypeID?: number | null;
    intEasiaCateID?: any;
    strPriceRange?: string | null;
    dtmFilterDateFrom?: string | null;
    dtmFilterDateTo?: string | null;
    strFilterSupplierName?: string | null;
    strFilterItemTypeName?: string | null;
    strListCityCode?: string | null;
    page?: number;
    pageSize?: number;
    strOrder?: string | null;
    tblsReturn?: string;
    intTypeID?: number;
    enabled?: boolean;
}) => {
    const { user } = useUser();
    const { coData } = useListCompanyOwner();

    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 10;

    const query = useQuery({
        queryKey: [
            QUERY_KEYS.TARIFF.LIST_SUPPLIER_MAPPING_PRICE,
            filters,
            user?.strUserGUID,
            coData?.strCompanyGUID,
        ],
        queryFn: () =>
            fetchListSupplierMappingPrice({
                strUserGUID: user?.strUserGUID ?? null,
                strSupplierMappingPriceGUID: filters?.strSupplierMappingPriceGUID ?? null,
                strCompanyGUID: filters?.strCompanyGUID ?? coData?.strCompanyGUID ?? user?.strCompanyGUID ?? null,
                strSupplierGUID: filters?.strSupplierGUID ?? null,
                strPriceListGUID: filters?.strPriceListGUID ?? null,
                strPriceLevelGUID: filters?.strPriceLevelGUID ?? null,
                intComTypeID: filters?.intComTypeID ?? 0,
                intCateID: filters?.intCateID ?? 1,
                intBoatPriceTypeID: filters?.intBoatPriceTypeID ?? null,
                intEasiaCateID: filters?.intEasiaCateID ?? null,
                strPriceRange: filters?.strPriceRange ?? null,
                dtmFilterDateFrom: filters?.dtmFilterDateFrom ?? "2026-01-01",
                dtmFilterDateTo: filters?.dtmFilterDateTo ?? "2026-12-31",
                strFilterSupplierName: filters?.strFilterSupplierName ?? null,
                strFilterItemTypeName: filters?.strFilterItemTypeName ?? null,
                strListCityCode: filters?.strListCityCode ?? null,
                intCurPage: page,
                intPageSize: pageSize,
                strOrder: filters?.strOrder ?? null,
                tblsReturn: filters?.tblsReturn ?? "[0][2]",
                intTypeID: filters?.intTypeID ?? 3,
            }),
        enabled: !!user?.strUserGUID && !!filters?.dtmFilterDateFrom && !!filters?.dtmFilterDateTo && (filters?.enabled !== false),
        placeholderData: keepPreviousData,
    });

    const listData = query.data?.[0] ?? [];
    const totalRecords = listData?.[0]?.intTotalRecords || 0;
    const totalPages = Math.ceil(totalRecords / pageSize);

    return {
        dataTariff: listData,
        totalRecords,
        totalPages,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        refetch: query.refetch,
    };
};


//Tour/GetListTourPriceItemLevelInAd

const fetchGetListTourPriceItemLevelInAd = async (body: any) => {
    const res = await apiClient.post("Tour/GetListTourPriceItemLevelInAd", body);
    return res.data;
}

export const useGetListTourPriceItemLevelInAd = (filters?: {
    strTourPriceItemLevelGUID?: string | null;
    strCompanyGUID?: string | null;
    strTourGUID?: string | null;
    strPriceLevelGUID?: string | null;
    strPaxGroupTypeGUID?: string | null;
    intCateID?: any;
    intComType?: number;
    intJoinTypeID?: number | null;
    intProductID?: number;
    intTypeID?: number;
    strFilterServiceName?: string | null;
    IsAllienceCopyTour?: boolean;
    dtmFilterDateFrom?: string | null;
    dtmFilterDateTo?: string | null;
    strListCityCode?: string | null;
    page?: number;
    pageSize?: number;
    strOrder?: string | null;
    tblsReturn?: string;
    enabled?: boolean;
}) => {
    const { user } = useUser();
    const { coData } = useListCompanyOwner();

    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 10;

    const query = useQuery({
        queryKey: [
            QUERY_KEYS.TARIFF.LIST_TOUR_PRICE_ITEM_LEVEL_IN_AD,
            filters,
            user?.strUserGUID,
            coData?.strCompanyGUID,
        ],
        queryFn: () =>
            fetchGetListTourPriceItemLevelInAd({
                strUserGUID: user?.strUserGUID ?? null,
                strTourPriceItemLevelGUID: filters?.strTourPriceItemLevelGUID ?? null,
                strCompanyGUID: filters?.strCompanyGUID ?? coData?.strCompanyGUID ?? user?.strCompanyGUID ?? null,
                strTourGUID: filters?.strTourGUID ?? null,
                strPriceLevelGUID: filters?.strPriceLevelGUID ?? null,
                strPaxGroupTypeGUID: filters?.strPaxGroupTypeGUID ?? null,
                intCateID: filters?.intCateID ?? null,
                intComType: filters?.intComType ?? 0,
                intJoinTypeID: filters?.intJoinTypeID ?? null,
                intProductID: filters?.intProductID ?? 101,
                intTypeID: filters?.intTypeID ?? 3,
                strFilterServiceName: filters?.strFilterServiceName ?? "",
                IsAllienceCopyTour: filters?.IsAllienceCopyTour ?? false,
                dtmFilterDateFrom: filters?.dtmFilterDateFrom ?? "2026-01-01",
                dtmFilterDateTo: filters?.dtmFilterDateTo ?? "2026-12-31",
                strListCityCode: filters?.strListCityCode ?? null,
                intCurPage: page,
                intPageSize: pageSize,
                strOrder: filters?.strOrder ?? null,
                tblsReturn: filters?.tblsReturn ?? "[0][1]",
            }),
        enabled: !!user?.strUserGUID && !!filters?.dtmFilterDateFrom && !!filters?.dtmFilterDateTo && (filters?.enabled !== false),
        placeholderData: keepPreviousData,
    });

    const listData = query.data?.[0] ?? [];
    const totalRecords = listData?.[0]?.intTotalRecords || 0;
    const totalPages = Math.ceil(totalRecords / pageSize);

    return {
        dataTariff: listData,
        totalRecords,
        totalPages,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        refetch: query.refetch,
    };
};