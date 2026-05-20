import { useMutation, useQueryClient } from "@tanstack/react-query";

import PanelPopup from "@/components/popup/panel-popup";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { deleteTourCustomizedCustomer } from "@/hooks/actions/useTourCustomized";
import { useTranslate } from "@/locales";
import { useToastStore } from "@/zustand/useToastStore";

interface Props {
  open: boolean;
  onClose: () => void;
  strCustomerGUID: string;
  strTourCode: string;
  customerName?: string;
  onDeleted?: () => void;
}

const DeleteCustomer = ({
  open,
  onClose,
  strCustomerGUID,
  strTourCode,
  customerName,
  onDeleted,
}: Props) => {
  const { t } = useTranslate("tourcustomize");
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  const { mutate: deleteCustomerApi, isPending } = useMutation({
    mutationFn: deleteTourCustomizedCustomer,
  });

  const handleDelete = () => {
    if (!strCustomerGUID) {
      showToast("error", t("missingCustomerInfo"));
      return;
    }

    deleteCustomerApi(
      {
        strCustomerGUID,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              QUERY_KEYS.TOUR_CUSTOMER.LIST_TOUR_CUSTOMER,
              strTourCode,
            ],
          });

          showToast("success", t("deleteCustomerSuccess"));
          onDeleted?.();
          onClose();
        },
        onError: (error: any) => {
          showToast("error", error?.message || t("deleteCustomerError"));
        },
      }
    );
  };

  return (
    <PanelPopup
      open={open}
      onClose={onClose}
      title={t("deleteCustomer")}
      className="w-[500px]"
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border border-gray-300 px-5 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            {t("cancel")}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="h-10 rounded-lg bg-[#c62828] px-5 font-semibold text-white transition hover:bg-[#b71c1c] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? t("deleting") : t("delete")}
          </button>
        </div>
      }
    >
      <div className="space-y-2 text-sm text-gray-700">
        <p>{t("deleteCustomerConfirm")}</p>
        {customerName && (
          <p className="font-semibold text-gray-900">{customerName}</p>
        )}
      </div>
    </PanelPopup>
  );
};

export default DeleteCustomer;
