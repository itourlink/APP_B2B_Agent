import { TableCore, type ColumnDef } from '@/components/table/table-core';
import { QUERY_KEYS } from '@/hooks/actions/query-keys';
import { useDetailBookingRequest } from '@/hooks/actions/useUser';
import { useRouter } from '@/routes/hooks/use-router';
import { paths } from '@/routes/paths';
import { fDateTime } from '@/utils/format-time';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, MessageSquare } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const DetailRequest = () => {
    const router = useRouter();
    const location = useLocation()
    const item = location.state
    const { data, isLoading } = useQuery({
        queryKey: [QUERY_KEYS.USER.LIST_BOOKING_REQUEST, 1],
        queryFn: () =>
            useDetailBookingRequest({
                strBookingRequestGUID: item?.strBookingRequestGUID
            }),
        placeholderData: keepPreviousData,
    });

    const listDataCompany = data?.[0]?.[0] ?? [];
    const listDataService = data?.[2] ?? [];
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
            field: "strServiceName",
            headerName: "Tên dịch vụ",
            render: (_, row) => {

                return (
                    <div className="min-w-full">
                        <div className="font-bold text-[#004b91] leading-tight uppercase text-sm">{row.strServiceName}</div>
                        <div className="text-xs text-brand-600 mt-1 flex items-center gap-1">
                            <Calendar size={12} />
                            <span>{fDateTime(row.dtmDateFrom)} - {fDateTime(row.dtmDateTo)}</span>
                        </div>
                    </div>
                )
            }
        },
        {
            field: "strType",
            headerName: "Kiểu",
            render: (value) => (
                <div className="flex justify-center min-w-25">
                    <div className="flex items-center gap-1 text-gray-700 italic">
                        <span className="text-sm" dangerouslySetInnerHTML={{ __html: value }} />
                    </div>
                </div >
            ),
        },
        {
            field: "intQuantity",
            headerName: "Tổng số khách",
            render: (value) => (
                <div className="flex justify-center min-w-20">
                    <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-medium">
                        {value}
                    </span>
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
    ];

    return (
        <div className="max-w-7xl mx-auto bg-[#f8fafc] min-h-screen">
            <button
                onClick={() => router.push(paths.content.requestBooking)}
                className="cursor-pointer flex items-center gap-2 text-gray-500 hover:text-[#004b91] transition-colors group py-2"
            >
                <div className="p-1.5 rounded-full group-hover:bg-blue-50 transition-colors">
                    <ArrowLeft size={20} />
                </div>
                <span className="text-sm font-medium">Quay lại</span>
            </button>

            <div className="space-y-5">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
                    <div className="flex justify-between items-start">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-gray-800">Thông tin bên nhận</h2>
                                <div className="p-1.5 bg-[#4a6fa5] rounded-lg text-white">
                                    <MessageSquare size={16} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-x-20">
                                <div className="text-sm">
                                    <span className="text-gray-400 font-medium">Công ty</span>
                                    <div className="mt-1 text-[#004b91] font-semibold uppercase">{listDataCompany?.strCompanyName}</div>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-gray-400 font-normal uppercase tracking-wider">Trạng thái: </span>
                            <span className="text-xs font-bold text-gray-600">{listDataCompany?.strRequestProcessName}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-800 mb-6">Thông tin yêu cầu</h2>
                    <div className="grid grid-cols-3 gap-y-6">
                        <div className="space-y-1">
                            <div className="text-xs text-gray-400 font-medium uppercase">Mã yêu cầu</div>
                            <div className="text-[15px] text-gray-700 font-semibold">{listDataCompany?.strBookingRequestCode}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs text-gray-400 font-medium uppercase">Tổng số khách</div>
                            <div className="text-[15px] text-gray-700 font-semibold">{Number(listDataCompany?.intAdult) + Number(listDataCompany?.intChildren)}</div>
                        </div>
                        <div className="space-y-1 text-right">
                            <div className="text-xs text-gray-400 font-medium uppercase">Tổng số ngày</div>
                            <div className="text-[15px] text-gray-700 font-semibold">{listDataCompany?.intNoOfDay}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs text-gray-400 font-medium uppercase">Ngày gửi yêu cầu</div>
                            <div className="text-[15px] text-gray-700 font-normal">{fDateTime(listDataCompany?.dtmCreatedDate)}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs text-gray-400 font-medium uppercase">Tổng Giá</div>
                            <div className="text-gray-700">
                                {new Intl.NumberFormat('vi-VN').format(listDataCompany?.dblPriceTotal)} <span className="text-[10px] align-top">đ</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 pb-2">
                        <h2 className="text-lg font-bold text-gray-800">Danh sách dịch vụ</h2>
                    </div>

                    <TableCore
                        rowData={listDataService ?? []}
                        columnDefs={colDefs}
                        loading={isLoading}
                    />

                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Booking Request</h2>
                    <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-600 font-normal leading-relaxed italic">
                        Không có dữ liệu
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailRequest;