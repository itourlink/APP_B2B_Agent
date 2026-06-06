import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import i18next from "i18next";
export type DatePickerFormat =
    | Dayjs
    | Date
    | string
    | number
    | null
    | undefined;

export const formatStr = {
    dateTime: "DD MMM YYYY h:mm a", // 17 Apr 2022 12:00 am
    date: "DD MMM YYYY", // 17 Apr 2022
    time: "h:mm a", // 12:00 am
    split: {
        dateTime: "DD/MM/YYYY h:mm a", // 17/04/2022 12:00 am
        date: "DD/MM/YYYY", // 17/04/2022
    },
    paramCase: {
        dateTime: "DD-MM-YYYY h:mm a", // 17-04-2022 12:00 am
        date: "DD-MM-YYYY", // 17-04-2022
    },
};

export function fDateTime(date: DatePickerFormat, format?: string) {
    if (!date) return null;

    const d = dayjs(date);
    if (!d.isValid()) return "Invalid time value";

    const day = d.day();
    const thu = day === 0 ? "CN" : `T${day + 1}`;

    const formatted = d
        .locale(i18next.language)
        .format(format ?? formatStr.dateTime);

    return `${thu}, ${formatted}`;
}

export function fDate(date: DatePickerFormat, format?: string) {
    if (!date) return null;

    const d = dayjs(date);
    if (!d.isValid()) return "Invalid time value";

    const day = d.day();
    const thu = day === 0 ? "CN" : `T${day + 1}`;

    const formatted = d
        .locale(i18next.language)
        .format(format ?? formatStr.date); // bỏ giờ

    return `${thu}, ${formatted}`;
}