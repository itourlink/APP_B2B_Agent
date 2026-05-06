import PrimaryButton from "@/components/button/primary-button";
import CustomFilter from "@/components/form/custom-filter"
import { Building2, Calendar, Hash, RotateCcw, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { TableCore, type ColumnDef } from "@/components/table/table-core";
import Pagination from "@/components/pagination/pagination";
import { REFUNDS_OPTIONS } from "@/utils/oprion-data";
import { fDateTime } from "@/utils/format-time";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useReportCommissionByAgentHost } from "@/hooks/actions/useUser";
import { useUserStore } from "@/zustand/useUserStore";
import type { IReportPendingApproval } from "@/hooks/interfaces/user";

const ReportPendingApproval = () => {
    const user = useUserStore((state) => state.user);
    const [filters, setFilters] = useState({
        startTime: "",
        endTime: "",
        refund: "",
        nameGroup: "",
        idOrder: "",
    });

    const [appliedFilters, setAppliedFilters] = useState(filters);

    const [page, setPage] = useState(1);
    const pageSize = 5;
    const { data, isLoading, isError } = useQuery({
        queryKey: [QUERY_KEYS.USER.LIST_REPORT_COMMISSION_BY_AGENT_HOST, page, appliedFilters],
        queryFn: () =>
            useReportCommissionByAgentHost({
                strPayableBookingItemGUID: null,
                strFilterAgentName: null,
                strFilterBookingCode: appliedFilters?.idOrder || null,
                strFilterGroupName: appliedFilters?.nameGroup || null,
                dtmFilterDateFrom: appliedFilters?.startTime || null,
                dtmFilterDateTo: appliedFilters?.endTime || null,
                intAgentHostPaymentTypeID: appliedFilters?.refund || null,
                intPaymentStatusID: "2,3",
                strPartnerCompanyGUID: user?.strCompanyGUID,
                strPartnerMemberGUID: null,
                strPaidBookingItemGUID: null,
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
            refund: "",
            nameGroup: "",
            idOrder: "",
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


    const colDefs: ColumnDef<IReportPendingApproval>[] = [
        {
            field: "No",
            headerName: "STT",
            render: (value) => <span className="text-gray-400 font-medium">{value}</span>,
        },
        {
            field: "strServiceName",
            headerName: "Tên dịch vụ",
            render: (_, row) => (
                <div className="space-y-1.5 py-2 min-w-[320px]">
                    <div className="text-[#004b91] font-bold text-[13px] leading-snug flex items-start gap-1">
                        {row?.strServiceName}
                    </div>

                    <div className="space-y-0.5 ml-1 border-l-2 border-gray-100 pl-2">
                        <div className="text-[11px] text-gray-500 font-medium uppercase tracking-tighter">
                            Tên nhà cung cấp
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#4e6d9a] font-semibold">
                            <Building2 size={13} className="text-[#4e6d9a]" />
                            {row?.strCompanyName || "null"}
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-brand-600 font-medium ml-1 pl-2">
                        <Hash size={12} />
                        <span className="text-gray-400 mr-1">Mã Booking/Tên nhóm:</span>
                        <span className="text-[#004b91]">{row?.strOrderAgentHostCode || "null"} / {row?.strGroupName}</span>
                    </div>
                </div>
            ),
        },
        {
            field: "strAgentHostPaymentTypeName",
            headerName: "Loại hoàn trả",
            render: (value) => (
                <div className="text-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md border border-gray-200 min-w-[100px]">
                    {value}
                </div>
            )
        },
        {
            field: "No",
            headerName: "Ngày bắt đầu - Ngày kết thúc",
            render: (_, row) => (
                <div className="text-xs text-gray-500 flex items-center gap-1.5 min-w-[170px]">
                    <Calendar size={13} className="text-gray-400" />
                    <span>{fDateTime(row.dtmDateFrom)} - {fDateTime(row.dtmDateTo)}</span>
                </div>
            ),
        },
        {
            field: "intTotalPax",
            headerName: "Tổng số khách",
            render: (value) => (
                <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
                    <Users size={14} /> {value} pax
                </div>
            )
        },
        {
            field: "strPaymentStatusName",
            headerName: "Trạng thái",
            render: (value) => {
                const isPaid = value === "Hoàn tất";
                return (
                    <span className={`min-w-[100px] text-center px-3 py-1 rounded-2xl text-[11px] font-medium ${isPaid ? "bg-green-50 text-green-600 border border-green-100" : "bg-orange-50 text-orange-600 border border-orange-100"
                        }`}>
                        {value}
                    </span>
                );
            },
        },
        {
            field: "IsHold",
            headerName: "Được Giữ",
            render: (value) => {
                return (
                    <span className={`min-w-[100px] text-center px-3 py-1 rounded-2xl text-[11px] font-medium ${value ? "bg-green-50 text-green-600 border border-green-100" : "bg-orange-50 text-orange-600 border border-orange-100"
                        }`}>
                        {value ? "Đang giữ" : "Không"}
                    </span>
                );
            },
        },
        {
            field: "dtmDateDeadlineToCheck",
            headerName: "Deadline",
            render: (value) => (
                <div className="text-xs text-gray-500 flex items-center gap-1.5 min-w-[150px]">
                    <Calendar size={13} className="text-gray-400" />
                    {fDateTime(value) || "null"}
                </div>
            ),
        },
        {
            field: "dblPayableBalance",
            headerName: "Tổng số tiền khả dụng",
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
        <div>
            <CustomFilter
                onChangeFilters={onChangeFilters}

                listSelect={[
                    {
                        key: "refund",
                        label: "Loại hoàn trả",
                        listOptions: REFUNDS_OPTIONS,
                        placeholder: "refund",
                        value: filters.refund,
                    },
                ]}
                search={[
                    {
                        keySearch: "idOrder",
                        value: filters.idOrder,
                        placeHoder: "Mã đặt",
                    }, {
                        keySearch: "nameGroup",
                        value: filters.nameGroup,
                        placeHoder: "Tên đại lý",
                    },
                ]}
                time={{
                    keyStartTime: "startTime",
                    keyendTime: "endTime",
                    startTime: filters.startTime ? new Date(filters.startTime).getTime() : 0,
                    endTime: filters.endTime ? new Date(filters.endTime).getTime() : 0,
                }}

            />

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

export default ReportPendingApproval