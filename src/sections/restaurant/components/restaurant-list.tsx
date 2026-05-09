import { useListRestaurant } from "@/hooks/actions/useRestaurant";
import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";
import { Star, MapPin, LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { getUrlImage } from "@/utils/format-image";

// ─── Types ───────────────────────────────────────────────────────────────────

// ─── RestaurantCard ───────────────────────────────────────────────────────────

export const RestaurantCard = ({ restaurant }: { restaurant: any }) => {

  const router = useRouter();

  return (
    <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full min-h-[195px] group">
      {/* Image — left */}
      <div
        className="relative w-1/2 overflow-hidden bg-gray-100 cursor-pointer shrink-0"
      // onClick={handleNavigate}
      >
        <img
          src={getUrlImage(restaurant?.strSupplierImage)}
          alt={restaurant?.strSupplierName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Content — right */}
      <div className="w-1/2 p-4 flex flex-col">
        {/* Restaurant name */}
        <h3
          // onClick={handleNavigate}
          className="text-[#1a4a8d] font-bold text-[15px] leading-tight uppercase mb-3 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
        >
          {restaurant.strSupplierName}
        </h3>

        {/* Star rating */}
        <div className="flex items-center gap-0.5 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={13}
              className={
                i < restaurant.intEasiaCateID
                  ? "fill-orange-400 text-orange-400"
                  : "text-gray-300"
              }
            />
          ))}
        </div>

        {/* Address */}
        <div className="flex items-start gap-1.5 mb-3">
          <MapPin size={13} className="text-gray-400 mt-0.5 shrink-0" />
          <p className="text-[12px] text-gray-600 leading-relaxed line-clamp-2">
            {restaurant.strSupplierAddr || "Đang cập nhật..."}
          </p>
        </div>

        {/* Badge */}
        <div className="mb-3">
          <span className="inline-block bg-[#e6f0ff] text-[#3b82f6] text-[11px] font-medium px-3 py-1 rounded-full">
            {restaurant.tag || "Nhà hàng nổi bật"}
          </span>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-end justify-between gap-2">
          <div>
            <p className="text-[11px] text-gray-500 mb-0.5">Giá từ</p>
            <p className="text-[#2563eb] font-bold text-lg leading-none">
              {restaurant.dblPriceFrom === "$0" ||
                restaurant.dblPriceFrom === "N/A" ? (
                <span className="text-gray-400 text-base">N/A</span>
              ) : (
                restaurant.dblPriceFrom
              )}
            </p>
          </div>

          <button
            onClick={() =>
              router.replaceParams(paths.shop.restaurant.detail, {
                item: restaurant,
              })
            }
            className="cursor-pointer text-blue-600 border border-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── RestaurantList ───────────────────────────────────────────────────────────

export const RestaurantList = () => {
  const [filters] = useState({
    page: 1,
    pageSize: 15,
  });

  const {
    restaurantData = [],
    restaurantLoading,
    restaurantError,
  } = useListRestaurant(filters);

  const isEmpty = !restaurantLoading && restaurantData?.length === 0;

  return (
    <section className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Khám phá nhà hàng
        </h2>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LOADING */}
        {restaurantLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <RestaurantSkeleton key={i} />
          ))}

        {/* ERROR */}
        {restaurantError && <ErrorState />}

        {/* EMPTY */}
        {isEmpty && <EmptyState />}

        {/* DATA */}
        {!restaurantLoading &&
          !restaurantError &&
          restaurantData?.map((restaurant: any) => (
            <RestaurantCard
              key={restaurant.strSupplierGUID}
              restaurant={restaurant}
            />
          ))}
      </div>
    </section>
  );
};


const RestaurantSkeleton = () => {
  return (
    <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden h-[195px] animate-pulse">
      <div className="w-1/2 bg-gray-200" />

      <div className="w-1/2 p-4 flex flex-col gap-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />

        <div className="mt-auto">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
};


const EmptyState = () => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <h3 className="text-gray-700 font-semibold text-lg">
        Không có nhà hàng nào
      </h3>
      <p className="text-gray-500 text-sm mt-1">
        Hiện tại chưa có dữ liệu phù hợp
      </p>
    </div>
  );
};

const ErrorState = () => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="text-red-400 text-5xl mb-3">⚠️</div>
      <h3 className="text-gray-800 font-semibold text-lg">
        Có lỗi xảy ra
      </h3>
      <p className="text-gray-500 text-sm mt-1">
        Không thể tải danh sách nhà hàng
      </p>
    </div>
  );
};
