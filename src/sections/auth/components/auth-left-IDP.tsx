import logo from "@/assets/images/auth/logo-itoursys-white.png"
import { useTranslation } from "react-i18next";
import Lang from "@/components/lang/lang";
const AuthLeftIDP = () => {
    const { t } = useTranslation("auth");

    return (
        <div className="flex flex-col justify-center min-h-screen w-105 ml-32">

            <div className="flex items-center justify-between mb-8">
                <img src={logo} alt="logo" className="w-55" />
                <Lang/>
            </div>

            <div className="text-white space-y-6">
                <div>
                    <p className="font-semibold text-lg mb-1">{t("suitableFor")}</p>
                    <p className="text-sm text-gray-200">
                        {t("usersAccessingSystems")}
                    </p>
                </div>

                <div>
                    <p className="font-semibold text-lg mb-2">{t("benefits")}</p>

                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-200">
                        <li>{t("benefitSingleSignOn")}</li>
                        <li>{t("benefitCentralizedManagement")}</li>
                        <li>{t("benefitSecurity")}</li>
                        <li>{t("benefitFastExperience")}</li>
                    </ul>
                </div>
            </div>

        </div>

    )
}

export default AuthLeftIDP