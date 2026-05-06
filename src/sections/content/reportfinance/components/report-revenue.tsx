import PrimaryButton from "@/components/button/primary-button";
import CustomFilter from "@/components/form/custom-filter"
import { Building2, Calendar, FolderOpen, RotateCcw, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import SummaryBadge from "./summary-badge";
import { TableCore, type ColumnDef } from "@/components/table/table-core";
import Pagination from "@/components/pagination/pagination";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useReportReceivableByAgent } from "@/hooks/actions/useUser";
import { useUserStore } from "@/zustand/useUserStore";
import type { IReportRevenue } from "@/hooks/interfaces/user";
import { fDateTime } from "@/utils/format-time";
import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";

const ReportRevenue = () => {
    const router = useRouter();
    const user = useUserStore((state) => state.user);
    const [filters, setFilters] = useState({
        startTime: "",
        endTime: "",
        nameProvider: "",
        idOrder: "",
        nameGroup: ""
    });

    const [appliedFilters, setAppliedFilters] = useState(filters);

    const [page, setPage] = useState(1);
    const pageSize = 5;
    const { data, isLoading, isError } = useQuery({
        queryKey: [QUERY_KEYS.USER.LIST_REPORT_RECEIV_ABLE_BY_AGENT, page, appliedFilters],
        queryFn: () =>
            useReportReceivableByAgent({
                strCompanyGUID: user?.strCompanyGUID,
                strPayableBookingItemGUID: null,
                strFilterAgentHostName: appliedFilters?.nameProvider || null,
                strFilterBookingCode: appliedFilters?.idOrder || null,
                strFilterGroupName: appliedFilters?.nameGroup || null,
                dtmFilterDateFrom: appliedFilters?.startTime || null,
                dtmFilterDateTo: appliedFilters?.endTime || null,
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

    const handleSearch = () => {
        setAppliedFilters(filters)
        setPage(1)
    };

    const handleReset = () => {
        const defaultFilters = {
            startTime: "",
            endTime: "",
            nameProvider: "",
            idOrder: "",
            nameGroup: ""
        };

        setFilters(defaultFilters);
        setAppliedFilters(defaultFilters);
        setPage(1);
    };

    const onChangeFilters = (key: string, value: string | number) => {
        let newValue: string | number = value;

        if ((key === "startTime" || key === "endTime") && value) {
            const date = new Date(Number(value));

            if (key === "startTime") {
                date.setUTCHours(0, 0, 0, 0);
            } else {
                date.setUTCHours(23, 59, 59, 999);
            }

            newValue = date.toISOString();
        }

        setFilters((prev) => ({
            ...prev,
            [key]: String(newValue),
        }));
    };

    const colDefs: ColumnDef<IReportRevenue>[] = [
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
            field: "No",
            headerName: "Mã Booking/Tên nhóm",
            render: (_, row) => (
                <div className="min-w-45">
                    <button onClick={() => router.replaceParams(paths.content.detailReportFinance, { item: row })} className="text-[#004b91] font-medium text-sm hover:underline cursor-pointer">
                        {row.strOrderAgentHostCode}
                    </button>
                    <div className="flex items-center gap-1.5 text-gray-500 text-[11px] mt-1">
                        <FolderOpen size={12} className="text-blue-400" />
                        {row.strGroupName}
                    </div>
                </div>
            ),
        },
        {
            field: "dtmDateFrom",
            headerName: "Ngày bắt đầu",
            render: (value) => (
                <div className="text-xs text-gray-600 flex items-center gap-1.5 min-w-[170px]">
                    <Calendar size={13} className="text-gray-400" />
                    {fDateTime(value)}
                </div>
            ),
        },
        {
            field: "dtmDateTo",
            headerName: "Ngày kết thúc",
            render: (value) => (
                <div className="text-xs text-gray-600 flex items-center gap-1.5 min-w-[170px]">
                    <Calendar size={13} className="text-gray-400" />
                    {fDateTime(value)}
                </div>
            ),
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
                <div className="min-w-[100px] flex justify-center">
                    {new Intl.NumberFormat('vi-VN').format(
                        Number.isFinite(Number(value)) ? Number(value) : 0
                    )}{" "}
                    <span className="text-[10px] align-top">đ</span>
                </div>
            ),
        },
        {
            field: "dblPayableTotal",
            headerName: "Số tiền nhận được",
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
            field: "strPayableStatusName",
            headerName: "Trạng thái trả tiền",
            render: (value) => {
                const isFull = value !== "Not Paid";
                return (
                    <span className={`px-3 py-1 rounded-2xl text-[11px] font-medium border ${isFull ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"
                        }`}>
                        {value}
                    </span>
                );
            },
        },
    ];

    return (
        <div>
            <CustomFilter
                onChangeFilters={onChangeFilters}
                search={[
                    {
                        keySearch: "nameProvider",
                        value: filters.nameProvider,
                        placeHoder: "Tên nhà cung cấp",
                    },
                    {
                        keySearch: "idOrder",
                        value: filters.idOrder,
                        placeHoder: "Mã đặt",
                    },
                    {
                        keySearch: "nameGroup",
                        value: filters.nameGroup,
                        placeHoder: "Tên Nhóm",
                    },
                ]}
                time={{
                    keyStartTime: "startTime",
                    keyendTime: "endTime",
                    startTime: filters.startTime ? new Date(filters.startTime).getTime() : 0,
                    endTime: filters.endTime ? new Date(filters.endTime).getTime() : 0,
                }}
            />

            <div className="flex items-end justify-between">

                <div className="flex gap-2 mt-3">
                    <PrimaryButton
                        text="Tìm kiếm"
                        onClick={handleSearch}
                        className="bg-[#4e6d9a] hover:bg-[#3d567a] rounded-lg px-4 py-2 text-sm w-fit"
                        prefixIcon={<Search size={18} />}
                    />

                    <PrimaryButton
                        text="Reset"
                        onClick={handleReset}
                        className="bg-gray-200 hover:bg-gray-300 text-black rounded-lg px-4 py-2 text-sm w-fit"
                        prefixIcon={<RotateCcw size={18} />}
                    />
                </div>

                <SummaryBadge label="Tổng doanh thu" value={0} />

            </div>

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
        </div>
    )
}

export default ReportRevenue

