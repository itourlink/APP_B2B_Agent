import apiClient from "@/axios";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useUser } from "./useAuth";
import { useListCompanyOwner } from "./useCompanyOwner";
import { QUERY_KEYS } from "./query-keys";
import { useCurrency } from "@/components/currency/useCurrency";

const fetchListHotel = async (body: any) => {
    const res = await apiClient.post("supplier/GetListSupplierForHotelByAgent", body);
    return res.data;
};

export const useListHotel = (filters?: {
    page?: number;
    pageSize?: number;
    strSupplierGUID?: string | null;
    strFilterLocationCode?: string | null;
    strFilterSupplierName?: string | null;
    intNoOfRooms?: number | null;
    dtmFilterCheckIn?: string | Date | null;
    dtmFilterCheckOut?: string | Date | null;
    IsShowAll?: boolean;
    strPriceFromRange?: string | null;
    strListEasiaCateID?: string | null;
    strOrder?: string | null;
    tblsReturn?: string;
}) => {
    const { user } = useUser();
    const { currencyId } = useCurrency();

    const {
        page = 1,
        pageSize = 10,
        strSupplierGUID = null,
        strFilterLocationCode = null,
        strFilterSupplierName = null,
        intNoOfRooms = null,
        dtmFilterCheckIn = null,
        dtmFilterCheckOut = null,
        IsShowAll = true,
        strPriceFromRange = null,
        strListEasiaCateID = null,
        strOrder = null,
        tblsReturn = "[0]",
    } = filters || {};

    const query = useQuery({
        queryKey: [QUERY_KEYS.HOTEL.LIST_HOTEL, filters, currencyId],
        queryFn: () =>
            fetchListHotel({
                strUserGUID: user?.strUserGUID,
                strCompanyPartnerGUID: user?.strCompanyGUID,
                strCompanyOwnerGUID: null,
                intCurrencyID: currencyId,

                strSupplierGUID,
                strFilterLocationCode,
                strFilterSupplierName,

                intNoOfRooms,
                dtmFilterCheckIn,
                dtmFilterCheckOut,

                IsShowAll,

                strPriceFromRange,
                strListEasiaCateID,

                intCurPage: page,
                intPageSize: pageSize,
                strOrder,
                tblsReturn,
            }),
        enabled: !!user,
        placeholderData: keepPreviousData,
    });

    const listData = query.data?.[0] ?? [];
   const listDataCompany = query.data?.[1]?.[0] ?? null;
    
    const totalRecords = listData?.[0]?.intTotalRecords || 0;
    const totalPages = Math.ceil(totalRecords / pageSize);
 
    return {
        hotelData: listData,
        companyData: listDataCompany,
        totalRecords,
        totalPages,
        hotelLoading: query.isLoading,
        hotelError: query.isError,
    };
};

export const useListHotelGetPriceUID = (filters?: {
    page?: number;  
    pageSize?: number;
    strSupplierGUID?: string | null;
    strFilterLocationCode?: string | null;
    strFilterSupplierName?: string | null;
    intNoOfRooms?: number | null;
    dtmFilterCheckIn?: string | Date | null;
    dtmFilterCheckOut?: string | Date | null;
    IsShowAll?: boolean;
    strPriceFromRange?: string | null;
    strListEasiaCateID?: string | null;
    strOrder?: string | null;
    tblsReturn?: string;
}) => {
    const { user } = useUser();
    const { currencyId } = useCurrency();

    const {
        page = 1,
        pageSize = 10,
        strSupplierGUID = null,
        strFilterLocationCode = null,
        strFilterSupplierName = null,
        intNoOfRooms = null,
        dtmFilterCheckIn = null,
        dtmFilterCheckOut = null,
        IsShowAll = true,
        strPriceFromRange = null,
        strListEasiaCateID = null,
        strOrder = null,
        tblsReturn = "[0]",
    } = filters || {};

    const query = useQuery({
        queryKey: [QUERY_KEYS.HOTEL.LIST_HOTEL, filters, currencyId],
        queryFn: () =>
            fetchListHotel({
                strUserGUID: user?.strUserGUID,
                strCompanyPartnerGUID: user?.strCompanyGUID,
                strCompanyOwnerGUID: null,
                intCurrencyID: currencyId,

                strSupplierGUID,
                strFilterLocationCode,
                strFilterSupplierName,

                intNoOfRooms,
                dtmFilterCheckIn,
                dtmFilterCheckOut,

                IsShowAll,

                strPriceFromRange,
                strListEasiaCateID,

                intCurPage: page,
                intPageSize: pageSize,
                strOrder,
                tblsReturn,
            }),
        enabled: !!user,
        placeholderData: keepPreviousData,
    });

    const listData = query.data ?? [];
    const totalRecords = listData?.[0]?.intTotalRecords || 0;
    const totalPages = Math.ceil(totalRecords / pageSize);

    return {
        hotelData: listData,
        totalRecords,
        totalPages,
        hotelLoading: query.isLoading,
        hotelError: query.isError,
    };
};

const fetchItemTypeByAgent = async (body: any) => {
    const res = await apiClient.post("supplier/GetListItemTypeByAgent", body);
    return res.data;
};

export const useListItemByAgent = (filters?: { strSupplierGUID?: string | null }) => {
    const { user } = useUser();
    const { coData } = useListCompanyOwner();

    const {
        strSupplierGUID = null,
    } = filters || {};

    const query = useQuery({
        queryKey: [QUERY_KEYS.HOTEL.LIST_ITEM_BY_AGENT, filters, coData?.strCompanyGUID],
        queryFn: () =>
            fetchItemTypeByAgent({
                strItemTypeGUID: null,
                strSupplierGUID: strSupplierGUID,
                strCompanyOwnerGUID: coData?.strCompanyGUID,
                intCurPage: null,
                intPageSize: null,
                strOrder: null,
                tblsReturn: null
            }),
        enabled: !!user && !!coData,
        placeholderData: keepPreviousData,
    });

    const listData = query.data ?? [];

    return {
        ibgData: listData,
        ibgLoading: query.isLoading,
        ibgError: query.isError,
    };
};

const fetchListSupPriceByAgent = async (body: any) => {
    const res = await apiClient.post("supplier/GetListSupplierMappingPriceForHotelByAgent", body);
    return res.data;
};

export const useListSupplierPriceByAgent = (
    filters?: {
        strSupplierGUID?: string | null;
        strPriceListGUID?: string | null;
        strPriceLevelGUID?: string | null;
    }
) => {
    const { user } = useUser();
    const { coData } = useListCompanyOwner();
    const { currencyId } = useCurrency();

    const {
        strSupplierGUID = null,
        strPriceListGUID = null,
        strPriceLevelGUID = null
    } = filters || {};

    // YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = tomorrowDate.toISOString().split("T")[0];

    const isReady =
        !!user &&
        !!coData &&
        !!strSupplierGUID &&
        !!strPriceListGUID &&
        !!strPriceLevelGUID;

    const query = useQuery({
        queryKey: [
            QUERY_KEYS.HOTEL.LIST_SUPPLIER_PRICE_BY_AGENT,
            filters,
            coData?.strCompanyGUID,
            currencyId
        ],
        queryFn: () =>
            fetchListSupPriceByAgent({
                strSupplierMappingPriceGUID: null,
                strSupplierGUID,
                strPriceListGUID,
                strPriceLevelGUID,
                strCompanyOwnerGUID: coData?.strCompanyGUID,
                dtmFilterCheckIn: today,
                dtmFilterCheckOut: tomorrow,
                intCurPage: null,
                intPageSize: null,
                strOrder: null,
                tblsReturn: "[0][1]",
                intCurrencyView: currencyId,
            }),
        enabled: isReady,
        placeholderData: keepPreviousData,
    });

    return {
        spbData: query.data ?? [],
        spbLoading: query.isLoading,
        spbError: query.isError,
    };
};

const fetchSearchHotel = async (body: any) => {
    const res = await apiClient.post("supplier/GetListSupplierForHotelAlotmentByAgent", body);
    return res.data;
};

export const useSearchHotel = (filters?: {
    page?: number
    pageSize?: number
    intCurPage?: number
    intPageSize?: number
    strFilterDestinationName?: string,
    strFilterLocationCode?: string | null,
    strFilterSupplierName?: string | null,
    strPriceFromRange?: string | null,
    strListEasiaCateID?: string | null,
    IsShowAll?: boolean,
    intNoOfRooms?: number,
    dtmFilterCheckIn?: Date,
    dtmFilterCheckOut?: Date | null
}) => {
    const { user } = useUser();
    const { coData } = useListCompanyOwner();
    const { currencyId } = useCurrency();

    const page =
        filters?.intCurPage ?? filters?.page ?? 1;

    const pageSize =
        filters?.intPageSize ?? filters?.pageSize ?? 5;

    const query = useQuery({
        queryKey: [QUERY_KEYS.HOTEL.LIST_SEARCH_HOTEL, filters,],
        queryFn: () =>
            fetchSearchHotel({
                strCompanyPartnerGUID: user?.strCompanyGUID,
                strCompanyOwnerGUID: coData?.strCompanyGUID,

                strFilterLocationCode: filters?.strFilterLocationCode,

                intNoOfRooms: filters?.intNoOfRooms,
                dtmFilterCheckIn: filters?.dtmFilterCheckIn,
                dtmFilterCheckOut: filters?.dtmFilterCheckOut,

                intCurrencyID: currencyId,
                IsShowAll: filters?.IsShowAll,

                strSupplierGUID: null,
                strFilterSupplierName: filters?.strFilterSupplierName ?? null,
                strPriceFromRange: filters?.strPriceFromRange ?? null,
                strListEasiaCateID: filters?.strListEasiaCateID ?? null,

                intCurPage: page,
                intPageSize: pageSize,
                strOrder: null,
                tblsReturn: "[0],[1],[2]"
            }),
        enabled: !!user && !!coData,
        placeholderData: keepPreviousData,
    });

    const listData = query.data?.[0] ?? [];
    const totalRecords = listData?.[0]?.intTotalRecords || 0;
    const totalPages = pageSize ? Math.ceil(totalRecords / pageSize) : 0;
    return {
        searchData: listData,
        searchLoading: query.isLoading,
        searchError: query.isError,
        totalRecords,
        totalPages,
    };
};

const fetchListPriceListForCompany = async (body: any) => {
    const res = await apiClient.post(
        "supplier/GetListPriceListForCompany",
        body
    );

    return res.data;
};

export const useListPriceListForCompany = (filters?: {
    page?: number;
    pageSize?: number;
    intCurPage?: number;
    intPageSize?: number;

    strPriceListGUID?: string | null;
    strSupplierGUID?: string | null;

    IsNotInPriceList?: number | null;
    IsAddSystem?: number;
    IsEnable?: number;
}) => {
    const { user } = useUser();
    const { coData } = useListCompanyOwner();

    const page =
        filters?.intCurPage ?? filters?.page ?? 1;

    const pageSize =
        filters?.intPageSize ?? filters?.pageSize ?? 20;

    const query = useQuery({
        queryKey: [
            QUERY_KEYS.HOTEL.LIST_PRICE_LIST_FOR_COMPANY,
            filters
        ],

        queryFn: () =>
            fetchListPriceListForCompany({
                strUserGUID: user?.strUserGUID,

                strPriceListGUID:
                    filters?.strPriceListGUID ?? null,

                IsNotInPriceList:
                    filters?.IsNotInPriceList ?? true,

                strSupplierGUID:
                    filters?.strSupplierGUID ?? null,

                IsAddSystem:
                    filters?.IsAddSystem ?? true,

                strCompanyGUID:
                    coData?.strCompanyGUID,

                IsEnable:
                    filters?.IsEnable ?? true,

                intCurPage: page,
                intPageSize: pageSize,

                strOrder: null,
                tblsReturn: "[0]"
            }),

        enabled: !!user && !!coData,
        placeholderData: keepPreviousData,
    });

    const listData = query.data?.[0]?.[0] ?? [];

    const totalRecords =
        listData?.[0]?.intTotalRecords || 0;

    const totalPages =
        pageSize
            ? Math.ceil(totalRecords / pageSize)
            : 0;

    return {
        pplfcData: listData,
        pplfcLoading: query.isLoading,
        pplfcError: query.isError,

        totalRecords,
        totalPages,
    };
};

const fetchSearchDesHotel = async (body: any) => {
    const res = await apiClient.post("system/GetListDirectorySearchingForSuppByAgent", body);
    return res.data;
};

export const useSearchDesHotel = (filters?: {
    page?: number,
    pageSize?: number,
    strFilterDestinationName?: string
}) => {
    const { user } = useUser();
    const { coData } = useListCompanyOwner();

    const page = filters?.page ?? null;
    const pageSize = filters?.pageSize ?? null;

    const query = useQuery({
        queryKey: [QUERY_KEYS.HOTEL.LIST_SEARCH_DES_HOTEL, filters],
        queryFn: () =>
            fetchSearchDesHotel({
                strCompanyPartnerGUID: user?.strCompanyGUID,
                strCompanyOwnerGUID: coData?.strCompanyGUID,
                intCateID: 1,
                strFilterDestinationName: filters?.strFilterDestinationName,
                intCurPage: page,
                intPageSize: pageSize,
                strOrder: null,
                tblsReturn: "[0]"
            }),
        enabled: !!user || !!coData,
        placeholderData: keepPreviousData,
    });

    const listData = query.data?.[0] ?? [];
    const totalRecords = listData?.[0]?.intTotalRecords || 0;
    const totalPages = pageSize ? Math.ceil(totalRecords / pageSize) : 0;
    return {
        searchDesData: listData,
        totalRecords,
        totalPages,
        searchDesLoading: query.isFetching,
        searchDesError: query.isError,
    };
};