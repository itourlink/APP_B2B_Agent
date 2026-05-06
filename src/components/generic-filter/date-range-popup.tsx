import { useEffect, useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";

type Props = {
  isOpen?: boolean;
  value: {
    startDate: Date | null;
    endDate: Date | null;
  };
  onApply: (range: Props["value"]) => void;
};
const DateRangePopup = ({ isOpen, value, onApply }: Props) => {
  const [temp, setTemp] = useState([
    {
      startDate: value.startDate || new Date(),
      endDate: value.endDate || new Date(),
      key: "selection",
    },
  ]);

  useEffect(() => {
    setTemp([
      {
        startDate: value.startDate || new Date(),
        endDate: value.endDate || new Date(),
        key: "selection",
      },
    ]);
  }, [value]);

  if (!isOpen) return null;

  const handleClear = () => {
    setTemp([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-xl w-90">
      <DateRange
        ranges={temp}
        onChange={(item: any) => setTemp([item.selection])}
        moveRangeOnFirstSelection={false}
        showDateDisplay={false}
        rangeColors={["#2566b0"]}
        minDate={new Date()}
      />

      <div className="flex justify-between mt-4 text-sm bg-gray-100 p-3 rounded-lg">
        <div>
          <div className="text-gray-500">Start Date</div>
          <div className="font-medium">
            {format(temp[0].startDate, "dd MMM yyyy")}
          </div>
        </div>

        <div className="flex items-center">→</div>

        <div>
          <div className="text-gray-500">End Date</div>
          <div className="font-medium">
            {format(temp[0].endDate, "dd MMM yyyy")}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition rounded-lg cursor-pointer"
        >
          Clear
        </button>

        <button
          onClick={() =>
            onApply({
              startDate: temp[0].startDate,
              endDate: temp[0].endDate,
            })
          }
          className="px-4 py-2 bg-[#4a6fa5] hover:bg-[#3b5b7e] transition text-white rounded-lg cursor-pointer"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default DateRangePopup;