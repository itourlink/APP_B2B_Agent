import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, CircleX } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useFormContext, Controller, useFormState } from "react-hook-form";
import { twMerge } from "tailwind-merge";

type Option = {
    label: string;
    value: string | number;
};

type Props = {
    name: string;
    label?: {
        text?: string;
        icon?: React.ReactNode;
    };
    helperText?: string;
    options: Option[];
    InputProps?: {
        startAdornment?: React.ReactNode;
        endAdornment?: React.ReactNode;
    };
    placeholder?: string;
    disabled?: boolean;
};

export function RHFSearchSelect({
    name,
    label,
    options,
    InputProps,
    placeholder = "-- Chọn --",
    disabled = false,
}: Props) {
    const { control, clearErrors } = useFormContext();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const ref = useRef<HTMLDivElement>(null);

    const { errors } = useFormState({ name });
    const error = errors[name];

    // click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // auto close if disabled
    useEffect(() => {
        if (disabled && open) setOpen(false);
    }, [disabled, open]);

    // clear error auto
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                clearErrors(name);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error, clearErrors, name]);

    // reset search when close
    useEffect(() => {
        if (!open) setSearch("");
    }, [open]);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => {
                const selectedOption = options.find(
                    (opt) => opt.value === field.value
                );

                const filteredOptions = options.filter((opt) =>
                    opt.label.toLowerCase().includes(search.toLowerCase())
                );

                return (
                    <div className="flex flex-col gap-1 w-full" ref={ref}>
                        <div className="relative w-full">

                            {/* LABEL */}
                            {label && (
                                <div className="flex gap-1 text-mdMedium text-black mb-2">
                                    <span>{label.text}</span>
                                    <span className="text-red-400">{label.icon}</span>
                                </div>
                            )}

                            {/* SELECT BOX */}
                            <div
                                className={twMerge(
                                    "flex items-center justify-between px-4 py-3 h-[48px] rounded-[10px] border",
                                    error ? "border-red-500" : "border-[#cccccc]",
                                    disabled
                                        ? "bg-gray-100 cursor-not-allowed opacity-70"
                                        : "cursor-pointer"
                                )}
                                onClick={() => {
                                    if (disabled) return;
                                    setOpen(!open);
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    {InputProps?.startAdornment && (
                                        <div>{InputProps.startAdornment}</div>
                                    )}

                                    <span className="text-base">
                                        {selectedOption?.label || (
                                            <span className="text-[#b7b9c0]">{placeholder}</span>
                                        )}
                                    </span>
                                </div>

                                <ChevronDown
                                    className={twMerge(open && !disabled && "rotate-180")}
                                />
                            </div>

                            {/* DROPDOWN */}
                            {open && !disabled && (
                                <div className="absolute top-full left-0 w-full mt-1 z-10 bg-white border border-[#cccccc] rounded-xl shadow-lg overflow-hidden">

                                    {/* SEARCH */}
                                    <div className="p-2 border-b">
                                        <input
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Tìm kiếm..."
                                            className="w-full px-3 py-2 text-sm border rounded-md outline-none"
                                        />
                                    </div>

                                    {/* OPTIONS */}
                                    <div className="max-h-52 overflow-auto">
                                        {filteredOptions.length > 0 ? (
                                            filteredOptions.map((opt) => (
                                                <div
                                                    key={opt.value}
                                                    className={twMerge(
                                                        "px-4 py-2 text-sm cursor-pointer hover:bg-gray-100",
                                                        opt.value === field.value && "bg-gray-100 font-medium"
                                                    )}
                                                    onClick={() => {
                                                        field.onChange(opt.value);
                                                        setOpen(false);
                                                        setSearch("");
                                                    }}
                                                >
                                                    <p className="text-black">{opt.label}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-sm text-gray-400">
                                                Không tìm thấy
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ERROR */}
                        {error && (
                            <AnimatePresence>
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <div className="flex items-center gap-2 text-red-500 text-xs mt-1">
                                        <CircleX size={16} />
                                        {error.message}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </div>
                );
            }}
        />
    );
}