import { useEffect, useMemo, useState } from "react";
import { useListMenu } from "@/hooks/actions/useMenu";

// views
// import TourView from "@/sections/tour/view/tour-view";
// import RestaurantView from "@/sections/restaurant/view/restaurant-view";
// import BoatView from "@/sections/boat/view/boat-view";
// import HotelView from "@/sections/hotel/view/hotel-view";
// import VehicleView from "@/sections/vehicle/view/vehicle-view";
// import FlightView from "@/sections/flight/view/flight-view";
// import VoucherView from "@/sections/voucher/view/voucher-view";
// import GuideView from "@/sections/guide/view/guide-view";

const ShopView = () => {
    const { menuData } = useListMenu();

    // map component theo GUID
    // const componentMap = useMemo(() => ({
    //     "1b7a2657-18eb-4703-8573-fa43b8dda001": <TourView />,
    //     "2b7a2657-18eb-4703-8573-fa43b8dda001": <HotelView />,
    //     "3b7a2657-18eb-4703-8573-fa43b8dda001": <BoatView />,
    //     "4b7a2657-18eb-4703-8573-fa43b8dda001": <VehicleView />,
    //     "5b7a2657-18eb-4703-8573-fa43b8dda001": <VoucherView />,
    //     "6b7a2657-18eb-4703-8573-fa43b8dda001": <RestaurantView />,
    //     "7b7a2657-18eb-4703-8573-fa43b8dda001": <GuideView />,
    //     "8b7a2657-18eb-4703-8573-fa43b8dda001": <FlightView />,
    // }), []);

    const firstMenuGUID = menuData?.[0]?.strWebMenuGUID;

    const [activeMenu, setActiveMenu] = useState<string>("");

    useEffect(() => {
        if (firstMenuGUID) {
            setActiveMenu(firstMenuGUID);
        }
    }, [firstMenuGUID]);

    // const renderContent = () => {
    //     return (
    //         componentMap[
    //         activeMenu as keyof typeof componentMap
    //         ] || <div>Không có dữ liệu</div>
    //     );
    // };

    return (
        <div className="space-y-5">
            {/* menu */}
            <div className="flex flex-wrap items-center gap-3">
                {menuData?.map((item: any) => {
                    const isActive =
                        activeMenu === item?.strWebMenuGUID;

                    return (
                        <button
                            key={item?.strWebMenuGUID}
                            onClick={() =>
                                setActiveMenu(item?.strWebMenuGUID)
                            }
                            className={`
                                px-4 py-2 rounded-lg border text-sm font-medium transition-all
                                ${isActive
                                    ? "bg-[#004b91] text-white border-[#004b91]"
                                    : "bg-white text-gray-700 hover:bg-blue-50"
                                }
                            `}
                        >
                            {item?.strMenuName}
                        </button>
                    );
                })}
            </div>

            {/* content */}
            <div>
                {/* {renderContent()} */}
            </div>
        </div>
    );
};

export default ShopView;