import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useHelperFileByShow } from "@/hooks/actions/useUser";
import { getUrlImage } from "@/utils/format-image";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";

type Props = {
    open: boolean;
    onClose: () => void;
};
export const VideoHelperPopup = ({ open, onClose }: Props) => {
    const {
        data: vdData,
        isLoading,
        isError
    } = useQuery({
        queryKey: [QUERY_KEYS.USER.LIST_HELPER_FILE_BY_SHOW],
        queryFn: () =>
            useHelperFileByShow({
                strTravelHelperSubModuleCode: "A7168",
                intLangID: 18
            }),
        placeholderData: keepPreviousData,
        enabled: open
    });

    const listVdData = vdData?.[0]?.[0] ?? [];

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-[800px] max-w-[95%] bg-white rounded-2xl shadow-xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300">
                    <span className="font-semibold">Video Helper</span>
                    <button onClick={onClose} className="cursor-pointer">
                        <X size={18} />
                    </button>
                </div>


                <div className="p-4">

                    {isLoading && (
                        <div className="animate-pulse">
                            <div className="w-full h-[400px] bg-gray-200 rounded-xl relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center">
                                        <div className="w-0 h-0 border-l-[12px] border-l-gray-500 border-y-[8px] border-y-transparent ml-1" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 space-y-2">
                                <div className="h-2 bg-gray-200 rounded w-full" />
                                <div className="flex justify-between">
                                    <div className="h-2 bg-gray-200 rounded w-16" />
                                    <div className="h-2 bg-gray-200 rounded w-10" />
                                </div>
                            </div>
                        </div>
                    )}

                    {isError && (
                        <div className="w-full h-[400px] bg-gray-100 rounded-xl flex flex-col items-center justify-center text-center px-4">

                            <p className="text-sm font-medium text-gray-700">
                                Không tải được video
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Vui lòng kiểm tra mạng hoặc thử lại
                            </p>

                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 px-4 py-1.5 text-sm bg-[#004b91] text-white rounded-md hover:bg-[#003d75] transition cursor-pointer"
                            >
                                Thử lại
                            </button>
                        </div>
                    )}

                    {!isLoading && !isError && (
                        listVdData?.strPathAndFile ? (
                            <video
                                src={getUrlImage(listVdData?.strPathAndFile)}
                                controls
                                autoPlay
                                className="w-full rounded-lg"
                            />
                        ) : (
                            <div className="text-center text-gray-400 py-10">
                                No video
                            </div>
                        )
                    )}

                </div>
            </div>
        </div>
    );
};