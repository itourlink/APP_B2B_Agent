import { useTranslate } from "@/locales";
import { ChevronUp, ChevronDown } from "lucide-react";

interface Props {
  selectedCount?: number;
  totalPrice?: number;
  totalCommission?: number;
  open?: boolean;
  onToggle?: () => void;
  onQuote?: () => void;
  onBooking?: () => void;
}

const CartBottomAcction = ({
  selectedCount = 0,
  totalPrice = 0,
  totalCommission = 0,
  open = true,
  onToggle,
  onQuote,
  onBooking,
}: Props) => {
  const { t } = useTranslate("cart");
  if (selectedCount <= 0) return null;

  return (
    <div
      className="
        fixed bottom-0 left-0 right-0 z-50
        border-t border-gray-200
        bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.08)]
      "
    >
      <div
        className="
          mx-auto flex h-[64px]
          max-w-[1400px]
          items-center justify-between
          px-6
        "
      >
        {/* ================= LEFT ================= */}
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span>
            {t("selectAll")}
            {" "}
            <span className="font-semibold text-[#004b91]">
              {selectedCount}
            </span>
            {" "}
            {t("services")}
          </span>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex items-center gap-6">

          {/* TOTAL */}
          <div className="text-right">
            <div className="text-sm text-gray-500">
              {t("totalPrice")}
              {" "}
              <span className="font-bold text-[#ff4d4f]">
                $
                {Number(totalPrice).toLocaleString(
                  "en-US"
                )}
              </span>
            </div>

            <div className="text-sm text-gray-500">
              {t("commission")}
              {" "}
              <span className="font-semibold text-[#1677ff]">
                $
                {Number(
                  totalCommission
                ).toLocaleString("en-US")}
              </span>
            </div>
          </div>

          {/* TOGGLE */}
          <button
            type="button"
            onClick={onToggle}
            className="
              flex h-8 w-8 items-center justify-center
              rounded-full border border-gray-300
              text-gray-600
              hover:bg-gray-100
            "
          >
            {open ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronUp size={18} />
            )}
          </button>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onQuote}
              className="
                rounded border border-[#1677ff]
                px-4 py-2 text-sm font-medium
                text-[#1677ff]
                hover:bg-blue-50 cursor-pointer
              "
            >
              {t("sendQuote")}
            </button>

            <button
              type="button"
              onClick={onBooking}
              className="
                rounded bg-[#1677ff]
                px-5 py-2 text-sm font-medium
                text-white
                hover:bg-[#0958d9] cursor-pointer
              "
            >
              {t("book")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartBottomAcction;