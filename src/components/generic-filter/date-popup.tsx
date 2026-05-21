import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "react-date-range";

type Props = {
    isOpen?: boolean;
    value: Date | null;
    onApply: (date: Date | null) => void;
};

const DatePopup = ({ isOpen, value, onApply }: Props) => {
    const [temp, setTemp] = useState<Date>(value || new Date());

    useEffect(() => {
        if (value) setTemp(value);
    }, [value]);

    if (!isOpen) return null;

    return (
        <div className="bg-white p-4 rounded-2xl shadow-xl">

            {/* Calendar */}
            <Calendar
                date={temp}
                onChange={(date: Date) => setTemp(date)}
                minDate={new Date()}
                color="#2566b0"
            />

            {/* Preview */}
            <div className="mt-4 text-sm bg-gray-100 p-3 rounded-lg text-center">
                <div className="text-gray-500">Selected Date</div>
                <div className="font-medium">
                    {format(temp, "dd MMM yyyy")}
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-4">
                <button
                    onClick={() => setTemp(new Date())}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition rounded-lg"
                >
                    Clear
                </button>

                <button
                    onClick={() => onApply(temp)}
                    className="cursor-pointer px-4 py-2 bg-[#4a6fa5] hover:bg-[#3b5b7e] text-white rounded-lg"
                >
                    Apply
                </button>
            </div>
        </div>
    );
};

export default DatePopup;