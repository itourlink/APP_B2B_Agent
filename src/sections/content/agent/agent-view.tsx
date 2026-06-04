import PrimaryButton from "@/components/button/primary-button";
import CustomFilter from "@/components/form/custom-filter";
import { Building2, RotateCcw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { TableCore, type ColumnDef } from "@/components/table/table-core";
import Pagination from "@/components/pagination/pagination";
import { useToastStore } from "@/zustand/useToastStore";
import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";
import { useCompanyOwnerListInfo } from "@/hooks/actions/useCompanyOwnerInfo";
import PanelPopup from "@/components/popup/panel-popup";

const AgentView = () => {
    const { showToast } = useToastStore();
    const router = useRouter();

    const IS_DEMO_SINGLE_DATA = false;

    const [filters, setFilters] = useState({
        nameProvider: "",
    });

    const [appliedFilters, setAppliedFilters] = useState(filters);
    const [page, setPage] = useState(1);

    const pageSize = 5;

    const {
        data,
        isError,
        isLoading,
        totalRecords,
    } = useCompanyOwnerListInfo({
        page,
        pageSize,
        nameProvider: appliedFilters.nameProvider,
    });

    const mockSingleData = [
        {
            No: 1,
            strCompanyGUID: "test-guid",
            strCompanyName: "CÔNG TY TEST",
            strUrlLink: "cong-ty-tnhh-ket-noi-du-lich-8F620",
        },
    ];

    const listData = useMemo(() => {
        if (IS_DEMO_SINGLE_DATA) {
            return mockSingleData;
        }

        return data ?? [];
    }, [IS_DEMO_SINGLE_DATA, data]);


    const finalTotalRecords = IS_DEMO_SINGLE_DATA
        ? mockSingleData.length
        : totalRecords;

    const totalPages = Math.ceil(finalTotalRecords / pageSize);

    useEffect(() => {
        if (page > totalPages) {
            setPage(1);
        }
    }, [page, totalPages]);


    const [isFirstLoad, setIsFirstLoad] = useState(true);

    useEffect(() => {
        if (
            isFirstLoad &&
            !isLoading &&
            !isError &&
            listData?.length === 1
        ) {
            router.replaceQuery(paths.shop.home, {
                company: listData[0]?.strUrlLink,
            });
        }

        if (!isLoading) {
            setIsFirstLoad(false);
        }
    }, [listData, isLoading, isError, isFirstLoad]);

    const handleSearch = () => {
        setAppliedFilters(filters);
        setPage(1);
    };

    const handleReset = () => {
        const defaultFilters = {
            nameProvider: "",
        };

        setFilters(defaultFilters);
        setAppliedFilters(defaultFilters);
        setPage(1);
    };

    const onChangeFilters = (
        key: string,
        value: string | number
    ) => {
        setFilters((prev) => ({
            ...prev,
            [key]: String(value),
        }));
    };

    const colDefs: ColumnDef<any>[] = [
        {
            field: "No",
            headerName: "STT",
            render: (value) => (
                <span className="text-gray-400 font-medium">
                    {value}
                </span>
            ),
        },
        {
            field: "strCompanyName",
            headerName: "Tên công ty",
            render: (_, row) => (
                <div className="space-y-0.5 py-1 text-xs w-full">
                    <div className="flex items-center gap-2 text-[#004b91] font-semibold text-sm">
                        <Building2
                            size={14}
                            className="text-[#4e6d9a]"
                        />

                        <span className="uppercase tracking-tight">
                            {row?.strCompanyName}
                        </span>
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
                        onClick={() =>
                            showToast("info", "Sắp ra mắt")
                        }
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
                </div>
            ),
        },
    ];

    return (
        <PanelPopup
            title="Danh sách đại lý"
            open={true}
            className="w-[90vw] max-w-none"
        >
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
                        rowData={listData}
                        columnDefs={colDefs}
                        loading={isLoading}
                    />

                    {!isError && (
                        <Pagination
                            currentPage={page}
                            onPageChange={(value) =>
                                setPage(value)
                            }
                            totalPages={totalPages || 1}
                        />
                    )}
                </div>
            </div>
        </PanelPopup>

    );
};

export default AgentView;