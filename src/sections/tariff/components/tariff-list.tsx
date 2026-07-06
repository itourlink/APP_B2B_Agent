import { useState, useMemo, useEffect } from "react";
import { useGetListSupplierMappingPrice, useGetListTourPriceItemLevelInAd } from "@/hooks/actions/useTariff";
import { fCurrency, safeText } from "@/utils/format-number";
import { fDateTariff } from "@/utils/format-time";
import Pagination from "@/components/pagination/pagination";
import TariffSearch from "./tariff-search";

const TariffList = () => {
    // Các trạng thái bộ lọc đang nhập trên UI (Không kích hoạt gọi API trực tiếp)
    const [supplierType, setSupplierType] = useState("Hotel");
    const [serviceName, setServiceName] = useState("");
    const [dateFrom, setDateFrom] = useState("2026-01-01");
    const [dateTo, setDateTo] = useState("2026-12-31");
    const [category, setCategory] = useState("");
    const [country, setCountry] = useState("");
    const [region, setRegion] = useState("");
    const [destination, setDestination] = useState("");

    // Bộ lọc thực tế được áp dụng để gọi API (Chỉ cập nhật khi bấm Lọc hoặc Reset)
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
        strListCityCode: appliedFilters.destination ? `${appliedFilters.destination},` : null,
        page: currentPage,
        pageSize: pageSize,
        enabled: isHotel,
    });

    // Gọi API lấy dữ liệu Transport / Excursion sử dụng useGetListTourPriceItemLevelInAd
    // Đối với Transport (Boat): intProductID = 101, intTypeID = 3
    // Đối với Excursion (Flight): intProductID = 102 (hoặc tùy loại, tạm thời để 101/102 tùy thuộc vào loại hình)
    const tourQuery = useGetListTourPriceItemLevelInAd({
        strFilterServiceName: appliedFilters.serviceName || "",
        dtmFilterDateFrom: appliedFilters.dateFrom || "2026-01-01",
        dtmFilterDateTo: appliedFilters.dateTo || "2026-12-31",
        intProductID: appliedFilters.supplierType === "Transport" ? 101 : 100,
        intTypeID: 3,
        intCateID: appliedFilters.category || null,
        strListCityCode: appliedFilters.destination ? `${appliedFilters.destination},` : null,
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
            alert("Vui lòng chọn khoảng ngày (Date from - Date to) trước khi lọc!");
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
                isLoading={tariffLoading || tariffFetching}
            />

            {/* Hiển thị bảng dữ liệu hoặc màn hình loading, báo lỗi */}
            {tariffLoading ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center text-gray-500 font-medium">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#004b91] mr-3"></div>
                    Đang tải dữ liệu...
                </div>
            ) : tariffError ? (
                <div className="bg-white rounded-xl border border-red-200 shadow-sm p-12 text-center text-red-500 font-medium bg-red-50/20">
                    Có lỗi xảy ra khi tải dữ liệu.
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-sm">
                                <thead>
                                    <tr className="bg-blue-50/70 border-b border-gray-200">
                                        <th className="px-4 py-3 font-semibold text-gray-600 text-center w-12">STT</th>
                                        <th className="px-4 py-3 font-semibold text-gray-600 w-1/4">Hotel name</th>
                                        <th className="px-4 py-3 font-semibold text-gray-600 w-1/4">Room name</th>
                                        <th className="px-4 py-3 font-semibold text-gray-600 text-center">Date from</th>
                                        <th className="px-4 py-3 font-semibold text-gray-600 text-center">Date to</th>
                                        <th className="px-4 py-3 font-semibold text-gray-600 text-right">Price</th>
                                        <th className="px-4 py-3 font-semibold text-gray-600 text-right">Price SGL</th>
                                        <th className="px-4 py-3 font-semibold text-gray-600 text-right">Price Dbl</th>
                                        <th className="px-4 py-3 font-semibold text-gray-600 text-right">Price Child</th>
                                        <th className="px-4 py-3 font-semibold text-gray-600 text-center">Remark</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-[13px] text-gray-700">
                                    {!appliedFilters.dateFrom || !appliedFilters.dateTo ? (
                                        <tr>
                                            <td colSpan={10} className="py-12 text-center text-amber-500 font-medium bg-amber-50/10">
                                                Vui lòng chọn khoảng ngày để xem dữ liệu.
                                            </td>
                                        </tr>
                                    ) : tariffFetching ? (
                                        <tr>
                                            <td colSpan={10} className="py-12 text-center text-gray-500 font-medium bg-gray-50/50">
                                                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#004b91] mr-3 align-middle"></div>
                                                Đang tìm kiếm...
                                            </td>
                                        </tr>
                                    ) : !tariffData || tariffData.length === 0 ? (
                                        <tr>
                                            <td colSpan={10} className="py-12 text-center text-gray-400 font-medium bg-gray-50/50">
                                                Không có dữ liệu .
                                            </td>
                                        </tr>
                                    ) : (
                                        tariffData.map((row: any, idx: number) => {
                                            const span = hotelGroupSpans[idx];
                                            const hotelName = safeText(row.strSupplierName || "---");
                                            const hotelRating = safeText(row.strEasiaCateName) || "";
                                            const displayHotelName = hotelRating ? `${hotelName} (${hotelRating})` : hotelName;
                                            const hotelAddress = safeText(row.strSupplierAddress || "");
                                            const hotelWebsite = safeText(row.strSupplierWeb || "");

                                            const roomName = safeText(row.strItemTypeName || "---");
                                            const dateFrom = fDateTariff(row.dtmDateFrom || row.dateFrom);
                                            const dateTo = fDateTariff(row.dtmDateTo || row.dateTo);

                                            const priceVal = row.dblPrice !== undefined ? row.dblPrice : row.price;
                                            const priceSglVal = row.dblPriceSGL !== undefined ? row.dblPriceSGL : row.priceSgl;
                                            const priceDblVal = row.dblPriceTPL !== undefined ? row.dblPriceTPL : row.priceDbl;
                                            const priceChildVal = row.dblPriceChild !== undefined ? row.dblPriceChild : row.priceChild;

                                            const remark = safeText(row.strRemark);

                                            return (
                                                <tr key={row.strSupplierMappingPriceGUID || idx} className="hover:bg-slate-50/40 transition-colors">
                                                    <td className="px-4 py-4 text-center text-gray-400 font-medium border-r border-gray-100">
                                                        {row.No || idx + 1}
                                                    </td>

                                                    {/* Ô hiển thị tên khách sạn được gộp dòng dựa trên số lượng phòng trùng nhau */}
                                                    {span !== undefined ? (
                                                        <td
                                                            rowSpan={span}
                                                            className="px-4 py-4 font-semibold text-gray-900 border-r border-gray-100 align-middle text-center bg-white"
                                                        >
                                                            <div className="space-y-1 flex flex-col items-center justify-center">
                                                                <span className="text-[#004b91] uppercase block">{displayHotelName}</span>
                                                                {hotelAddress && <p className="text-gray-500 font-normal text-xs">{hotelAddress}</p>}
                                                                {hotelWebsite && (
                                                                    <a
                                                                        href={hotelWebsite}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="text-blue-500 text-xs font-normal hover:underline block"
                                                                    >
                                                                        {hotelWebsite}
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </td>
                                                    ) : null}

                                                    <td className="px-4 py-4 border-r border-gray-100 font-medium">
                                                        {roomName}
                                                    </td>
                                                    <td className="px-4 py-4 text-center border-r border-gray-100 text-gray-500">
                                                        {dateFrom}
                                                    </td>
                                                    <td className="px-4 py-4 text-center border-r border-gray-100 text-gray-500">
                                                        {dateTo}
                                                    </td>
                                                    <td className="px-4 py-4 text-right font-medium border-r border-gray-100 text-gray-500">
                                                        {fCurrency(priceVal, "VND")}
                                                    </td>
                                                    <td className="px-4 py-4 text-right font-medium border-r border-gray-100 text-gray-500">
                                                        {fCurrency(priceSglVal, "VND")}
                                                    </td>
                                                    <td className="px-4 py-4 text-right font-medium border-r border-gray-100 text-gray-500">
                                                        {fCurrency(priceDblVal, "VND")}
                                                    </td>
                                                    <td className="px-4 py-4 text-right font-medium border-r border-gray-100 text-gray-500">
                                                        {fCurrency(priceChildVal, "VND")}
                                                    </td>
                                                    <td className="px-4 py-4 text-center text-gray-400">
                                                        {remark || "--"}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

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