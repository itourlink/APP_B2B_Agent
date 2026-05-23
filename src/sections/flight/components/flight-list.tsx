import { useState } from "react";

import {
  Star,
  LayoutGrid,
  List,
  MapPin,
} from "lucide-react";

import { useListFlight } from "@/hooks/actions/useFilght";

import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";

import { getUrlImage } from "@/utils/format-image";

/* ───────────────────────────────────────── */
/* FLIGHT CARD */
/* ───────────────────────────────────────── */

const FlightCard = ({
  flight,
  viewMode,
}: any) => {
  const router = useRouter();

  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group ${
        viewMode === "grid"
          ? "flex h-full min-h-[195px]"
          : "flex"
      }`}
    >
      {/* IMAGE */}
      <div
        className={`relative overflow-hidden bg-gray-100 cursor-pointer shrink-0 ${
          viewMode === "grid"
            ? "w-1/2"
            : "w-[320px] h-[210px]"
        }`}
      >
        <img
          src={
            flight?.strSupplierImage
              ? getUrlImage(
                  flight?.strSupplierImage
                )
              : "https://placehold.co/600x400?text=Flight"
          }
          alt={flight?.strSupplierName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* CONTENT */}
      <div
        className={`p-4 flex flex-col ${
          viewMode === "grid"
            ? "w-1/2"
            : "flex-1"
        }`}
      >
        {/* TITLE */}
        <h3
          className={`font-bold uppercase cursor-pointer hover:text-[#2566b0] transition-colors ${
            viewMode === "grid"
              ? "text-[#1a4a8d] text-[15px] leading-tight mb-3 line-clamp-2"
              : "text-[#0f172a] text-[20px] leading-tight mb-4"
          }`}
        >
          {String(
            flight?.strSupplierName || "---"
          )}
        </h3>

        {/* STAR */}
        <div className="flex items-center gap-0.5 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={
                viewMode === "grid"
                  ? 13
                  : 16
              }
              className={
                i <
                (flight?.intEasiaCateID || 0)
                  ? "fill-orange-400 text-orange-400"
                  : "text-gray-300"
              }
            />
          ))}
        </div>

        {/* ADDRESS */}
        <div
          className={`flex items-start gap-2 ${
            viewMode === "grid"
              ? "mb-3"
              : "mb-4"
          }`}
        >
          <MapPin
            size={
              viewMode === "grid"
                ? 13
                : 15
            }
            className="text-gray-400 mt-0.5 shrink-0"
          />

          <p
            className={`text-gray-600 leading-relaxed ${
              viewMode === "grid"
                ? "text-[12px] line-clamp-2"
                : "text-[14px]"
            }`}
          >
            {String(
              flight?.strSupplierAddr ||
                "Đang cập nhật..."
            )}
          </p>
        </div>

        {/* TAG */}
        <div
          className={
            viewMode === "grid"
              ? "mb-3"
              : "mb-4"
          }
        >
          <span className="inline-block bg-[#e6f0ff] text-[#3b82f6] text-[11px] font-medium px-3 py-1 rounded-full">
            {typeof flight?.tag ===
            "object"
              ? "Chuyến bay nổi bật"
              : flight?.tag ||
                "Chuyến bay nổi bật"}
          </span>
        </div>

        {/* FOOTER */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-end justify-between gap-2">
          {/* PRICE */}
          <div>
            <p className="text-[11px] text-gray-500 mb-0.5">
              Giá từ
            </p>

            <p
              className={`text-[#2563eb] font-bold leading-none ${
                viewMode === "grid"
                  ? "text-lg"
                  : "text-[38px]"
              }`}
            >
              {typeof flight?.dblPriceFrom ===
                "object" ||
              flight?.dblPriceFrom ===
                "$0" ||
              flight?.dblPriceFrom ===
                "N/A" ||
              !flight?.dblPriceFrom ? (
                <span className="text-gray-400">
                  N/A
                </span>
              ) : (
                flight?.dblPriceFrom
              )}
            </p>
          </div>

          {/* BUTTON */}
          <button
            onClick={() => {
              router.replaceParams(
                paths.shop.flight.detail,
                {
                  item: flight,
                }
              );
            }}
            className={`cursor-pointer font-medium transition-all whitespace-nowrap ${
              viewMode === "grid"
                ? "text-[#2566b0] border border-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs"
                : "bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-xl text-sm"
            }`}
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

const FlightList = () => {
  const [viewMode, setViewMode] =
    useState<"grid" | "list">(
      "grid"
    );

  const filters = {
    page: 1,
    pageSize: 15,
  };

  const { flightData = [] } =
    useListFlight(filters);

  return (
    <section className="max-w-7xl mx-auto px-6 mb-10 mt-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Chuyến bay nổi bật
        </h2>

        {/* VIEW MODE */}
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm">
          <span className="text-sm text-gray-500 ml-2">
            Hiển thị dạng:
          </span>

          {/* GRID */}
          <button
            onClick={() =>
              setViewMode("grid")
            }
            className={`p-1.5 rounded-md shadow-sm cursor-pointer transition-all ${
              viewMode === "grid"
                ? "bg-[#2566b0] text-white"
                : "text-gray-400 hover:bg-gray-100"
            }`}
          >
            <LayoutGrid size={18} />
          </button>

          {/* LIST */}
          <button
            onClick={() =>
              setViewMode("list")
            }
            className={`cursor-pointer p-1.5 rounded-md transition-colors ${
              viewMode === "list"
                ? "bg-[#2566b0] text-white"
                : "text-gray-400 hover:bg-gray-100"
            }`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* LIST */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 lg:grid-cols-2 gap-6"
            : "flex flex-col gap-5"
        }
      >
        {flightData?.map(
          (flight: any) => (
            <FlightCard
              key={
                flight?.strSupplierGUID
              }
              flight={flight}
              viewMode={viewMode}
            />
          )
        )}
      </div>
    </section>
  );
};

export default FlightList;