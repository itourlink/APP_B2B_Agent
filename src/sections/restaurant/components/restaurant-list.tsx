import { useState } from "react";

import {
  Star,
  MapPin,
  LayoutGrid,
  List,
  UtensilsCrossed,
} from "lucide-react";

import { useListRestaurant } from "@/hooks/actions/useRestaurant";

import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";

import { getUrlImage } from "@/utils/format-image";

/* ─────────────────────────────────────────────────────────── */
/* GRID CARD */
/* ─────────────────────────────────────────────────────────── */

const RestaurantCardGrid = ({
  restaurant,
}: {
  restaurant: any;
}) => {
  const router = useRouter();

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      {/* IMAGE */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <img
          src={
            restaurant?.strSupplierImage
              ? getUrlImage(
                restaurant?.strSupplierImage
              )
              : "https://placehold.co/600x400?text=Restaurant"
          }
          alt={restaurant?.strSupplierName}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-grow flex-col p-4">
        {/* TITLE */}
        <h3 className="mb-3 line-clamp-2 min-h-[48px] text-[15px] font-bold uppercase leading-tight text-[#0f172a]">
          {restaurant?.strSupplierName || "---"}
        </h3>

        {/* STAR */}
        <div className="mb-3 flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i <
                  (restaurant?.intEasiaCateID || 0)
                  ? "fill-orange-400 text-orange-400"
                  : "text-gray-300"
              }
            />
          ))}
        </div>

        {/* TYPE */}
        <div className="mb-2 flex items-center gap-2 text-[13px] text-gray-600">
          <UtensilsCrossed
            size={14}
            className="shrink-0 text-gray-400"
          />

          <span>Nhà hàng</span>
        </div>

        {/* ADDRESS */}
        <div className="mb-4 flex items-start gap-2 text-[13px] text-gray-600">
          <MapPin
            size={14}
            className="mt-0.5 shrink-0 text-gray-400"
          />

          <span className="line-clamp-2 leading-relaxed">
            {restaurant?.strSupplierAddr ||
              "Đang cập nhật..."}
          </span>
        </div>

        {/* TAG */}
        <div className="mb-4">
          <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-medium text-orange-700">
            {restaurant?.tag ||
              "Nhà hàng nổi bật"}
          </span>
        </div>

        {/* FOOTER */}
        <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-4">
          <div>
            <p className="mb-1 text-[11px] text-gray-500">
              Giá từ
            </p>

            <p className="text-xl font-bold leading-none text-[#2563eb]">
              {restaurant?.dblPriceFrom === "$0" ||
                restaurant?.dblPriceFrom === "N/A"
                ? "N/A"
                : restaurant?.dblPriceFrom}
            </p>
          </div>

          <button
            onClick={() =>
              router.replaceParams(
                paths.shop.restaurant.detail,
                {
                  item: restaurant,
                }
              )
            }
            className="
            cursor-pointer
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

/* ─────────────────────────────────────────────────────────── */
/* LIST CARD */
/* ─────────────────────────────────────────────────────────── */

const RestaurantCardList = ({
  restaurant,
}: {
  restaurant: any;
}) => {
  const router = useRouter();

  return (
    <div className="group flex overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      {/* IMAGE */}
      <div className="h-[210px] w-[320px] shrink-0 overflow-hidden bg-gray-100">
        <img
          src={
            restaurant?.strSupplierImage
              ? getUrlImage(
                restaurant?.strSupplierImage
              )
              : "https://placehold.co/600x400?text=Restaurant"
          }
          alt={restaurant?.strSupplierName}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 items-stretch justify-between p-5">
        {/* LEFT */}
        <div className="flex flex-1 flex-col">
          {/* TITLE */}
          <h3 className="mb-3 text-[20px] font-bold uppercase leading-tight text-[#0f172a]">
            {restaurant?.strSupplierName || "---"}
          </h3>

          {/* TYPE */}
          <div className="mb-3 flex items-center gap-2 text-[14px] text-gray-600">
            <UtensilsCrossed
              size={15}
              className="shrink-0 text-gray-400"
            />

            <span>Nhà hàng</span>
          </div>

          {/* ADDRESS */}
          <div className="flex items-start gap-2 text-[14px] text-gray-600">
            <MapPin
              size={15}
              className="mt-0.5 shrink-0 text-gray-400"
            />

            <span className="leading-relaxed">
              {restaurant?.strSupplierAddr ||
                "Đang cập nhật..."}
            </span>
          </div>

          {/* TAG */}
          <div className="mt-4">
            <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-medium text-orange-700">
              {restaurant?.tag ||
                "Nhà hàng nổi bật"}
            </span>
          </div>

          {/* PRICE */}
          <div className="mt-auto pt-5">
            <p className="mb-1 text-[13px] text-gray-500">
              Giá từ
            </p>

            <p className="text-[38px] font-bold leading-none text-[#2563eb]">
              {restaurant?.dblPriceFrom === "$0" ||
                restaurant?.dblPriceFrom === "N/A"
                ? "N/A"
                : restaurant?.dblPriceFrom}
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
                    (restaurant?.intEasiaCateID || 0)
                    ? "fill-orange-400 text-orange-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>

          {/* BUTTON */}
          <button
            onClick={() =>
              router.replaceParams(
                paths.shop.restaurant.detail,
                {
                  item: restaurant,
                }
              )
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

/* ─────────────────────────────────────────────────────────── */
/* SKELETON */
/* ─────────────────────────────────────────────────────────── */

const RestaurantSkeleton = () => {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="h-52 bg-gray-200" />

      <div className="p-4">
        <div className="mb-3 h-5 w-3/4 rounded bg-gray-200" />

        <div className="mb-2 h-3 w-1/2 rounded bg-gray-200" />

        <div className="mb-4 h-3 w-full rounded bg-gray-200" />

        <div className="flex items-center justify-between">
          <div className="h-8 w-24 rounded bg-gray-200" />

          <div className="h-8 w-20 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────── */
/* EMPTY */
/* ─────────────────────────────────────────────────────────── */

const EmptyState = () => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <h3 className="text-lg font-semibold text-gray-700">
        Không có nhà hàng nào
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        Hiện tại chưa có dữ liệu phù hợp
      </p>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────── */
/* ERROR */
/* ─────────────────────────────────────────────────────────── */

const ErrorState = () => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-3 text-5xl text-red-400">
        ⚠️
      </div>

      <h3 className="text-lg font-semibold text-gray-800">
        Có lỗi xảy ra
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        Không thể tải danh sách nhà hàng
      </p>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────── */
/* MAIN */
/* ─────────────────────────────────────────────────────────── */

export const RestaurantList = () => {
  const [viewMode, setViewMode] = useState<
    "grid" | "list"
  >("grid");

  const [filters] = useState({
    page: 1,
    pageSize: 15,
  });

  const {
    restaurantData = [],
    restaurantLoading,
    restaurantError,
  } = useListRestaurant(filters);

  const isEmpty =
    !restaurantLoading &&
    restaurantData?.length === 0;

  return (
    <section className="mx-auto min-h-screen max-w-7xl bg-gray-50 p-6">
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Khám phá nhà hàng
        </h2>

        {/* VIEW MODE */}
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-1.5 shadow-sm">
          <span className="ml-2 text-sm text-gray-500">
            Hiển thị dạng:
          </span>

          {/* GRID */}
          <button
            onClick={() => setViewMode("grid")}
            className={`rounded-md p-1.5 transition-all ${viewMode === "grid"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-400 hover:bg-gray-100"
              }`}
          >
            <LayoutGrid size={18} />
          </button>

          {/* LIST */}
          <button
            onClick={() => setViewMode("list")}
            className={`rounded-md p-1.5 transition-all ${viewMode === "list"
                ? "bg-blue-600 text-white shadow-sm"
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
        {/* LOADING */}
        {restaurantLoading &&
          Array.from({ length: 6 }).map(
            (_, i) => (
              <RestaurantSkeleton key={i} />
            )
          )}

        {/* ERROR */}
        {restaurantError && <ErrorState />}

        {/* EMPTY */}
        {isEmpty && <EmptyState />}

        {/* DATA */}
        {!restaurantLoading &&
          !restaurantError &&
          restaurantData?.map(
            (restaurant: any) =>
              viewMode === "grid" ? (
                <RestaurantCardGrid
                  key={
                    restaurant?.strSupplierGUID
                  }
                  restaurant={restaurant}
                />
              ) : (
                <RestaurantCardList
                  key={
                    restaurant?.strSupplierGUID
                  }
                  restaurant={restaurant}
                />
              )
          )}
      </div>
    </section>
  );
};

export default RestaurantList;