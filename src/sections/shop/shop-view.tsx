import { Navigate, useLocation } from "react-router-dom";

import { paths } from "@/routes/paths";
import { useListMenu } from "@/hooks/actions/useMenu";
import { menuConfigByGUID } from "@/components/header/data-menu";


const ShopView = () => {
    const location = useLocation();

    const company =
        new URLSearchParams(location.search).get(
            "company"
        ) || "";

    const { menuData } = useListMenu();

    const firstMenu = menuData?.find(
        (item) => item?.IsShowMenu
    );

    const redirectPath =
        menuConfigByGUID[
            firstMenu?.strWebMenuGUID || ""
        ]?.link || paths.shop.tour.list;

    return (
        <Navigate
            to={`${redirectPath}?company=${company}`}
            replace
        />
    );
};

export default ShopView;