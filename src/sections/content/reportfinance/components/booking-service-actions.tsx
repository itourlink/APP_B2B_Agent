import { Plus, Printer, Users } from "lucide-react";

const BookingServiceActions = () => {
  return (
    <div className="mt-7 flex flex-wrap items-center gap-3">
      {/* Select + Add button group */}
      <div className="flex items-center overflow-visible rounded-[14px]">
        <select
          className="h-[42px] min-w-[120px] rounded-l-[12px] border-[4px] border-r-0 border-[#76c61d] bg-white px-4 text-[15px] text-gray-700 outline-none"
          defaultValue="Tour"
        >
          <option value="Tour">Tour</option>
          <option value="Hotel">Hotel</option>
          <option value="Boat">Boat</option>
          <option value="Transport">Transport</option>
          <option value="Voucher">Voucher</option>
          <option value="Restaurant">Restaurant</option>
          <option value="Guide Fee">Guide Fee</option>
          <option value="Flight">Flight</option>
        </select>

        <button className="inline-flex h-[42px] items-center gap-2 rounded-r-[12px] bg-[#76c61d] px-4 text-[15px] font-medium text-white hover:bg-[#69b319]">
          <Plus size={16} />
          Thêm dịch vụ
        </button>
      </div>

      {/* Export */}
      <button className="inline-flex h-[42px] items-center gap-2 rounded-[12px] bg-[#f2994a] px-4 text-[15px] font-medium text-white hover:bg-[#e58a39]">
        <Printer size={16} />
        Export
      </button>

      {/* Request button */}
      <button className="inline-flex h-[42px] items-center gap-2 rounded-[14px] border border-[#2f80ed] bg-white px-4 text-[15px] font-medium text-[#2f80ed] hover:bg-blue-50">
        <Users size={18} />
        Gửi yêu cầu thiết lập tài khoản cho Leader
      </button>
    </div>
  );
};

export default BookingServiceActions;