import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useListAgentNotify, useUpdNotifyIsRead } from "@/hooks/actions/useUser";
import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";
import { fDateTime } from "@/utils/format-time";
import { useUserStore } from "@/zustand/useUserStore";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import { useState } from "react";

const NotificationPopup = () => {
    const queryClient = useQueryClient();
    const router = useRouter()
    const user = useUserStore((state) => state.user);
    const [page] = useState(1);
    const pageSize = 3;
    const { data, isLoading, isError } = useQuery({
        queryKey: [QUERY_KEYS.USER.LIST_AGENT_NOTIFY, page, pageSize],
        queryFn: () =>
            useListAgentNotify({
                strCompanyGUID: user?.strCompanyGUID,
                strMemberGUID: null,
                strPassengerGUID: null,
                strGuideGUID: null,
                intLangID: user?.intLangID,
                intCurPage: page,
                intPageSize: pageSize,
                strOrder: null,
                tblsReturn: "[0]"
            }),
        placeholderData: keepPreviousData,
    });

    const listData = data?.[0] ?? []
    const { mutate: useUpdNotifyIsReadApi } = useMutation({
        mutationFn: useUpdNotifyIsRead,
    });
    const handleIsRead = (guid: string) => {
        useUpdNotifyIsReadApi(
            { strAgentNotifyToGUID: guid },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_KEYS.USER.LIST_AGENT_NOTIFY],
                    });

                    router.push(paths.overlay.notification);
                },
            }
        );
    };

    return (
        <div className="relative">
            <div className="absolute right-0 top-[120%] pt-2 w-[320px]">
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden z-50 p-1.5 shadow-2xl border border-gray-100">

                    <div className="px-3 py-2 mb-1 flex justify-between items-center">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Thông báo</span>
                    </div>

                    <div className="max-h-100 overflow-y-auto custom-scrollbar">

                        {isLoading && (
                            <div className="space-y-2 p-2 animate-pulse">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="p-3 rounded-xl border border-gray-100">
                                        <div className="flex gap-3">
                                            <div className="mt-2 h-2 w-2 rounded-full bg-gray-200" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-3 w-2/3 bg-gray-200 rounded" />
                                                <div className="h-3 w-full bg-gray-200 rounded" />
                                                <div className="h-2 w-1/3 bg-gray-200 rounded" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {isError && (
                            <div className="flex flex-col items-center justify-center py-10 text-center">

                                <span className="text-xs text-gray-500">Không tải được thông báo</span>

                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-4 px-2 py-1.5 text-[10px] bg-[#004b91] text-white rounded-md hover:bg-[#003d75] transition cursor-pointer"
                                >
                                    Thử lại
                                </button>
                            </div>
                        )}

                        {!isLoading && !isError && listData.map((item: any) => (
                            <button
                                key={item.id}
                                onClick={() => handleIsRead(item?.strAgentNotifyToGUID)}
                                className="group relative p-3 rounded-xl hover:bg-blue-50/50 transition-all cursor-pointer mb-0.5 border-b border-gray-50 last:border-0"
                            >
                                <div className="flex gap-3">
                                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${item.IsRead ? 'bg-transparent' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'}`} />

                                    <div className="space-y-1">
                                        <div className="text-start text-[13px] font-semibold text-gray-700 leading-none group-hover:text-[#004b91]">
                                            {item?.strAgentNotifyTitle}
                                        </div>
                                        <p className="text-start text-[12px] text-gray-500 leading-snug line-clamp-2 font-normal">
                                            {item?.strAgentNotifyContent}
                                        </p>
                                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                                            <Calendar size={12} />
                                            <span>{fDateTime(item?.dtmCreatedDateAgentNotifyTo)}</span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}

                    </div>

                    <button onClick={() => router.push(paths.overlay.notification)} className="cursor-pointer p-2 border-t border-gray-50 mt-1 w-full py-2 text-[12px] text-gray-500 hover:text-[#004b91] hover:bg-gray-50 rounded-lg transition-colors font-medium">
                        Xem tất cả thông báo
                    </button>

                </div>
            </div>
        </div>
    );
};

export default NotificationPopup;