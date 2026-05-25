import { useState, useEffect } from "react";
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
            <Calendar
                date={temp}
                onChange={(date: Date) => {
                    setTemp(date);

                    onApply(date);
                }}
                minDate={new Date()}
                color="#2566b0"
            />
        </div>
    );
};

export default DatePopup;