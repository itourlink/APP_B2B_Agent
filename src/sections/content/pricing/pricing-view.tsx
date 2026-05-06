import Pagination from "@/components/pagination/pagination";
import { TableCore, type ColumnDef } from "@/components/table/table-core";
import { Edit3, Tag, Trash2 } from "lucide-react";
import { useState } from "react";

const PricingView = () => {
    const [filters, setFilters] = useState({
        page: String(1),
        limit: String(50),
    });
    //   const { auditLog, alLoading, alEmpty } = useAuditLog(filters);
    const colDefs: ColumnDef<any>[] = [
        {
            field: "stt",
            headerName: "STT",
            render: (value) => <span className="text-gray-400 font-medium">{value}</span>
        },
        {
            field: "channelPriceCode",
            headerName: "Mã Giá Kênh",
            render: (value) => (
                <span className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                    {value || "---"}
                </span>
            )
        },
        {
            field: "channelPriceName",
            headerName: "Tên giá kênh",
            render: (value) => (
                <div className="flex items-center gap-2 py-1 min-w-[200px]">
                    <div className="p-1.5 bg-blue-50 text-blue-500 rounded-md">
                        <Tag size={14} />
                    </div>
                    <span className="text-gray-800 text-sm font-semibold">
                        {value}
                    </span>
                </div>
            )
        },
        {
            field: "remark",
            headerName: "Nhận xét",
            render: (value) => (
                <div className="text-xs text-gray-500 italic max-w-[250px] line-clamp-2">
                    {value || "---"}
                </div>
            )
        },
        {
            field: "actions",
            headerName: "Hành động",
            render: () => (
                <div className="flex items-center gap-3">
                    <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        <Edit3 size={16} />
                    </button>
                    <button className="text-red-500 hover:text-red-700 transition-colors">
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    // const mockData = [
    //     {
    //         stt: 1,
    //         channelPriceCode: "CP-OTA-001",
    //         channelPriceName: "Giá đại lý OTA - Mùa cao điểm",
    //         remark: "Áp dụng cho các booking từ tháng 6 đến tháng 8.",
    //     },
    //     {
    //         stt: 2,
    //         channelPriceCode: "CP-CORP-002",
    //         channelPriceName: "Giá khách đoàn Doanh nghiệp",
    //         remark: "Yêu cầu tối thiểu 20 khách trở lên.",
    //     },
    //     {
    //         stt: 3,
    //         channelPriceCode: "CP-WEB-003",
    //         channelPriceName: "Giá niêm yết Website",
    //         remark: null, // Sẽ hiển thị ---
    //     },
    // ];

    const mockData: any[] = [];
    const auditLog = {
        result: mockData,
        meta: {
            pageCount: 5,
        },
    };

    const alLoading = false;
    const alEmpty = false;

    return (
        <div className="pt-4">
            <TableCore
                rowData={auditLog?.result ?? []}
                columnDefs={colDefs}
                loading={alLoading}
            />

            {!alEmpty && (
                <Pagination
                    currentPage={Number(filters.page)}
                    onPageChange={(value) => {
                        setFilters({
                            ...filters,
                            page: String(value),
                        });
                    }}
                    totalPages={Number(auditLog?.meta?.pageCount)}
                />
            )}
        </div>
    )
}

export default PricingView