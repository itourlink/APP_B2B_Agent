import { useState } from "react";
import { Calendar } from "react-date-range";
import { vi, enUS } from "date-fns/locale";
import i18next from "i18next";

type PickerMode = "month" | "year" | null;
type ChangeShownDate = (
    value: Date | number | string,
    mode?: "set" | "setYear" | "setMonth" | "monthOffset"
) => void;

type Props = {
    isOpen?: boolean;
    value: Date | null;
    onApply: (date: Date | null) => void;
    disableDays?: number;
    minDate?: Date;
    maxDate?: Date;
    compact?: boolean;
};

export const DatePopup = ({
    isOpen,
    value,
    onApply,
    disableDays = 0,
    minDate: minimumDate,
    maxDate,
    compact = false,
}: Props) => {
    const [pickerMode, setPickerMode] = useState<PickerMode>(null);
    const [yearPageStart, setYearPageStart] = useState(() => {
        const initialYear = (value ?? new Date()).getFullYear();
        return Math.floor(initialYear / 10) * 10;
    });
    const locale =
        i18next.language === "vi"
            ? vi
            : enUS;

    const defaultMinDate = new Date();
    defaultMinDate.setDate(defaultMinDate.getDate() + disableDays);
    const minDate = minimumDate ?? defaultMinDate;
    const today = new Date();
    const initialDate = today < minDate
        ? minDate
        : maxDate && today > maxDate
            ? maxDate
            : today;
    const monthNames = Array.from({ length: 12 }, (_, month) =>
        i18next.language === "vi"
            ? `Tháng ${month + 1}`
            : new Intl.DateTimeFormat("en-US", { month: "short" }).format(
                new Date(2020, month, 1)
            )
    );

    const isYearDisabled = (year: number) => {
        const firstDay = new Date(year, 0, 1);
        const lastDay = new Date(year, 11, 31, 23, 59, 59, 999);
        return lastDay < minDate || (maxDate ? firstDay > maxDate : false);
    };

    const isMonthDisabled = (year: number, month: number) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0, 23, 59, 59, 999);
        return lastDay < minDate || (maxDate ? firstDay > maxDate : false);
    };

    const renderNavigator = (
        focusedDate: Date,
        changeShownDate: ChangeShownDate
    ) => {
        const focusedYear = focusedDate.getFullYear();
        const focusedMonth = focusedDate.getMonth();
        const years = Array.from({ length: 10 }, (_, index) => yearPageStart + index);

        const moveBackward = () => {
            if (pickerMode === "year") {
                setYearPageStart((current) => current - 10);
                return;
            }
            if (pickerMode === "month") {
                changeShownDate(focusedYear - 1, "setYear");
                return;
            }
            changeShownDate(-1, "monthOffset");
        };

        const moveForward = () => {
            if (pickerMode === "year") {
                setYearPageStart((current) => current + 10);
                return;
            }
            if (pickerMode === "month") {
                changeShownDate(focusedYear + 1, "setYear");
                return;
            }
            changeShownDate(1, "monthOffset");
        };

        return (
            <div className="relative flex h-10 items-center justify-between px-2 text-[11px]">
                <button
                    type="button"
                    onClick={moveBackward}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-lg text-slate-600 hover:bg-slate-100"
                    aria-label="Previous"
                >
                    ‹
                </button>

                <div className="flex items-center justify-center gap-1 font-semibold text-slate-800">
                    {pickerMode === "year" ? (
                        <span>{yearPageStart} - {yearPageStart + 9}</span>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => setPickerMode((current) =>
                                    current === "month" ? null : "month"
                                )}
                                className="rounded px-1.5 py-1 hover:bg-slate-100"
                            >
                                {monthNames[focusedMonth]}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setYearPageStart(Math.floor(focusedYear / 10) * 10);
                                    setPickerMode((current) =>
                                        current === "year" ? null : "year"
                                    );
                                }}
                                className="rounded px-1.5 py-1 hover:bg-slate-100"
                            >
                                {focusedYear}
                            </button>
                        </>
                    )}
                </div>

                <button
                    type="button"
                    onClick={moveForward}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-lg text-slate-600 hover:bg-slate-100"
                    aria-label="Next"
                >
                    ›
                </button>

                {pickerMode === "month" && (
                    <div className="absolute left-0 right-0 top-10 z-30 grid grid-cols-3 gap-1 rounded-lg border border-slate-200 bg-white p-2 shadow-xl">
                        {monthNames.map((monthName, month) => {
                            const disabled = isMonthDisabled(focusedYear, month);
                            return (
                                <button
                                    type="button"
                                    key={monthName}
                                    disabled={disabled}
                                    onClick={() => {
                                        changeShownDate(month, "setMonth");
                                        setPickerMode(null);
                                    }}
                                    className={`rounded-md px-1 py-2 text-center ${
                                        month === focusedMonth
                                            ? "bg-[#2566b0] text-white"
                                            : "text-slate-700 hover:bg-blue-50"
                                    } disabled:cursor-not-allowed disabled:bg-transparent disabled:text-slate-300`}
                                >
                                    {monthName}
                                </button>
                            );
                        })}
                    </div>
                )}

                {pickerMode === "year" && (
                    <div className="absolute left-0 right-0 top-10 z-30 grid grid-cols-2 gap-1 rounded-lg border border-slate-200 bg-white p-2 shadow-xl">
                        {years.map((year) => {
                            const disabled = isYearDisabled(year);
                            return (
                                <button
                                    type="button"
                                    key={year}
                                    disabled={disabled}
                                    onClick={() => {
                                        changeShownDate(year, "setYear");
                                        setPickerMode(null);
                                    }}
                                    className={`rounded-md px-2 py-2 text-center ${
                                        year === focusedYear
                                            ? "bg-[#2566b0] text-white"
                                            : "text-slate-700 hover:bg-blue-50"
                                    } disabled:cursor-not-allowed disabled:bg-transparent disabled:text-slate-300`}
                                >
                                    {year}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div
            className={`rounded-xl bg-white shadow-xl ${
                compact
                    ? "p-2 [&_.rdrCalendarWrapper]:text-[10px]"
                    : "p-4"
            }`}
        >
            <Calendar
                locale={locale}
                date={value ?? initialDate}
                onChange={(date: Date) => onApply(date)}
                minDate={minDate}
                maxDate={maxDate}
                color="#2566b0"
                navigatorRenderer={renderNavigator}
            />
        </div>
    );
};
