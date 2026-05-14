import PanelPopup from "@/components/popup/panel-popup";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useDelTourCustomizedDayDestination } from "@/hooks/actions/useUser";
import { useToastStore } from "@/zustand/useToastStore";

import { useMutation, useQueryClient } from "@tanstack/react-query";

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
      showToast("error", "Thiếu thông tin điểm đến để xóa");
      return;
    }

    try {
      await deleteDestinationApi({
        strTourCustomizedDayGUID,
        strCityGUID,
        strLocationCode: strCityGUID,
      });

      await queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.USER.LIST_SERVICE_TOUR_CUSTOMIZED,
        ],
      });

      showToast("success", "Delete destination successfully");
      onClose();
    } catch (error: any) {
      showToast(
        "error",
        error?.message || "Delete destination failed"
      );
    }
  };

  return (
    <PanelPopup
      open={open}
      onClose={onClose}
      title="Delete Destination"
      className="w-[500px]"
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border px-4 py-2"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="cursor-pointer rounded-lg bg-[#c62828] px-4 py-2 text-white disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      }
    >
      <div className="space-y-2 text-sm text-gray-700">
        <p>Bạn có chắc muốn xóa điểm đến này khỏi ngày hiện tại?</p>

        {locationName && (
          <p className="font-semibold text-gray-900">
            {locationName}
          </p>
        )}
      </div>
    </PanelPopup>
  );
};

export default DeleteDestination;
