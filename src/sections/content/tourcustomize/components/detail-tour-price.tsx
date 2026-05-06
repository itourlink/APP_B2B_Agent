import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useListTotalPriceForTourCustom } from "@/hooks/actions/useUser";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

interface DetailTourPriceProps {
    item?: any;
}

const DetailTourPrice = ({ item }: DetailTourPriceProps) => {
    const { data, isLoading } = useQuery({
        queryKey: [QUERY_KEYS.USER.LIST_TOTAL_PRICE_FOR_TOUR_CUSTOM, item?.strTourCustomizedGUID],
        queryFn: () =>
            useListTotalPriceForTourCustom({
                strTourCustomizedGUID: item?.strTourCustomizedGUID,
            }),
        placeholderData: keepPreviousData,
    });

    const listData = data?.[0] ?? [];

    // Lấy số lượng khách từ data để hiển thị header
    const firstItem = listData[0];
    const adultLabel = firstItem ? `Adult(${firstItem.intAdult})` : "Adult";
    // Giả sử lấy số lượng TPL Red từ đâu đó, ở đây tôi để mặc định theo hình là (3)
    const tplLabel = "TPL Red (3)";

    return (
        <div className="space-y-4 pt-4 font-sans">
            <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-gray-800 uppercase">Total Price</h3>
                <button className="px-4 py-1.5 bg-[#4a6fa5] text-white text-[11px] font-bold rounded uppercase hover:bg-[#3b5b7e] cursor-pointer transition-colors shadow-sm">
                    Recalculate Price
                </button>
                <button className="px-4 py-1.5 bg-[#4a6fa5] text-white text-[11px] font-bold rounded uppercase hover:bg-[#3b5b7e] cursor-pointer transition-colors shadow-sm">
                    Overview Price
                </button>
            </div>

            <div className="w-full border-b border-gray-200">
                <table className="w-full text-left text-[14px] border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="px-4 py-3 font-semibold text-[#4a6fa5] w-1/3">Description</th>
                            <th className="px-4 py-3 font-semibold text-[#4a6fa5] text-right">{adultLabel}</th>
                            <th className="px-4 py-3 font-semibold text-[#4a6fa5] text-right">{tplLabel}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={3} className="px-4 py-8 text-center text-gray-400">Đang tải dữ liệu...</td>
                            </tr>
                        ) : listData.length > 0 ? (
                            listData.map((row: any, index: number) => {
                                const isTotal = row.IsTotal === true;
                                return (
                                    <tr
                                        key={index}
                                        className={`${isTotal ? "bg-[#f8fbff]" : "bg-white"} transition-colors hover:bg-gray-50/50`}
                                    >
                                        <td className={`px-4 py-3 ${isTotal ? "font-bold text-gray-800" : "text-gray-600"}`}>
                                            {isTotal ? "Total" : row.strDes}
                                        </td>
                                        <td className={`px-4 py-3 text-right ${isTotal ? "font-bold text-gray-800" : "text-gray-600"}`}>
                                            ${row.dblPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className={`px-4 py-3 text-right ${isTotal ? "font-bold text-gray-800" : "text-gray-600"}`}>
                                            {row.dblPriceTPLRed < 0 ? "-" : ""}${Math.abs(row.dblPriceTPLRed || 0).toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td className="px-4 py-8 text-gray-400 italic text-center" colSpan={3}>
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DetailTourPrice;