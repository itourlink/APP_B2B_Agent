import PanelPopup from "@/components/popup/panel-popup";

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
    return (
        <PanelPopup
            open={open}
            onClose={onClose}
            title="Delete Service"
            className="w-[400px]"
        >
            <div className="space-y-5">
                <div className="text-[14px] text-gray-600">
                    Are you sure you want to
                    delete this service?
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="cursor-pointer px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={loading}
                        onClick={onConfirm}
                        className="cursor-pointer px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                    >
                        {loading
                            ? "Deleting..."
                            : "Delete"}
                    </button>
                </div>
            </div>
        </PanelPopup>
    );
};

export default DeleteServicePopup;