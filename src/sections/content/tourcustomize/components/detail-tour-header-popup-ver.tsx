import { useUser } from "@/hooks/actions/useAuth";
import { useAddCopyTourCustomized } from "@/hooks/actions/useUser";
import { useToastStore } from "@/zustand/useToastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

type DetailTourHeaderPopupVerProps = {
  open: boolean;
  onClose: () => void;
  tourCustomizedGUID: string;
};

const DetailTourHeaderPopupVer = ({
  open,
  onClose,
  tourCustomizedGUID,
}: DetailTourHeaderPopupVerProps) => {

  const { user } = useUser();

  const queryClient = useQueryClient();

  const { showToast } = useToastStore();

  const { t } = useTranslation("tourcustomize");

  const addVersionMutation = useMutation({
    mutationFn: (payload: any) =>
      useAddCopyTourCustomized(payload),

    onSuccess: () => {

      showToast("success", t("addVersionSuccess"));

      queryClient.invalidateQueries();

      onClose();
    },

    onError: () => {
      showToast("error", t("addVersionError"));
    },
  });

  const handleAddVersion = () => {

    if (!tourCustomizedGUID) {

      showToast("error", t("tourNotFound"));

      return;
    }

    const payload = {

      strUserGUID: user?.strUserGUID,

      intType: 1,

      strTourCustomizedGUID: tourCustomizedGUID,

      strNewTourCustomizedGUID: null,

      intLoad: 0,
    };

    addVersionMutation.mutate(payload);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20">

      <div className="w-[280px] overflow-hidden rounded-b-xl rounded-t-md border border-gray-300 bg-white shadow-lg">

        {/* Header */}
        <div className="flex h-8 items-center justify-between bg-[#2f69b1] px-2">

          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-sm font-bold text-[#2f69b1]">
            ?
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-[#ffffff] hover:text-gray-700"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-5">

          <p className="mb-4 text-[13px] text-gray-700">
            {t("areYouSureToCopyToNewVersion")}
          </p>

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded bg-gray-100 px-4 py-2 text-sm text-gray-600 hover:bg-gray-200"
            >
              {t("exit")}
            </button>

            <button
              type="button"
              onClick={handleAddVersion}
              disabled={addVersionMutation.isPending}
              className="cursor-pointer rounded bg-[#3b5b7e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2f69b1]"
            >
              {addVersionMutation.isPending
                ? t("loading")
                : t("accept")
              }
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTourHeaderPopupVer;