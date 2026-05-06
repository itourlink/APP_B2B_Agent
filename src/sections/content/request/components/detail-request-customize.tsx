import { useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, MessageCircle } from 'lucide-react';
import { useRouter } from '@/routes/hooks/use-router';
import { paths } from '@/routes/paths';
import { TableCore, type ColumnDef } from '@/components/table/table-core';
import { fDateTime } from '@/utils/format-time';
import { useToastStore } from '@/zustand/useToastStore';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/hooks/actions/query-keys';
import { useListRequestMessage, useListServiceItemBySaleReq } from '@/hooks/actions/useUser';
import { isValidValue } from '@/utils/utilts';

const DetailRequestCustomize = () => {
    const { showToast } = useToastStore();
    const router = useRouter();
    const location = useLocation();
    const item = location.state?.item; console.log("itemahaha", item)

    const { data, isLoading, isError } = useQuery({
        queryKey: [QUERY_KEYS.USER.LIST_REQUEST_MESSAGE],
        queryFn: () =>
            useListRequestMessage({
                strRequestMessageGUID: null,
                strRequestCode: item?.strRequestCode,
                strSaleRequestGUID: item?.strSaleRequestGUID,
                strOrder: null,
                intCurPage: null,
                intPageSize: null,
                tblsReturn: "[0]"
            }),
        placeholderData: keepPreviousData,
    });

    const {
        data: svData,
        isLoading: svIsLoading,
    } = useQuery({
        queryKey: [QUERY_KEYS.USER.LIST_SERVICE_ITEM_BY_SALE_REQ],
        queryFn: () =>
            useListServiceItemBySaleReq({
                strSaleRequestGUID: item?.strSaleRequestGUID
            }),
        placeholderData: keepPreviousData,
    });

    const listData = data?.[0] ?? [];

    const listServices = svData?.[0] ?? [];
    const isCancel =
        Number(item?.intRequestStatusID) === 4 ||
        item?.strStatusName === "Cancellation Request";

    const colDefs: ColumnDef<any>[] = [
        {
            field: "stt",
            headerName: "STT",
            render: (value) => <span>{value}</span>
        },
        {
            field: "strServiceName",
            headerName: "Tên dịch vụ",
            render: (_, row) => (
                <div className="min-w-[250px]">
                    <div className="font-bold text-[#004b91] uppercase text-sm leading-tight">
                        {row.strServiceName}
                    </div>
                    <div className="text-xs text-brand-600 mt-1 flex items-center gap-1">
                        <Calendar size={12} />
                        {fDateTime(row.dtmDateFrom)} - {fDateTime(row.dtmDateTo)}
                    </div>
                </div>
            )
        },
        {
            field: "No",
            headerName: "Ngày Từ - Ngày Đến",
            render: (_, row) => (
                <div className="text-xs text-gray-600 flex items-center gap-1.5 min-w-[180px]">
                    <Calendar size={13} className="text-gray-400" />
                    <span>{fDateTime(row.dtmDateFrom)} - {fDateTime(row.dtmDateTo)}</span>
                </div>
            ),
        },
        {
            field: "intTotalPax",
            headerName: "Tổng số khách",
            render: (value) => (
                <div className="bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 inline-block font-medium">
                    {value}
                </div>
            )
        },
        {
            field: "dblTotalPrice",
            headerName: "Tổng giá",
            render: (value) => (
                <div className="text-gray-700">
                    {new Intl.NumberFormat('vi-VN').format(value)}{" "}
                    <span className="text-[10px] align-top font-normal">đ</span>
                </div>
            )
        }
    ];

    return (
        <div className="max-w-7xl mx-auto bg-[#f8fafc] min-h-screen p-4">
            <button
                onClick={() => router.push(paths.content.requestCustomize)}
                className="cursor-pointer flex items-center gap-2 text-gray-500 hover:text-[#004b91] transition-colors group py-2"
            >
                <div className="p-1.5 rounded-full group-hover:bg-blue-50 transition-colors">
                    <ArrowLeft size={20} />
                </div>
                <span className="text-sm font-medium">Quay lại</span>
            </button>
            <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
                        <div className="flex justify-between items-center mb-6">
                            <div className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                Thông tin bên nhận
                                <MessageCircle size={20} className="text-white fill-[#004b91] p-0.5 rounded" />
                            </div>
                            {!isCancel && (
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => showToast("info", "Sắp ra mắt")}
                                        className="cursor-pointer w-full px-10 py-1.5 bg-[#004b91] hover:bg-[#003d75] rounded-lg text-white transition-colors disabled:opacity-50"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-1">
                            <div className="text-xs text-gray-400 font-medium uppercase">Công ty</div>
                            <div className="text-sm text-gray-800 font-semibold uppercase">
                                {item?.strCompanyName}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-y-6 mt-6">
                            <div className="space-y-1">
                                <div className="text-xs text-gray-400 font-medium uppercase">Mã yêu cầu</div>
                                <div className="text-[15px] text-gray-800 font-semibold">{item?.strRequestCode}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-xs text-gray-400 font-medium uppercase">Tổng số khách</div>
                                <div className="text-[15px] text-gray-800 font-semibold">{item?.intTotalPax}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-xs text-gray-400 font-medium uppercase">Tổng số ngày</div>
                                <div className="text-[15px] text-gray-800 font-semibold">{item?.intDuration}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-xs text-gray-400 font-medium uppercase">Ngày gửi yêu cầu</div>
                                <div className="text-[15px] text-gray-800 font-semibold">{fDateTime(item?.dtmCreatedDate)}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-xs text-gray-400 font-medium uppercase">Tổng giá</div>
                                <div className="text-[15px] text-gray-800 font-semibold">
                                    {new Intl.NumberFormat('vi-VN').format(
                                        isNaN(Number(item?.dblTotalPrice)) ? 0 : Number(item?.dblTotalPrice)
                                    )} đ
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Thông tin trao đổi</h2>

                        <div className="space-y-4 overflow-y-auto max-h-[200px] pr-2 custom-scrollbar">
                            {isLoading ? (
                                [...Array(3)].map((_, i) => (
                                    <div key={i} className="border border-gray-100 rounded-lg overflow-hidden animate-pulse">
                                        <div className="bg-gray-100 px-3 py-2 space-y-2">
                                            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                            <div className="h-2 bg-gray-200 rounded w-1/4"></div>
                                        </div>
                                        <div className="p-3 bg-white space-y-2">
                                            <div className="h-3 bg-gray-100 rounded w-full"></div>
                                        </div>
                                    </div>
                                ))
                            ) : isError ? (
                                <div className="flex flex-col items-center justify-center py-6 text-red-500 bg-red-50 rounded-xl border border-red-100">
                                    <div className="text-xs font-medium">Đã có lỗi xảy ra khi tải dữ liệu</div>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="mt-2 text-[10px] underline hover:text-red-700"
                                    >
                                        Thử lại
                                    </button>
                                </div>
                            ) : listData.length > 0 ? (
                                listData.map((msg: any, index: any) => (
                                    <div key={msg.strRequestMessageGUID || index} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <div className="bg-blue-50/80 px-3 py-1.5">
                                            <div className="text-sm text-gray-700 font-medium capitalize">
                                                {isValidValue(msg.strFullName)}
                                            </div>
                                            <div className="text-[10px] text-gray-500">

                                                {fDateTime(msg.dtmCreatedDate)}
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white text-sm text-gray-800">
                                            {msg.strMessageContent}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-400 text-sm italic py-4 text-center">
                                    Không có dữ liệu trao đổi
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-5">
                <div className="p-6 pb-2">
                    <h2 className="text-lg font-bold text-gray-800">Danh sách dịch vụ</h2>
                </div>
                <TableCore
                    rowData={listServices ?? []}
                    columnDefs={colDefs}
                    loading={svIsLoading}
                />
            </div>
        </div>
    );
};

export default DetailRequestCustomize;