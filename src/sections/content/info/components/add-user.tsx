import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";

import { Field, Form } from "@/components/hook-form";
import { useToastStore } from "@/zustand/useToastStore";
import { ROLES_OPTIONS, TITLES_OPTIONS } from "../../../../utils/oprion-data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addUserInCompany, useCheckAgentRegisterByEmail } from "@/hooks/actions/useUser";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";

const Schema = zod.object({
    title: zod.string().min(1, "Vui lòng chọn danh xưng"),
    firstName: zod.string().min(1, "Tên là bắt buộc"),
    lastName: zod.string().min(1, "Họ là bắt buộc"),
    email: zod.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),
    role: zod.string().min(1, "Vui lòng chọn vai trò"),
    phone: zod.string().default(""),
    note: zod.string().default(""),
});

type SchemaType = zod.infer<typeof Schema>;

interface Props {
    onClose: () => void
}
const AddUser = ({ onClose }: Props) => {
    const queryClient = useQueryClient();
    const { showToast } = useToastStore();

    const { mutate: addUserInCompanyApi, isPending: isLoading } = useMutation({
        mutationFn: addUserInCompany,
    });

    const defaultValues: SchemaType = {
        title: "",
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        phone: "",
        note: "",
    };

    const methods = useForm<SchemaType>({
        resolver: zodResolver(Schema) as any,
        defaultValues,
    });

    const { handleSubmit, formState: { isSubmitting } } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            const res = await useCheckAgentRegisterByEmail({
                strEmail: data.email
            });

            if (res?.data?.length > 0) {
                showToast("error", "Email đã tồn tại");
                return;
            }

            const payload = {
                intMemberTypeID: 1,
                intSaluteID: Number(data.title),
                intMemberRoleID: Number(data.role),

                strFirstName: data.firstName,
                strLastName: data.lastName,
                strMobile: data.phone,
                strEmail: data.email,
                strRemark: data.note
            };

            addUserInCompanyApi(payload, {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_KEYS.USER.LIST_USER_IN_COMPANY_OWNER],
                    });
                    onClose();
                    showToast("success", "Thêm người dùng thành công");
                },
                onError: () => {
                    showToast("error", "Thêm người dùng thất bại");
                },
            });

        } catch (err) {
            showToast("error", "Lỗi khi kiểm tra email");
        }
    });

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">

                <div className="grid grid-cols-2 gap-x-6 gap-y-6">

                    <Field.Select
                        name="title"
                        label={{ text: "Danh xưng" }}
                        options={TITLES_OPTIONS}
                    />

                    <Field.Text
                        name="firstName"
                        label={{ text: "Tên", icon: <span className="text-red-500">*</span> }}
                        placeholder="Nhập tên"
                    />

                    <Field.Text
                        name="lastName"
                        label={{ text: "Họ", icon: <span className="text-red-500">*</span> }}
                        placeholder="Nhập họ"
                    />

                    <Field.Text
                        name="email"
                        label={{ text: "Email", icon: <span className="text-red-500">*</span> }}
                        placeholder="Nhập email"
                    />

                    <Field.Select
                        name="role"
                        label={{ text: "Vai trò", icon: <span className="text-red-500">*</span> }}
                        options={ROLES_OPTIONS}
                    />

                    <Field.Text
                        name="phone"
                        label={{ text: "Số điện thoại" }}
                        placeholder="Nhập số điện thoại"
                    />
                </div>

                <div className="space-y-1.5">
                    <Field.Text
                        name="note"
                        label={{ text: "Ghi chú" }}
                        placeholder="Nhập ghi chú..."
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

export default AddUser;