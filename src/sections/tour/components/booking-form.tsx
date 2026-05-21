import {
    Calendar,
    Star,
    HelpCircle,
    Download,
    Users,
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { format } from "date-fns";

import DatePopup from "@/components/generic-filter/date-popup";
import GuestRoomPopup from "@/components/generic-filter/guess-room-popup";
import { useListPrice } from "@/hooks/actions/useBooking";

interface Props {
    item?: any;
}

const BookingForm = ({ item }: Props) => {
    const [canFetchPrice, setCanFetchPrice] = useState(false);
    // ================= STATE =================
    const [active, setActive] = useState<"dateOne" | "guestRoom" | null>(null);

    const [startDate, setStartDate] = useState<Date | null>(null);

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

    const [selectedStar, setSelectedStar] = useState<number | null>(null);
    const [joinType, setJoinType] = useState<number | null>(null);

    // ================= REF =================
    const dateRef = useRef<HTMLDivElement>(null);
    const guestRef = useRef<HTMLDivElement>(null);

    // ================= OUTSIDE CLICK =================
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dateRef.current &&
                !dateRef.current.contains(event.target as Node) &&
                active === "dateOne"
            ) {
                setActive(null);
            }

            if (
                guestRef.current &&
                !guestRef.current.contains(event.target as Node) &&
                active === "guestRoom"
            ) {
                setActive(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [active]);

    // ================= STAR LIST =================
    const starList = useMemo(() => {
        if (!item?.strListEasiaCateID) return [];

        return item.strListEasiaCateID
            .split(",")
            .map((id: string) => Number(id))
            .filter(Boolean);
    }, [item]);

    useEffect(() => {
        if (starList.length > 0) {
            setSelectedStar(starList[0]);
        }
    }, [starList]);

    // ================= JOIN TYPE =================
    const joinTypeList = useMemo(() => {
        if (!item?.strListJoinTypeID) return [];

        return item.strListJoinTypeID
            .split(",")
            .map((id: string) => Number(id))
            .map((id: number) => ({
                value: id,
                label: id === 1
                    ? "Joined Tour"
                    : id === 2
                        ? "Private Tour"
                        : `Type ${id}`,
            }));
    }, [item]);

    useEffect(() => {
        if (joinTypeList.length > 0) {
            setJoinType(joinTypeList[0].value);
        }
    }, [joinTypeList]);

    useEffect(() => {
        if (canFetchPrice) {
            // trigger re-fetch logic (nếu hook support refetch dependency)
        }
    }, [guestValue, selectedStar, joinType]);

    // ================= PRICE API =================
    const { priceData } = useListPrice({
        enabled: canFetchPrice && !!startDate,

        strTourGUID: item?.strTourGUID,
        intNoOfAdult: guestValue.adults,
        intNoOfSGLSup: guestValue.roomTypes?.sgl,
        intNoOfTPLRec: guestValue.roomTypes?.tpl,

        dtmFilterDateFrom: startDate
            ? startDate.toISOString()
            : null,

        intEasiaCateID: selectedStar,
        intJoinTypeID: joinType,
    });

    console.log("priceData", priceData);

    // ================= UI =================
    return (
        <div className="w-[320px] sticky top-32">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">

                {/* HEADER */}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold">Đặt tour</h3>
                        <p className="text-xs text-slate-500">
                            Nhập thông tin để hiển thị giá
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                            <HelpCircle size={16} />
                        </button>
                        <button className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                            <Download size={16} />
                        </button>
                    </div>
                </div>
                {priceData?.[0]?.dblUnitPrice && (
                    <div className="">
                        Tổng giá: ₫{priceData?.[0]?.dblUnitPrice?.toLocaleString("vi-VN") ?? "0"}
                    </div>
                )}

                {/* DATE */}
                <div ref={dateRef}>
                    <label className="text-xs font-semibold">Ngày bắt đầu</label>

                    <button
                        onClick={() =>
                            setActive(active === "dateOne" ? null : "dateOne")
                        }
                        className="w-full border rounded-lg px-3 py-2 flex justify-between"
                    >
                        <span>
                            {startDate
                                ? format(startDate, "dd/MM/yyyy")
                                : "Chọn ngày"}
                        </span>
                        <Calendar size={16} />
                    </button>

                    {active === "dateOne" && (
                        <DatePopup
                            isOpen
                            value={startDate}
                            onApply={(val) => {
                                setStartDate(val);
                                setActive(null);

                                if (val) {
                                    setCanFetchPrice(true); // 👈 ONLY HERE
                                }
                            }}
                        />
                    )}
                </div>

                {/* GUEST */}
                <div ref={guestRef}>
                    <label className="text-xs font-semibold">Số lượng khách</label>

                    <button
                        onClick={() =>
                            setActive(active === "guestRoom" ? null : "guestRoom")
                        }
                        className="w-full border rounded-lg px-3 py-2 flex justify-between"
                    >
                        <div className="flex gap-2">
                            <Users size={16} />
                            <span>
                                {guestValue.adults} NL • {guestValue.children} TE •{" "}
                                {guestValue.rooms} Phòng
                            </span>
                        </div>
                        <span>▼</span>
                    </button>

                    {active === "guestRoom" && (
                        <GuestRoomPopup
                            isOpen
                            isRoomDetail={true}
                            value={guestValue}
                            onDone={(val) => {
                                setGuestValue(val);
                                setActive(null);
                            }}
                        />
                    )}
                </div>

                {/* STAR */}
                <div>
                    <label className="text-xs font-semibold">Hạng Tour</label>

                    <div className="flex gap-2">
                        {starList.map((star: number) => (
                            <button
                                key={star}
                                onClick={() => setSelectedStar(star)}
                                className={`px-3 py-1 border rounded-lg ${selectedStar === star
                                    ? "border-blue-500"
                                    : "border-slate-300"
                                    }`}
                            >
                                {Array.from({ length: star }).map((_, i) => (
                                    <Star key={i} size={14} fill="gold" />
                                ))}
                            </button>
                        ))}
                    </div>
                </div>

                {/* TYPE */}
                <div>
                    <label className="text-xs font-semibold">Loại hình</label>

                    <select
                        value={joinType || ""}
                        onChange={(e) => setJoinType(Number(e.target.value))}
                        className="w-full border rounded-lg px-3 py-2"
                    >
                        {joinTypeList.map((t: any) => (
                            <option key={t.value} value={t.value}>
                                {t.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* BUTTON */}
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
                    Đặt ngay
                </button>

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
                    Thêm vào giỏ
                </button>
            </div>
        </div>
    );
};

export default BookingForm;