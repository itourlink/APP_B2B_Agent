import PrimaryButton from "@/components/button/primary-button";
import Pagination from "@/components/pagination/pagination";
import PanelPopup from "@/components/popup/panel-popup";
import { TableCore, type ColumnDef } from "@/components/table/table-core";
import { fDateTime } from "@/utils/format-time";
import { Calendar, Phone, PlusCircle, ShieldCheck, User } from "lucide-react";
import { useEffect, useState } from "react";
import AddUser from "./add-user";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import type { IListUserInCompanyOwner } from "@/hooks/interfaces/user";
import { useListUserInCompanyOwner } from "@/hooks/actions/useUser";

const UserManagement = () => {
    const [open, setOpen] = useState({
        add: false
    })
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const { data, isLoading, isError } = useQuery({
        queryKey: [QUERY_KEYS.USER.LIST_USER_IN_COMPANY_OWNER, page],
        queryFn: () =>
            useListUserInCompanyOwner({
                strOrder: null,
                strFilterUserName: null,
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

    const colDefs: ColumnDef<IListUserInCompanyOwner>[] = [
        {
            field: "No",
            headerName: "STT",
            render: (value) => <span className="font-medium text-gray-400">{value}</span>
        },

        {
            field: "strFullName",
            headerName: "Người dùng",
            render: (_, row) => (
                <div className="space-y-1 py-1 min-w-50">
                    <div className="flex items-center gap-1.5 font-medium text-gray-700">
                        <User size={14} className="text-gray-400" /> {row.strFullName}
                    </div>
                    <div className="text-[11px] text-gray-400 italic ml-5">{row.strEmail}</div>
                </div>
            )
        },

        {
            field: "strMobile",
            headerName: "Liên hệ",
            render: (value) => (
                <div className="flex items-center gap-1.5 text-gray-700 text-sm">
                    <div className="p-1 bg-green-50 text-green-600 rounded">
                        <Phone size={12} />
                    </div>
                    {value || "---"}
                </div>
            )
        },

        {
            field: "strMemberRoleName",
            headerName: "Vai trò",
            render: (value) => (
                <span className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                    {value || "---"}
                </span>
            )
        },

        {
            field: "strMemberRoleName",
            headerName: "Quyền quản trị",
            render: (value) => (
                <div className="flex items-center gap-1.5">
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold ${value === 'Admin'
                        ? "bg-purple-50 text-purple-600 border border-purple-100"
                        : "bg-blue-50 text-blue-600 border border-blue-100"
                        }`}>
                        <ShieldCheck size={12} />
                        {value}
                    </span>
                </div>
            )
        },

        {
            field: "dtmCreatedDate",
            headerName: "Ngày tạo",
            render: (value) => (
                <div className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Calendar size={13} className="text-gray-400" />
                    {fDateTime(value)}
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="pt-4">
                <PrimaryButton
                    text="Thêm người dùng"
                    isLoading={false}
                    className="bg-[#4e6d9a] hover:bg-[#3d567a] rounded-lg w-fit text-sm font-medium transition shadow-sm"
                    prefixIcon={<PlusCircle size={18} />}
                    onClick={() => { setOpen((prev) => ({ ...prev, add: true })) }}
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


            {open.add && (
                <PanelPopup open={open.add} onClose={() => setOpen((prev) => ({ ...prev, add: false }))} title="Thêm người dùng">
                    <AddUser onClose={() => setOpen((prev) => ({ ...prev, add: false }))} />
                </PanelPopup>
            )}
        </div>
    )
}

export default UserManagement