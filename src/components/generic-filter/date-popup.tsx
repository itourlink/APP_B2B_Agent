import { useState, useEffect } from "react";
import { Calendar } from "react-date-range";

type Props = {
    isOpen?: boolean;
    value: Date | null;
    onApply: (date: Date | null) => void;
    disableDays?: number;
};

export const DatePopup = ({
    isOpen,
    value,
    onApply,
    disableDays = 0,
}: Props) => {
    const [temp, setTemp] = useState<Date>(value || new Date());

    useEffect(() => {
        if (value) setTemp(value);
    }, [value]);

    if (!isOpen) return null;

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + disableDays);

    return (
        <div className="bg-white p-4 rounded-2xl shadow-xl">
            <Calendar
                date={temp}
                onChange={(date: Date) => {
                    setTemp(date);
                    onApply(date);
                }}
                minDate={minDate}
                color="#2566b0"
            />
        </div>
    );
};