import PanelPopup from "@/components/popup/panel-popup";
import { useTranslate } from "@/locales";

interface Props {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteServicePopup = ({
  open,
  loading,
  onClose,
  onConfirm,
}: Props) => {
  const { t } = useTranslate("tourcustomize");

  return (
    <PanelPopup
      open={open}
      onClose={onClose}
      title={t("deleteService")}
      className="w-[400px]"
    >
      <div className="space-y-5">
        <div className="text-[14px] text-gray-600">
          {t("deleteServiceConfirm")}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50"
          >
            {t("cancel")}
          </button>

          <button
            disabled={loading}
            onClick={onConfirm}
            className="cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? t("deleting") : t("delete")}
          </button>
        </div>
      </div>
    </PanelPopup>
  );
};

export default DeleteServicePopup;
