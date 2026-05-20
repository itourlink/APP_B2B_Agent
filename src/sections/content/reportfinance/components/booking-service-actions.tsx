import { useTranslate } from "@/locales";
import { Plus, Printer, Users } from "lucide-react";

const BookingServiceActions = () => {
  const { t } = useTranslate("reportfinance");

  return (
    <div className="mt-7 flex flex-wrap items-center gap-3">
      {/* Select + Add button group */}
      <div className="flex items-center overflow-visible rounded-[14px]">
        <select
          className="h-[42px] min-w-[120px] rounded-l-[12px] border-[4px] border-r-0 border-[#76c61d] bg-white px-4 text-[15px] text-gray-700 outline-none"
          defaultValue="Tour"
        >
          <option value="Tour">{t("tour")}</option>
          <option value="Hotel">{t("hotel")}</option>
          <option value="Boat">{t("boat")}</option>
          <option value="Transport">{t("transport")}</option>
          <option value="Voucher">{t("voucher")}</option>
          <option value="Restaurant">{t("restaurant")}</option>
          <option value="Guide Fee">{t("guideFee")}</option>
          <option value="Flight">{t("flight")}</option>
        </select>

        <button className="inline-flex h-[42px] items-center gap-2 rounded-r-[12px] bg-[#76c61d] px-4 text-[15px] font-medium text-white hover:bg-[#69b319]">
          <Plus size={16} />
          {t("addService")}
        </button>
      </div>

      {/* Export */}
      <button className="inline-flex h-[42px] items-center gap-2 rounded-[12px] bg-[#f2994a] px-4 text-[15px] font-medium text-white hover:bg-[#e58a39]">
        <Printer size={16} />
        {t("export")}
      </button>

      {/* Request button */}
      <button className="inline-flex h-[42px] items-center gap-2 rounded-[14px] border border-[#2f80ed] bg-white px-4 text-[15px] font-medium text-[#2f80ed] hover:bg-blue-50">
        <Users size={18} />
        {t("sendLeaderRequest")}
      </button>
    </div>
  );
};

export default BookingServiceActions;