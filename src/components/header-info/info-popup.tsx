import { CONFIG } from "@/config-global"
import type { IUser } from "@/hooks/interfaces/auth"
import { useRouter } from "@/routes/hooks/use-router"
import { paths } from "@/routes/paths"
import { getUrlImage } from "@/utils/format-image"
import { isValidValue } from "@/utils/utilts"
import { useUserStore } from "@/zustand/useUserStore"
import { AnimatePresence, motion } from "framer-motion"
import { ClipboardList, LogOut, User } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

export const InfoPopup = () => {
    const [open, setOpen] = useState(false)
    const user = useUserStore((state) => state.user);
    const isLoading = useUserStore((state) => state.loading);

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <button className="flex justify-center items-center p-1 gap-2 border border-gray-200 rounded-full hover:shadow-md transition-shadow cursor-pointer bg-gray-50/50">
                <div className="w-8 h-8 bg-blue-100 text-[#4a6fa5] flex items-center justify-center rounded-full overflow-hidden">
                    {user?.strAvatar ?
                        <img src={getUrlImage(user?.strAvatar)} alt={user?.strAvatar} className="w-full h-full object-cover" />
                        :
                        <User size={18} fill="#4a6fa5" />
                    }
                </div>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 z-50"
                    >
                        <InfoCard user={user} isLoading={isLoading} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

interface Props {
    user: IUser | null
    isLoading: boolean
}
const InfoCard = ({ user, isLoading }: Props) => {
    const { t } = useTranslation("header")
    const router = useRouter()

    const handleLogout = async () => {
        window.location.href = `${CONFIG.serverUrl}auth/logout`;
    };

    return (
        <div className="relative">
            <div className="absolute right-0 top-[120%] pt-2 w-70">
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden z-50 p-2 shadow-2xl border border-gray-100">

                    {isLoading ? (
                        <div className="space-y-2">
                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                            <div className="h-3 w-40 bg-gray-100 rounded animate-pulse" />
                        </div>
                    ) : (
                        <>
                            <div className="px-4 py-3 border-b border-gray-50">
                                <div className="text-[15px] font-bold text-gray-800 leading-tight"> {isValidValue(user?.strFullName)} </div>
                                <div className="text-[12px] text-gray-400 font-normal mt-0.5 tracking-tight"> {isValidValue(user?.strEmail)}
                                </div>
                            </div>
                        </>
                    )}

                    <div className="space-y-0.5">
                        <button onClick={() => router.push(paths.content.info)} className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-600 hover:bg-blue-50 hover:text-[#004b91] rounded-xl transition-all group">
                            <User size={16} className="text-gray-400 group-hover:text-[#004b91]" />
                            <span className="font-medium">{t("information")}</span>
                        </button>

                        <button onClick={() => router.push(paths.content.service)} className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-600 hover:bg-blue-50 hover:text-[#004b91] rounded-xl transition-all group">
                            <ClipboardList size={16} className="text-gray-400 group-hover:text-[#004b91]" />
                            <span className="font-medium">{t("serviceBookingList")}</span>
                        </button>

                        <div className="my-1 border-t border-gray-50" />

                        <button onClick={() => handleLogout()} className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 rounded-xl transition-all group">
                            <LogOut size={16} className="text-red-400" />
                            <span className="font-medium">{t("logout")}</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};