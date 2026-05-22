import { useListGuideFee } from "@/hooks/actions/useGuideFee";
import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";

import {
    Star,
    MapPin,
    LayoutGrid,
    List,
} from "lucide-react";

import { useState } from "react";

import { getUrlImage } from "@/utils/format-image";

/* ───────────────────────────────────────── */
/* GRID CARD */
/* ───────────────────────────────────────── */

const GuideCardGrid = ({
    guide,
}: {
    guide: any;
}) => {
    const router = useRouter();

    const handleNavigate = () => {
        const supplierGuidQuery =
            guide?.strSupplierGUID
                ? `?supplierGuid=${encodeURIComponent(
                      guide.strSupplierGUID
                  )}`
                : "";

        router.replaceParams(
            `${paths.shop.guide.detail}${supplierGuidQuery}`,
            {
                item: guide,
            }
        );
    };

    return (
        <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
            {/* IMAGE */}
            <div
                onClick={handleNavigate}
                className="relative h-52 cursor-pointer overflow-hidden bg-gray-100"
            >
                <img
                    src={
                        guide?.strSupplierImage
                            ? getUrlImage(
                                  guide?.strSupplierImage
                              )
                            : "https://placehold.co/600x400?text=Guide"
                    }
                    alt={guide?.strSupplierName}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            {/* CONTENT */}
            <div className="flex flex-grow flex-col p-4">
                {/* TITLE */}
                <h3
                    onClick={handleNavigate}
                    className="mb-3 line-clamp-2 min-h-[48px] cursor-pointer text-[15px] font-bold uppercase leading-tight text-[#0f172a] transition-colors hover:text-[#2566b0]"
                >
                    {guide?.strSupplierName || "---"}
                </h3>

                {/* STAR */}
                <div className="mb-3 flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={14}
                            className={
                                i <
                                (guide?.intEasiaCateID ||
                                    0)
                                    ? "fill-orange-400 text-orange-400"
                                    : "text-gray-300"
                            }
                        />
                    ))}
                </div>

                {/* ADDRESS */}
                <div className="mb-4 flex items-start gap-2 text-[13px] text-gray-600">
                    <MapPin
                        size={14}
                        className="mt-0.5 shrink-0 text-gray-400"
                    />

                    <span className="line-clamp-2 leading-relaxed">
                        {guide?.strSupplierAddr ||
                            "Đang cập nhật..."}
                    </span>
                </div>

                {/* TAG */}
                <div className="mb-4">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700">
                        {guide?.tag ||
                            "Phí hướng dẫn"}
                    </span>
                </div>

                {/* FOOTER */}
                <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-4">
                    <div>
                        <p className="mb-1 text-[11px] text-gray-500">
                            Giá từ
                        </p>

                        <p className="text-xl font-bold leading-none text-[#2563eb]">
                            {guide?.dblMaxPriceFrom ===
                                "$0" ||
                            guide?.dblMaxPriceFrom ===
                                "N/A"
                                ? "N/A"
                                : guide?.dblMaxPriceFrom}
                        </p>
                    </div>

                    <button
                        onClick={handleNavigate}
                        className="
                            rounded-lg
                            border
                            border-blue-200
                            px-3
                            py-1.5
                            text-xs
                            font-medium
                            text-[#2566b0]
                            transition-all
                            hover:border-blue-600
                            hover:bg-blue-50
                        "
                    >
                        Xem chi tiết
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ───────────────────────────────────────── */
/* LIST CARD */
/* ───────────────────────────────────────── */

const GuideCardList = ({
    guide,
}: {
    guide: any;
}) => {
    const router = useRouter();

    const handleNavigate = () => {
        const supplierGuidQuery =
            guide?.strSupplierGUID
                ? `?supplierGuid=${encodeURIComponent(
                      guide.strSupplierGUID
                  )}`
                : "";

        router.replaceParams(
            `${paths.shop.guide.detail}${supplierGuidQuery}`,
            {
                item: guide,
            }
        );
    };

    return (
        <div className="group flex overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
            {/* IMAGE */}
            <div
                onClick={handleNavigate}
                className="h-[210px] w-[320px] shrink-0 cursor-pointer overflow-hidden bg-gray-100"
            >
                <img
                    src={
                        guide?.strSupplierImage
                            ? getUrlImage(
                                  guide?.strSupplierImage
                              )
                            : "https://placehold.co/600x400?text=Guide"
                    }
                    alt={guide?.strSupplierName}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* CONTENT */}
            <div className="flex flex-1 items-stretch justify-between p-5">
                {/* LEFT */}
                <div className="flex flex-1 flex-col">
                    {/* TITLE */}
                    <h3
                        onClick={handleNavigate}
                        className="mb-3 cursor-pointer text-[20px] font-bold uppercase leading-tight text-[#0f172a] transition-colors hover:text-[#2566b0]"
                    >
                        {guide?.strSupplierName ||
                            "---"}
                    </h3>

                    {/* ADDRESS */}
                    <div className="flex items-start gap-2 text-[14px] text-gray-600">
                        <MapPin
                            size={15}
                            className="mt-0.5 shrink-0 text-gray-400"
                        />

                        <span className="leading-relaxed">
                            {guide?.strSupplierAddr ||
                                "Đang cập nhật..."}
                        </span>
                    </div>

                    {/* TAG */}
                    <div className="mt-4">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700">
                            {guide?.tag ||
                                "Phí hướng dẫn"}
                        </span>
                    </div>

                    {/* PRICE */}
                    <div className="mt-auto pt-5">
                        <p className="mb-1 text-[13px] text-gray-500">
                            Giá từ
                        </p>

                        <p className="text-[38px] font-bold leading-none text-[#2563eb]">
                            {guide?.dblMaxPriceFrom ===
                                "$0" ||
                            guide?.dblMaxPriceFrom ===
                                "N/A"
                                ? "N/A"
                                : guide?.dblMaxPriceFrom}
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
                                    i <
                                    (guide?.intEasiaCateID ||
                                        0)
                                        ? "fill-orange-400 text-orange-400"
                                        : "text-gray-300"
                                }
                            />
                        ))}
                    </div>

                    {/* BUTTON */}
                    <button
                        onClick={handleNavigate}
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

/* ───────────────────────────────────────── */
/* MAIN */
/* ───────────────────────────────────────── */

const GuideFeeList = () => {
    const [filters] = useState({
        page: 1,
        pageSize: 15,
    });

    const [viewMode, setViewMode] =
        useState<"list" | "grid">(
            "grid"
        );

    const { guideFeeData: guideData = [] } =
        useListGuideFee(filters);

    return (
        <section className="mx-auto min-h-screen max-w-7xl bg-gray-50 p-6">
            {/* HEADER */}
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                    Phí hướng dẫn
                </h2>

                {/* VIEW MODE */}
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-1">
                    <span className="ml-2 text-[12px] text-gray-500">
                        Hiển thị dạng:
                    </span>

                    <div className="flex gap-1">
                        {/* GRID */}
                        <button
                            onClick={() =>
                                setViewMode("grid")
                            }
                            className={`cursor-pointer rounded-md p-1.5 transition-all ${
                                viewMode === "grid"
                                    ? "bg-[#2566b0] text-white shadow-sm"
                                    : "text-gray-400 hover:bg-gray-200"
                            }`}
                        >
                            <LayoutGrid size={16} />
                        </button>

                        {/* LIST */}
                        <button
                            onClick={() =>
                                setViewMode("list")
                            }
                            className={`cursor-pointer rounded-md p-1.5 transition-all ${
                                viewMode === "list"
                                    ? "bg-[#2566b0] text-white shadow-sm"
                                    : "text-gray-400 hover:bg-gray-200"
                            }`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div
                className={
                    viewMode === "grid"
                        ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                        : "flex flex-col gap-5"
                }
            >
                {guideData?.map((guide: any) =>
                    viewMode === "grid" ? (
                        <GuideCardGrid
                            key={
                                guide?.strSupplierGUID
                            }
                            guide={guide}
                        />
                    ) : (
                        <GuideCardList
                            key={
                                guide?.strSupplierGUID
                            }
                            guide={guide}
                        />
                    )
                )}
            </div>
        </section>
    );
};

export default GuideFeeList;