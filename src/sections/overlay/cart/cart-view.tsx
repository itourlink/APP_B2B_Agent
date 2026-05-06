import { TableCore, type ColumnDef } from "@/components/table/table-core";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useGetListCart } from "@/hooks/actions/useUser";
// import { useRouter } from "@/routes/hooks/use-router";
import { useUserStore } from "@/zustand/useUserStore";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Banknote, Edit3, Trash2, Tag, Users, Briefcase } from "lucide-react";
import { useEffect, useState } from "react";
// import dayjs from "dayjs";
import { fDateTime } from "@/utils/format-time";

const CartView = () => {
    const [filters, setFilters] = useState({
        page: String(1),
        limit: String(50),
        nameAccount: "",
        idAccount: "",
        idSwift: "",
        addRess: "",
    });

    // const router = useRouter();
    const user = useUserStore((state) => state.user)
    // const [page, setPage] = useState(1);

    // const pageSize = 5;
    const { data, isLoading } = useQuery({
        queryKey: [QUERY_KEYS.USER.LIST_CART, user?.strUserGUID, user?.intCurrencyID],
        queryFn: () =>
            useGetListCart({
                strCompanyAgentGUID: user?.strCompanyGUID,
                strCartServiceItemGUID: null,
                strListCartServiceItemGUID: null,
                strOnlineCartGUID: null,
                strBuyFromAgentHostGUID: null,
                intCurrencyID:  1,
                intCurPage: null,
                intPageSize: null,
                strOrder: null,
                tblsReturn: "[0]",
            }),
        refetchOnWindowFocus: false,
        enabled: !!user?.strCompanyGUID && !!user?.intCurrencyID,
        placeholderData: keepPreviousData,
    });
    const listData = data?.[0] ?? [];
    const totalRecords = listData?.[0]?.intTotalRecords || 0;
    const totalPages = Math.ceil(totalRecords / Number(filters.limit));


    useEffect(() => {
        if (Number(filters.page) > totalPages && totalPages > 0) {
            setFilters(prev => ({ ...prev, page: "1" }));
        }
    }, [totalPages]);


    const colDefs: ColumnDef<any>[] = [
        {
            field: "No",
            headerName: "STT",
            render: (_, __, index) => (
                <span className="text-gray-400 font-medium">
                    {(Number(filters.page) - 1) * Number(filters.limit) + index + 1}
                </span>
            )
        },

        {
            field: "strServiceName",
            headerName: "Tên Dịch vụ",
            render: (_, row) => {
                const dateFrom = fDateTime(row.dtmDateFrom, "DD MMM, YYYY");
                const dateTo = fDateTime(row.dtmDateTo, "DD MMM, YYYY");

                return (
                    <div className="space-y-1.5 py-2 text-xs">
                        {/* Dòng 1: Tên dịch vụ */}
                        <div className="text-[#004b91] font-semibold text-sm tracking-tight">
                            {row?.strServiceName}
                        </div>

                        {/* Dòng 2: Công ty */}
                        <div className="flex items-center gap-2 text-gray-600 font-bold">
                            <Briefcase size={14} className="text-gray-700" />
                            <span className="uppercase">{row?.strCompanyName || "CÔNG TY KẾT NỐI DU LỊCH"}</span>
                        </div>

                        {/* Dòng 3: Thời gian */}
                        <div className="text-gray-500 font-medium text-[11px]">
                            {dateFrom} {dateTo && dateTo !== dateFrom ? ` - ${dateTo}` : ""}
                        </div>
                    </div>
                );
            },
        },



        {
            field: "strType",
            headerName: "Loại",
            render: (value, row) => {
                // Xác định dữ liệu nào chứa thẻ HTML từ backend
                const htmlContent = row?.intQuantity || row?.strType || value;

                if (!htmlContent) return <span className="text-gray-400">---</span>;

                // Hiển thị nội dung HTML trực tiếp
                if (typeof htmlContent === 'string' && htmlContent.includes('<')) {
                    return (
                        <div className="flex flex-col items-start space-y-1 py-1">
                            <div
                                className="text-xs text-[#004b91] [&>Div]:mb-1 [&>Div>B]:font-semibold [&>Div>B]:text-gray-600 [&>div]:mb-1 [&>div>b]:font-semibold [&>div>b]:text-gray-600 [&>b]:font-semibold [&>b]:text-gray-600"
                                dangerouslySetInnerHTML={{ __html: htmlContent }}
                            />
                            <button className="text-xs text-[#004b91] hover:underline font-medium">
                                Edit
                            </button>
                        </div>
                    );
                }

                // Nếu chỉ là text bình thường
                return (
                    <div className="flex flex-col items-start space-y-1 py-1">
                        <div className="flex items-center gap-1 text-xs">
                            <Tag size={12} className="text-[#004b91]" />
                            <span className="capitalize text-gray-600 font-medium">{htmlContent}</span>
                        </div>
                        <button className="text-xs text-[#004b91] hover:underline font-medium">
                            Edit
                        </button>
                    </div>
                );
            }
        },

        {
            field: "dblQuantity",
            headerName: "Số lượng",
            render: (value) => (
                <div className="flex items-center gap-1.5 justify-center min-w-[70px]">
                    <Users size={14} className="text-gray-400" />
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-blue-100">
                        {value || 0}
                    </span>
                </div>
            ),
        },

        {
            field: "dblPriceTotal",
            headerName: "Tổng giá",
            render: (value) => (
                <div className="font-bold text-[#004b91]">
                    {new Intl.NumberFormat('vi-VN').format(value)}{" "}
                    <span className="text-[10px] align-top text-gray-500 uppercase font-normal">usd</span>
                </div>
            ),
        },

        {
            field: "commission",
            headerName: "Hoa hồng",
            render: (value) => (
                <div className="flex items-center gap-1 text-orange-600">
                    <Banknote size={14} />
                    {value
                        ? `${new Intl.NumberFormat('vi-VN').format(value)} đ`
                        : "---"}
                </div>
            )
        },

        {
            field: "actions",
            headerName: "Thao tác",
            render: (_) => (
                <div className="flex items-center gap-2">
                    <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <Edit3 size={18} />
                    </button>
                    <button
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ),
        },
    ];


    // const alEmpty = listData.length === 0;

    return (
        <div className="max-w-5xl mx-auto ">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Giỏ hàng</h1>
                    <p className="text-gray-500 text-sm mt-1 font-normal">
                        Kiểm tra danh sách dịch vụ và hoàn tất các bước để giữ chỗ ngay hôm nay.
                    </p>
                </div>
            </div>

            <div className="mt-4"></div>
            <TableCore
                rowData={listData}
                columnDefs={colDefs}
                loading={isLoading}
            />

            {/* {!alEmpty && (
                <Pagination
                    currentPage={Number(filters.page)}
                    onPageChange={(value) => {
                        setFilters({
                            ...filters,
                            page: String(value),
                        });
                    }}
                    totalPages={totalPages}
                />
            )} */}
        </div>
    );
}

export default CartView