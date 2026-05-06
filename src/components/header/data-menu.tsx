import BoatIcon from "@/assets/icons/header/boat-icon";
import FlightIcon from "@/assets/icons/header/flight-icon";
import GuidefeeIcon from "@/assets/icons/header/guidefee-icon";
import HotelIcon from "@/assets/icons/header/hotel-icon";
import RestaurantIcon from "@/assets/icons/header/restaurant-icon";
import TourIcon from "@/assets/icons/header/tour-icon";
import TransportIcon from "@/assets/icons/header/transport-icon";
import VoucherIcon from "@/assets/icons/header/voucher-icon";
import { paths } from "@/routes/paths";

// map theo GUID
const menuConfigByGUID: Record<string, any> = {
  "1b7a2657-18eb-4703-8573-fa43b8dda001": {
    link: paths.tour.list,
    match: [paths.tour.list, paths.tour.detail],
    icon: <TourIcon width="18px" height="18px" />,
  },
  "2b7a2657-18eb-4703-8573-fa43b8dda001": {
    link: paths.hotel.list,
    match: [paths.hotel.list, paths.hotel.detail],
    icon: <HotelIcon width="18px" height="18px" />,
  },
  "3b7a2657-18eb-4703-8573-fa43b8dda001": {
    link: paths.boat.list,
    match: [paths.boat.list, paths.boat.detail],
    icon: <BoatIcon width="18px" height="18px" />,
  },
  "4b7a2657-18eb-4703-8573-fa43b8dda001": {
    link: paths.vehicle.list,
    match: [paths.vehicle.list, paths.vehicle.detail],
    icon: <TransportIcon width="18px" height="18px" />,
  },
  "5b7a2657-18eb-4703-8573-fa43b8dda001": {
    link: paths.voucher.list,
    match: [paths.voucher.list],
    icon: <VoucherIcon width="18px" height="18px" />,
  },
  "6b7a2657-18eb-4703-8573-fa43b8dda001": {
    link: paths.restaurant.list,
    match: [paths.restaurant.list, paths.restaurant.detail],
    icon: <RestaurantIcon width="18px" height="18px" />,
  },
  "7b7a2657-18eb-4703-8573-fa43b8dda001": {
    link: paths.guide.list,
    match: [paths.guide.list],
    icon: <GuidefeeIcon width="18px" height="18px" />,
  },
  "8b7a2657-18eb-4703-8573-fa43b8dda001": {
    link: paths.flight.list,
    match: [paths.flight.list, paths.flight.detail],
    icon: <FlightIcon width="18px" height="18px" />,
  },
};

// build menu từ API
export const buildMenu = (apiMenu: any[] = []) => {
  return apiMenu
    ?.filter(item => item?.IsShowMenu)
    ?.map(item => {
      const config = menuConfigByGUID[item.strWebMenuGUID];

      if (!config) return null;

      return {
        id: item.strWebMenuGUID,
        title: item.strMenuName || "",
        link: config.link,
        match: config.match,
        icon: config.icon,
      };
    })
    .filter(Boolean);
};