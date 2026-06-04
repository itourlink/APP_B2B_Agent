import {
    Calendar,
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
import { useListCurrency, useListPrice } from "@/hooks/actions/useBooking";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCartForTour } from "@/hooks/actions/useCart";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useUser } from "@/hooks/actions/useAuth";
import { useToastStore } from "@/zustand/useToastStore";
import { useListCompanyOwner } from "@/hooks/actions/useCompanyOwner";
import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks/use-router";

interface Props {
    item?: any;
}

type GuestValue = {
    rooms: number;
    adults: number;
    children: number;
    childAges: number[];
    roomTypes: {
        sgl: number;
        dbl: number;
        twn: number;
        tpl: number;
    };
};
const BookingForm = ({ item }: Props) => {
    const queryClient = useQueryClient();
    const { user } = useUser();
    const { coData } = useListCompanyOwner();
    const { currencyData } = useListCurrency();

    console.log("currencyData", currencyData);
    const { showToast } = useToastStore();

    const route = useRouter();

    const [canFetchPrice, setCanFetchPrice] = useState(false);
    // ================= STATE =================
    const [active, setActive] = useState<"dateOne" | "guestRoom" | null>(null);

    const [startDate, setStartDate] = useState<Date | null>(null);

    const [guestValue, setGuestValue] = useState<GuestValue>({
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

    const { mutate: addCartForTourApi } = useMutation({
        mutationFn: addCartForTour,
    });


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

    const xmlNoOfChild = useMemo(() => {
        if (!guestValue.childAges?.length) {
            return null;
        }

        return guestValue.childAges
            .map((age) => `<child>${age}</child>`)
            .join("");
    }, [guestValue.childAges]);


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

        xmlNoOfChild,

        intEasiaCateID: selectedStar,

        intJoinTypeID: joinType,

        strPriceLevelGUID: item?.strPriceLevelGUID ?? "",
    });

    const price = priceData?.[0] ?? [];

    const dtmDateTo = startDate
        ? new Date(startDate.getTime() + 1 * 24 * 60 * 60 * 1000)
        : null;

    const buildPayload = () => {
        return {
            strCompanyPartnerGUID: user?.strCompanyGUID,
            strCompanyOwnerGUID: coData?.strCompanyGUID,
            strTourGUID: item?.strTourGUID,
            strTourPriceItemLevelGUID: price?.strTourPriceItemLevelGUID,
            strDepartureTourLevelGUID: null,

            intAdult: guestValue.adults,
            strListChildAge: guestValue.childAges?.join(",") ?? null,

            intSGL: guestValue.roomTypes.sgl,
            intDBL: guestValue.roomTypes.dbl,
            intTWN: guestValue.roomTypes.twn,
            intTPL: guestValue.roomTypes.tpl,

            dtmDateFrom: startDate?.toISOString(),
            dtmDateTo: dtmDateTo?.toISOString(),

            intCurrencyID: user?.intCurrencyID,
        };
    };

    const handleAddtoCart = () => {
        const payload = buildPayload();

        addCartForTourApi(payload, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.CART.LIST_CART],
                });
                route.push(paths.cart.list);
                showToast("success", "Thêm vào giỏ thành công");
            },
            onError: () => {
                showToast("error", "Thêm vào giỏ thất bại");
            },
        });
    };


    const handleBooking = () => {
        route.replaceParams(paths.booking.paymentBooking, { item: item, price: price, payload: buildPayload(), });
    };
    // ================= UI =================
    return (
        <div className="w-[280px] sticky top-24">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">

                {/* HEADER */}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold">Đặt tour</h3>
                        <p className="text-[11px] text-slate-500">
                            Nhập thông tin để hiển thị giá
                        </p>
                    </div>

                    {/* <div className="flex gap-2">
                        <button className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center">
                            <HelpCircle size={14} />
                        </button>

                        <button className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center">
                            <Download size={14} />
                        </button>
                    </div> */}
                </div>

                {price.dblTotalPrice && (
                    <div className="">
                        <div className="text-[24px] font-semibold text-[#0c63e6]">
                            Tổng giá: {currencyData?.strCurrencySymbol} {price.dblTotalPrice?.toLocaleString("vi-VN") ?? "0"}
                        </div>
                        <div className="text-[12px] pt-[5px]">
                            Giá / Khách: {currencyData?.strCurrencySymbol} {price.dblUnitPrice?.toLocaleString("vi-VN") ?? "0"}
                        </div>
                        <div className="text-[12px] pt-[5px]">
                            Còn lại: {price.intPaxRemain ?? "0"} suất
                        </div>
                    </div>
                )}

                {/* DATE */}
                <div ref={dateRef}>
                    <label className="text-[11px] font-semibold">Ngày bắt đầu</label>

                    <button
                        onClick={() =>
                            setActive(active === "dateOne" ? null : "dateOne")
                        }
                        className="cursor-pointer w-full border border-slate-300 rounded-lg px-3 py-2 text-sm flex justify-between items-center"
                    >
                        <span>
                            {startDate
                                ? format(startDate, "dd/MM/yyyy")
                                : "Chọn ngày"}
                        </span>

                        <Calendar size={14} />
                    </button>

                    {active === "dateOne" && (
                        <div className="absolute top-0 z-50 right-72">
                            <DatePopup
                                isOpen
                                value={startDate}
                                onApply={(val) => {
                                    setStartDate(val);
                                    setActive(null);

                                    if (val) {
                                        setCanFetchPrice(true);
                                    }
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* GUEST */}
                <div ref={guestRef}>
                    <label className="text-[11px] font-semibold">Số lượng khách</label>

                    <button
                        onClick={() =>
                            setActive(active === "guestRoom" ? null : "guestRoom")
                        }
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm flex justify-between items-center"
                    >
                        <div className="flex gap-2 items-center">
                            <Users size={14} />

                            <span>
                                {guestValue.adults} NL • {guestValue.children} TE •{" "}
                                {guestValue.rooms} Phòng
                            </span>
                        </div>

                        <span className="text-xs">▼</span>
                    </button>

                    {active === "guestRoom" && (
                        <div className="absolute top-0 z-50 right-72">
                            <GuestRoomPopup
                                isOpen
                                isRoomDetail={true}
                                value={guestValue}
                                onDone={(val) => {
                                    setGuestValue(val);
                                    setActive(null);
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* STAR */}
                <div>
                    <label className="text-[11px] font-semibold">Hạng Tour</label>

                    <select
                        value={selectedStar ?? ""}
                        onChange={(e) =>
                            setSelectedStar(
                                e.target.value ? Number(e.target.value) : null
                            )
                        }
                        className="cursor-pointer w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                    >
                        {starList.map((star: number) => (
                            <option key={star} value={star} className="cursor-pointer">
                                {"⭐".repeat(star)} ({star} sao)
                            </option>
                        ))}
                    </select>
                </div>

                {/* TYPE */}
                <div>
                    <label className="text-[11px] font-semibold">Loại hình</label>

                    <select
                        value={joinType || ""}
                        onChange={(e) => setJoinType(Number(e.target.value))}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                    >
                        {joinTypeList.map((t: any) => (
                            <option key={t.value} value={t.value}>
                                {t.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* BUTTON */}
                <button
                    onClick={handleBooking}
                    disabled={!startDate || !price?.strTourPriceItemLevelGUID}
                    className="w-full bg-[#4a6fa5] hover:bg-[#3b5b7e] cursor-pointer text-white py-2.5 text-sm rounded-lg disabled:opacity-50"
                >
                    Đặt ngay
                </button>

                <button
                    onClick={handleAddtoCart}
                    disabled={!startDate || !price?.strTourPriceItemLevelGUID}
                    className="w-full bg-[#4a6fa5] hover:bg-[#3b5b7e] cursor-pointer text-white py-2.5 text-sm rounded-lg disabled:opacity-50"
                >
                    Thêm vào giỏ
                </button>
            </div>
        </div>
    );
};

export default BookingForm;