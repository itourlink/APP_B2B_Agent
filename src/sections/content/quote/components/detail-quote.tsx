import { TableCore, type ColumnDef } from '@/components/table/table-core';
import { paths } from '@/routes/paths';
import { ArrowLeft, Calendar, CheckCircle2, Edit3, Trash2, XCircle } from 'lucide-react';
import { fDateTime } from '@/utils/format-time';
import { useLocation } from 'react-router-dom';
import { useUserStore } from '@/zustand/useUserStore';
import { QUERY_KEYS } from '@/hooks/actions/query-keys';
import { useListAgentForGroup } from '@/hooks/actions/useUser';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useToastStore } from '@/zustand/useToastStore';
import { useRouter } from '@/routes/hooks/use-router';

const DetailQuote = () => {
    const { showToast } = useToastStore()
    const location = useLocation()
    const item = location.state.item
    const router = useRouter();
    const user = useUserStore((state) => state.user);

    const { data, isLoading } = useQuery({
        queryKey: [QUERY_KEYS.USER.LIST_AGENT_FOR_GROUP],
        queryFn: () =>
            useListAgentForGroup({
                strMemberAgentGUID: user?.strUserGUID,
                strCompanyAgentGUID: user?.strCompanyGUID,
                strAgentForGroupGUID: item?.strAgentForGroupGUID,
                strGroupCode: null,
                intCurPage: null,
                intPageSize: null,
                strOrder: null,
                tblsReturn: "[0][1]"
            }),
        placeholderData: keepPreviousData,
    });

    const listData = data?.[1] ?? []

    const colDefs: ColumnDef<any>[] = [
        {
            field: "stt",
            headerName: "STT",
            render: (_, __, rowIndex) => (
                <span className="text-gray-400 font-medium">
                    {rowIndex + 1}
                </span>
            )
        },
        {
            field: "strGroupCode",
            headerName: "Mã",
            render: (value) => (
                <span className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                    {value || "---"}
                </span>
            )
        },
        {
            field: "strMainServiceName",
            headerName: "Tên dịch vụ",
            render: (_, row) => {

                return (
                    <div className="">
                        <div className="font-bold text-[#004b91] leading-tight uppercase text-sm">{row.strMainServiceName}</div>
                    </div>
                )
            }
        },
        {
            field: "dtmDateFrom",
            headerName: "Ngày bắt đầu - Ngày kết thúc",
            render: (_, row) => (
                <div className="text-xs text-gray-500 flex items-center gap-1.5 min-w-[170px]">
                    <Calendar size={13} className="text-gray-400" />
                    <span>{fDateTime(row.dtmDateFrom)} - {fDateTime(row.dtmDateTo)}</span>
                </div>
            ),
        },

        {
            field: "dblQuantity",
            headerName: "Số lượng",
            render: (value) => (
                <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                    {value}
                </div>
            )
        },
        {
            field: "dblPrice",
            headerName: "Đơn giá",
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
            field: "IsActive",
            headerName: "Đặt",
            render: (value) => (
                <div className="flex justify-center">
                    {!value ? (
                        <CheckCircle2 size={18} className="text-green-500" />
                    ) : (
                        <XCircle size={18} className="text-gray-300" />
                    )}
                </div>
            ),
        },
        {
            field: "dblPrice",
            headerName: "Thao tác",
            render: (_) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => showToast("info", "Sắp ra mắt")}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                    >
                        <Edit3 size={18} />
                    </button>
                    <button
                        onClick={() => showToast("info", "Sắp ra mắt")}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="max-w-7xl mx-auto bg-[#f8fafc] min-h-screen">
            <button
                onClick={() => router.push(paths.content.quote)}
                className="cursor-pointer flex items-center gap-2 text-gray-500 hover:text-[#004b91] transition-colors group py-2"
            >
                <div className="p-1.5 rounded-full group-hover:bg-blue-50 transition-colors">
                    <ArrowLeft size={20} />
                </div>
                <span className="text-sm font-medium">Quay lại</span>
            </button>

            <div className="space-y-5 mt-2">
                <div className="flex justify-between">
                    <div className="flex flex-col font-sans">

                        <div className="flex items-center gap-1.5">
                            <h2 className="text-lg font-bold text-gray-800">{item?.strAgentGroupName}</h2>
                        </div>

                        <div className="text-[14px] text-gray-500 font-normal tracking-tight">
                            <span>{item?.strGroupCode}</span>
                        </div>
                    </div>


                    <div className="flex justify-end">
                        <button
                            onClick={() => showToast("info", "Sắp ra mắt")}
                            className="cursor-pointer w-full px-10 py-1.5 bg-[#004b91] hover:bg-[#003d75] rounded-lg text-white transition-colors disabled:opacity-50"
                        >
                            Đặt
                        </button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-800 mb-6">Thông tin chung</h2>

                    <div className="grid grid-cols-3 gap-y-6">



                        <div className="space-y-1">
                            <div className="text-xs text-gray-400 font-medium uppercase">Group size</div>
                            <div className="text-[15px] text-gray-700 font-semibold">{item?.intTotalPax}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs text-gray-400 font-medium uppercase">Customer Name</div>
                            <div className="text-[15px] text-gray-800 font-semibold uppercase tracking-tight">
                                {item?.strCustomerName}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs text-gray-400 font-medium uppercase">Total Price</div>
                            <div className="text-[15px] text-gray-700 font-semibold">{item?.dblPriceTotal} <span className="text-[10px] align-top">đ</span></div>
                        </div>

                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 pb-2">
                        <h2 className="text-lg font-bold text-gray-800">Danh sách đặt dịch vụ</h2>
                    </div>

                    <TableCore
                        rowData={listData ?? []}
                        columnDefs={colDefs}
                        loading={isLoading}
                    />
                </div>
            </div>
        </div>
    )
}

export default DetailQuote