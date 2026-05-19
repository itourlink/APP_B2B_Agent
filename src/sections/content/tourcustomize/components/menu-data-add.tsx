import {
  Bed,
  Car,
  ImageIcon,
  Landmark,
  Pencil,
  PlusCircle,
} from "lucide-react";

import type { IServiceMenuItem } from "./service-menu";

type TranslateFn = (key: string) => string;

export const getMenuItems = (t: TranslateFn): IServiceMenuItem[] => [
  {
    icon: <Bed size={20} />,
    label: t("menuAddAccommodation"),
    value: "accommodation",
    color: "text-blue-700",
  },
  {
    icon: <Landmark size={20} />,
    label: t("menuAddTours"),
    value: "tours",
    color: "text-blue-700",
  },
  {
    icon: <Car size={20} />,
    label: t("menuAddTransportation"),
    value: "shipping",
    color: "text-blue-700",
  },
  {
    icon: <Pencil size={20} />,
    label: t("menuAddManual"),
    value: "manual",
    color: "text-blue-700",
  },
  {
    icon: <PlusCircle size={20} />,
    label: t("menuAddSingleService"),
    value: "service",
    color: "text-blue-700",
  },
  {
    icon: <ImageIcon size={20} />,
    label: t("menuAddImage"),
    value: "image",
    color: "text-blue-700",
  },
];
