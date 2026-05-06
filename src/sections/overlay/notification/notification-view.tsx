import { useState } from 'react';
import { Bell, Calendar } from 'lucide-react';
import { useUserStore } from '@/zustand/useUserStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/hooks/actions/query-keys';
import { useListAgentNotify, useUpdNotifyIsRead } from '@/hooks/actions/useUser';
import { fDateTime } from '@/utils/format-time';

const NotificationView = () => {
    const [filter, setFilter] = useState('all');
    const queryClient = useQueryClient();
    const user = useUserStore((state) => state.user);
    const [page] = useState(1);
    const { data } = useQuery({
        queryKey: [QUERY_KEYS.USER.LIST_AGENT_NOTIFY, page],
        queryFn: () =>
            useListAgentNotify({
                strCompanyGUID: user?.strCompanyGUID,
                strMemberGUID: null,
                strPassengerGUID: null,
                strGuideGUID: null,
                intLangID: user?.intLangID,
                intCurPage: null,
                intPageSize: null,
                strOrder: null,
                tblsReturn: "[0]"
            }),
    });

    const listData = data?.[0] ?? [];

    const filteredData =
        filter === "unread"
            ? listData.filter((item: any) => !item?.IsRead)
            : listData;
    const total = listData.length;
    const unread = listData.filter((item: any) => !item?.IsRead).length;

    const { mutate: useUpdNotifyIsReadApi } = useMutation({
        mutationFn: useUpdNotifyIsRead,
    });
    const handleIsRead = (guid: string) => {
        queryClient.setQueryData(
            [QUERY_KEYS.USER.LIST_AGENT_NOTIFY, page],
            (oldData: any) => {
                if (!oldData) return oldData;

                const newData = [...oldData];
                newData[0] = newData[0].map((item: any) =>
                    item.strAgentNotifyToGUID === guid
                        ? { ...item, IsRead: true }
                        : item
                );

                return newData;
            }
        );

        useUpdNotifyIsReadApi({ strAgentNotifyToGUID: guid });
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Thông báo của bạn</h1>
                    <p className="text-gray-500 text-sm mt-1 font-normal">Quản lý và cập nhật các hoạt động mới nhất từ hệ thống iTourlink.</p>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-3 space-y-2">
                    {[
                        { id: 'all', label: 'Tất cả thông báo', count: total },
                        { id: 'unread', label: 'Chưa đọc', count: unread },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setFilter(item.id)}
                            className={`cursor-pointer w-full flex justify-between items-center px-4 py-3 rounded-xl text-sm transition-all ${filter === item.id
                                ? 'bg-[#004b91] text-white shadow-lg shadow-blue-100'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-transparent'
                                }`}
                        >
                            <span className="font-medium">{item.label}</span>
                            <span className={`text-[11px] px-2 py-0.5 rounded-full ${filter === item.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                {item.count}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="col-span-12 md:col-span-9 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-50">

                        {filteredData.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">

                                {/* icon */}
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 mb-3">
                                    <Bell size={20} className="text-gray-400" />
                                </div>

                                {/* text */}
                                <p className="text-sm text-gray-500 font-medium">
                                    Không có thông báo
                                </p>

                                <span className="text-xs text-gray-400 mt-1">
                                    {filter === "unread"
                                        ? "Bạn đã đọc hết tất cả thông báo"
                                        : "Hiện tại chưa có thông báo nào"}
                                </span>

                                {/* back button khi ở tab unread */}
                                {filter === "unread" && (
                                    <button
                                        onClick={() => setFilter("all")}
                                        className="mt-3 text-xs text-[#004b91] hover:underline cursor-pointer"
                                    >
                                        Xem tất cả thông báo
                                    </button>
                                )}
                            </div>
                        ) : (
                            filteredData.map((notif: any) => (
                                <div
                                    key={notif?.strAgentNotifyGUID}
                                    onClick={() => handleIsRead(notif?.strAgentNotifyToGUID)}
                                    className={`p-5 flex gap-4 transition-all cursor-pointer hover:bg-blue-50/30 ${!notif?.IsRead ? "bg-blue-50/40" : ""
                                        }`}
                                >
                                    {/* icon + dot */}
                                    <div className="relative">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-[#004b91]">
                                            <Bell size={20} />
                                        </div>

                                        {!notif?.IsRead && (
                                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full shadow" />
                                        )}
                                    </div>

                                    {/* content */}
                                    <div className="flex-grow space-y-1">
                                        <div className="flex items-center gap-1 text-[11px] text-gray-400">
                                            <Calendar size={12} />
                                            {fDateTime(notif?.dtmCreatedDateAgentNotifyTo)}
                                        </div>

                                        <div className="flex justify-between items-start">
                                            <h3 className="text-sm font-semibold text-gray-800">
                                                {notif?.strAgentNotifyTitle}
                                            </h3>
                                        </div>

                                        <p className="text-[13px] text-gray-500 leading-relaxed">
                                            {notif?.strAgentNotifyContent}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationView;