import {
    Calendar,
    Star,
    HelpCircle,
    Download,
    Users,
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import { format } from "date-fns";

import DatePopup from "@/components/generic-filter/date-popup";
import GuestRoomPopup from "@/components/generic-filter/guess-room-popup";

interface Props {
    item?: any;
}
const BookingForm = ({ item }: Props) => {

    console.log("first", item);

    const [active, setActive] = useState<
        "dateOne" | "guestRoom" | null
    >(null);

    // ================= DATE =================
    const [startDate, setStartDate] =
        useState<Date | null>(null);

    // ================= GUEST =================
    const [guestValue, setGuestValue] = useState({
        rooms: 1,
        adults: 2,
        children: 0,
        childAges: [],
        roomTypes: {
            sgl: 0,
            dbl: 1,
            twn: 0,
            tpl: 0,
        },
    });

    // ================= REF =================
    const dateRef = useRef<HTMLDivElement>(null);

    const guestRef =
        useRef<HTMLDivElement>(null);

    // ================= CLICK OUTSIDE =================
    useEffect(() => {
        const handleClickOutside = (
            event: MouseEvent
        ) => {
            // date
            if (
                dateRef.current &&
                !dateRef.current.contains(
                    event.target as Node
                ) &&
                active === "dateOne"
            ) {
                setActive(null);
            }

            // guest
            if (
                guestRef.current &&
                !guestRef.current.contains(
                    event.target as Node
                ) &&
                active === "guestRoom"
            ) {
                setActive(null);
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
    }, [active]);

    return (
        <div className="w-[320px] sticky top-32">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">

                {/* HEADER */}
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">
                            Đặt tour
                        </h3>

                        <p className="text-xs text-slate-500 mt-1">
                            Nhập thông tin để hiển thị giá
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-full bg-[#2566b0] text-white flex items-center justify-center">
                            <HelpCircle size={16} />
                        </button>

                        <button className="w-8 h-8 rounded-full bg-[#2566b0] text-white flex items-center justify-center">
                            <Download size={16} />
                        </button>
                    </div>
                </div>

                {/* WARNING */}
                <div className="text-red-500 text-sm font-medium">
                    Bạn hãy chọn ngày bắt đầu
                </div>

                {/* DATE */}
                <div
                    ref={dateRef}
                    className="space-y-1 relative"
                >
                    <label className="text-xs font-semibold text-slate-700">
                        Ngày bắt đầu
                    </label>

                    <button
                        type="button"
                        onClick={() =>
                            setActive(
                                active === "dateOne"
                                    ? null
                                    : "dateOne"
                            )
                        }
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm flex items-center justify-between hover:border-[#2566b0]"
                    >
                        <span>
                            {startDate
                                ? format(
                                    startDate,
                                    "dd/MM/yyyy"
                                )
                                : "Chọn ngày"}
                        </span>

                        <Calendar
                            size={16}
                            className="text-slate-400"
                        />
                    </button>

                    {active === "dateOne" && (
                        <div className="absolute top-[72px] left-0 z-50">
                            <DatePopup
                                isOpen
                                value={startDate}
                                onApply={(
                                    val: Date | null
                                ) => {
                                    setStartDate(
                                        val
                                    );

                                    setActive(
                                        null
                                    );
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* GUEST */}
                <div
                    ref={guestRef}
                    className="space-y-1 relative"
                >
                    <label className="text-xs font-semibold text-slate-700">
                        Số lượng khách
                    </label>

                    <button
                        type="button"
                        onClick={() =>
                            setActive(
                                active ===
                                    "guestRoom"
                                    ? null
                                    : "guestRoom"
                            )
                        }
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm flex items-center justify-between hover:border-[#2566b0]"
                    >
                        <div className="flex items-center gap-2">
                            <Users
                                size={16}
                                className="text-slate-400"
                            />

                            <span>
                                {
                                    guestValue.adults
                                }{" "}
                                NL •{" "}
                                {
                                    guestValue.children
                                }{" "}
                                TE •{" "}
                                {
                                    guestValue.rooms
                                }{" "}
                                Phòng
                            </span>
                        </div>

                        <span className="text-slate-400">
                            ▼
                        </span>
                    </button>

                    {active ===
                        "guestRoom" && (
                            <div className="absolute top-[72px] left-0 z-50">
                                <GuestRoomPopup
                                    isOpen
                                    isRoomDetail
                                    value={
                                        guestValue
                                    }
                                    onDone={(
                                        newVal: any
                                    ) => {
                                        setGuestValue(
                                            newVal
                                        );

                                        setActive(
                                            null
                                        );
                                    }}
                                />
                            </div>
                        )}
                </div>

                {/* STAR + TYPE */}
                <div className="grid grid-cols-2 gap-3">

                    {/* STAR */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">
                            Hạng Tour
                        </label>

                        <div className="flex items-center justify-between border border-slate-300 rounded-lg px-3 py-2">
                            <div className="flex gap-1 text-yellow-400">
                                {[1, 2, 3, 4].map(
                                    (i) => (
                                        <Star
                                            key={
                                                i
                                            }
                                            size={
                                                14
                                            }
                                            fill="currentColor"
                                        />
                                    )
                                )}
                            </div>

                            <span className="text-slate-400">
                                ▼
                            </span>
                        </div>
                    </div>

                    {/* TYPE */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">
                            Loại hình
                        </label>

                        <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                            <option>
                                Joined Tour
                            </option>
                        </select>
                    </div>
                </div>

                {/* BUTTON */}
                <button className="w-full bg-[#2566b0] text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                    Đặt ngay
                </button>

                <button className="w-full bg-[#2566b0] text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                    Thêm vào giỏ
                </button>
            </div>
        </div>
    );
};

export default BookingForm;