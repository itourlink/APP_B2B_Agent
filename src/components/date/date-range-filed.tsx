import { useState } from "react";
import { format } from "date-fns";

const DateRangeField = () => {
  const [open, setOpen] = useState(false);
  const [range] = useState<any>(null);

  return (
    <div className="relative w-fit">
      {/* Label */}
      <div className="font-semibold text-[#6b7280] text-sm mb-1">
        Date range
      </div>

      {/* Input */}
      <div
        onClick={() => setOpen(!open)}
        className="border rounded-lg px-4 py-2 cursor-pointer min-w-[260px]"
      >
        {range
          ? `${format(range.startDate, "dd MMM yyyy")} - ${format(
            range.endDate,
            "dd MMM yyyy"
          )}`
          : "Select date"}
      </div>

      {/* Popup */}
      {open && (
        <div className="absolute top-full mt-2 z-50">
          {/* <DateRangePopup
            value={range || { startDate: null, endDate: null }}
            onApply={(val) => {
              setRange(val);
              setOpen(false);
            }}
          /> */}
        </div>
      )}
    </div>
  );
};

export default DateRangeField;