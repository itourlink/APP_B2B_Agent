import PrimaryButton from "@/components/button/primary-button";
import CustomFilter from "@/components/form/custom-filter"
import { Building2, RotateCcw, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { TableCore, type ColumnDef } from "@/components/table/table-core";
import Pagination from "@/components/pagination/pagination";
import type { IAgent } from "@/hooks/interfaces/user";
import { useToastStore } from "@/zustand/useToastStore";
import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";
import { useCompanyOwnerListInfo } from "@/hooks/actions/useCompanyOwnerInfo";

const AgentView = () => {
    const { showToast } = useToastStore()
    const router = useRouter();

    const [filters, setFilters] = useState({
        nameProvider: "",
    });

    const [appliedFilters, setAppliedFilters] = useState(filters);
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const { data, isError, isLoading, totalRecords } = useCompanyOwnerListInfo({
        page,
        pageSize,
        nameProvider: appliedFilters.nameProvider,
    });

    const totalPages = Math.ceil(totalRecords / pageSize);

    const listData = data;


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
            nameProvider: "",
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

    const colDefs: ColumnDef<IAgent>[] = [
        {
            field: "No",
            headerName: "STT",
            render: (value) => <span className="text-gray-400 font-medium">{value}</span>,
        },
        {
            field: "strCompanyName",
            headerName: "Tên công ty",
            render: (_, row) => (
                <div className="space-y-0.5 py-1 text-xs">
                    <div className="flex items-center gap-2 text-[#004b91] font-semibold text-sm">
                        <Building2 size={14} className="text-[#4e6d9a]" />
                        <span className="uppercase tracking-tight">{row?.strCompanyName}</span>
                    </div>
                </div>
            ),
        },
        {
            field: "No",
            headerName: "Thao tác",
            render: (_, row) => (
                <div className="flex items-center gap-2 min-w-[150px]">
                    <button
                        onClick={() => showToast("info", "Sắp ra mắt")}
                        className="cursor-pointer px-4 py-1.5 bg-[#004b91] text-white text-[13px] font-medium rounded hover:bg-[#003d76] transition-all shadow-sm"
                    >
                        Tariff
                    </button>
                    <button
                        onClick={() =>
                            router.replaceQuery(
                                paths.shop.home,
                                {
                                    company: row?.strUrlLink,
                                },
                                {
                                    target: "_blank",
                                }
                            )
                        }
                        className="cursor-pointer px-4 py-1.5 bg-[#004b91] text-white text-[13px] font-medium rounded hover:bg-[#003d76] transition-all shadow-sm"
                    >
                        Shop
                    </button>
                </div >
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
                            keySearch: "nameProvider",
                            value: filters.nameProvider,
                            placeHoder: "Tên đại lý",
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
        </div>
    )
}

export default AgentView