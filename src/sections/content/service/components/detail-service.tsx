import PanelPopup from '@/components/popup/panel-popup';
import { TableCore, type ColumnDef } from '@/components/table/table-core';
import { useRouter } from '@/routes/hooks/use-router';
import { paths } from '@/routes/paths';
import { AlertCircle, ArrowLeft, Calendar, Edit3, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ListPayable from './list-payable';
import ListPaid from './list-paid';
import { fDateTime } from '@/utils/format-time';
import { useLocation } from 'react-router-dom';
import { useUserStore } from '@/zustand/useUserStore';
import { QUERY_KEYS } from '@/hooks/actions/query-keys';
import { useListAgentHostServiceItem } from '@/hooks/actions/useUser';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { IServiceDetailTable } from '@/hooks/interfaces/user';
import { useToastStore } from '@/zustand/useToastStore';

const DetailService = () => {
    const { showToast } = useToastStore()
    const location = useLocation()
    const item = location.state.item
    const router = useRouter();
    const [open, setOpen] = useState({
        payable: false,
        paid: false
    })

    const user = useUserStore((state) => state.user);

    console.log("item", item)

    const { data, isLoading } = useQuery({
        queryKey: [QUERY_KEYS.USER.LIST_AGENT_HOST_SERVICE_ITEM, 1],
        queryFn: () =>
            useListAgentHostServiceItem({
                strMemberAgentGUID: user?.strUserGUID,
                strCompanyAgentGUID: user?.strCompanyGUID,
                strCompanyOwnerGUID: null,
                strAgentHostServiceItemGUID: item?.strAgentHostServiceItemGUID,
                strFilterDateFrom: null,
                strFilterDateTo: null,
                strAgentHostServiceItemCode: null,
                intBookingStatusID: null,
                intCurrencyID: user?.intCurrencyID,
                strFilterAgent: null,
                strWhere: null,
                intType: 1,
                intLangID: user?.intLangID,
                intCurPage: 1,
                intPageSize: 20,
                strOrder: null,
                tblsReturn: "[0][1]",
            }),
        placeholderData: keepPreviousData,
    });
    const listData = data?.[1] ?? []

    const colDefs: ColumnDef<IServiceDetailTable>[] = [
        {
            field: "strServiceName",
            headerName: "Tên dịch vụ",
            render: (_, row) => {

                return (
                    <div className="">
                        <div className="font-bold text-[#004b91] leading-tight uppercase text-sm">{row.strServiceName}</div>
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
                onClick={() => router.push(paths.content.service)}
                className="cursor-pointer flex items-center gap-2 text-gray-500 hover:text-[#004b91] transition-colors group py-2"
            >
                <div className="p-1.5 rounded-full group-hover:bg-blue-50 transition-colors">
                    <ArrowLeft size={20} />
                </div>
                <span className="text-sm font-medium">Quay lại</span>
            </button>

            <div className="space-y-5 mt-2">
                <div className="flex flex-col gap-1 font-sans">
                    <div className="flex items-center gap-1.5">
                        <h2 className="text-lg font-bold text-gray-800">{item?.strServiceName}</h2>
                        <button onClick={() => router.replaceParams(paths.content.detailTour, { item: item })} className="text-[#004b91] cursor-pointer hover:opacity-80 transition-opacity">
                            <AlertCircle size={16} strokeWidth={2.5} />
                        </button>
                    </div>

                    <div className="text-[14px] text-gray-500 font-normal tracking-tight">
                        <span>{fDateTime(item?.dtmDateFrom)} - {fDateTime(item?.dtmDateTo)}</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-800 mb-6">Thông tin chung</h2>

                    <div className="grid grid-cols-3 gap-y-6">

                        <div className="space-y-1">
                            <div className="text-xs text-gray-400 font-medium uppercase">Agent host</div>
                            <div className="text-[15px] text-gray-800 font-semibold uppercase tracking-tight">
                                {item?.strAgentHostName}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-xs text-gray-400 font-medium uppercase">Group size</div>
                            <div className="text-[15px] text-gray-700 font-semibold">{item?.intAdultsInService}</div>
                        </div>

                        <div className="space-y-1 text-right">
                            <div className="text-xs text-gray-400 font-medium uppercase">Status</div>
                            <div className="text-[15px] text-gray-700 font-semibold">{item?.strBookingStatusName}</div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-xs text-gray-400 font-medium uppercase">Total price</div>
                            <button
                                onClick={() => setOpen((prev) => ({ ...prev, payable: true }))}
                                className="cursor-pointer text-[15px] text-[#0066b2] font-semibold underline decoration-blue-200 underline-offset-4"
                            >
                                {new Intl.NumberFormat('vi-VN').format(item?.dblPriceTotal)} <span className="text-[10px] align-top">đ</span>
                            </button>
                        </div>

                        <div className="space-y-1">
                            <div className="text-xs text-gray-400 font-medium uppercase">Đã thanh toán</div>
                            <button
                                onClick={() => setOpen((prev) => ({ ...prev, paid: true }))}
                                className="cursor-pointer text-[15px] text-[#0066b2] font-semibold underline decoration-blue-200 underline-offset-4"
                            >
                                {new Intl.NumberFormat('vi-VN').format(item?.dblPricePaid)} <span className="text-[10px] align-top">đ</span>
                            </button>
                        </div>

                        <div className="space-y-1">
                            <div className="text-xs text-gray-400 font-medium uppercase">Hoa hồng</div>
                            <div className="text-[15px] text-gray-700 font-semibold">
                                {new Intl.NumberFormat('vi-VN').format(item?.dblPriceAgentCom)} <span className="text-[10px] align-top">đ</span>
                            </div>
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

                <div className="flex justify-end pt-4">
                    <button
                        onClick={() => showToast("info", "Sắp ra mắt")}
                        className="cursor-pointer w-fit px-16 py-2.5 bg-[#004b91] hover:bg-[#003d75] rounded-lg text-white transition-colors disabled:opacity-50"
                    >

                        Hủy đặt dịch vụ
                    </button>
                </div>
            </div>


            {open.payable && (
                <PanelPopup title='List Payable' open={open.payable} onClose={() => setOpen((prev) => ({ ...prev, payable: false }))}>
                    <ListPayable item={item} />
                </PanelPopup>
            )}
            {open.paid && (
                <PanelPopup title='List Paid' open={open.paid} onClose={() => setOpen((prev) => ({ ...prev, paid: false }))}>
                    <ListPaid item={item} />
                </PanelPopup>
            )}
        </div>
    );
};

export default DetailService;