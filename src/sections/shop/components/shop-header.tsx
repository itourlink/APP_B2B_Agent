import { LogIn } from "lucide-react";
import { useLocation } from "react-router-dom";

import logo from "../../../../public/favicon.png";

import Lang from "@/components/lang/lang";
import Currency from "@/components/currency/currency";
import Notification from "@/sections/notification/components/notification";
import CartIcon from "@/sections/cart/components/cart-icon";
import TourCustomized from "@/sections/tour-customized/tour-customized";
import Tariff from "@/sections/tariff/components/tariff";

import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";
import { CONFIG } from "@/config-global";

import AuthUserInfo from "@/sections/auth/components/auth-user-info";
import { useUser } from "@/hooks/actions/useAuth";
import { useListMenu } from "@/hooks/actions/useMenu";
import { useEffect } from "react";
import { buildMenu } from "@/components/header-outside/data-menu";
import { useTranslate } from "@/locales";

const ShopHeader = () => {
    const router = useRouter();
    const location = useLocation();
    const { t } = useTranslate("header")
    useTranslate("noti")

    const pathname = location.pathname;

    const company =
        new URLSearchParams(location.search).get("company") || "";

    // ===== SEARCH =====
    const searchType =
        new URLSearchParams(location.search).get("type") || "tour";

    const isSearchPage = pathname === paths.shop.search;

    const searchMenuMap: Record<string, string> = {
        tour: paths.shop.tour.list,
        hotel: paths.shop.hotel.list,
        boat: paths.shop.boat.list,
        vehicle: paths.shop.vehicle.list,
        restaurant: paths.shop.restaurant.list,
        guide: paths.shop.guide.list,
        flight: paths.shop.flight.list,
        voucher: paths.shop.voucher.list,
    };

    const { menuData } = useListMenu();
    const menu = buildMenu(menuData || [], t);

    const { user, userLoading } = useUser();

    const handleLogin = async () => {
        if (company) {
            localStorage.setItem("company", company);
        }

        window.location.href = `${CONFIG.serverUrl}auth/login`;
    };

    const renderAuthGroup = () => {
        if (userLoading) {
            return (
                <div className="flex w-20 h-10 animate-pulse bg-slate-100 rounded-lg border border-slate-200" />
            );
        }

        if (user) {
            return <AuthUserInfo />;
        }

        return (
            <button
                onClick={handleLogin}
                className="cursor-pointer flex w-auto h-10 relative justify-center items-center rounded-lg border border-[rgba(64,64,64,0.5)] hover:bg-slate-50"
            >
                <div className="w-10 flex justify-center cursor-pointer transition-colors">
                    <LogIn color="#000000" size={18} />
                </div>
            </button>
        );
    };

    const isPathMatch = (item: any) => {
        // SEARCH PAGE => KHÔNG CHECK MATCH THƯỜNG
        if (isSearchPage) {
            return false;
        }

        return item.match?.some((p: string) => {
            return pathname === p || pathname.startsWith(p + "/");
        });
    };

    const hasActive = menu?.some(
        (item) => item && isPathMatch(item)
    );

    const isAgentCompanyPage =
        pathname.startsWith(paths.shop.agentCompany.list);

    const isSaleChannelPage =
        pathname.startsWith(paths.shop.salesChannel.list);

    const isCartPage =
        pathname.startsWith(paths.shop.cart.list);
    const isNotificationPage =
        pathname.startsWith(paths.shop.notification.list);

    useEffect(() => {

        // SEARCH PAGE => KHÔNG REDIRECT
        if (isSearchPage || isAgentCompanyPage || isSaleChannelPage || isCartPage || isNotificationPage) return;

        const firstItem = menu[0];

        if (!firstItem?.link) return;

        if (!hasActive && !isAgentCompanyPage && !isSaleChannelPage && !isCartPage && !isNotificationPage) {
            const pathname = firstItem.link.split("?")[0];

            const search = company
                ? `?company=${company}`
                : "";

            router.replace({
                pathname,
                search,
            });
        }
    }, [
        menu,
        hasActive,
        company,
        isSearchPage,
        router,
    ]);

    const handleNavigate = (link?: string) => {
        if (!link) return;

        const hasCompanyInUrl = link.includes("company=");

        if (!company && !hasCompanyInUrl) {
            router.push(paths.content.agent);
            return;
        }

        const url = company
            ? `${link.split("?")[0]}?company=${company}`
            : link;

        router.push(url);
    };

    return (
        <div className="bg-white px-6 sticky top-0 left-0 w-full z-50 shadow h-30 flex flex-col justify-center gap-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() =>
                            window.location.href = "https://myagentmarket.itourlink.com"
                            // window.location.href = "http://localhost:5177/"

                        }
                        className="overflow-hidden w-10 cursor-pointer"
                    >
                        <img
                            src={logo}
                            alt="logo"
                            className="w-full h-full object-contain"
                        />
                    </button>

                    <div className="h-10 w-px bg-[rgba(64,64,64,0.5)]" />

                    <button
                        onClick={() => window.open("https://myagentmember.itourlink.com/agent", "_blank")}
                        // onClick={() => window.location.href = "http://localhost:5177/"}
                        className="cursor-pointer rounded-lg px-3 py-2 text-[14px] font-medium text-gray-700 hover:text-[#2566b0] hover:bg-blue-50 transition-all duration-200 active:scale-95"
                    >
                        {t("member")}
                    </button>

                    <div className="h-10 w-px bg-[rgba(64,64,64,0.5)]" />

                    <button
                        onClick={() =>
                            router.push(
                                `${paths.shop.salesChannel.list}?company=${company}`
                            )
                        }
                        className="cursor-pointer rounded-lg px-3 py-2 text-[14px] font-medium text-gray-700 hover:text-[#2566b0] hover:bg-blue-50 transition-all duration-200 active:scale-95"
                    >
                        {t("salesChannelSettings")}
                    </button>
                </div>

                <div className="flex items-center">
                    <div className="flex items-center gap-2">
                        <Lang />
                        <Currency />
                        <CartIcon />
                        <Notification />

                        <button
                            onClick={() =>
                                router.push(
                                    `${paths.shop.agentCompany.list}?company=${company}`
                                )
                            }
                            className="cursor-pointer rounded-lg border border-[rgba(64,64,64,0.5)] px-3 py-2 text-[14px] font-medium text-gray-700 hover:text-[#2566b0] hover:bg-blue-50 transition-all duration-200 active:scale-95"
                        >
                            {t("listAgentHost")}
                        </button>

                        <TourCustomized />
                        <Tariff />

                        <button
                            onClick={() => window.open("https://myagentmember.itourlink.com/request-booking", "_blank")}
                            className="cursor-pointer rounded-lg border border-[rgba(64,64,64,0.5)] px-3 py-2 text-[14px] font-medium text-gray-700 hover:text-[#2566b0] hover:bg-blue-50 transition-all duration-200 active:scale-95"
                        >
                            {t("myRequest")}
                        </button>
                    </div>

                    <div className="ml-2">
                        {renderAuthGroup()}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-5 overflow-x-auto">
                {menu?.length > 0 && (
                    <div className="flex items-center gap-5 overflow-x-auto">
                        {menu.map((item) => {
                            if (!item) return null;

                            const isActive = isSearchPage
                                ? item.link === searchMenuMap[searchType]
                                : isPathMatch(item);

                            return (
                                <div
                                    key={item.id}
                                    onClick={() => handleNavigate(item.link)}
                                    className={`
                        flex items-center gap-2 p-1 cursor-pointer 
                        transition-all whitespace-nowrap
                        ${isActive
                                            ? "text-[#2566b0] font-semibold"
                                            : "text-gray-700 hover:text-[#2566b0] font-semibold"
                                        }
                    `}
                                >
                                    <div>{item.icon}</div>
                                    <div className="text-[14px]">
                                        {item.title}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopHeader;