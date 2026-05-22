import { useState } from "react";

import {
  Star,
  LayoutGrid,
  List,
  MapPin,
  Plane,
} from "lucide-react";

import { useListFlight } from "@/hooks/actions/useFilght";

import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";

import { getUrlImage } from "@/utils/format-image";

/* ───────────────────────────────────────── */
/* GRID CARD */
/* ───────────────────────────────────────── */

const FlightCardGrid = ({
  flight,
}: {
  flight: any;
}) => {
  const router = useRouter();

  const handleNavigate = () => {
    router.replaceParams(
      paths.shop.flight.detail,
      {
        item: flight,
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
            flight?.strSupplierImage
              ? getUrlImage(
                  flight?.strSupplierImage
                )
              : "https://placehold.co/600x400?text=Flight"
          }
          alt={flight?.strSupplierName}
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
          {flight?.strSupplierName ||
            "---"}
        </h3>

        {/* STAR */}
        <div className="mb-3 flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i <
                (flight?.intEasiaCateID || 0)
                  ? "fill-orange-400 text-orange-400"
                  : "text-gray-300"
              }
            />
          ))}
        </div>

        {/* TYPE */}
        <div className="mb-2 flex items-center gap-2 text-[13px] text-gray-600">
          <Plane
            size={14}
            className="shrink-0 text-gray-400"
          />

          <span>Chuyến bay</span>
        </div>

        {/* ADDRESS */}
        <div className="mb-4 flex items-start gap-2 text-[13px] text-gray-600">
          <MapPin
            size={14}
            className="mt-0.5 shrink-0 text-gray-400"
          />

          <span className="line-clamp-2 leading-relaxed">
            {flight?.strSupplierAddr ||
              "Đang cập nhật..."}
          </span>
        </div>

        {/* TAG */}
        <div className="mb-4">
          <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-medium text-sky-700">
            {flight?.tag ||
              "Chuyến bay nổi bật"}
          </span>
        </div>

        {/* FOOTER */}
        <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-4">
          <div>
            <p className="mb-1 text-[11px] text-gray-500">
              Giá từ
            </p>

            <p className="text-xl font-bold leading-none text-[#2563eb]">
              {flight?.dblPriceFrom ===
                "$0" ||
              flight?.dblPriceFrom ===
                "N/A"
                ? "N/A"
                : flight?.dblPriceFrom}
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

const FlightCardList = ({
  flight,
}: {
  flight: any;
}) => {
  const router = useRouter();

  const handleNavigate = () => {
    router.replaceParams(
      paths.shop.flight.detail,
      {
        item: flight,
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
            flight?.strSupplierImage
              ? getUrlImage(
                  flight?.strSupplierImage
                )
              : "https://placehold.co/600x400?text=Flight"
          }
          alt={flight?.strSupplierName}
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
            {flight?.strSupplierName ||
              "---"}
          </h3>

          {/* TYPE */}
          <div className="mb-3 flex items-center gap-2 text-[14px] text-gray-600">
            <Plane
              size={15}
              className="shrink-0 text-gray-400"
            />

            <span>Chuyến bay</span>
          </div>

          {/* ADDRESS */}
          <div className="flex items-start gap-2 text-[14px] text-gray-600">
            <MapPin
              size={15}
              className="mt-0.5 shrink-0 text-gray-400"
            />

            <span className="leading-relaxed">
              {flight?.strSupplierAddr ||
                "Đang cập nhật..."}
            </span>
          </div>

          {/* TAG */}
          <div className="mt-4">
            <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-medium text-sky-700">
              {flight?.tag ||
                "Chuyến bay nổi bật"}
            </span>
          </div>

          {/* PRICE */}
          <div className="mt-auto pt-5">
            <p className="mb-1 text-[13px] text-gray-500">
              Giá từ
            </p>

            <p className="text-[38px] font-bold leading-none text-[#2563eb]">
              {flight?.dblPriceFrom ===
                "$0" ||
              flight?.dblPriceFrom ===
                "N/A"
                ? "N/A"
                : flight?.dblPriceFrom}
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
                  (flight?.intEasiaCateID || 0)
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
    <section className="mx-auto mb-10 mt-6 max-w-7xl px-6">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Chuyến bay nổi bật
        </h2>

        {/* VIEW MODE */}
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-1.5 shadow-sm">
          <span className="ml-2 text-sm text-gray-500">
            Hiển thị dạng:
          </span>

          {/* GRID */}
          <button
            onClick={() =>
              setViewMode("grid")
            }
            className={`cursor-pointer rounded-md p-1.5 transition-all ${
              viewMode === "grid"
                ? "bg-[#2566b0] text-white shadow-sm"
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
            className={`cursor-pointer rounded-md p-1.5 transition-all ${
              viewMode === "list"
                ? "bg-[#2566b0] text-white shadow-sm"
                : "text-gray-400 hover:bg-gray-100"
            }`}
          >
            <List size={18} />
          </button>
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
        {flightData?.map((flight: any) =>
          viewMode === "grid" ? (
            <FlightCardGrid
              key={flight?.strSupplierGUID}
              flight={flight}
            />
          ) : (
            <FlightCardList
              key={flight?.strSupplierGUID}
              flight={flight}
            />
          )
        )}
      </div>
    </section>
  );
};

export default FlightList;