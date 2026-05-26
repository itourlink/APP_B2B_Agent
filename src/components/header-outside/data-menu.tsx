import BoatIcon from "@/assets/icons/header/boat-icon";
import FlightIcon from "@/assets/icons/header/flight-icon";
import GuidefeeIcon from "@/assets/icons/header/guidefee-icon";
import HotelIcon from "@/assets/icons/header/hotel-icon";
import RestaurantIcon from "@/assets/icons/header/restaurant-icon";
import TourIcon from "@/assets/icons/header/tour-icon";
import TransportIcon from "@/assets/icons/header/transport-icon";
import VoucherIcon from "@/assets/icons/header/voucher-icon";

import { paths } from "@/routes/paths";

const COMMON_MATCH = [
  paths.shop.search,
  paths.booking.paymentBooking,
];

export const menuConfigByGUID: Record<string, any> = {
  "1b7a2657-18eb-4703-8573-fa43b8dda001": {
    type: "tour",
    link: paths.shop.tour.list,
    match: [
      paths.shop.tour.list,
      paths.shop.tour.detail,
      ...COMMON_MATCH,
    ],
    icon: <TourIcon width="18px" height="18px" />,
  },

  "2b7a2657-18eb-4703-8573-fa43b8dda001": {
    type: "hotel",
    link: paths.shop.hotel.list,
    match: [
      paths.shop.hotel.list,
      paths.shop.hotel.detail,
      ...COMMON_MATCH,
    ],
    icon: <HotelIcon width="18px" height="18px" />,
  },

  "3b7a2657-18eb-4703-8573-fa43b8dda001": {
    type: "boat",
    link: paths.shop.boat.list,
    match: [
      paths.shop.boat.list,
      paths.shop.boat.detail,
      ...COMMON_MATCH,
    ],
    icon: <BoatIcon width="18px" height="18px" />,
  },

  "4b7a2657-18eb-4703-8573-fa43b8dda001": {
    type: "vehicle",
    link: paths.shop.vehicle.list,
    match: [
      paths.shop.vehicle.list,
      paths.shop.vehicle.detail,
      ...COMMON_MATCH,
    ],
    icon: <TransportIcon width="18px" height="18px" />,
  },

  "5b7a2657-18eb-4703-8573-fa43b8dda001": {
    type: "voucher",
    link: paths.shop.voucher.list,
    match: [
      paths.shop.voucher.list,
      ...COMMON_MATCH,
    ],
    icon: <VoucherIcon width="18px" height="18px" />,
  },

  "6b7a2657-18eb-4703-8573-fa43b8dda001": {
    type: "restaurant",
    link: paths.shop.restaurant.list,
    match: [
      paths.shop.restaurant.list,
      paths.shop.restaurant.detail,
      ...COMMON_MATCH,
    ],
    icon: <RestaurantIcon width="18px" height="18px" />,
  },

  "7b7a2657-18eb-4703-8573-fa43b8dda001": {
    type: "guide",
    link: paths.shop.guide.list,
    match: [
      paths.shop.guide.list,
      paths.shop.guide.detail,
      ...COMMON_MATCH,
    ],
    icon: <GuidefeeIcon width="18px" height="18px" />,
  },

  "8b7a2657-18eb-4703-8573-fa43b8dda001": {
    type: "flight",
    link: paths.shop.flight.list,
    match: [
      paths.shop.flight.list,
      paths.shop.flight.detail,
      ...COMMON_MATCH,
    ],
    icon: <FlightIcon width="18px" height="18px" />,
  },
};

export const buildMenu = (
  apiMenu: any[] = [],
) => {
  return apiMenu
    ?.filter((item) => item?.IsShowMenu)
    ?.map((item) => {
      const config =
        menuConfigByGUID[item.strWebMenuGUID];

      if (!config) return null;

      return {
        id: item.strWebMenuGUID,
        title: item.strMenuName || "",
        type: config.type,
        link: config.link,
        match: config.match,
        icon: config.icon,
      };
    })
    .filter(Boolean);
};