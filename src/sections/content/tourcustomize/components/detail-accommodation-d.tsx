import Pagination from "@/components/pagination/pagination";
import PanelPopup from "@/components/popup/panel-popup";
import {
    TableCore,
    type ColumnDef,
} from "@/components/table/table-core";
import { fDateTime } from "@/utils/format-time";
import { useEffect, useMemo, useState } from "react";

const DetailAccommodationD = ({
    open,
    onClose,
}: any) => {

    // const { supListMapData } = useGetlistSupplierMappingPrice({
    //     page: 1,
    //     pageSize: 9999,
    //     strSupplierMappingPriceGUID: "D244B4CB-78F9-4AC3-992A-A523FB582927",
    //     strSupplierGUID: "48E69696-F9F9-4D76-AAEA-A6FD144721BE",
    //     tblsReturn: "[0][1][2]",
    // })

    // console.log("supListMapData", supListMapData)

    const supListMapData = useMemo(
        () => [
            [
                {
                    No: 1,
                    strPriceSeasonGUID:
                        "D8D9ED12-258A-4ADE-9BFA-4E7FFF02F254",
                    strPriceSeasonName: "2025",
                    strSeasonName: "Year around",
                    strItemName:
                        "VILLA SUPERIOR",
                    strMealIncludedTypeName:
                        "Breakfast Included",
                    dblMarkup: 0,
                    dblPriceView: 21.6,
                    intTotalRecords: "1",
                },
            ],
            [
                {
                    strPriceSeasonGUID:
                        "D8D9ED12-258A-4ADE-9BFA-4E7FFF02F254",
                    dtmDateFrom:
                        "2025-01-01T00:00:00",
                    dtmDateTo:
                        "2029-12-31T00:00:00",
                },
            ],
            [],
        ],
        []
    );

    const [page, setPage] = useState(1);
    const pageSize = 10;

    // data[0] = table data
    const listData = useMemo(() => {
        return supListMapData?.[0] || [];
    }, [supListMapData]);

    // data[1] = season/date data
    const seasonData = useMemo(() => {
        return supListMapData?.[1] || [];
    }, [supListMapData]);

    // const totalRecords = Number(
    //     listData?.[0].intTotalRecords || 0
    // );

    const totalRecords = 10;

    const totalPages = Math.ceil(
        totalRecords / pageSize
    );

    const isLoading = false;
    const isError = false
    const colDefs = useMemo<
        ColumnDef<any>[]
    >(
        () => [
            {
                field: "No",
                headerName: "STT",
                render: (value) => (
                    <span className="text-gray-500 font-medium">
                        {value}
                    </span>
                ),
            },
            {
                field: "strItemName",
                headerName: "Mô tả",
                render: (_, row) => {
                    const season: any = seasonData?.find(
                        (item: any) =>
                            item?.strPriceSeasonGUID ===
                            row?.strPriceSeasonGUID
                    );

                    return (
                        <div className="py-2">
                            {/* season */}
                            <div className="mb-3 border-b pb-3">
                                <div className="font-semibold text-[18px]">
                                    Mùa:{" "}
                                    {
                                        row?.strPriceSeasonName
                                    }
                                </div>

                                <div className="mt-1 text-sm">
                                    <span className="font-semibold">
                                        Date
                                        Valid:
                                    </span>{" "}
                                    (
                                    {
                                        row?.strSeasonName
                                    }
                                    ) (Monday -
                                    Sunday)
                                    [
                                    {fDateTime(
                                        season?.dtmDateFrom
                                    )}{" "}
                                    -{" "}
                                    {fDateTime(
                                        season?.dtmDateTo
                                    )}
                                    ]
                                </div>
                            </div>

                            {/* item */}
                            <div className="flex items-center gap-1 text-[16px]">
                                <span className="font-bold uppercase">
                                    {
                                        row?.strItemName
                                    }
                                </span>

                                <span>
                                    (
                                    {
                                        row?.strMealIncludedTypeName
                                    }
                                    )
                                </span>
                            </div>
                        </div>
                    );
                },
            },
            {
                field: "dblMarkup",
                headerName: "Mark up",
                render: (value) => (
                    <div className="font-medium">
                        {Number(value) >
                            0
                            ? value
                            : "No Markup"}
                    </div>
                ),
            },
            {
                field: "dblPriceView",
                headerName: "Giá",
                render: (value) => (
                    <div className="text-right font-medium">
                        ${value}
                    </div>
                ),
            },
        ],
        [seasonData]
    );

    useEffect(() => {
        if (page > totalPages) {
            setPage(1);
        }
    }, [page, totalPages]);

    return (
        <PanelPopup
            open={open}
            onClose={onClose}
            title="KHÁCH SẠN BÃI CHÁY HẠ LONG - VILLA SUPERIOR(Breakfast Included)"
            className="w-[900px]"
        >
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
        </PanelPopup>
    );
};

export default DetailAccommodationD;