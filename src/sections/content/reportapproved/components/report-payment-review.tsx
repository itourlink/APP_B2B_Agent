import { Building2, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { TableCore, type ColumnDef } from "@/components/table/table-core";
import Pagination from "@/components/pagination/pagination";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useListPaidBookingItem } from "@/hooks/actions/useUser";
import { useUserStore } from "@/zustand/useUserStore";
import type { IReportPayReview } from "@/hooks/interfaces/user";
import { useToastStore } from "@/zustand/useToastStore";

const ReportPaymentReview = () => {
    const user = useUserStore((state) => state.user);
    const { showToast } = useToastStore()
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const { data, isLoading, isError } = useQuery({
        queryKey: [QUERY_KEYS.USER.LIST_PAID_BOOKING_ITEM, page],
        queryFn: () =>
            useListPaidBookingItem({
                strPaidBookingItemGUID: null,
                strCompanyGUID: null,
                strAgentCode: user?.strAgentCode,
                IsPaid: true,
                IsAgentConfirmed: false,
                intCurPage: page,
                intPageSize: pageSize,
                strOrder: null,
                tblsReturn: "[0]"
            }),
        placeholderData: keepPreviousData,
    });
    const listData = data?.[0] ?? [];
    const totalRecords = listData?.[0]?.intTotalRecords || 0;
    const totalPages = Math.ceil(totalRecords / pageSize);

    useEffect(() => {
        if (page > totalPages) {
            setPage(1);
        }
    }, [totalPages]);


    const colDefs: ColumnDef<IReportPayReview>[] = [
        {
            field: "No",
            headerName: "STT",
            render: (value) => <span className="text-gray-400 font-medium">{value}</span>,
        },
        {
            field: "strCompanyName",
            headerName: "Tên nhà cung cấp",
            render: (_, row) => (
                <div className="space-y-0.5 py-1 min-w-50 text-xs">
                    <div className="flex items-center gap-2 text-[#004b91] font-semibold text-sm">
                        <Building2 size={14} className="text-[#4e6d9a]" />
                        <span className="uppercase tracking-tight">{row?.strCompanyName}</span>
                    </div>
                </div>
            ),
        },
        {
            field: "strPaidTitle",
            headerName: "Tiêu đề",
            render: (value) => (
                <div className="flex items-center gap-2 py-1">
                    <div className="p-1.5 bg-gray-50 text-gray-500 rounded-md">
                        <ClipboardList size={14} />
                    </div>
                    <span className="font-semibold text-gray-800 hover:text-[#004b91] cursor-pointer transition-colors">
                        {value}
                    </span>
                </div>
            )
        },
        {
            field: "dblPaidAmount",
            headerName: "Tổng giá",
            render: (value) => (
                <div className="">
                    {new Intl.NumberFormat('vi-VN').format(
                        Number.isFinite(Number(value)) ? Number(value) : 0
                    )}{" "}
                    <span className="text-[10px] align-top">đ</span>
                </div>
            ),
        },
        {
            field: "No",
            headerName: "Thao tác",
            render: () => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => showToast("info", "Sắp ra mắt")}
                        className="cursor-pointer px-4 py-1.5 bg-[#004b91] text-white text-[13px] font-medium rounded hover:bg-[#003d76] transition-all shadow-sm"
                    >
                        Xác nhận
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <TableCore
                rowData={listData ?? []}
                columnDefs={colDefs}
                loading={isLoading}
            />

            {!isError && (
                <Pagination
                    currentPage={page}
                    onPageChange={(value) => setPage(value)}
                    totalPages={totalPages || 1}
                />
            )}
        </div>
    )
}

export default ReportPaymentReview