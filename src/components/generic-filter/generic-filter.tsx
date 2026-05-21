import { useEffect, useRef, useState } from "react";
import { Search, SearchIcon, Users, Badge } from "lucide-react";
import { format } from "date-fns";
import StarIcon from "@/assets/icons/star-icon";
import GuestPopup from "./guest-popup";
import DateRangePopup from "./date-range-popup";
import DatePopup from "./date-popup";
import TypeSelect, { type Option } from "./type-select";
import GuestRoomPopup from "./guess-room-popup";
import TourTypeSelect from "./tour-type-select";




type FilterItem =
    | {
        type: "search"; key: string; placeholder?: string; label?: string; renderDropdown?: (args: {
            value: string;
            close: () => void;
        }) => React.ReactNode
    }
    | { type: "guest"; key: string; label?: string }
    | { type: "guestRoom"; key: string; label?: string; isRoomDetail?: boolean }
    | { type: "dateRange"; keyStart: string; keyEnd: string; label?: string }
    | { type: "date"; key: string; label?: string }
    | { type: "select"; key: string; label?: string; options: Option[] }
    | { type: "toggle"; key: string; label?: string }
    | { type: "tourType"; key: string; label?: string; mainOptions: Option[]; getSubOptions: (val: any) => Option[] }

interface Props {
    filters: FilterItem[];
    values: Record<string, any>;
    onChange: (key: string, value: any) => void;
    onSearch: () => void;

    searchResult?: any[];
    isLoading?: boolean;
    onSelectSearch?: (val: string) => void;
}

export const GenericFilter = ({
    filters,
    values,
    onChange,
    onSearch,
}: Props) => {
    const guestRef = useRef<HTMLDivElement>(null);
    const dateRef = useRef<HTMLDivElement>(null);
    const dateOneRef = useRef<HTMLDivElement>(null);
    const locadesRef = useRef<HTMLDivElement>(null);

    const [active, setActive] = useState<
        "guest" | "guestRoom" | "date" | "dateOne" | "locades" | "search" | null
    >(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;

            if (
                guestRef.current &&
                !guestRef.current.contains(target) &&
                (!dateRef.current || !dateRef.current.contains(target)) &&
                (!dateOneRef.current || !dateOneRef.current.contains(target)) &&
                (!locadesRef.current || !locadesRef.current.contains(target))
            ) {
                setActive(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () =>
            document.removeEventListener("click", handleClickOutside);
    }, []);

    const renderItem = (item: FilterItem) => {
        switch (item.type) {
            case "toggle":
                return (
                    <div className="flex items-center gap-3">
                        <StarIcon currentColor="#6b7280" />

                        <div className="text-sm font-semibold">
                            {item.label || "Toggle"}
                        </div>

                        <div
                            onClick={() =>
                                onChange(item.key, !values[item.key])
                            }
                            className={`flex items-center w-12 h-[25px] rounded-full cursor-pointer ${values[item.key] ? "bg-[#2566b0]" : "bg-gray-300"
                                }`}
                        >
                            <div
                                className={`w-5 h-5 bg-white rounded-full transition ${values[item.key]
                                    ? "translate-x-[25px]"
                                    : "translate-x-[2px]"
                                    }`}
                            />
                        </div>
                    </div>
                );

            case "search":
                return (
                    <div className="relative flex items-center gap-2">
                        <Search size={18} />

                        <div>
                            <div className="text-sm font-semibold">{item.label ?? "Search"}</div>

                            <input
                                value={values[item.key] || ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    onChange(item.key, val);

                                    setActive(val ? "search" : null);
                                }}
                                placeholder={item.placeholder}
                                className="outline-0"
                            />
                        </div>

                        {active === "search" && (
                            <div className="absolute top-[81px] z-50">
                                {item.renderDropdown?.({
                                    value: values[item.key],
                                    close: () => setActive(null),
                                })}
                            </div>
                        )}
                    </div>
                );


            case "guest":
                return (
                    <div ref={guestRef} className="relative">
                        <button
                            onClick={() =>
                                setActive(active === "guest" ? null : "guest")
                            }
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <Users size={18} />
                            <div>
                                <div className="text-sm font-semibold">
                                    {item.label || "Guest"}
                                </div>
                                <div className="text-sm">
                                    {values[item.key]?.adults || 1} Adult
                                </div>
                            </div>
                        </button>

                        {active === "guest" && (
                            <div className="absolute top-20">
                                <GuestPopup
                                    isOpen
                                    value={values[item.key]}
                                    onDone={(val) => {
                                        onChange(item.key, val);
                                        setActive(null);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                );

            case "guestRoom":
                const val = values[item.key] || {
                    rooms: 1,
                    adults: 1,
                    children: 0,
                    childAges: [],
                    roomTypes: {
                        sgl: 0,
                        dbl: 1,
                        twn: 0,
                        tpl: 0,
                    },
                };

                return (
                    <div ref={guestRef} className="relative">
                        <button
                            onClick={() =>
                                setActive(active === "guestRoom" ? null : "guestRoom")
                            }
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <Users size={18} />
                            <div>
                                <div className="text-sm font-semibold">
                                    {item.label || "Guest & Room"}
                                </div>

                                <div className="text-sm">
                                    {val.rooms} Room • {val.adults} Adult
                                    {val.children > 0 ? ` • ${val.children} Child` : ""}
                                </div>
                            </div>
                        </button>

                        {active === "guestRoom" && (
                            <div className="absolute top-20 z-50">
                                <GuestRoomPopup
                                    isOpen
                                    isRoomDetail={item.isRoomDetail ?? false} 
                                    value={val}
                                    onDone={(newVal) => {
                                        onChange(item.key, newVal);
                                        setActive(null);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                );
            case "dateRange":
                return (
                    <div ref={dateRef} className="relative">
                        <button
                            onClick={() =>
                                setActive(active === "date" ? null : "date")
                            }
                            className="cursor-pointer"
                        >
                            <div className="text-sm font-semibold">
                                {item.label || "Date Range"}
                            </div>
                            <div className="text-sm">
                                {values[item.keyStart] && values[item.keyEnd]
                                    ? `${format(values[item.keyStart], "dd/MM")} - ${format(
                                        values[item.keyEnd],
                                        "dd/MM"
                                    )}`
                                    : "Select Date"}
                            </div>
                        </button>

                        {active === "date" && (
                            <div className="absolute top-[81px]">
                                <DateRangePopup
                                    isOpen
                                    value={{
                                        startDate: values[item.keyStart],
                                        endDate: values[item.keyEnd],
                                    }}
                                    onApply={(val) => {
                                        onChange(item.keyStart, val.startDate);
                                        onChange(item.keyEnd, val.endDate);
                                        setActive(null);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                );

            case "date":
                return (
                    <div ref={dateOneRef} className="relative">
                        <button
                            onClick={() =>
                                setActive(active === "dateOne" ? null : "dateOne")
                            }
                            className="cursor-pointer"
                        >
                            <div className="text-sm font-semibold">
                                {item.label || "Date"}
                            </div>
                            <div className="text-sm">
                                {values[item.key]
                                    ? format(values[item.key], "dd/MM")
                                    : "Select Date"}
                            </div>
                        </button>

                        {active === "dateOne" && (
                            <div className="absolute top-[81px]">
                                <DatePopup
                                    isOpen
                                    value={values[item.key]}
                                    onApply={(val) => {
                                        if (!val) return;
                                        onChange(item.key, val);
                                        setActive(null);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                );

            case "select":
                return (
                    <div className="flex items-center gap-2">
                        <Badge size={18} />
                        <div>
                            <div className="text-sm font-semibold">
                                {item.label || "Select"}
                            </div>

                            <TypeSelect
                                value={values[item.key]}
                                options={item.options}
                                onChange={(val) => onChange(item.key, val)}
                            />
                        </div>
                    </div>
                );

            case "tourType":
                return (
                    <div className="flex flex-col gap-1">
                        <div className="text-sm font-semibold">
                            {item.label || "Tour Type"}
                        </div>
                        <TourTypeSelect
                            value={values[item.key] || { mainType: "all", subType: "all" }}
                            mainOptions={item.mainOptions}
                            getSubOptions={item.getSubOptions}
                            onChange={(newVal) => onChange(item.key, newVal)}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full flex justify-center">
            <div className="bg-white rounded-xl shadow-2xl p-6 flex gap-5 items-center">


                {filters
                    .filter((item) => {
                        // bật Tour Series => ẩn Tour Type
                        if (
                            item.type === "tourType" &&
                            values.isTourSeries
                        ) {
                            return false;
                        }

                        return true;
                    })
                    .map((item, i, arr) => (
                        <div key={i} className="flex items-center gap-5">
                            {renderItem(item)}

                            {i !== arr.length - 1 && (
                                <div className="h-10 w-px bg-gray-300" />
                            )}
                        </div>
                    ))}

                <button
                    onClick={onSearch}
                    className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-[#2566b0] hover:bg-[#003566] text-white rounded-lg"
                >
                    <SearchIcon size={16} />
                    Search
                </button>
            </div>
        </div>
    );
};