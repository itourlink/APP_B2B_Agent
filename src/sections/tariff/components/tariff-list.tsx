import { useState, useMemo } from "react";
import { useGetListSupplierMappingPrice, useGetListTourPriceItemLevelInAd } from "@/hooks/actions/useTariff";
import { fCurrency, safeText } from "@/utils/format-number";
import { fDateTariff } from "@/utils/format-time";
import Pagination from "@/components/pagination/pagination";
import TariffSearch from "./tariff-search";
import { TableCore, type ColumnDef } from "@/components/table/table-core";
import { useTranslate } from "@/locales";

// Các trạng thái bộ lọc đang nhập trên UI (Không kích hoạt gọi API trực tiếp)
import { useUser } from "@/hooks/actions/useAuth";
import { useListCompanyOwner } from "@/hooks/actions/useCompanyOwner";
import { buildHotelExportUrl, buildTourExportUrl } from "@/utils/export.service";

const TariffList = () => {
    const { t } = useTranslate("tariff");
    const { user } = useUser();
    const { coData } = useListCompanyOwner(); // Company chủ sở hữu (giống như useTariff dùng)
    const [supplierType, setSupplierType] = useState("Hotel");
    const [serviceName, setServiceName] = useState("");
    const [dateFrom, setDateFrom] = useState("2026-01-01");
    const [dateTo, setDateTo] = useState("2026-12-31");
    const [category, setCategory] = useState("");
    const [country, setCountry] = useState("");
    const [region, setRegion] = useState("");
    const [destination, setDestination] = useState("");

    // Bộ lọc thực tế được áp dụng để gọi API 
    const [appliedFilters, setAppliedFilters] = useState({
        serviceName: "",
        dateFrom: "2026-01-01",
        dateTo: "2026-12-31",
        supplierType: "Hotel",
        category: "",
        country: "",
        region: "",
        destination: "",
    });

    // Các trạng thái phân trang
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const isHotel = appliedFilters.supplierType === "Hotel";

    // Gọi API lấy dữ liệu Hotel sử dụng useGetListSupplierMappingPrice
    const hotelQuery = useGetListSupplierMappingPrice({
        strFilterSupplierName: appliedFilters.serviceName || null,
        dtmFilterDateFrom: appliedFilters.dateFrom || "2026-01-01",
        dtmFilterDateTo: appliedFilters.dateTo || "2026-12-31",
        intTypeID: 3,
        intCateID: 1,
        intEasiaCateID: appliedFilters.category || null,
        strListCityCode: appliedFilters.destination || null,
        page: currentPage,
        pageSize: pageSize,
        enabled: isHotel,
    });

    // Gọi API lấy dữ liệu Transport / Excursion sử dụng useGetListTourPriceItemLevelInAd
    const tourQuery = useGetListTourPriceItemLevelInAd({
        strFilterServiceName: appliedFilters.serviceName || "",
        dtmFilterDateFrom: appliedFilters.dateFrom || "2026-01-01",
        dtmFilterDateTo: appliedFilters.dateTo || "2026-12-31",
        intProductID: appliedFilters.supplierType === "Transport" ? 101 : 100,
        intTypeID: 3,
        intCateID: appliedFilters.category || null,
        strListCityCode: appliedFilters.destination || null,
        page: currentPage,
        pageSize: pageSize,
        enabled: !isHotel,
    });

    // Trích xuất dữ liệu dựa trên loại hình đang chọn
    const {
        dataTariff: tariffData,
        totalRecords: tariffTotalRecords,
        isLoading: tariffLoading,
        isFetching: tariffFetching,
        isError: tariffError
    } = isHotel ? hotelQuery : tourQuery;

    // Hàm xử lý Lọc: Đồng bộ giá trị UI đang nhập vào bộ lọc áp dụng gọi API
    const handleSearch = () => {
        if (!dateFrom || !dateTo) {
            alert(t("pleaseSelectDateRange"));
            return;
        }
        setAppliedFilters({
            serviceName,
            dateFrom,
            dateTo,
            supplierType,
            category,
            country,
            region,
            destination,
        });
        setCurrentPage(1); // Reset số trang về 1
    };

    const handleReset = () => {
        setSupplierType("Hotel");
        setServiceName("");
        setDateFrom("2026-01-01");
        setDateTo("2026-12-31");
        setCategory("");
        setCountry("");
        setRegion("");
        setDestination("");

        setAppliedFilters({
            serviceName: "",
            dateFrom: "2026-01-01",
            dateTo: "2026-12-31",
            supplierType: "Hotel",
            category: "",
            country: "",
            region: "",
            destination: "",
        });
        setCurrentPage(1);
    };

    // Bước 2, 4, 5, 6 — Tạo URL export dựa trên appliedFilters và mở trong tab mới
    const handleExport = () => {
        if (!user?.strUserGUID) {
            alert("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
            return;
        }

        // Dùng coData?.strCompanyGUID (giống useTariff hook) — là CompanyGUID của chủ sở hữu
        const strCompanyGUID = coData?.strCompanyGUID ?? user.strCompanyGUID;

        let exportUrl: string;

        if (appliedFilters.supplierType === "Hotel") {
            exportUrl = buildHotelExportUrl({
                strUserGUID: user.strUserGUID,
                strCompanyGUID,
                dateFrom: appliedFilters.dateFrom,
                dateTo: appliedFilters.dateTo,
                serviceName: appliedFilters.serviceName,
                category: appliedFilters.category,
                destination: appliedFilters.destination,
            });
        } else {
            exportUrl = buildTourExportUrl({
                strUserGUID: user.strUserGUID,
                strCompanyGUID,
                supplierType: appliedFilters.supplierType as "Transport" | "Excursion",
                dateFrom: appliedFilters.dateFrom,
                dateTo: appliedFilters.dateTo,
                serviceName: appliedFilters.serviceName,
                category: appliedFilters.category,
                destination: appliedFilters.destination,
            });
        }

        window.open(exportUrl, "_blank");
    };

    // Nhóm các khách sạn lại để tính toán số dòng cần gộp (rowSpan) dựa trên tên khách sạn
    const hotelGroupSpans = useMemo(() => {
        const spans: Record<number, number> = {};
        let i = 0;
        const list = tariffData || [];
        while (i < list.length) {
            const currentHotelName = list[i].strSupplierName || "";
            let count = 1;
            let j = i + 1;
            while (j < list.length && list[j].strSupplierName === currentHotelName) {
                count++;
                j++;
            }
            spans[i] = count;
            i = j;
        }
        return spans;
    }, [tariffData]);

    // Định nghĩa danh sách các cột cho TableCore
    const columnDefs = useMemo<ColumnDef<any>[]>(() => {
        return [
            {
                field: "No" as any,
                headerName: t("stt"),
                algin: "center",
                width: 60,
                render: (_val, row, rowIndex) => row.No || rowIndex + 1,
            },
            {
                field: "strSupplierName",
                headerName: isHotel ? t("hotelName") : t("serviceName"),
                width: 320,
                cellProps: (_val, _row, rowIndex) => {
                    const span = hotelGroupSpans[rowIndex];
                    if (span === undefined) return null; // Ẩn hoàn toàn ô td
                    return {
                        rowSpan: span,
                        className: "px-4 py-4 font-semibold text-gray-900 border-r border-gray-100 align-middle text-center bg-white",
                    };
                },
                render: (_val, row) => {
                    const hotelName = safeText(row.strSupplierName || row.strTourName || "");
                    const hotelRating = safeText(row.strEasiaCateName) || "";
                    const displayHotelName = hotelRating ? `${hotelName} (${hotelRating})` : hotelName;
                    const hotelAddress = safeText(row.strSupplierAddress || "");
                    const hotelWebsite = safeText(row.strSupplierWeb || "");

                    return (
                        <div className="space-y-1 flex flex-col items-center justify-center w-full">
                            <span className="text-[#004b91] uppercase block truncate max-w-[280px]" title={displayHotelName}>
                                {displayHotelName}
                            </span>
                            {hotelAddress && (
                                <p className="text-gray-500 font-normal text-xs truncate max-w-[280px]" title={hotelAddress}>
                                    {hotelAddress}
                                </p>
                            )}
                            {hotelWebsite && (
                                <a
                                    href={hotelWebsite}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-500 text-xs font-normal hover:underline block truncate max-w-[280px]"
                                    title={hotelWebsite}
                                >
                                    {hotelWebsite}
                                </a>
                            )}
                        </div>
                    );
                },
            },
            {
                field: "strItemTypeName",
                headerName: isHotel ? t("roomName") : t("itemName"),
                width: 250,
                render: (_val, row) => safeText(row.strItemTypeName || row.strPriceLevelName || ""),
            },
            {
                field: "dtmDateFrom",
                headerName: t("dateFrom"),
                algin: "center",
                render: (_val, row) => fDateTariff(row.dtmDateFrom || row.dateFrom),
            },
            {
                field: "dtmDateTo",
                headerName: t("dateTo"),
                algin: "center",
                render: (_val, row) => fDateTariff(row.dtmDateTo || row.dateTo),
            },
            {
                field: "dblPrice",
                headerName: t("price"),
                algin: "end",
                render: (_val, row) => {
                    const priceVal = row.dblPrice !== undefined ? row.dblPrice : row.price;
                    return fCurrency(priceVal, "VND");
                },
            },
            {
                field: "dblPriceSGL",
                headerName: t("priceSgl"),
                algin: "end",
                render: (_val, row) => {
                    const priceSglVal = row.dblPriceSGL !== undefined ? row.dblPriceSGL : row.priceSgl;
                    return fCurrency(priceSglVal, "VND");
                },
            },
            {
                field: "dblPriceTPL",
                headerName: t("priceDbl"),
                algin: "end",
                render: (_val, row) => {
                    const priceDblVal = row.dblPriceTPL !== undefined ? row.dblPriceTPL : row.priceDbl;
                    return fCurrency(priceDblVal, "VND");
                },
            },
            {
                field: "dblPriceChild",
                headerName: t("priceChild"),
                algin: "end",
                render: (_val, row) => {
                    const priceChildVal = row.dblPriceChild !== undefined ? row.dblPriceChild : row.priceChild;
                    return fCurrency(priceChildVal, "VND");
                },
            },
            {
                field: "strRemark",
                headerName: t("remark"),
                algin: "center",
                render: (_val, row) => safeText(row.strRemark) || "--",
            },
        ];
    }, [isHotel, hotelGroupSpans, t]);

    return (
        <div className="w-full">
            <TariffSearch
                serviceName={serviceName}
                setServiceName={setServiceName}
                dateFrom={dateFrom}
                setDateFrom={setDateFrom}
                dateTo={dateTo}
                setDateTo={setDateTo}
                supplierType={supplierType}
                setSupplierType={setSupplierType}
                category={category}
                setCategory={setCategory}
                country={country}
                setCountry={setCountry}
                region={region}
                setRegion={setRegion}
                destination={destination}
                setDestination={setDestination}
                onSearch={handleSearch}
                onReset={handleReset}
                onExport={handleExport}
                isLoading={tariffLoading || tariffFetching}
            />

            {/* Hiển thị bảng dữ liệu hoặc màn hình loading, báo lỗi */}
            {tariffLoading ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center text-gray-500 font-medium">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#004b91] mr-3"></div>
                    {t("loadingData")}
                </div>
            ) : tariffError ? (
                <div className="bg-white rounded-xl border border-red-200 shadow-sm p-12 text-center text-red-500 font-medium bg-red-50/20">
                    {t("errorLoadingData")}
                </div>
            ) : !appliedFilters.dateFrom || !appliedFilters.dateTo ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center text-amber-500 font-medium bg-amber-50/10">
                    {t("selectDateRangeToView")}
                </div>
            ) : (
                <>
                    <TableCore
                        rowData={tariffData || []}
                        columnDefs={columnDefs}
                        loading={tariffFetching}
                    />

                    {/* Thanh phân trang kết quả */}
                    {tariffTotalRecords > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(tariffTotalRecords / pageSize) || 1}
                            totalRecords={tariffTotalRecords}
                            recordsPerPage={pageSize}
                            onPageChange={setCurrentPage}
                            onRecordsPerPageChange={setPageSize}
                            className="mt-6"
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default TariffList;