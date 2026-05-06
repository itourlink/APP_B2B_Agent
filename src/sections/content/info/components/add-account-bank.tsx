import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";

import { Field, Form } from "@/components/hook-form";
import { useToastStore } from "@/zustand/useToastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAddCompanyBankAccount } from "@/hooks/actions/useUser";
import { useUserStore } from "@/zustand/useUserStore";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";

const Schema = zod.object({
    displayName: zod.string().min(1, "Tên hiển thị là bắt buộc"),
    accountInfo: zod.string().min(1, "Thông tin tài khoản là bắt buộc"),
    accountName: zod.string().min(1, "Tên tài khoản là bắt buộc"),
    accountNumber: zod.string().min(1, "Mã tài khoản là bắt buộc"),
    swiftCode: zod.string().min(1, "Mã Swift là bắt buộc"),
    branch: zod.string().min(1, "Chi nhánh tài khoản là bắt buộc"),
});

type SchemaType = zod.infer<typeof Schema>;

interface Props {
    onClose: () => void;
}

const AddAccountBank = ({ onClose }: Props) => {
    const queryClient = useQueryClient();
    const { showToast } = useToastStore();
    const user = useUserStore((state) => state.user);
    const { mutate: useAddCompanyBankAccountApi, isPending: isLoading } = useMutation({
        mutationFn: useAddCompanyBankAccount,
    });
    const defaultValues: SchemaType = {
        displayName: "",
        accountInfo: "",
        accountName: "",
        accountNumber: "",
        swiftCode: "",
        branch: "",
    };

    const methods = useForm<SchemaType>({
        resolver: zodResolver(Schema),
        defaultValues,
    });

    const { handleSubmit, formState: { isSubmitting } } = methods;

    const onSubmit = handleSubmit(async (data) => {
        const payload = {
            strCompanyGUID: user?.strCompanyGUID,
            strCompanyBankAccountInfo: data?.accountInfo,
            strCompanyBankAccountName: data?.accountName,
            strCompanyBankAccountCode: data?.accountNumber,
            strBankAddress: data?.branch,
            strSwiftCode: data?.swiftCode,
            strNameDisplay: data?.displayName,
        };

        useAddCompanyBankAccountApi(payload, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.USER.LIST_COMPANY_BANK_ACCOUNT],
                });
                onClose();
                showToast("success", "Thêm tài khoản thành công");
            },
            onError: () => {
                showToast("error", "Thêm tài khoản thất bại");
            },
        });
    });

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">

                <div className="grid grid-cols-2 gap-6">
                    <Field.Text
                        name="displayName"
                        label={{ text: "Tên hiển thị", icon: <span className="text-red-500">*</span> }}
                        placeholder="Nhập tên hiển thị"
                    />

                    <Field.Text
                        name="accountInfo"
                        label={{ text: "Thông tin tài khoản", icon: <span className="text-red-500">*</span> }}
                        placeholder="Nhập thông tin tài khoản (Tên ngân hàng...)"
                    />

                    <Field.Text
                        name="accountName"
                        label={{ text: "Tên tài khoản", icon: <span className="text-red-500">*</span> }}
                        placeholder="Nhập tên chủ tài khoản"
                    />

                    <Field.Text
                        name="accountNumber"
                        label={{ text: "Mã tài khoản", icon: <span className="text-red-500">*</span> }}
                        placeholder="Số tài khoản"
                    />
                    <Field.Text
                        name="swiftCode"
                        label={{ text: "Mã Swift", icon: <span className="text-red-500">*</span> }}
                        placeholder="SWIFT/BIC code"
                    />

                    <Field.Text
                        name="branch"
                        label={{ text: "Chi nhánh tài khoản", icon: <span className="text-red-500">*</span> }}
                        placeholder="Nhập chi nhánh ngân hàng"
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className="cursor-pointer w-full px-16 py-2.5 bg-[#004b91] hover:bg-[#003d75] rounded-lg text-white transition-colors disabled:opacity-50"
                    >
                        {isSubmitting || isLoading ? "Đang lưu..." : "Lưu"}
                    </button>
                </div>
            </div>
        </Form>
    );
};

export default AddAccountBank;