import { Bed, Car, ImageIcon, Landmark, Pencil, PlusCircle } from "lucide-react";
import type { IServiceMenuItem } from "./service-menu";

export const MENU_ITEMS: IServiceMenuItem[] = [
  {
    icon: <Bed size={20} />,
    label: "Thêm chỗ nghỉ",
    value: "accommodation",
    color: "text-blue-700",
  },
  {
    icon: <Landmark size={20} />,
    label: "Thêm Chuyến Tham quan",
    value: "excursion",
    color: "text-blue-700",
  },
  {
    icon: <Car size={20} />,
    label: "Thêm Dịch vụ Vận chuyển",
    value: "transport",
    color: "text-blue-700",
  },
  {
    icon: <Pencil size={20} />,
    label: "Thêm Thủ Công",
    value: "manual",
    color: "text-blue-700",
  },
  {
    icon: <PlusCircle size={20} />,
    label: "Thêm Dịch Vụ Đơn",
    value: "single_service",
    color: "text-blue-700",
  },
  {
    icon: <ImageIcon size={20} />,
    label: "Add Image",
    value: "image",
    color: "text-blue-700",
  },
];