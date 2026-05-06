import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
export type Option = {
    label: string;
    value: string | number;
};

type Props = {
    value?: string;
    onChange?: (val: string | number) => void;
    options: Option[];
};

const TypeSelect = ({ value, onChange, options }: Props) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: any) => {
            if (!ref.current?.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const selected =
        options.find((opt) => opt.value === value)?.label ||
        options[0]?.label;

    return (
        <div ref={ref} className="relative">
            <div
                onClick={() => setOpen(!open)}
                className={`flex items-center justify-between gap-2 px-4 py-2 rounded-lg border cursor-pointer min-w-[150px]
        ${open ? "border-[#2566b0]" : "border-gray-300"}`}
            >
                <span>{selected}</span>
                <ChevronDown
                    size={16}
                    className={`transition ${open ? "rotate-180" : ""}`}
                />
            </div>

            {open && (
                <div className="absolute left-0 mt-[30px] w-full bg-white rounded-xl shadow-lg py-2 z-50">
                    {options.map((item) => {
                        const isActive = item.value === value;

                        return (
                            <div
                                key={item.value}
                                onClick={() => {
                                    onChange?.(item.value);
                                    setOpen(false);
                                }}
                                className={`relative px-4 py-2 cursor-pointer hover:bg-gray-100
                  ${isActive ? "bg-gray-100 font-medium" : ""}`}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-0 h-full w-[3px] bg-[#2566b0] rounded-r"></div>
                                )}

                                {item.label}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TypeSelect;