import PrimaryButton from "@/components/button/primary-button";
import CustomFilter from "@/components/form/custom-filter"
import { Building2, Calendar, CheckCircle2, Copy, RotateCcw, Search, Trash2, Users, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { TableCore, type ColumnDef } from "@/components/table/table-core";
import Pagination from "@/components/pagination/pagination";
import { fDateTime } from "@/utils/format-time";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useListTourCustomized } from "@/hooks/actions/useUser";
import type { ITourCustomized } from "@/hooks/interfaces/user";
import { useToastStore } from "@/zustand/useToastStore";
import PanelPopup from "@/components/popup/panel-popup";
import DeleteTour from "./components/delele-tour";
import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks/use-router";

const TourProposalsView = () => {
    const router = useRouter()
    const { showToast } = useToastStore()
    const [filters, setFilters] = useState({
        nameTour: "",
    });
    const [open, setOpen] = useState({
        delete: false
    })

    const [appliedFilters, setAppliedFilters] = useState(filters);
    const [item, setItem] = useState<ITourCustomized | null>(null);
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const { data, isLoading, isError } = useQuery({
        queryKey: [QUERY_KEYS.USER.LIST_USER_IN_COMPANY_OWNER, page, appliedFilters],
        queryFn: () =>
            useListTourCustomized({
                strTourCustomizedGUID: null,
                strFilter: appliedFilters?.nameTour || null,
                intTourStepID: 2,
                strCodeChkVer: null,
                intMemberTypeID: 1,
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


    const handleSearch = () => {
        setAppliedFilters(filters)
        setPage(1)
    };

    const handleReset = () => {
        const defaultFilters = {
            nameTour: "",
        };
        setFilters(defaultFilters);
        setAppliedFilters(defaultFilters);
        setPage(1);
    };

    const onChangeFilters = (key: string, value: string | number) => {
        let newValue: string | number = value;

        setFilters((prev) => ({
            ...prev,
            [key]: String(newValue),
        }));
    };


    const colDefs: ColumnDef<ITourCustomized>[] = [
        {
            field: "No",
            headerName: "STT",
            render: (value) => (
                <span className="text-gray-400 font-medium">{value ?? "---"}</span>
            ),
        },
        {
            field: "strTourCode",
            headerName: "Mã",
            render: (value) => (
                <span className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                    {value ?? "---"}
                </span>
            )
        },
        {
            field: "strServiceName",
            headerName: "Tên dịch vụ",
            render: (_, row) => (
                <div className="space-y-0.5 py-1 min-w-[200px] text-xs flex items-center justify-center gap-2">
                    <button
                        onClick={() => router.replaceParams(paths.content.detailTour, { item: row })}
                        className="flex items-center gap-2 text-[#004b91] font-semibold text-sm cursor-pointer"
                    >
                        <Building2 size={14} className="text-[#4e6d9a]" />
                        <span className="uppercase tracking-tight">
                            {row?.strServiceName ?? "---"}
                        </span>
                    </button>

                    <Copy
                        size={14}
                        className="cursor-pointer hover:text-[#004b91]"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(row?.strServiceName ?? "");
                            showToast("success", "Đã sao chép tên dịch vụ")
                        }}
                    />
                </div>
            )
        },
        {
            field: "No",
            headerName: "Ngày",
            render: (_, row) => (
                <div className="text-xs text-gray-500 flex items-center gap-1.5 min-w-[320px]">
                    <Calendar size={13} className="text-gray-400" />
                    <span>
                        {fDateTime(row?.dtmDateFrom) ?? "---"} - {fDateTime(row?.dtmDateTo) ?? "---"}
                    </span>
                </div>
            ),
        },
        {
            field: "intAdult",
            headerName: "Tổng số Pax",
            render: (value) => (
                <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
                    <Users size={14} /> {value ?? 0} pax
                </div>
            )
        },
        {
            field: "strCountryName",
            headerName: "Tên quốc gia",
            render: (value) => (
                <div className="text-sm text-gray-600">
                    {typeof value === "object" ? "---" : value || "---"}
                </div>
            ),
        },
        {
            field: "IsSent",
            headerName: "Được gửi đến Agent Host",
            render: (value) => (
                <div className="flex justify-center min-w-[150px]">
                    {value ? (
                        <CheckCircle2 size={18} className="text-green-500" />
                    ) : (
                        <XCircle size={18} className="text-gray-300" />
                    )}
                </div>
            ),
        },
        {
            field: "dblTotalCostPrice",
            headerName: "Tổng giá",
            render: (value) => (
                <div className="min-w-[100px]">
                    {value
                        ? new Intl.NumberFormat("vi-VN").format(value)
                        : "0"}{" "}
                    <span className="text-[10px] align-top">đ</span>
                </div>
            ),
        },
        {
            field: "dtmCreatedDate",
            headerName: "Ngày tạo",
            render: (value) => (
                <div className="text-xs text-gray-500 flex items-center gap-1.5 min-w-[170px]">
                    <Calendar size={13} className="text-gray-400" />
                    {value ? fDateTime(value) : "---"}
                </div>
            ),
        },
        {
            field: "intVersionID",
            headerName: "Phiên bản",
            render: (value) => (
                <div className="flex justify-center min-w-[80px]">
                    <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-medium">
                        {value ?? "---"}
                    </span>
                </div>
            ),
        },
        {
            field: "No",
            headerName: "Thao tác",
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => showToast("info", "Sắp ra mắt")}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Chỉnh sửa"
                    >
                        <Copy size={18} />
                    </button>

                    <button
                        onClick={() => {
                            setItem(row);
                            setOpen(prev => ({ ...prev, delete: true }));
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Xóa"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex items-end gap-3">

                <CustomFilter
                    onChangeFilters={onChangeFilters}
                    search={[
                        {
                            keySearch: "nameTour",
                            value: filters.nameTour,
                            placeHoder: "Tên dịch vụ",
                        },
                    ]}
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

            {open.delete && (
                <PanelPopup
                    open={open.delete}
                    onClose={() => setOpen(prev => ({ ...prev, delete: false }))}
                    title="Xác nhận tour"
                >
                    <DeleteTour item={item} onClose={() => setOpen(prev => ({ ...prev, delete: false }))} />
                </PanelPopup>
            )}
        </div>
    )
}

export default TourProposalsView