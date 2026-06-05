import { useToastStore } from "@/zustand/useToastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDelTourCustomized } from "@/hooks/actions/useUser";
import PrimaryButton from "@/components/button/primary-button";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useTranslate } from "@/locales";

interface Props {
  item: any;
  onClose: () => void;
}

const DeleteTour = ({ item, onClose }: Props) => {
  const { t } = useTranslate("tourcustomize");
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();
  const { mutate: useDelTourCustomizedApi, isPending } = useMutation({
    mutationFn: useDelTourCustomized,
  });

  const handleDelete = () => {
    useDelTourCustomizedApi(
      { strTourCustomizedGUID: item?.strTourCustomizedGUID },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.USER.LIST_TOUR_CUSTOMIZED],
          });
          onClose();
          showToast("success", t("deleteTourSuccess"));
        },
        onError: () => {
          showToast("error", t("deleteTourError"));
        },
      }
    );
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
      <p className="text-gray-600">
        {t("deleteTourConfirm", { name: item?.strServiceName || "" })}
      </p>

      <div className="flex justify-between gap-2 pt-4">
        <PrimaryButton
          text={t("cancel")}
          onClick={onClose}
          className="bg-gray-200 hover:bg-gray-300 text-black rounded-lg px-4 py-2 w-full"
        />
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 w-full cursor-pointer"
        >
          {isPending ? t("deleting") : t("delete")}
        </button>
      </div>
    </div>
  );
};

export default DeleteTour;
