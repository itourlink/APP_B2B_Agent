import PanelPopup from "@/components/popup/panel-popup";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useUser } from "@/hooks/actions/useAuth";
import { addCartForHotel, useListSupplierPaymentTerm, useListSurchargeDateForAgent } from "@/hooks/actions/useBooking";
import { useListCompanyOwner } from "@/hooks/actions/useCompanyOwner";
import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";
import { fDateTime } from "@/utils/format-time";
import { useCurrency } from "@/components/currency/useCurrency";
import { useToastStore } from "@/zustand/useToastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslate } from "@/locales";
import SurFoc from "./sur-foc";

type Props = {
  open: boolean;
  onClose: () => void;
  data: {
    displayData: any;
    submitPayload: any;
  };
  focData: any
};

const BookingHotelCartPopup = ({ open, onClose, data, focData }: Props) => {

  const company = new URLSearchParams(location.search).get("company") || "";

  const { t } = useTranslate("hotel");

  const { currencyId } = useCurrency();

  const router = useRouter();

  const { user } = useUser();

  const { coData } = useListCompanyOwner();

  const { showToast } = useToastStore();

  const queryClient = useQueryClient();

  const { mutate: addCartForHotelApi, isPending } = useMutation({
    mutationFn: addCartForHotel,
  });

  const { supPaytermData } = useListSupplierPaymentTerm({
    strSupplierGUID: data?.submitPayload?.strSupplierGUID
  })

  const { surDateData } = useListSurchargeDateForAgent({
    strSupplierGUID: data?.submitPayload?.strSupplierGUID
  })

  console.log("supPaytermData", supPaytermData)
  console.log("surDateData", surDateData)

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
    <PanelPopup open={open} onClose={onClose} title={t("confirmAddToCart")} className="w-[1000px]">
      <div className="">
        {/* HOTEL */}
        <div className="mb-5">
          <h3 className="font-semibold text-lg text-slate-900">
            {displayData?.hotel?.strSupplierName}
          </h3>

          <p className="text-sm text-slate-500">
            {displayData?.strItemTypeName}
            {displayData?.includedBreak &&
              ` • ${displayData?.includedBreak}`}
          </p>
        </div>

        {/* SUMMARY */}
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="bg-slate-50 px-4 py-3 font-medium w-40">
                  {t("adult")}
                </td>

                <td className="px-4 py-3">
                  {displayData?.adultCount || 0} {t("personUnit")}
                </td>
              </tr>

              <tr className="border-b border-slate-200">
                <td className="bg-slate-50 px-4 py-3 font-medium">
                  {t("child")}
                </td>

                <td className="px-4 py-3">
                  {displayData?.childCount || 0} {t("childUnit")}
                </td>
              </tr>

              <tr className="border-b border-slate-200">
                <td className="bg-slate-50 px-4 py-3 font-medium">
                  {t("stayTime")}
                </td>

                <td className="px-4 py-3">
                  {fDateTime(displayData?.dtmDateFrom)}
                  {" → "}
                  {fDateTime(displayData?.dtmDateTo)}
                </td>
              </tr>

              <tr>
                <td className="bg-slate-50 px-4 py-3 font-medium">
                  {t("room")}
                </td>

                <td className="px-4 py-3">
                  {displayData?.strItemTypeName}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* DETAIL */}
        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3">
                  {t("detail")}
                </th>

                <th className="text-center px-4 py-3 w-24">
                  {t("quantity")}
                </th>

                <th className="text-right px-4 py-3 w-40">
                  {t("totalPayment")}
                </th>
              </tr>
            </thead>

            <tbody>
              {displayData?.items?.map(
                (item: any, idx: number) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    <td className="px-4 py-3">
                      {item.label}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {item.qty}
                    </td>

                    <td className="px-4 py-3 text-right font-medium">
                      ₫{item.total?.toLocaleString()}
                    </td>
                  </tr>
                ),
              )}
            </tbody>

            <tfoot>
              <tr className="bg-blue-50 border-t border-blue-200">
                <td
                  colSpan={2}
                  className="px-4 py-4 text-right font-semibold"
                >
                  {t("totalPayment")}
                </td>

                <td className="px-4 py-4 text-right text-lg font-bold text-blue-600">
                  ₫{displayData?.totalAmount?.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <SurFoc focData={focData} />

        {/* ACTION */}
        <div className="flex gap-3 mt-5">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="cursor-pointer flex-1 h-11 rounded-lg border border-slate-300 hover:bg-slate-50"
          >
            {t("cancel")}
          </button>

          <button
            type="button"
            onClick={handleAddtoCart}
            disabled={isPending}
            className="cursor-pointer flex-1 h-11 rounded-lg bg-[#004b91] hover:bg-[#003d76] text-white"
          >
            {isPending ? t("processing") : t("confirm")}
          </button>
        </div>
      </div>
    </PanelPopup>
  );
};

export default BookingHotelCartPopup;
