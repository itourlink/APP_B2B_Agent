import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";
import logo from "../../../public/itourlinklogo.png";
import Lang from "../lang/lang";
import Notification from "@/sections/overlay/notification/components/notification";
import Cart from "@/sections/overlay/cart/components/cart";
import { InfoPopup } from "./info-popup";
import { useUser } from "@/hooks/actions/useAuth";
import { useIsLoggedIn, useUserStore } from "@/zustand/useUserStore";
import { CONFIG } from "@/config-global";

const Header = () => {
  const router = useRouter();
  useUser();
  const isLoggedIn = useIsLoggedIn();
  const isLoading = useUserStore((state) => state.loading);

  const company = new URLSearchParams(window.location.search).get("company");
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-2.5">
      <div className="max-w-360 mx-auto flex justify-between items-center">

        <div className="flex items-center gap-8">
          <button
            onClick={() => router.push(paths.content.info)}
            className="transition-transform active:scale-95 duration-200 cursor-pointer"
          >
            <img src={logo} alt="logo" className="h-10 w-auto object-contain cursor-pointer" />
          </button>

          <div onClick={() =>
            router.push(
              `${paths.shop.salesChannel.list}?company=${company}`
            )
          } className="hidden md:flex items-center gap-2 text-gray-500 hover:text-[#4a6fa5] font-medium text-[14px] cursor-pointer transition-all">
            <span>Thiết lập kênh bán</span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">

          <div className="flex items-center gap-1 border-r border-gray-200 pr-4 mr-2">
            <Lang />
            <Notification />
            <Cart />
          </div>

          <button onClick={() => router.push(paths.content.agentHost)} className="cursor-pointer hidden lg:block bg-[#4a6fa5] hover:bg-[#3b5b7e] text-white px-5 py-2 rounded-full font-bold text-[13px] shadow-sm shadow-blue-200 transition-all active:scale-95 uppercase tracking-wide">
            List Agent Host
          </button>

          {
            !isLoading && !isLoggedIn ? (
              <button onClick={() => window.location.href = `${CONFIG.serverUrl}auth/login`} className="cursor-pointer hidden lg:block bg-[#4a6fa5] hover:bg-[#3b5b7e] text-white px-5 py-2 rounded-full font-bold text-[13px] shadow-sm shadow-blue-200 transition-all active:scale-95 uppercase tracking-wide">
                Đăng nhập
              </button>
            )
              : (
                <InfoPopup />
              )
          }

        </div>
      </div>
    </header >
  );
};

export default Header;