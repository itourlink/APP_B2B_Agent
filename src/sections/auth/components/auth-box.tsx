import type React from "react"
import bgAuth from "@/assets/images/auth/img-bg-login.jpg"
import AuthLeftIDP from "./auth-left-IDP"
import { useTranslate } from "@/locales"

interface Props {
    title?: string
    subtitle?: string
    link?: string
    children: React.ReactNode
}
const AuthBox = ({ title, subtitle, link, children }: Props) => {
    const { t } = useTranslate("auth")
    return (
        <>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
            <div className="min-h-screen relative  bg-black/40 bg-blend-overlay">
                <img
                    src={bgAuth}
                    className="absolute inset-0 w-full h-full -z-10"
                />
                <div className="min-h-screen flex items-center">

                    <div className="w-[55%] flex justify-center">
                        <AuthLeftIDP />
                    </div>

                    <div className="w-[45%] flex justify-start">
                        <div className="w-full max-w-115 p-6 rounded-2xl bg-white/20 backdrop-blur-md">
                            <div className="text-[24px] text-white font-bold text-center">
                                {title}
                            </div>

                            <div>
                                {children}
                            </div>

                            <div className="flex items-center justify-center gap-3 text-[14px] mt-5 text-white">
                                <div>{subtitle}</div>
                                <div className="hover:underline underline-offset-4 cursor-pointer">
                                    {link}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full px-6 py-3 
flex justify-between items-center text-white text-xs
bg-black/20 backdrop-blur-sm">
                    <div>{t("poweredBy")}</div>
                    <div className="flex items-center gap-3">

                        <div className="cursor-pointer hover:underline underline-offset-4">
                            {t("privacyPolicy")}
                        </div>
                        <div className="">|</div>
                        <div className="cursor-pointer hover:underline underline-offset-4">
                            {t("terms")}
                        </div>
                        <div className="">|</div>
                        <div className="cursor-pointer hover:underline underline-offset-4">
                            {t("help")}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AuthBox