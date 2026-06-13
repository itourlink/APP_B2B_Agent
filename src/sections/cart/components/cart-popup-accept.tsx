import PanelPopup from "@/components/popup/panel-popup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DelCartServiceItem } from "@/hooks/actions/useUser";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useUserStore } from "@/zustand/useUserStore";
import { useToastStore } from "@/zustand/useToastStore";
import { useTranslate } from "@/locales";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  item?: any;
}

const CartPopupAccept = ({ open, onClose, item, }: Props) => {
  const { t } = useTranslate("cart")
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const { showToast } = useToastStore();

  // Mutation to delete cart item
  const delCartItem = useMutation({
    mutationFn: (payload: any) => DelCartServiceItem(payload),
    onSuccess: () => {

      showToast(
        "success",
        t("removeServiceFromCartSuccess")
      );

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CART.LIST_CART],
      });

      onClose();
    },

    onError: () => {

      showToast(
        "error",
        t("removeServiceFromCartFailed")
      );
    },


  });
  const handleConfirmDelete = () => {
    const payload = {
      strUserGUID: user?.strUserGUID,
      strListCartServiceItemGUID:
        item?.strCartServiceItemGUID,
    };

    delCartItem.mutate(payload);
  };

  return (
    <PanelPopup
      open={open}
      onClose={onClose}
      title={t("areYouSure")}
      className="max-w-[320px] overflow-hidden rounded-md p-0 text-sm font-semibold text-white"
    >

      <div className="flex justify-end gap-2 border-t bg-[#fefefe] px-4 py-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded bg-gray-200 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-300"
        >
          {t("exit")}
        </button>

        <button
          type="button"
          onClick={handleConfirmDelete}
          disabled={delCartItem.isPending}
          className="rounded bg-[#4a6fa5] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#003d75] disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {
            delCartItem.isPending ? t("deleting") : t("confirm")
          }
        </button>
      </div>
    </PanelPopup>
  );
};

export default CartPopupAccept;