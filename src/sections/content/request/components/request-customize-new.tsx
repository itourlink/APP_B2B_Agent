import PrimaryButton from "@/components/button/primary-button";
import Pagination from "@/components/pagination/pagination";
import { TableCore, type ColumnDef } from "@/components/table/table-core";
import { fDateTime } from "@/utils/format-time";
import { Building2, Calendar, ClipboardList, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import AddRequest from "./add-request";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useListSaleRequest } from "@/hooks/actions/useUser";
import { useUserStore } from "@/zustand/useUserStore";
import type { ISaleRequest } from "@/hooks/interfaces/user";
import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";

const RequestCustomizeNew = () => {
    const user = useUserStore((state) => state.user);
    const router = useRouter()
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const { data, isLoading, isError } = useQuery({
        queryKey: [QUERY_KEYS.USER.LIST_SALE_REQUEST, page],
        queryFn: () =>
            useListSaleRequest({
                strSaleRequestGUID: null,
                strCompanyGUID: null,
                intRequestStatusID: 1,
                strAgentCode: user?.strAgentCode,
                strMemberCode: user?.strMemberCode,
                strOrder: null,
                intCurPage: page,
                intPageSize: pageSize,
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

    const [mode, setMode] = useState<"list" | "add">("list");
    const colDefs: ColumnDef<ISaleRequest>[] = [
        {
            field: "No",
            headerName: "STT",
            render: (value) => <span className="text-gray-400 font-medium">{value}</span>

        },

        {
            field: "strRequestCode",
            headerName: "Mã yêu cầu",
            render: (_, row) => (
                <button onClick={() => router.replaceParams(paths.content.detailRequestCustomize, { item: row })} className="cursor-pointer text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                    {row?.strRequestCode || "---"}
                </button>
            )
        },

        {
            field: "strRequestTitle",
            headerName: "Tiêu đề yêu cầu",
            render: (value) => (
                <div className="flex items-center gap-2 py-1 min-w-full">
                    <div className="p-1.5 bg-gray-50 text-gray-500 rounded-md">
                        <ClipboardList size={14} />
                    </div>
                    <span className="font-semibold text-gray-800 transition-colors">
                        {value}
                    </span>
                </div>
            )
        },

        {
            field: "strCompanyName",
            headerName: "Công ty",
            render: (value) => (
                <div className="flex items-center gap-2 text-[#004b91] font-semibold text-sm min-w-full">
                    <Building2 size={14} className="text-[#4e6d9a]" />
                    <span className="uppercase tracking-tight">{value}</span>
                </div>
            )
        },

        {
            field: "dblTotalPrice",
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
            field: "dtmCreatedDate",
            headerName: "Ngày tạo",
            render: (value) => (
                <div className="text-xs text-gray-500 flex items-center gap-1.5 min-w-42.5">
                    <Calendar size={13} className="text-gray-400" />
                    {fDateTime(value)}
                </div>
            ),
        },
    ];

    return (
        <div>
            {mode === "list" && (
                <>
                    <div className="pt-4">
                        <PrimaryButton
                            text="Thêm yêu cầu"
                            isLoading={false}
                            className="bg-[#4e6d9a] hover:bg-[#3d567a] rounded-lg w-fit text-sm font-medium transition shadow-sm"
                            prefixIcon={<PlusCircle size={18} />}
                            onClick={() => setMode("add")}
                        />
                    </div>

                    <div className="mt-4"></div>

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
                </>
            )}

            {mode === "add" && (
                <div className="">
                    <AddRequest onBack={() => setMode("list")} />
                </div>
            )}

        </div>
    )
}

export default RequestCustomizeNew