import PanelPopup from "@/components/popup/panel-popup";
import { addTourCustomizedSerByListDays } from "@/hooks/actions/useUser";
import { useToastStore } from "@/zustand/useToastStore";

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props {
    open: boolean;
    onClose: () => void;
    strTourCustomizedPriceItemGUID: string;
}

const UpdateNoOfDay = ({ open, onClose, strTourCustomizedPriceItemGUID }: Props) => {

    const { showToast } = useToastStore();
    const queryClient = useQueryClient();

    const {
        mutateAsync: addTourCustomizedSerByListDaysApi,
        isPending: isLoading,
    } = useMutation({
        mutationFn: addTourCustomizedSerByListDays,
    });

    const handleUpdate = async () => {
        const payload = {
            strTourCustomizedPriceItemGUID: "c168f48b-ef96-418f-b662-b87c6f6147f5",
            strListDays: "1,2,3"
        }
        addTourCustomizedSerByListDaysApi(payload, {
            onSuccess: () => { },
            onError: () => { }
        })
    }

    return (
        <PanelPopup
            open={open}
            onClose={onClose}
            title="Update List Days"
            footer={
                <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={isLoading}
                    className="cursor-pointer rounded-lg bg-[#4a6fa5] hover:bg-[#3b5b7e] px-4 py-2 text-white disabled:opacity-50"
                >
                    {isLoading ? "Lưu..." : "Lưu"}
                </button>
            }
        >
            <div className="space-y-2 text-sm text-gray-700">
                <p>REGULAR RESTAURANTS</p>

            </div>
        </PanelPopup>
    );
}

export default UpdateNoOfDay;
