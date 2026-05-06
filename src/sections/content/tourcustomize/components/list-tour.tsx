import { useState } from "react";
import {
  MapPin, ChevronsUpDown, Menu, Trash2, ChevronDown, RefreshCw,
  Bed, Landmark, Car, Pencil, PlusCircle, Image as ImageIcon
} from "lucide-react";
import ServiceMenu, { type IServiceMenuItem } from "./service-menu";
import { getUrlImage } from "@/utils/format-image";
import { isValidValue } from "@/utils/utilts";

const MENU_ITEMS: IServiceMenuItem[] = [
  { icon: <Bed size={20} />, label: 'Thêm chỗ nghỉ', value: 'accommodation', color: 'text-blue-700' },
  { icon: <Landmark size={20} />, label: 'Thêm Chuyến Tham quan', value: 'excursion', color: 'text-blue-700' },
  { icon: <Car size={20} />, label: 'Thêm Dịch vụ Vận chuyển', value: 'transport', color: 'text-blue-700' },
  { icon: <Pencil size={20} />, label: 'Thêm Thủ Công', value: 'manual', color: 'text-blue-700' },
  { icon: <PlusCircle size={20} />, label: 'Thêm Dịch Vụ Đơn', value: 'single_service', color: 'text-blue-700' },
  { icon: <ImageIcon size={20} />, label: 'Add Image', value: 'image', color: 'text-blue-700' },
];

interface Props {
  item: any[]; // ❗ đổi từ item -> items
  onChange: (value: string) => void;
}

const ListTour = ({ item, onChange }: Props) => {
  const [showMenu, setShowMenu] = useState(false);

  const parseLocations = (str: string) => {
    if (!str) return [];

    return str
      .split("#")
      .filter(Boolean)
      .map((item) => {
        const parts = item.split("!");
        return {
          name: parts[1],
        };
      });
  };

  const firstItem = item?.[0];

  const locations = parseLocations(String(firstItem?.strListLocation));


  const renderRow = (item: any, index: number) => {
    const safe = (val: any) =>
      typeof val === "object" ? "" : val ?? "";

    return (
      <tr
        key={item?.id ?? index}
        className="border-b border-gray-50 hover:bg-gray-50 transition-colors group"
      >
        <td className="px-4 py-4 text-[13px] text-gray-600">
          {index + 1}
        </td>

        <td className="px-4 py-4">
          <div className="w-[100px] h-[60px] rounded-lg overflow-hidden border border-gray-100 shadow-sm">
            <img
              src={getUrlImage(String(item?.strImage ?? ""))}
              alt={safe(item?.strSupplierName)}
              className="w-full h-full object-cover"
            />
          </div>
        </td>

        <td className="px-4 py-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold text-[#333] uppercase tracking-tight">
                {safe(item?.strSupplierName)}
              </span>
              <RefreshCw size={14} className="text-[#0057a8] rotate-90" />
            </div>

            <div className="text-[12px] text-gray-500">
              ({safe(item?.strCateName)})
            </div>

            <div className="flex items-center gap-1 border border-gray-300 rounded px-2 py-1 w-fit bg-white cursor-pointer hover:border-gray-400 transition-colors">
              <div className="flex text-[#333]">
                {safe(item?.strListEasiaCateName)}
              </div>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
          </div>
        </td>

        <td className="px-4 py-4 text-[13px] text-gray-700 font-medium">
          {safe(item?.strServiceNameMain)}
        </td>

        <td className="px-4 py-4 text-[13px] text-gray-700">
          {safe(item?.intNoOfDay)}
        </td>

        <td className="px-4 py-4 text-[14px] text-gray-800 font-bold text-right">
          {safe(item?.strQuantity)}
        </td>

        <td className="px-4 py-4 text-[14px] text-gray-800 font-bold text-right">
          ₫{isValidValue(item?.dblPriceCost)}
        </td>

        <td className="px-4 py-4 text-[14px] text-gray-800 font-bold text-right">
          ₫{isValidValue(item?.dblPriceCostUnit)}
        </td>

        <td className="px-4 py-4">
          <div className="flex justify-center">
            <button className="bg-[#f2f4f7] p-2 rounded-md hover:bg-red-50 hover:text-red-600 transition-all text-gray-500">
              <Trash2 size={18} />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="w-full bg-white font-sans">
      <div className="flex items-center gap-5">
        <h3 className="text-lg font-bold text-gray-800">
          Ngày {isValidValue(firstItem?.intDayOrder)}
        </h3>
        <h3 className="text-lg font-bold text-gray-800">
          {isValidValue(firstItem?.strDayTitle)}
        </h3>
      </div>
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <div className="flex items-center gap-4 text-gray-700">
          <MapPin size={20} className="fill-current" />

          <div className="flex flex-wrap gap-2">
            {locations.map((loc, idx) => (
              <span
                key={idx}
                className="border border-[#4a6fa5] p-1 rounded-sm text-[#4a6fa5]"
              >
                {loc.name}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#e9f2ff] text-[#4a83d4] p-1.5 rounded-md cursor-pointer hover:bg-[#d0e4ff] transition-colors">
            <ChevronsUpDown size={18} />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
            >
              <Menu size={20} />
            </button>

            {showMenu && (
              <div className="absolute left-[-200px] top-full mt-2 z-50">
                <ServiceMenu
                  items={MENU_ITEMS}
                  onChange={(value) => {
                    onChange(value);
                    setShowMenu(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-[12px] text-gray-500 font-medium border-b border-gray-100 uppercase tracking-tight">
              <th className="px-4 py-3 text-left w-12 font-normal">STT</th>
              <th className="px-4 py-3 text-left w-24 font-normal">Image</th>
              <th className="px-4 py-3 text-left font-normal uppercase">Service</th>
              <th className="px-4 py-3 text-left font-normal uppercase">Description</th>
              <th className="px-4 py-3 text-left font-normal uppercase">No Of Days</th>
              <th className="px-4 py-3 text-left font-normal uppercase">Quantity</th>
              <th className="px-4 py-3 text-right font-normal uppercase">Price</th>
              <th className="px-4 py-3 text-right font-normal uppercase">Price per pax</th>
              <th className="px-4 py-3 text-center w-20 font-normal uppercase">Thao tác</th>
            </tr>
          </thead>

          <tbody>

            {(item ?? [])
              .filter(i => i?.strDayShiftName !== "Night")
              .map((item, index) => renderRow(item, index))}

            {item.some(i => i?.strDayShiftName === "Night") && (
              <>
                <tr className="bg-blue-50">
                  <td colSpan={9} className="px-4 py-2 text-[13px] font-bold text-gray-600">
                    Night
                  </td>
                </tr>

                {item
                  .filter(i => i?.strDayShiftName === "Night")
                  .map((item, index) => renderRow(item, index))
                }
              </>
            )}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListTour;