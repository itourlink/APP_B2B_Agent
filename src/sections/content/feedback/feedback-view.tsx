import PrimaryButton from "@/components/button/primary-button"
import CustomFilter from "@/components/form/custom-filter"
import { STATES_OPTIONS } from "@/utils/oprion-data";
import { RotateCcw, Search } from "lucide-react"
import Pagination from "@/components/pagination/pagination";
import { TableCore, type ColumnDef } from "@/components/table/table-core";
import { Building2, ClipboardList, FolderOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useListAgentRequest } from "@/hooks/actions/useUser";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useUserStore } from "@/zustand/useUserStore";
import type { IFeedBack } from "@/hooks/interfaces/user";

const FeedbackView = () => {

    const [filters, setFilters] = useState({
        startTime: "",
        endTime: "",
        state: "",
    });

    const [appliedFilters, setAppliedFilters] = useState(filters);
    const user = useUserStore((state) => state.user);
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const { data, isLoading, isError } = useQuery({
        queryKey: [QUERY_KEYS.USER.LIST_AGENT_REQUEST, page, appliedFilters],
        queryFn: () =>
            useListAgentRequest({
                strAgentRequestGUID: null,
                strBookingGUID: null,
                strAgentHostBookingGUID: null,
                strMemberGUID: null,
                strPartnerCompanyGUID: user?.strCompanyGUID,
                strPassengerGUID: null,
                isDone: false,
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



    const colDefs: ColumnDef<IFeedBack>[] = [
        {
            field: "No",
            headerName: "STT",
            render: (value) => <span className="text-gray-400 font-medium">{value}</span>,
        },
        {
            field: "strCompanyName",
            headerName: "Tên nhà cung cấp",
            render: (_, row) => (
                <div className="space-y-0.5 py-1 min-w-full text-xs">
                    <div className="flex items-center gap-2 text-[#004b91] font-semibold text-sm">
                        <Building2 size={14} className="text-[#4e6d9a]" />
                        <span className="uppercase tracking-tight">{row?.strCompanyName}</span>
                    </div>
                </div>
            ),
        },
        {
            field: "strGroupName",
            headerName: "Tên nhóm",
            render: (value) => (
                <div className="flex items-center gap-2 text-gray-700 min-w-[180px] font-semibold">
                    <FolderOpen size={16} className="text-blue-400" />
                    <span className="text-sm">{value}</span>
                </div>
            ),
        },
        {
            field: "strTitle",
            headerName: "Tiêu đề",
            render: (value) => (
                <div className="flex items-center gap-2 py-1 min-w-full">
                    <div className="p-1.5 bg-gray-50 text-gray-500 rounded-md">
                        <ClipboardList size={14} />
                    </div>
                    <span className="font-semibold text-gray-800 hover:text-[#004b91] cursor-pointer transition-colors">
                        {value}
                    </span>
                </div>
            )
        },
        {
            field: "strContent",
            headerName: "Nội dung",
            render: (value) => (
                <div className="text-xs text-gray-500 italic min-w-full line-clamp-2">
                    {value}
                </div>
            ),
        },
    ];



    const onChangeFilters = (key: string, value: string | number) => {
        let newValue = value;

        if (key === "startTime" && value) {
            const date = new Date(Number(value));
            date.setUTCHours(0, 0, 0, 0);
            newValue = date.getTime();
        }

        if (key === "endTime" && value) {
            const date = new Date(Number(value));
            date.setUTCHours(23, 59, 59, 999);
            newValue = date.getTime();
        }

        setFilters((prev) => ({
            ...prev,
            [key]: String(newValue),
            page: String(1),
        }));
    };

    const handleSearch = () => {
        setPage(1);
        setAppliedFilters(filters);
    };

    const handleReset = () => {
        setFilters({
            startTime: "",
            endTime: "",
            state: "",
        });
    };

    return (
        <div>
            <CustomFilter
                onChangeFilters={onChangeFilters}
                time={{
                    keyStartTime: "startTime",
                    keyendTime: "endTime",
                    startTime: Number(filters.startTime),
                    endTime: Number(filters.endTime),
                }}
                listSelect={[
                    {
                        key: "state",
                        label: "Trạng thái",
                        listOptions: STATES_OPTIONS,
                        placeholder: "state",
                        value: filters.state,
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

export default FeedbackView