import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, Minus, ChevronDown, Save } from "lucide-react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";

// Định nghĩa kiểu dữ liệu cho số lượng khách
interface GuestCounts {
  adult: number;
  child: number;
}

const BookingCard: React.FC = () => {
  // 1. State cho ngày khởi hành (Dùng Dayjs theo thư viện bạn cài)
  const [departureDate, setDepartureDate] = useState<Dayjs | null>(dayjs("2026-04-15"));

  // 2. State cho bộ chọn khách
  const [showGuestPopup, setShowGuestPopup] = useState<boolean>(false);
  const [counts, setCounts] = useState<GuestCounts>({ adult: 1, child: 0 });
  const guestPickerRef = useRef<HTMLDivElement>(null);

  // Xử lý click ra ngoài để đóng popup khách
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (guestPickerRef.current && !guestPickerRef.current.contains(event.target as Node)) {
        setShowGuestPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUpdateGuest = (type: keyof GuestCounts, operation: "inc" | "dec") => {
    setCounts((prev) => ({
      ...prev,
      [type]: operation === "inc" 
        ? prev[type] + 1 
        : Math.max(type === "adult" ? 1 : 0, prev[type] - 1),
    }));
  };

  return (
    <div className="w-full lg:w-[320px]">
      <div className="sticky top-[130px] space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#2566b0]">Đặt vé</h2>

        {/* PHẦN CHỌN NGÀY */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Ngày khởi hành <span className="text-red-500">*</span>
          </label>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
            <DatePicker
              value={departureDate}
              onChange={(newValue) => setDepartureDate(newValue)}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  sx: {
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      fontSize: "0.875 r em",
                      fontFamily: "inherit",
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </div>

        {/* PHẦN CHỌN KHÁCH */}
        <div className="relative" ref={guestPickerRef}>
          <label className="mb-1 block text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Số lượng khách
          </label>
          <button
            type="button"
            onClick={() => setShowGuestPopup(!showGuestPopup)}
            className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm transition-all hover:border-[#2566b0] focus:ring-2 focus:ring-blue-100"
          >
            <div className="flex items-center gap-2 text-slate-700">
              <Users size={18} className="text-[#2566b0]" />
              <span className="font-medium">
                {counts.adult} Người lớn - {counts.child} Trẻ em
              </span>
            </div>
            <ChevronDown 
              size={16} 
              className={`text-slate-400 transition-transform duration-300 ${showGuestPopup ? "rotate-180" : ""}`} 
            />
          </button>

          {/* Popover chọn số lượng */}
          <AnimatePresence>
            {showGuestPopup && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute left-0 right-0 z-50 mt-2 rounded-xl border border-slate-200 bg-white p-4 shadow-xl"
              >
                {/* Hàng Người lớn */}
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Người lớn</p>
                    <p className="text-[11px] text-slate-500">Từ 12 tuổi</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleUpdateGuest("adult", "dec")}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-[#2566b0] hover:bg-blue-50 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-4 text-center font-bold text-slate-700">{counts.adult}</span>
                    <button
                      onClick={() => handleUpdateGuest("adult", "inc")}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-[#2566b0] hover:bg-blue-50 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Hàng Trẻ em */}
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Trẻ em</p>
                    <p className="text-[11px] text-slate-500">Dưới 12 tuổi</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleUpdateGuest("child", "dec")}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-[#2566b0] hover:bg-blue-50 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-4 text-center font-bold text-slate-700">{counts.child}</span>
                    <button
                      onClick={() => handleUpdateGuest("child", "inc")}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-[#2566b0] hover:bg-blue-50 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setShowGuestPopup(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2566b0] py-2.5 text-sm font-bold text-white shadow-md shadow-blue-100 transition hover:bg-blue-700 active:scale-[0.98]"
                >
                  <Save size={16} /> Lưu thay đổi
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nút xác nhận cuối cùng */}
        <button 
          className="w-full rounded-xl bg-gradient-to-r from-[#2566b0] to-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-100 transition-all hover:brightness-110 active:scale-[0.99]"
          onClick={() => console.log({ departureDate: departureDate?.format("DD/MM/YYYY"), ...counts })}
        >
          Xác nhận đặt vé
        </button>
      </div>
    </div>
  );
};

export default BookingCard;
