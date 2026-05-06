import Pagination from "@/components/pagination/pagination";
import { TableCore, type ColumnDef } from "@/components/table/table-core";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useListAgentForGroup } from "@/hooks/actions/useUser";
import type { IQuoteGroup } from "@/hooks/interfaces/user";
import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";
import { useUserStore } from "@/zustand/useUserStore";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { FolderOpen, User, Users } from "lucide-react";
import { useEffect, useState } from "react";

const QuoteView = () => {
    const router = useRouter()
    const user = useUserStore((state) => state.user);
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const { data, isLoading, isError } = useQuery({
        queryKey: [QUERY_KEYS.USER.LIST_AGENT_FOR_GROUP, page],
        queryFn: () =>
            useListAgentForGroup({
                strMemberAgentGUID: user?.strUserGUID,
                strCompanyAgentGUID: user?.strCompanyGUID,
                strAgentForGroupGUID: null,
                strGroupCode: null,
                intCurPage: null,
                intPageSize: null,
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

    const colDefs: ColumnDef<IQuoteGroup>[] = [
        {
            field: "No",
            headerName: "STT",
            render: (value) => <span className="text-gray-400 font-medium">{value}</span>
        },
        
        {
            field: "strGroupCode",
            headerName: "Mã",
            render: (value) => (
                <span className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                    {value || "---"}
                </span>
            )
        },

        {
            field: "strAgentGroupName",
            headerName: "Tên nhóm",
            render: (_, row) => (
                <button onClick={() => router.replaceParams(paths.content.detaiQuote, { item: row })} className="cursor-pointer flex items-center gap-2 text-gray-700 min-w-[180px] font-semibold">
                    <FolderOpen size={16} className="text-blue-400" />
                    <span className="text-sm">{row?.strAgentGroupName}</span>
                </button>
            )
        },
        {
            field: "strCustomerName",
            headerName: "Tên khách hàng",
            render: (value) => (
                <div className="flex items-center gap-1.5 font-medium text-gray-700">
                    <User size={14} className="text-gray-400" /> {value}
                </div>
            )
        },

        {
            field: "intTotalPax",
            headerName: "Tổng số Pax",
            render: (value) => (
                <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
                    <Users size={14} /> {value} pax
                </div>
            )
        },

        {
            field: "dblPriceTotal",
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
    ];

    return (
        <div className="pt-4">
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

export default QuoteView