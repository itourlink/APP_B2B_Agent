import { useState, useRef, useEffect } from "react";
import { useUser } from "@/hooks/actions/useAuth";
import { User, LogOut, ChevronDown } from "lucide-react";
import { getUrlImage } from "@/utils/format-image";
import { CONFIG } from "@/config-global";
import { truncateEmail, truncateText } from "@/utils/format-number";
import { isValidValue } from "@/utils/utilts";
import { useTranslate } from "@/locales";

const AuthUserInfo = () => {
    const { user, userLoading } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslate("header")

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (userLoading) return <div className="animate-pulse">Loading...</div>;
    if (!user) return null;

    const handleLogout = async () => {
        window.location.href = `${CONFIG.serverUrl}auth/logout`;
    };

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition-all cursor-pointer"
            >

                {isValidValue(user?.strAvatar) ?

                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white overflow-hidden">
                        <img src={getUrlImage(isValidValue(user?.strAvatar))} alt={isValidValue(user?.strAvatar)} className="w-full h-full object-cover" />
                    </div>
                    :
                    <div className="w-8 h-8 bg-[#2566b0] rounded-full flex items-center justify-center text-white">
                        <User size={20} />
                    </div>

                }

                <span className="font-medium text-slate-700">{truncateText(isValidValue(user?.strFullName), 10) || "User"}</span>
                <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-4 z-50">
                    <div className="px-4 pb-3 border-b border-slate-50">
                        <p className="font-bold text-slate-800">{truncateText(isValidValue(user?.strFullName), 10)}</p>
                        <p className="text-sm text-slate-400 truncate">{truncateEmail(isValidValue(user?.strEmail), 10)}</p>
                    </div>

                    <div className="mt-2">
                        <button onClick={() => {
                            // router.push(paths.content.info);
                            window.open("https://myagentmember.itourlink.com", "_blank");
                        }} className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 transition-colors text-sm">
                            <User size={18} /> {t("profile")}
                        </button>
                        {/* <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 transition-colors text-sm">
                            <FileText size={18} /> Đơn đặt của tôi
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 transition-colors text-sm">
                            <Heart size={18} /> Yêu thích
                        </button> */}
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-50">
                        <button onClick={() => handleLogout()} className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition-colors font-medium text-sm">
                            <LogOut size={18} /> {t("logout")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuthUserInfo;