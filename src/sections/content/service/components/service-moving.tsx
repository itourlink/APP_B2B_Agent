import Pagination from "@/components/pagination/pagination";
import { TableCore, type ColumnDef } from "@/components/table/table-core";
import { fDateTime } from "@/utils/format-time";
import { useEffect, useState } from "react";
import { User, Building2, Calendar, Banknote } from "lucide-react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useListAgentHostServiceItem } from "@/hooks/actions/useUser";
import { useUserStore } from "@/zustand/useUserStore";

interface Props {
    appliedFilters?: {
        idOrder: string;
        startTime: string;
        endTime: string;
    };
}

const ServiceMoving = ({ appliedFilters }: Props) => {
    const user = useUserStore((state) => state.user);
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
                intBookingStatusID: "3",
                intCurrencyID: user?.intCurrencyID,
                strFilterAgent: null,
                strWhere: null,
                intType: 1,
                intLangID: user?.intLangID,
                intCurPage: page,
                intPageSize: pageSize,
                strOrder: null,
                tblsReturn: "[0]",
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

    const colDefs: ColumnDef<any>[] = [
        {
            field: "No",
            headerName: "STT",
            render: (value) => <span className="text-gray-400 font-medium">{value}</span>,
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
            headerName: "Tên dịch vụ",
            render: (_, row) => {
                const parser = new DOMParser();
                const htmlDoc = parser.parseFromString(row.strType, "text/html");
                const divs = htmlDoc.querySelectorAll("div");
                const categoryText = divs[0]?.textContent.replace("Category:", "").trim();
                const joinTypeText = divs[1]?.textContent.replace("Join Type:", "").trim();

                return (
                    <div className="min-w-[250px] space-y-1">
                        <div className="font-bold text-[#004b91] leading-tight uppercase text-sm">
                            {row.strServiceName}
                        </div>
                        <div className="text-[11px] flex gap-2">
                            <span className="text-gray-500 font-bold text-xs italic">
                                Category: <span className="text-yellow-500 not-italic">{categoryText}</span>
                            </span>
                            <span className="text-gray-500 font-bold text-xs italic">
                                Join Type: <span className="text-gray-800 not-italic">{joinTypeText}</span>
                            </span>
                        </div>
                        <div className="text-xs text-brand-600 mt-1 flex items-center gap-1">
                            <Calendar size={12} /> <span>{fDateTime(row?.dtmDateFrom)} - {fDateTime(row?.dtmDateTo)}</span>
                        </div>
                    </div>
                );
            }
        },

        {
            field: "agentHost",
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
            field: "groupSize",
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
                <div className="">
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
            render: (value) => (
                <div className={`min-w-[100px] ${value > 0 ? "text-red-500" : "text-gray-800"}`}>
                    {new Intl.NumberFormat("vi-VN").format(value)}{" "}
                    <span className="text-[10px] align-top">đ</span>
                </div>
            ),
        },

        {
            field: "dblPricePaid",
            headerName: "Tổng đã trả",
            render: (value) => (
                <div className="min-w-[100px] text-green-600">
                    {new Intl.NumberFormat("vi-VN").format(value || 0)}{" "}
                    <span className="text-[10px] align-top">đ</span>
                </div>
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
            field: "dtmDateDeadline",
            headerName: "Thời hạn",
            render: (_, row) => {
                const createdDate = row.dtmCreatedDate ? new Date(row.dtmCreatedDate) : null;
                const deadlineDate = row.dtmDateDeadline ? new Date(row.dtmDateDeadline) : null;

                const isExpired = createdDate && deadlineDate ? deadlineDate > createdDate : false;

                return (
                    <div
                        className={`text-xs flex justify-center items-center gap-1.5 min-w-[150px] ${isExpired ? "text-red-500" : "text-gray-500"
                            }`}
                    >
                        <Calendar size={13} className="text-gray-400" />
                        {isExpired
                            ? "Đã hết hạn"
                            : row.dtmDateDeadline
                                ? fDateTime(row.dtmDateDeadline)
                                : "Không có"}
                    </div>
                );
            },
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
        </div>
    )
}

export default ServiceMoving;