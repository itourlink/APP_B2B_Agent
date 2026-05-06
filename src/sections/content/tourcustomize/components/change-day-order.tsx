import { GripHorizontal, MapPin, Trash2, Plus, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import CreatedDayPopup from "./created-day-popup";
import { useLocation } from "react-router-dom";

export interface IDayItem {
  id: string;
  name: string;
  date: string;
}
 // khai báo props để nhận dữ liệu từ component cha  
interface ChangeDayOrderProps {
  items: IDayItem[];

  
  onChanged: (hasChange: boolean) => void;
  onClose: () => void;
  onSave: (newDays: IDayItem[]) => void;
  hasChange: boolean;
  strTourCustomizedGUID: string;
}

const ChangeDayOrder = ({ items, onChanged, onSave, hasChange, strTourCustomizedGUID }: ChangeDayOrderProps) => {

  const location = useLocation();
  const item = location.state?.item;


  // Ưu tiên lấy GUID từ item trong state
  const currentGUID = item?.strTourCustomizedGUID || strTourCustomizedGUID;
  // console.log("item change day order using GUID:", currentGUID);
  
  
  // 1. Khởi tạo Local State từ Props
  const [localDays, setLocalDays] = useState<IDayItem[]>(items);
  const [isAddDayOpen, setIsAddDayOpen] = useState(false);

  // 2. Theo dõi sự thay đổi
  useEffect(() => {
    const isDifferent = localDays.length !== items.length;
    onChanged(isDifferent);
  }, [localDays, items, onChanged]);

  // 3. Logic: Mở popup tạo tên ngày
  const handleOpenAddDay = () => {
    setIsAddDayOpen(true);
  };

  // 3.1 Xử lý lưu sau khi có tên ngày
  // const handleSaveNewDay = (title: string) => {
  //   const newDay: IDayItem = {
  //     id: Math.random().toString(36).substr(2, 9),
  //     name: `Day ${localDays.length + 1}`, // Giữ logic số thứ tự
  //     date: `new day)${title}`, // Định dạng theo screenshot yêu cầu (null hoặc new day)
  //   };
  //   // Format date field để hiển thị custom title như screenshot người dùng gửi
  //   // Trong thực tế, IDayItem có thể cần thêm field 'title' riêng, nhưng hiện tại tôi map vào 'date' để demo UI.
  //   const customDay: IDayItem = {
  //       ...newDay,
  //       date: `(new day)(null): ${title}`
  //   };
  //   setLocalDays([...localDays, customDay]);
  // };

  // 4. Logic: Reset
  const handleReset = () => {
    setLocalDays(items);
    onChanged(false);
  };

  // 5. Logic: Xóa ngày
  const handleDelete = (id: string) => {
    setLocalDays(prev => prev.filter(day => day.id !== id));
  };

  return (
    <div className="flex flex-col gap-5 font-sans">
      {/* 1. Danh sách ngày */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar overscroll-contain">
        {localDays.map((day) => (
          <div 
            key={day.id} 
            className="rounded-lg bg-[#efefef] px-4 py-5 border border-transparent transition-all"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <button className="shrink-0 text-[#3d3d3d]">
                  <GripHorizontal size={20} />
                </button>

                <div className="min-w-0">
                  <p className="text-[15px] font-medium text-[#4a4a4a]">
                    {day.name}({day.date}):
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-[#333]">
                    <MapPin size={18} className="fill-[#333]" />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleDelete(day.id)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/70 text-[#333] transition hover:bg-white hover:text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {localDays.length === 0 && (
          <div className="py-10 text-center text-gray-400 italic">
            Chưa có ngày nào trong lịch trình
          </div>
        )}
      </div>

      {/* 2. Nút Lưu (Chỉ hiện khi có thay đổi) - Theo mẫu screenshot mới */}
      {hasChange && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
          <button 
            onClick={() => onSave(localDays)}
            className="px-8 py-2 bg-[#004b91] text-white rounded-lg font-bold text-sm hover:bg-[#003c73] transition-all shadow-sm"
          >
            Lưu
          </button>
        </div>
      )}

      {/* 3. Footer actions - Theo mẫu screenshot */}
      <div className="border-t border-gray-100 pt-5">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleOpenAddDay}
            className="inline-flex items-center gap-2 rounded-md bg-[#efefef] px-4 py-2 text-sm font-medium text-[#444] transition hover:bg-[#e7e7e7]"
          >
            <Plus size={20} strokeWidth={2.5} />
            <span>Add Last Day</span>
          </button>

          <button 
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[#444] transition hover:bg-gray-50"
          >
            <RefreshCw size={18} />
            <span>Nhập lại</span>
          </button>
        </div>
      </div>
      {/* 4. Created Day Popup */}
      <CreatedDayPopup 
        open={isAddDayOpen}
        onClose={() => setIsAddDayOpen(false)}
        strTourCustomizedGUID={currentGUID}
        intDayOrder={localDays.length + 1}
      />
    </div>
  );
};

export default ChangeDayOrder;