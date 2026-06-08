import { useTranslate } from "@/locales";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";

const ages = Array.from({ length: 17 }, (_, i) => i + 1);
type RoomTypes = {
    sgl: number;
    dbl: number;
    twn: number;
    tpl: number;
};
type Props = {
    isOpen: boolean;
    isRoomDetail?: boolean;
    value: {
        rooms: number;
        adults: number;
        children: number;
        childAges: number[];
        roomTypes: RoomTypes;
    };
    onDone: (val: Props["value"]) => void;
};

const defaultRoomTypes: RoomTypes = {
    sgl: 0,
    dbl: 1,
    twn: 0,
    tpl: 0,
};

const GuestRoomPopup = ({ isOpen, value, onDone, isRoomDetail = false }: Props) => {
    const { t } = useTranslate("genericFilter")
    const safeValue = value || {
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

    const [roomTypes, setRoomTypes] = useState<RoomTypes>(
        safeValue.roomTypes || defaultRoomTypes
    );
    const [rooms, setRooms] = useState(safeValue.rooms);
    const [openRoomDetail, setOpenRoomDetail] = useState(false);
    const [adults, setAdults] = useState(safeValue.adults);
    const [children, setChildren] = useState(safeValue.children);
    const [childAges, setChildAges] = useState<number[]>(safeValue.childAges);

    useEffect(() => {
        setRooms(safeValue.rooms);
        setAdults(safeValue.adults);
        setChildren(safeValue.children);
        setChildAges(safeValue.childAges);
        setRoomTypes(safeValue.roomTypes || defaultRoomTypes);
    }, [value]);

    if (!isOpen) return null;


    const handleChildrenChange = (type: "inc" | "dec") => {
        if (type === "inc") {
            setChildren((prev) => prev + 1);
            setChildAges((prev) => [...prev, 1]);
        } else {
            setChildren((prev) => Math.max(0, prev - 1));
            setChildAges((prev) => prev.slice(0, -1));
        }
    };

    const handleAgeChange = (index: number, value: number) => {
        const newAges = [...childAges];
        newAges[index] = value;
        setChildAges(newAges);
    };

    const handleRoomTypeChange = (
        key: keyof RoomTypes,
        type: "inc" | "dec"
    ) => {
        setRoomTypes((prev) => {
            const current = prev || defaultRoomTypes;

            const updated: RoomTypes = {
                ...current,
                [key]:
                    type === "inc"
                        ? current[key] + 1
                        : Math.max(0, current[key] - 1),
            };

            const total =
                updated.sgl + updated.dbl + updated.twn + updated.tpl;

            setRooms(total || 1);

            return updated;
        });
    };

    const ROOM_CONFIG: { key: keyof RoomTypes; label: string }[] = [
        { key: "sgl", label: t("sglRooms") },
        { key: "dbl", label: t("dblRooms") },
        { key: "twn", label: t("twnRooms") },
        { key: "tpl", label: t("tplRooms") },
    ];
    return (
        <div className="w-[520px] bg-white rounded-2xl shadow-lg p-4">
            {/* Rooms */}
            <div className="mb-2">
                <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => isRoomDetail && setOpenRoomDetail(!openRoomDetail)}
                >
                    <div>
                        <div className="font-semibold">{t("rooms")}</div>
                        <div className="text-sm text-gray-500">
                            {t("numberOfRooms")}
                        </div>
                    </div>

                    {!isRoomDetail ? (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setRooms((p) => Math.max(1, p - 1))}
                                className="w-8 h-8 border border-slate-200 rounded-full flex items-center justify-center cursor-pointer"
                            >
                                -
                            </button>
                            <span>{rooms}</span>
                            <button
                                onClick={() => setRooms((p) => p + 1)}
                                className="w-8 h-8 border border-slate-200 rounded-full flex items-center justify-center cursor-pointer"
                            >
                                +
                            </button>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500">
                            {rooms} {t("room")} <ChevronDownIcon className="w-4 h-4 inline-block" />
                        </div>
                    )}
                </div>

                {isRoomDetail && openRoomDetail && (
                    <div className="mt-3 border border-slate-200 rounded-lg p-3 space-y-3 bg-gray-50">
                        {ROOM_CONFIG.map((item) => (
                            <div key={item.key} className="flex justify-between items-center">
                                <span>{item.label}</span>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() =>
                                            handleRoomTypeChange(item.key as any, "dec")
                                        }
                                        className="w-8 h-8 bg-gray-200 rounded cursor-pointer"
                                    >
                                        -
                                    </button>

                                    <span>{roomTypes?.[item.key as keyof typeof roomTypes]}</span>

                                    <button
                                        onClick={() =>
                                            handleRoomTypeChange(item.key as any, "inc")
                                        }
                                        className="w-8 h-8 bg-gray-200 rounded cursor-pointer"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="w-full h-px bg-gray-300"></div>

            <div className="flex gap-5 items-start">

                {/* Adults */}
                <div className="flex justify-between items-center w-full mt-1 mb-4">
                    <div>
                        <div className="font-semibold">{t("adults")}</div>
                        <div className="text-sm text-gray-500">{t("ages18OrAbove")}</div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setAdults((p) => Math.max(1, p - 1))}
                            className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center cursor-pointer"
                        >
                            -
                        </button>
                        <span>{adults}</span>
                        <button
                            onClick={() => setAdults((p) => p + 1)}
                            className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center cursor-pointer"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className="border-l border-gray-300 self-stretch my-5"></div>

                {/* Children */}
                <div className="w-full">

                    <div className="flex justify-between items-center my-1">
                        <div>
                            <div className="font-semibold">{t("children")}</div>
                            <div className="text-sm text-gray-500">{t("ages")} 1-17</div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleChildrenChange("dec")}
                                className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center cursor-pointer"
                            >
                                -
                            </button>
                            <span>{children}</span>
                            <button
                                onClick={() => handleChildrenChange("inc")}
                                className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center cursor-pointer"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Children list */}
                    {children > 0 && (
                        <div
                            className={`mt-1 pr-2 ${children >= 4 ? "max-h-27 overflow-y-auto " : ""
                                }`}
                        >
                            {childAges.map((age, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center mb-1"
                                >
                                    <span>{t("child")} {index + 1}</span>

                                    <select
                                        value={age}
                                        onChange={(e) =>
                                            handleAgeChange(index, Number(e.target.value))
                                        }
                                        className="border border-gray-300 rounded-md px-2 py-1 cursor-pointer focus:outline-0"
                                    >
                                        {ages.map((a) => (
                                            <option key={a} value={a}>
                                                {a} {t("years")}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {/* Done button */}
            <button
                onClick={() =>
                    onDone({
                        rooms,
                        adults,
                        children,
                        childAges,
                        roomTypes,
                    })
                }
                className="w-full mt-4 bg-[#4a6fa5] hover:bg-[#3b5b7e] text-white py-2 rounded-lg cursor-pointer transition"
            >
                {t("apply")}
            </button>
        </div>
    );
};

export default GuestRoomPopup;