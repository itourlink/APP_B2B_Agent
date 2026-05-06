import Pagination from "@/components/pagination/pagination";
import { TableCore, type ColumnDef } from "@/components/table/table-core";
import { fDateTime } from "@/utils/format-time";
import { useEffect, useState } from "react";
import { User, Building2, Calendar, Banknote } from "lucide-react";
import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useListAgentHostServiceItem } from "@/hooks/actions/useUser";
import { useUserStore } from "@/zustand/useUserStore";
import type { IServicePropose } from "@/hooks/interfaces/user";
import PanelPopup from "@/components/popup/panel-popup";
import ListPayable from "./list-payable";

interface Props {
    appliedFilters?: {
        idOrder: string;
        startTime: string;
        endTime: string;
    };
}

const ServicePropose = ({ appliedFilters }: Props) => {
    const user = useUserStore((state) => state.user);
    const router = useRouter()
    const [item, setItem] = useState<IServicePropose | null>(null);
    const [open, setOpen] = useState({
        payable: false,
    })
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const { data, isLoading, isError } = useQuery({
        queryKey: [QUERY_KEYS.USER.LIST_AGENT_HOST_SERVICE_ITEM, page, appliedFilters],
        queryFn: () =>
            useListAgentHostServiceItem({
                strMemberAgentGUID: user?.strUserGUID,
                strCompanyAgentGUID: user?.strCompanyGUID,
                strCompanyOwnerGUID: null,
                strAgentHostServiceItemGUID: null,
                strFilterDateFrom: appliedFilters?.startTime || null,
                strFilterDateTo: appliedFilters?.endTime || null,
                strAgentHostServiceItemCode: appliedFilters?.idOrder || null,
                intBookingStatusID: "6",
                intCurrencyID: user?.intCurrencyID,
                strFilterAgent: null,
                strWhere: null,
                intType: 1,
                intLangID: user?.intLangID,
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
    const colDefs: ColumnDef<IServicePropose>[] = [
        {
            field: "No",
            headerName: "STT",
            render: (value) => <span>{value}</span>
        },

        {
            field: "strAgentHostServiceItemCode",
            headerName: "Mã",
            render: (value) => (
                <span className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                    {value || "---"}
                </span>
            )
        },

        {
            field: "strServiceName",
            headerName: "Tên dịch vụ",
            render: (_, row) => {
                return (
                    <button onClick={() => router.replaceParams(paths.content.detailService, { item: row })} className="min-w-80 cursor-pointer">
                        <div className="font-bold text-[#004b91] leading-tight uppercase text-sm">{row?.strServiceName}</div>
                        <div className="text-xs text-brand-600 mt-1 flex items-center gap-1">
                            <Calendar size={12} /> <span>{fDateTime(row.dtmDateFrom)} - {fDateTime(row.dtmDateTo)}</span>
                        </div>
                    </button>
                )
            }
        },

        {
            field: "No",
            headerName: "Đại lý / Công ty",
            render: (_, row) => (
                <div className="space-y-1 py-1 min-w-50">
                    <div className="flex items-center gap-1.5 font-medium text-gray-700">
                        <User size={14} className="text-gray-400" /> {row.strUserFirstName} {row.strUserLastName}
                    </div>
                    <div className="text-[11px] text-gray-400 italic ml-5">{row.strUserEmail}</div>
                    <div className="flex items-center gap-1.5 text-xs text-[#4e6d9a] font-semibold ml-5">
                        <Building2 size={13} /> {row.strAgentHostName}
                    </div>
                </div>
            )
        },

        {
            field: "No",
            headerName: "Quy mô",
            render: (_, row) => (
                <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 min-w-[100px]">
                    <div
                        className=""
                        dangerouslySetInnerHTML={{ __html: row?.intQuantity }}
                    ></div>
                </div>
            )
        },

        {
            field: "dblPriceTotal",
            headerName: "Tổng giá",
            render: (value) => (
                <div className="min-w-[100px] flex justify-center">
                    {new Intl.NumberFormat('vi-VN').format(
                        Number.isFinite(Number(value)) ? Number(value) : 0
                    )}{" "}
                    <span className="text-[10px] align-top">đ</span>
                </div>
            ),
        },

        {
            field: "dblPaymentAmount",
            headerName: "Phải trả",
            render: (_, row) => (
                <button onClick={() => {
                    setItem(row)
                    setOpen((prev) => ({ ...prev, payable: true }))
                }} className={`${Number(row?.dblPaymentAmount) > 0 ? "text-red-500" : "text-green-600"} min-w-[100px] cursor-pointer border rounded-2xl`}>
                    {new Intl.NumberFormat('vi-VN').format(
                        Number.isFinite(Number(row?.dblPaymentAmount)) ? Number(row?.dblPaymentAmount) : 0
                    )}{" "}
                    <span className="text-[10px] align-top">đ</span>
                </button>
            ),
        },

        {
            field: "dblPriceTotalAgentCom",
            headerName: "Hoa hồng",
            render: (value) => (
                <div className="flex items-center gap-1 text-orange-600 min-w-[100px]">
                    <Banknote size={14} />
                    {value ? `${new Intl.NumberFormat('vi-VN').format(value)} đ` : "---"}
                </div>
            )
        },

        {
            field: "dtmDateDeadline",
            headerName: "Thời hạn",
            render: (value) => (
                <div className={`text-xs min-w-[150px] ${value ? "" : "text-gray-500"} flex items-center gap-1.5`}>
                    <Calendar size={13} className="text-gray-400" />{value ? fDateTime(value) : "---"}
                </div>
            ),
        },

        {
            field: "dtmCreatedDate",
            headerName: "Ngày đặt",
            render: (value) => (
                <div className={`text-xs min-w-[150px] ${value ? "" : "text-gray-500"} flex items-center gap-1.5`}>
                    <Calendar size={13} className="text-gray-400" />{value ? fDateTime(value) : "---"}
                </div>
            ),
        },
    ];

    return (
        <div className="pt-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <TableCore
                    rowData={listData ?? []}
                    columnDefs={colDefs}
                    loading={isLoading}
                />
            </div>

            {!isError && (
                <Pagination
                    currentPage={page}
                    onPageChange={(value) => setPage(value)}
                    totalPages={totalPages || 1}
                />
            )}

            {open.payable && (
                <PanelPopup title='List Payable' open={open.payable} onClose={() => setOpen((prev) => ({ ...prev, payable: false }))}>
                    <ListPayable item={item} />
                </PanelPopup>
            )}
        </div>
    )
}

export default ServicePropose;