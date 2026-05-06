import { useRouter } from "@/routes/hooks/use-router";
import { fDateTime } from "@/utils/format-time";
import { useToastStore } from "@/zustand/useToastStore";
import { ArrowLeft, Calendar, ChevronDown, Copy, Play, Users, X } from "lucide-react";
import { useLocation } from "react-router-dom";

interface HeaderProps {
    onUpdate: () => void;
    isLocked?: boolean;
}

export const DetailTourHeader = ({ onUpdate, isLocked }: HeaderProps) => {

    const location = useLocation();
    const item = location.state?.item;

    const router = useRouter();
    const { showToast } = useToastStore();
    return (
        <div className={isLocked ? "w-full bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between font-sans opacity-50 pointer-events-none transition-opacity" : "w-full bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between font-sans"}>
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="cursor-pointer">
                    <ArrowLeft size={20} />
                </button>
                <div className="space-y-1">
                    <div className="relative group inline-block">
                        <button
                            onClick={onUpdate}
                            className="cursor-pointer flex items-center gap-2"
                        >
                            <h1 className="text-xl font-bold text-gray-800 tracking-tight">
                                {item?.strServiceName || "Chưa có tên Tour"}
                            </h1>
                        </button>

                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 
    whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded 
    opacity-0 group-hover:opacity-100 transition">
                            Click to edit
                        </span>
                    </div>

                    <div className="flex items-center gap-3 text-[13px] text-gray-500 font-normal">
                        <div className="flex items-center gap-1.5">
                            <span># {item?.strTourCode || "---"}</span>
                            <Copy onClick={() => {
                                navigator.clipboard.writeText(item?.strTourCode || "");
                                showToast("success", "Đã sao chép mã tour");
                            }} size={14} className="text-blue-400 cursor-pointer hover:text-[#004b91]" />
                        </div>
                        <span className="text-gray-300">|</span>

                        <div className="flex items-center text-gray-700 font-medium">
                            [<span className="flex items-center text-[10px] mx-0.5">{item?.strEasiaCateName}</span>]
                        </div>
                        <span className="text-gray-300">|</span>

                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            <span>{fDateTime(item?.dtmDateFrom)} - {fDateTime(item?.dtmDateTo)}</span>
                        </div>
                        <span className="text-gray-300">|</span>

                        <div className="flex items-center gap-1.5">
                            <Users size={14} />
                            <span>{item?.intTotalPax || 0}</span>
                            <button className="text-blue-400 hover:text-[#004b91]">
                                <Play size={12} className="rotate-90 fill-current" />
                            </button>
                        </div>
                        <span className="text-gray-300">|</span>

                        <div className="flex items-center gap-1">
                            <span>Ver⁺</span>
                            <div className="flex items-center gap-0.5 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 cursor-pointer">
                                <span className="font-bold text-gray-800">{item?.strVersion || 1}</span>
                                <ChevronDown size={12} />
                            </div>
                            <X size={12} className="text-gray-300 cursor-pointer hover:text-red-400" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right mr-2">
                    <div className="text-2xl text-gray-800 font-normal tracking-tight underline decoration-gray-300 underline-offset-4">
                        đ0
                    </div>
                    <div className="text-[13px] text-green-500 font-normal flex items-center justify-end gap-1">
                        <span className="text-[10px]">↑</span>0(%)
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 border border-blue-400 text-[#004b91] text-[13px] font-bold rounded-lg hover:bg-blue-50 transition-all uppercase">
                        Gửi Email
                    </button>

                    <button className="px-5 py-2 bg-[#004b91] text-white text-[13px] font-bold rounded-lg hover:bg-[#003c73] transition-all uppercase">
                        Book
                    </button>

                    <button className="px-4 py-2 bg-[#ff9800] text-white text-[13px] font-bold rounded-lg hover:bg-[#f57c00] transition-all flex items-center gap-2 uppercase">
                        <Play size={14} className="fill-current" />
                        Preview
                    </button>

                    <button className="px-4 py-2 bg-[#1e5bab] text-white text-[13px] font-bold rounded-lg hover:bg-[#154a8a] transition-all flex items-center gap-2 uppercase">
                        <Play size={14} className="fill-current" />
                        Preview PDF (Demo)
                    </button>
                </div>
            </div>
        </div>
    );
};