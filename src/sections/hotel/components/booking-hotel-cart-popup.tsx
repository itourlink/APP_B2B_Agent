import PanelPopup from "@/components/popup/panel-popup";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useUser } from "@/hooks/actions/useAuth";
import { addCartForHotel } from "@/hooks/actions/useBooking";
import { useListCompanyOwner } from "@/hooks/actions/useCompanyOwner";
import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";
import { fDateTime } from "@/utils/format-time";
import { useCurrency } from "@/components/currency/useCurrency";
import { useToastStore } from "@/zustand/useToastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  onClose: () => void;
  data: {
    displayData: any;
    submitPayload: any;
  };
};

const BookingHotelCartPopup = ({ open, onClose, data }: Props) => {

  const company = new URLSearchParams(location.search).get("company") || "";

  const { t } = useTranslation("hotel");

  const { currencyId } = useCurrency();

  const router = useRouter();

  const { user } = useUser();

  const { coData } = useListCompanyOwner();

  const { showToast } = useToastStore();

  const queryClient = useQueryClient();

  const { mutate: addCartForHotelApi, isPending } = useMutation({
    mutationFn: addCartForHotel,
  });

  if (!data) return null;

  const { displayData, submitPayload } = data;

  const handleAddtoCart = () => {
    const finalPayload = {
      ...submitPayload,

      strCompanyPartnerGUID:
        submitPayload?.strCompanyPartnerGUID || user?.strCompanyGUID,

      strCompanyOwnerGUID:
        submitPayload?.strCompanyOwnerGUID || coData?.strCompanyGUID,

      intCurrencyID: submitPayload?.intCurrencyID || currencyId,
    };

    addCartForHotelApi(finalPayload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.CART.LIST_CART],
        });

        showToast("success", t("addToCartSuccess"));

        onClose();

        router.push(`${paths.shop.cart.list}?company=${company}`);
      },

      onError: () => {
        showToast("error", t("addToCartFailed"));
      },
    });
  };

  return (
    <PanelPopup open={open} onClose={onClose} title={t("confirmAddToCart")}>
      <div className="p-5 space-y-4 text-sm">
        {/* GUEST INFO */}
        <div className="rounded-xl border p-4 bg-amber-50">
          <div className="text-xs text-amber-600 mb-2">{t("guestInfo")}</div>

          <div className="flex items-center justify-between text-sm">
            <div>
              <div className="text-slate-500">{t("adult")} </div>

              <div className="font-semibold text-slate-900">
                {displayData?.adultCount || 0} {t("personUnit")}
              </div>
            </div>

            <div>
              <div className="text-slate-500"> {t("child")}</div>

              <div className="font-semibold text-slate-900">
                {displayData?.childCount || 0} {t("childUnit")}
              </div>
            </div>
          </div>
        </div>

        {/* HOTEL */}
        <div className="rounded-xl border p-4 bg-slate-50">
          <div className="text-xs text-slate-500"> {t("hotel")}</div>

          <div className="font-semibold text-slate-900">
            {displayData?.hotel?.strSupplierName}
          </div>
        </div>

        {/* ROOM INFO */}
        <div className="rounded-xl border p-4 space-y-1">
          <div className="text-xs text-slate-500"> {t("room")}</div>

          <div className="font-semibold text-slate-900">
            {displayData?.strItemTypeName}{" "}
            {displayData?.includedBreak
              ? `- ${displayData?.includedBreak}`
              : ""}
          </div>

          {displayData?.includedBreak && (
            <div className="text-xs text-emerald-600 flex items-center gap-1">
              🍽 {displayData?.includedBreak}
            </div>
          )}
        </div>

        {/* DATE */}
        <div className="rounded-xl border p-4 bg-blue-50">
          <div className="text-xs text-blue-500 mb-2">{t("stayTime")}</div>

          <div className="flex justify-between text-sm">
            <div>
              <div className="font-semibold text-slate-900">
                {fDateTime(displayData?.dtmDateFrom)}
              </div>
            </div>

            <div className="text-slate-400">→</div>

            <div>
              <div className="font-semibold text-slate-900">
                {fDateTime(displayData?.dtmDateTo)}
              </div>
            </div>
          </div>
        </div>

        {/* TOTAL */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 flex justify-between">
          <div>
            <div className="text-xs text-blue-500"> {t("totalPayment")}</div>

            <div className="text-xs text-slate-500">  {t("includeAllServices")}</div>
          </div>

          <div className="text-lg font-bold text-blue-600">
            ₫{displayData?.totalAmount?.toLocaleString()}
          </div>
        </div>

        {/* ITEMS */}
        <div className="space-y-2">
          <div className="font-semibold text-slate-800"> {t("detail")}</div>

          {displayData?.items?.map((item: any, idx: number) => (
            <div
              key={idx}
              className="flex justify-between border p-3 rounded-lg"
            >
              <div>
                <div className="font-medium">{item.label}</div>

                <div className="text-xs text-slate-500">
                  {t("quantity")}: {item.qty}
                </div>
              </div>

              <div className="font-semibold">
                ₫{item.total?.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* ACTION */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            disabled={isPending}
            className="cursor-pointer flex-1 h-10 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
          >
            {t("cancel")}
          </button>

          <button
            onClick={handleAddtoCart}
            disabled={isPending}
            className="cursor-pointer flex-1 h-10 rounded-lg bg-[#004b91] hover:bg-[#003d76] text-white disabled:opacity-50"
          >
            {isPending ? t("processing") : t("confirm")}
          </button>
        </div>
      </div>
    </PanelPopup>
  );
};

export default BookingHotelCartPopup;
