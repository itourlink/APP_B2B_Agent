import { Flag, Map, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
  data: any[];
  isLoading: boolean;
  onSelectDestination?: (item: any) => void;
};

const HotelLocationDes = ({
  data = [],
  isLoading,
  onSelectDestination,
}: Props) => {
  const { t } = useTranslation("hotel");

  /**
   * API đôi khi trả:
   * [[...]]
   * nên flatten về [...]
   */
  const flatData = Array.isArray(data?.[0]) ? data[0] : data;

  /**
   * Check value hợp lệ
   * Bắt luôn:
   * null
   * undefined
   * {}
   */
  const isValidValue = (value: any) => {
    if (value == null) {
      return false;
    }

    if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0
    ) {
      return false;
    }

    return true;
  };

  /**
   * destination:
   * - không có strSupplierGUID
   *
   * hotels:
   * - có strSupplierGUID
   */
  const destination = flatData?.find(
    (item) => !isValidValue(item?.strSupplierGUID),
  );

  const hotels = flatData?.filter((item) =>
    isValidValue(item?.strSupplierGUID),
  );

  if (isLoading) {
    return (
      <div className="w-105 bg-white rounded-xl shadow-lg border border-gray-300 text-sm">
        <div className="p-6 flex flex-col items-center text-gray-400">
          <div className="mb-2 w-6 h-6 border-4 border-gray-300 border-t-[#4a6fa5] rounded-full animate-spin"></div>

          {t("searchingHotels")}
        </div>
      </div>
    );
  }

  if (!flatData.length) {
    return (
      <div className="w-105 bg-white rounded-xl shadow-lg border border-gray-300 text-sm">
        <div className="p-6 flex flex-col items-center text-gray-400">
          <MapPin size={24} className="mb-2" />

          {t("noMatchingResults")}
        </div>
      </div>
    );
  }

  return (
    <div className="w-105 bg-white rounded-xl shadow-lg border border-gray-300 text-sm max-h-100 overflow-y-auto pb-4">
      {/* DESTINATION */}
      {destination && (
        <div className="border-b border-gray-300">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold p-4">
            <MapPin size={14} />

            {t("destination")}
          </div>

          <button
            onClick={() =>
              onSelectDestination?.({
                ...destination,
                __type: "destination",
              })
            }
            className="flex gap-3 w-full hover:bg-[#e9e9e981] px-4 py-3 transition cursor-pointer"
          >
            <MapPin className="text-[#2566b0] mt-1" size={18} />

            <div className="font-semibold text-left">
              {destination?.strDestinationName}
            </div>
          </button>
        </div>
      )}

      {/* HOTELS */}
      {hotels.length > 0 && (
        <div>
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold p-4">
            <Map size={14} />

            {t("hotels")}
          </div>

          <div className="flex flex-col">
            {hotels.map((hotel, index) => (
              <button
                key={index}
                onClick={() =>
                  onSelectDestination?.({
                    ...hotel,
                    __type: "hotel",
                  })
                }
                className="flex gap-3 hover:bg-[#e9e9e981] px-4 py-3 cursor-pointer"
              >
                <Flag className="text-[#2566b0] mt-1" size={18} />

                <div className="font-medium text-left">
                  {hotel?.strDestinationName}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelLocationDes;