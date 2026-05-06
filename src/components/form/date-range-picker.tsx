import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./index.css";
import { CalendarDays } from "lucide-react";

interface IDateProps {
  startTime: number;
  endTime: number;
  onStartTime: (value: number) => void;
  onEndTime: (value: number) => void;
  className?: string;
  labelFrom?: string;
  labelTo?: string;
}

export function DateRangePicker({
  startTime,
  endTime,
  onStartTime,
  onEndTime,
  className = "bg-white",
  labelFrom = "Từ ngày",
  labelTo = "Đến ngày",
}: IDateProps) {
  const [fromDate, setFromDate] = useState<Date | null>(
    startTime ? new Date(startTime) : null
  );
  const [toDate, setToDate] = useState<Date | null>(
    endTime ? new Date(endTime) : null
  );

  useEffect(() => {
    setFromDate(startTime ? new Date(startTime) : null);
    setToDate(endTime ? new Date(endTime) : null);
  }, [startTime, endTime]);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const d = date;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="rounded-lg shadow-sm">
      <div
        className={`${className} flex flex-row items-center justify-between gap-2 px-4 py-2`}
      >
        {/* From */}
        <div className="relative">
          <DatePicker
            selected={fromDate}
            onChange={(date: Date | null) => {
              setFromDate(date);
              if (date) onStartTime(date.getTime());
            }}
            maxDate={toDate ?? undefined}
            dateFormat="dd-MM-yyyy"
            popperPlacement="bottom-start"
            customInput={
              <div className="relative cursor-pointer">
                <input
                  className={`border-none w-35.5 rounded-md focus:outline-none cursor-pointer ${!fromDate ? "text-gray-400" : "text-black"
                    }`}
                  value={fromDate ? formatDate(fromDate) : labelFrom}
                  readOnly
                />
                <span className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                  <CalendarDays size={18} color={!fromDate ? "#9ca3af" : "black"} />
                </span>
              </div>
            }
          />
        </div>

        <span className="mx-1 flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 3.33203L10 7.9987L6 12.6654"
              stroke="#838384"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        {/* To */}
        <div className="relative">
          <DatePicker
            selected={toDate}
            onChange={(date: Date | null) => {
              setToDate(date);
              if (date) {
                const d = new Date(date);
                d.setUTCHours(23, 59, 59, 999);
                onEndTime(d.getTime());
              }
            }}
            minDate={fromDate ?? undefined}
            dateFormat="dd-MM-yyyy"
            popperPlacement="bottom-end"
            customInput={
              <div className="relative cursor-pointer">
                <input
                  className={`border-none w-35.5 rounded-md focus:outline-none cursor-pointer ${!toDate ? "text-gray-400" : "text-black"
                    }`}
                  value={toDate ? formatDate(toDate) : labelTo}
                  readOnly
                />
                <span className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                  <CalendarDays size={18} color={!toDate ? "#9ca3af" : "black"} />
                </span>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}