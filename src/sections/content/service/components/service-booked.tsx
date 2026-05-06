import Pagination from "@/components/pagination/pagination";
import PanelPopup from "@/components/popup/panel-popup";
import { TableCore, type ColumnDef } from "@/components/table/table-core";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useListAgentHostServiceItem } from "@/hooks/actions/useUser";
import type { IServiceBooked } from "@/hooks/interfaces/user";
import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";
import { fDateTime } from "@/utils/format-time";
import { useUserStore } from "@/zustand/useUserStore";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Banknote, Building2, Calendar, User } from "lucide-react";
import { useEffect, useState } from "react";
import ListPayable from "./list-payable";
import ListPaid from "./list-paid";

interface Props {
    appliedFilters?: {
        idOrder: string;
        startTime: string;
        endTime: string;
    };
}

const ServiceBooked = ({ appliedFilters }: Props) => {
    const user = useUserStore((state) => state.user);
    const router = useRouter();
    const [item, setItem] = useState<IServiceBooked | null>(null);
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const [open, setOpen] = useState({
        payable: false,
        paid: false
    })
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
                intBookingStatusID: "2",
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

    const colDefs: ColumnDef<IServiceBooked>[] = [
        {
            field: "No",
            headerName: "STT",
            render: (value) => <span className="text-gray-500 font-medium">{value}</span>,
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
            field: "No",
            headerName: "Tỷ lệ",
            render: (value) => (
                <div className="relative flex items-center justify-center w-10 h-10">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-gray-200" />
                        <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent"
                            strokeDasharray={100} strokeDashoffset={100 - (value || 0)}
                            className="text-blue-400" />
                    </svg>
                    <span className="absolute text-[9px] font-bold text-blue-500">{value || 0}%</span>
                </div>
            ),
        },
        {
            field: "strServiceName",
            headerName: "Tên dịch vụ",
            render: (_, row) => {

                return (
                    <div className="min-w-50">
                        <button onClick={() => router.replaceParams(paths.content.detailService, { item: row })} className="font-bold text-[#004b91] leading-tight uppercase text-sm cursor-pointer">{row.strServiceName}</button>
                        <div className="text-xs text-brand-600 mt-1 flex items-center gap-1">
                            <Calendar size={12} /> <span>{fDateTime(row.dtmDateFrom)} - {fDateTime(row.dtmDateTo)}</span>
                        </div>
                    </div>
                )
            }
        },
        {
            field: "No",
            headerName: "Tên máy chủ đại lý",
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
            field: "strBookingSubStatusName",
            headerName: "Trạng thái",
            render: (value) => (
                <span className="text-xs text-gray-700 whitespace-nowrap">{value}</span>
            )
        },
        {
            field: "No",
            headerName: "Quy mô nhóm",
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
            headerName: "Tổng Số Tiền Phải Trả",
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
            field: "dblPricePaid",
            headerName: "Tổng đã trả",
            render: (_, row) => (
                <button onClick={() => {
                    setItem(row)
                    setOpen((prev) => ({ ...prev, paid: true }))
                }} className="min-w-[100px] text-green-600 min-w-[100px] cursor-pointer border rounded-2xl">
                    {new Intl.NumberFormat("vi-VN").format(row?.dblPricePaid || 0)}{" "}
                    <span className="text-[10px] align-top">đ</span>
                </button>
            ),
        },
        {
            field: "dblPriceTotalAgentCom",
            headerName: "Tổng Tiền Hoa Hồng",
            render: (value) => (
                <div className="flex items-center gap-1 text-orange-600 min-w-[100px]">
                    <Banknote size={14} />
                    {value ? `${new Intl.NumberFormat("vi-VN").format(value)} đ` : "---"}
                </div>
            ),
        },
        {
            field: "dtmCreatedDate",
            headerName: "Ngày đặt",
            render: (value) => (
                <div className="text-xs text-gray-500 flex items-center gap-1.5 min-w-[150px]">
                    <Calendar size={13} className="text-gray-400" />
                    {fDateTime(value)}
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
            {open.paid && (
                <PanelPopup title='List Paid' open={open.paid} onClose={() => setOpen((prev) => ({ ...prev, paid: false }))}>
                    <ListPaid item={item} />
                </PanelPopup>
            )}
        </div>
    )
}

export default ServiceBooked;