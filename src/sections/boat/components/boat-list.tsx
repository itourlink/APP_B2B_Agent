import { useState } from "react";
import {
    Anchor,
    LayoutGrid,
    List,
    MapPin,
    Star,
} from "lucide-react";

import { useListBoat } from "@/hooks/actions/useBoat";
import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";
import { getUrlImage } from "@/utils/format-image";
import { fCurrency } from "@/utils/format-number";
import { useListCurrency } from "@/components/currency/useListCurrency";

const BoatCardSkeleton = () => {
    return (
        <div className="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="h-44 bg-gray-200" />

            <div className="p-4">
                <div className="mb-3 h-4 w-3/4 rounded bg-gray-200" />
                <div className="mb-2 h-3 w-1/2 rounded bg-gray-200" />
                <div className="mb-4 h-3 w-full rounded bg-gray-200" />
                <div className="h-8 w-1/3 rounded bg-gray-200" />
            </div>
        </div>
    );
};

const BoatError = () => (
    <div className="py-20 text-center text-red-500">
        Không tải được danh sách du thuyền
    </div>
);

const BoatCard = ({ boat }: any) => {
    const router = useRouter();
    const { selectedCurrency } = useListCurrency()

    return (
        <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
            {/* IMAGE */}
            <div className="relative h-44 overflow-hidden">
                <img
                    src={
                        boat?.strSupplierImage
                            ? getUrlImage(boat?.strSupplierImage)
                            : "https://placehold.co/600x400?text=Boat"
                    }
                    alt={boat?.strSupplierName}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            {/* CONTENT */}
            <div className="flex flex-grow flex-col p-4">
                <h3 className="mb-4 line-clamp-2 h-12 text-[15px] font-bold uppercase leading-tight text-gray-800">
                    {boat?.strSupplierName || "---"}
                </h3>

                <div className="mb-4 space-y-2.5 text-[13px] text-gray-600">
                    <div className="flex items-center gap-2">
                        <Anchor
                            size={14}
                            className="shrink-0 text-gray-400"
                        />

                        <span>Du thuyền</span>

                        <div className="ml-1 flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={14}
                                    className={
                                        i < (boat?.intEasiaCateID || 0)
                                            ? "fill-orange-400 text-orange-400"
                                            : "text-gray-300"
                                    }
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <MapPin
                            size={14}
                            className="mt-0.5 shrink-0 text-gray-400"
                        />

                        <span className="line-clamp-2 leading-relaxed">
                            {boat?.strSupplierAddr || "---"}
                        </span>
                    </div>
                </div>

                {/* DIVIDER */}
                <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                    </div>

                    <div className="relative flex justify-center">
                        <span className="bg-white px-3 text-[11px] font-bold italic tracking-wider text-gray-900">
                            Tăng giá/Giảm giá
                        </span>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="mt-auto flex items-end justify-between">
                    <div>
                        <p className="mb-0.5 text-[11px] text-gray-500">
                            Giá từ
                        </p>

                        <p className="text-xl font-bold leading-none text-[#2563eb]">
                            {fCurrency(
                                boat?.dblPriceFrom,
                                selectedCurrency?.label
                            )}
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            router.replaceParams(paths.shop.boat.detail, {
                                item: boat,
                            })
                        }
                        className="cursor-pointer rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-[#2566b0] transition-all hover:border-blue-600 hover:bg-blue-50"
                    >
                        Xem chi tiết
                    </button>
                </div>
            </div>
        </div>
    );
};

const BoatCardList = ({ boat }: any) => {
    const router = useRouter();
    const { selectedCurrency } = useListCurrency()

    return (
        <div className="group flex overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
            {/* IMAGE */}
            <div className="h-[180px] w-[270px] shrink-0 overflow-hidden">
                <img
                    src={
                        boat?.strSupplierImage
                            ? getUrlImage(boat?.strSupplierImage)
                            : "https://placehold.co/600x400?text=Boat"
                    }
                    alt={boat?.strSupplierName}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* CONTENT */}
            <div className="flex flex-1 items-stretch justify-between p-5">
                {/* LEFT */}
                <div className="flex flex-1 flex-col">
                    {/* TITLE */}
                    <h3 className="mb-3 text-[18px] font-bold uppercase leading-tight text-[#0f172a]">
                        {boat?.strSupplierName || "---"}
                    </h3>

                    {/* TYPE */}
                    <div className="mb-3 flex items-center gap-2 text-[14px] text-gray-600">
                        <Anchor
                            size={15}
                            className="shrink-0 text-gray-400"
                        />

                        <span>Du thuyền</span>
                    </div>

                    {/* ADDRESS */}
                    <div className="flex items-start gap-2 text-[14px] text-gray-600">
                        <MapPin
                            size={15}
                            className="mt-0.5 shrink-0 text-gray-400"
                        />

                        <span className="leading-relaxed">
                            {boat?.strSupplierAddr || "---"}
                        </span>
                    </div>

                    {/* PRICE */}
                    <div className="mt-auto pt-5">
                        <p className="mb-1 text-[13px] text-gray-500">
                            Giá từ
                        </p>

                        <p className="text-[38px] font-bold leading-none text-[#2563eb]">

                            {fCurrency(
                                boat?.dblPriceFrom,
                                selectedCurrency?.label
                            )}
                        </p>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="ml-6 flex min-w-[180px] flex-col items-end justify-between">
                    {/* STAR */}
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={16}
                                className={
                                    i < (boat?.intEasiaCateID || 0)
                                        ? "fill-orange-400 text-orange-400"
                                        : "text-gray-300"
                                }
                            />
                        ))}
                    </div>

                    {/* BUTTON */}
                    <button
                        onClick={() =>
                            router.replaceParams(paths.shop.boat.detail, {
                                item: boat,
                            })
                        }
                        className="
                            rounded-xl
                            bg-[#2563eb]
                            px-6
                            py-3
                            text-sm
                            font-semibold
                            text-white
                            transition-all
                            hover:bg-[#1d4ed8]
                        "
                    >
                        Xem chi tiết
                    </button>
                </div>
            </div>
        </div>
    );
};

const BoatList = () => {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const [filters] = useState({
        page: 1,
        pageSize: 15,
        tblsReturn: "[0]",
    });

    const { boatData, boatLoading, boatError } = useListBoat(filters);

    // DATA THẬT
    const boatDT = boatData?.[0] ?? [];

    return (
        <section className="mx-auto max-w-7xl bg-white p-8">
            {/* HEADER */}
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                    Du Thuyền Nổi Bật
                </h2>

                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-1">
                    <span className="ml-2 text-[12px] text-gray-500">
                        Hiển thị dạng:
                    </span>

                    <div className="flex gap-1">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`cursor-pointer rounded-md p-1.5 transition-all ${viewMode === "grid"
                                ? "bg-[#2566b0] text-white shadow-sm"
                                : "text-gray-400 hover:bg-gray-200"
                                }`}
                        >
                            <LayoutGrid size={16} />
                        </button>

                        <button
                            onClick={() => setViewMode("list")}
                            className={`cursor-pointer rounded-md p-1.5 transition-all ${viewMode === "list"
                                ? "bg-[#2566b0] text-white shadow-sm"
                                : "text-gray-400 hover:bg-gray-200"
                                }`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* LOADING */}
            {boatLoading && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {[...Array(8)].map((_, i) => (
                        <BoatCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* ERROR */}
            {boatError && <BoatError />}

            {/* DATA */}
            {!boatLoading && !boatError && (
                <div
                    className={
                        viewMode === "grid"
                            ? "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
                            : "flex flex-col gap-4"
                    }
                >
                    {boatDT.length > 0 ? (
                        boatDT.map((boat: any) =>
                            viewMode === "grid" ? (
                                <BoatCard
                                    key={boat?.strSupplierGUID}
                                    boat={boat}
                                />
                            ) : (
                                <BoatCardList
                                    key={boat?.strSupplierGUID}
                                    boat={boat}
                                />
                            )
                        )
                    ) : (
                        <div className="col-span-full py-10 text-center text-gray-500">
                            Không có dữ liệu
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default BoatList;