import { LogIn } from "lucide-react";
import { paths } from "@/routes/paths";
import logo from "../../../public/favicon.png";
import Lang from "../lang/lang";
import Currency from "../currency/currency";
import { useRouter } from "@/routes/hooks/use-router";
import { CONFIG } from "@/config-global";
import AuthUserInfo from "@/sections/auth/components/auth-user-info";
import { useUser } from "@/hooks/actions/useAuth";
import Notification from "@/sections/notification/components/notification";

import CartIcon from "@/sections/cart/components/cart-icon";
import TourCustomized from "@/sections/tour-customized/tour-customized";
import { useTranslate } from "@/locales";
import { useLocation } from "react-router-dom";

const HeaderOutside = () => {
  const { t } = useTranslate("header")
  const { pathname } = useLocation();

  const hideCurrency = pathname.includes("/booking/payment-booking");
  const isTariff = pathname.includes("/tariff");
  const router = useRouter();
  const { user, userLoading } = useUser();

  const company =
    new URLSearchParams(location.search).get("company") || "";

  const handleLogin = async () => {

    if (company) {
      localStorage.setItem("company", company);
    }


    window.location.href = `${CONFIG.serverUrl}auth/login`;

  };

  const renderAuthGroup = () => {
    if (userLoading) {
      return (
        <div className="flex w-20.25 h-10 animate-pulse bg-slate-100 rounded-lg border border-slate-200" />
      );
    }

    if (user) {
      return <AuthUserInfo />;
    }

    return (
      <button onClick={() => handleLogin()} className="cursor-pointer flex w-auto h-10 relative justify-center items-center rounded-lg border border-[rgba(64,64,64,0.5)] hover:bg-slate-50">
        <button

          className="w-10 flex justify-center cursor-pointer transition-colors"
        >
          <LogIn color="#000000" size={18} />
        </button>
      </button>
    );
  };


  return (
    <div className="bg-white px-6 fixed top-0 left-0 w-full z-51 shadow h-30 flex flex-col justify-center gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <button onClick={() =>
            router.push(`${paths.shop.home}?company=${company}`)
          } className="overflow-hidden w-10 cursor-pointer">
            <img src={logo} alt="logo" className="w-full h-full object-contain cursor-pointer" />
          </button>
          {!isTariff && (
            <>
              <div className="h-10 w-px bg-[rgba(64,64,64,0.5)]" />
              <button onClick={() =>
                router.push(
                  `${paths.shop.salesChannel.list}?company=${company}`
                )
              } className="cursor-pointer rounded-lg px-3 py-2 text-[14px] font-medium text-gray-700 hover:text-[#2566b0] hover:bg-blue-50 transition-all duration-200 active:scale-95">
                {t("salesChannelSetup")}
              </button>
            </>
          )}
        </div>
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <Lang />
            {!hideCurrency && !isTariff && <Currency />}
            {!isTariff && (
              <>
                <CartIcon />
                <Notification />
                <button onClick={() => window.open("https://myagentmember.itourlink.com/request-booking", "_blank")} className="cursor-pointer rounded-lg border border-[rgba(64,64,64,0.5)] px-3 py-2 text-[14px] font-medium text-gray-700 hover:text-[#2566b0] hover:bg-blue-50 transition-all duration-200 active:scale-95">
                  {t("myRequest")}
                </button>
                <TourCustomized />
                <button onClick={() => router.push(
                  `${paths.shop.agentCompany.list}?company=${company}`
                )} className="cursor-pointer rounded-lg border border-[rgba(64,64,64,0.5)] px-3 py-2 text-[14px] font-medium text-gray-700 hover:text-[#2566b0] hover:bg-blue-50 transition-all duration-200 active:scale-95">
                  {t("listAgentHost")}
                </button>
              </>
            )}
          </div>
          <div className="ml-2">
            {renderAuthGroup()}
          </div>
        </div>
      </div>
    </div >
  );
};

export default HeaderOutside;

