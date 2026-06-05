import { useMutation, useQueryClient } from "@tanstack/react-query";

import PanelPopup from "@/components/popup/panel-popup";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useDelTourCustomizedDayDestination } from "@/hooks/actions/useUser";
import { useTranslate } from "@/locales";
import { useToastStore } from "@/zustand/useToastStore";

interface Props {
  open: boolean;
  onClose: () => void;
  strTourCustomizedDayGUID: string;
  strCityGUID: string;
  locationName?: string;
}

const DeleteDestination = ({
  open,
  onClose,
  strTourCustomizedDayGUID,
  strCityGUID,
  locationName,
}: Props) => {
  const { t } = useTranslate("tourcustomize");
  const { showToast } = useToastStore();
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteDestinationApi,
    isPending: isLoading,
  } = useMutation({
    mutationFn: useDelTourCustomizedDayDestination,
  });

  const handleDelete = async () => {
    if (!strTourCustomizedDayGUID || !strCityGUID) {
      showToast("error", t("deleteDestinationMissing"));
      return;
    }

    try {
      await deleteDestinationApi({
        strTourCustomizedDayGUID,
        strCityGUID,
        strLocationCode: strCityGUID,
      });

      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER.LIST_SERVICE_TOUR_CUSTOMIZED],
      });

      showToast("success", t("deleteDestinationSuccess"));
      onClose();
    } catch (error: any) {
      showToast("error", error?.message || t("deleteDestinationError"));
    }
  };

  return (
    <PanelPopup
      open={open}
      onClose={onClose}
      title={t("deleteDestination")}
      className="w-[500px]"
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border px-4 py-2"
          >
            {t("cancel")}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="cursor-pointer rounded-lg bg-[#c62828] px-4 py-2 text-white disabled:opacity-50"
          >
            {isLoading ? t("deleting") : t("delete")}
          </button>
        </div>
      }
    >
      <div className="space-y-2 text-sm text-gray-700">
        <p>{t("deleteDestinationConfirm")}</p>

        {locationName && (
          <p className="font-semibold text-gray-900">{locationName}</p>
        )}
      </div>
    </PanelPopup>
  );
};

export default DeleteDestination;
