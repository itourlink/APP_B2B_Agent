/**
 * Export Service
 * Centralizes all export-to-Excel URL building logic for Tariff module.
 */

const EXPORT_BASE_URL = "https://api.itourlink.com/Page/ExportExcel.aspx";

/**
 * Converts a date string from yyyy-MM-dd format (used in app)
 * to M/D/YYYY format (required by the export API).
 */
const formatDateForExport = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "null";
    const [year, month, day] = dateStr.split("-");
    return `${parseInt(month)}/${parseInt(day)}/${year}`;
};

const toApiValue = (val: string | number | null | undefined): string => {
    if (val === null || val === undefined || val === "") return "null";
    return String(val);
};

// ─── Hotel (Supplier Mapping Price) ──────────────────────────────────────────

export interface HotelExportParams {
    strUserGUID: string;
    strCompanyGUID: string;
    dateFrom: string;
    dateTo: string;
    serviceName?: string;
    category?: string;       // intEasiaCateID - star rating
    destination?: string;    // strListCityCode
}

export const buildHotelExportUrl = (params: HotelExportParams): string => {
    const searchParams = new URLSearchParams({
        type: "GetListSupplierMappingPrice",
        act: "PriceSupp",
        strUserGUID: params.strUserGUID,
        strSupplierMappingPriceGUID: "null",
        strCompanyGUID: params.strCompanyGUID,
        strSupplierGUID: "null",
        strPriceListGUID: "null",
        strPriceLevelGUID: "null",
        intComTypeID: "0",
        intCateID: "1",
        intBoatPriceTypeID: "null",
        intEasiaCateID: toApiValue(params.category),
        strPriceRange: "null",
        dtmFilterDateFrom: formatDateForExport(params.dateFrom),
        dtmFilterDateTo: formatDateForExport(params.dateTo),
        strFilterSupplierName: toApiValue(params.serviceName),
        strFilterItemTypeName: "null",
        strListCityCode: params.destination ? `${params.destination},` : "null",
        intCurPage: "1",
        intPageSize: "9999",
        strOrder: "null",
        tblsReturn: "[0][2]",
        intTypeID: "3",
    });

    return `${EXPORT_BASE_URL}?${searchParams.toString()}`;
};

// ─── Tour / Transport / Excursion ────────────────────────────────────────────

export interface TourExportParams {
    strUserGUID: string;
    strCompanyGUID: string;
    dateFrom: string;
    dateTo: string;
    supplierType: "Transport" | "Excursion";
    serviceName?: string;
    category?: string;
    destination?: string;
}

export const buildTourExportUrl = (params: TourExportParams): string => {
    const intProductID = params.supplierType === "Transport" ? "101" : "100";

    const searchParams = new URLSearchParams({
        type: "GetListTourPriceItemLevelInAd",
        act: "PriceTour",
        strUserGUID: params.strUserGUID,
        strCompanyGUID: params.strCompanyGUID,
        intProductID,
        intTypeID: "3",
        intCateID: toApiValue(params.category),
        dtmFilterDateFrom: formatDateForExport(params.dateFrom),
        dtmFilterDateTo: formatDateForExport(params.dateTo),
        strFilterServiceName: toApiValue(params.serviceName),
        strListCityCode: params.destination ? `${params.destination},` : "null",
        intCurPage: "1",
        intPageSize: "9999",
        strOrder: "null",
        tblsReturn: "[0][2]",
    });

    return `${EXPORT_BASE_URL}?${searchParams.toString()}`;
};
