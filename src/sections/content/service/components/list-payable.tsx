import { TableCore, type ColumnDef } from "@/components/table/table-core";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useListPayableBooking } from "@/hooks/actions/useUser";
import type { IListPayable } from "@/hooks/interfaces/user";
import { fDateTime } from "@/utils/format-time";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
    item: any;
}

const ListPayable = ({ item }: Props) => {
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const { data, isLoading } = useQuery({
        queryKey: [QUERY_KEYS.USER.LIST_PAYABLE_BOOKING, page],
        queryFn: () =>
            useListPayableBooking({
                strAgentHostServiceItemGUID: item?.strAgentHostServiceItemGUID,
                tblsReturn: "[0][1][2]"
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
    const colDefs: ColumnDef<IListPayable>[] = [
        {
            field: "strBookingPaymentTermGUID",
            headerName: "STT",
            render: (_, __, rowIndex) => (
                <span className="text-gray-400 font-medium">
                    {rowIndex + 1}
                </span>
            )
        },

        {
            field: "dblPriceCharge",
            headerName: "Payable",
            render: (value) => (
                <div className="font-semibold text-gray-800 min-w-[100px]">
                    {new Intl.NumberFormat('vi-VN').format(
                        Number(value) || 0
                    )}{" "}
                    <span className="text-[10px] align-top">đ</span>
                </div>
            )
        },

        {
            field: "dtmDateTo",
            headerName: "Deadline",
            render: (value) => (
                <div className="text-xs text-gray-500 flex items-center justify-center gap-1.5 min-w-[170px]">
                    <Calendar size={13} className="text-gray-400" />
                    {value ? fDateTime(value) : "---"}
                </div>
            )
        },

        {
            field: "dtmCreatedDate",
            headerName: "Create Date",
            render: (value) => (
                <div className="text-xs text-gray-500 flex items-center justify-center gap-1.5 min-w-[170px]">
                    <Calendar size={13} className="text-gray-400" />
                    {value ? fDateTime(value) : "---"}
                </div>
            )
        },

        {
            field: "strPaymentTermCode",
            headerName: "Payment Method",
            render: (value) => (
                <span className="bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {value || "---"}
                </span>
            )
        },
    ]

    return (
        <div>

            <div className="flex justify-between items-center mb-6">
                <div className="space-y-1">
                    <div className="text-xs text-gray-400 font-medium uppercase">Service Name</div>
                    <div className="text-[15px] text-gray-800 font-semibold uppercase tracking-tight">
                        {item?.strServiceName}
                    </div>
                </div>


                <div className="space-y-1">
                    <div className="text-xs text-gray-400 font-medium uppercase">Agent host</div>
                    <div className="text-[15px] text-gray-800 font-semibold uppercase tracking-tight">
                        {item?.strAgentHostName}
                    </div>
                </div>

            </div>
            <div className="">
                <TableCore
                    rowData={listData ?? []}
                    columnDefs={colDefs}
                    loading={isLoading}
                />
            </div>
        </div>
    )
}

export default ListPayable