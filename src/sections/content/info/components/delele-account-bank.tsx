import { useToastStore } from "@/zustand/useToastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDelCompanyBankAccount } from "@/hooks/actions/useUser";
import PrimaryButton from "@/components/button/primary-button";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";

interface Props {
    item: any;
    onClose: () => void;
}

const DeleteAccountBank = ({ item, onClose }: Props) => {
    const queryClient = useQueryClient();
    const { showToast } = useToastStore();
    const { mutate: useDelCompanyBankAccountApi, isPending } = useMutation({
        mutationFn: useDelCompanyBankAccount,
    });

    const handleDelete = () => {
        useDelCompanyBankAccountApi(
            { strCompanyBankAccountGUID: item?.strCompanyBankAccountGUID },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_KEYS.USER.LIST_COMPANY_BANK_ACCOUNT],
                    });
                    onClose();
                    showToast("success", "Xóa tài khoản thành công");
                },
                onError: () => {
                    showToast("error", "Xóa tài khoản thất bại");
                },
            }
        );
    };

    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">

            <p className="text-gray-600">
                Bạn có chắc chắn muốn xóa tài khoản{" "}
                <span className="font-medium">{item?.strCompanyBankAccountName}</span>?
            </p>

            <div className="flex justify-between gap-2 pt-4">
                <PrimaryButton
                    text="Hủy"
                    onClick={onClose}
                    className="bg-gray-200 hover:bg-gray-300 text-black rounded-lg px-4 py-2 w-full"
                />
                <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 w-full cursor-pointer"
                >
                    {isPending ? "Đang xóa..." : "Xóa"}
                </button>
            </div>
        </div>
    );
};

export default DeleteAccountBank;