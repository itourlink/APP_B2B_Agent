import { useTranslate } from "@/locales";
import PanelPopup from "./panel-popup";

interface LogoutPopupProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const LogoutPopup = ({
    open,
    onClose,
    onConfirm,
}: LogoutPopupProps) => {
    const { t } = useTranslate("agent");

    return (
        <PanelPopup
            open={open}
            className="w-[400px]"
            title={t("logout")}
        >
            <p className="text-sm text-gray-600">
                {t("logoutMessage")}
            </p>

            <div className="mt-6 flex justify-end gap-3">
                <button
                    onClick={onClose}
                    className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
                >
                    {t("cancel")}
                </button>

                <button
                    onClick={onConfirm}
                    className="cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                    {t("logout")}
                </button>
            </div>
        </PanelPopup>
    );
};