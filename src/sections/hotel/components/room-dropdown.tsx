import { BedDouble, Plus, Minus } from "lucide-react";
import { useEffect, useRef } from "react";

interface RoomDropdownProps {
    isOpen: boolean;
    onToggle: () => void;
    onClose?: () => void;
    options?: {
        label: string;
        icon?: React.ReactNode;
    }[];
}

const RoomDropdown = ({
    isOpen,
    onToggle,
    onClose,
    options = [],
}: RoomDropdownProps) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (
            event: MouseEvent
        ) => {
            if (
                ref.current &&
                !ref.current.contains(event.target as Node)
            ) {
                onClose?.();
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, [onClose]);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={onToggle}
                className="cursor-pointer flex items-center gap-1 bg-orange-400 text-white px-3 py-1 rounded-full"
            >
                <BedDouble size={14} />
                <Plus size={12} />
                <Minus size={12} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-slate-300 rounded-lg shadow-lg p-3 min-w-[200px] z-50">
                    {options.map((item) => (
                        <label
                            key={item.label}
                            className="flex items-center gap-2 mb-2"
                        >
                            <input type="checkbox" />

                            {item.icon}

                            {item.label}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RoomDropdown;