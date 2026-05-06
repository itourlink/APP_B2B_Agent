import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";

import { Field, Form } from "@/components/hook-form";
import { useToastStore } from "@/zustand/useToastStore";
import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "@/zustand/useUserStore";
import { useCheckMemberPassword, useUpdMemberPassword } from "@/hooks/actions/useUser";

const Schema = zod
    .object({
        oldPassword: zod.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
        newPassword: zod
            .string()
            .min(8, "Mật khẩu phải từ 8-30 ký tự")
            .max(30, "Mật khẩu không quá 30 ký tự")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                "Mật khẩu phải bao gồm chữ thường, chữ hoa, chữ số và ký tự đặc biệt"
            ),
        confirmPassword: zod.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"],
    });

type SchemaType = zod.infer<typeof Schema>;

interface Props {
    onClose: () => void
}
const ChangePasswordUser = ({ onClose }: Props) => {
    const user = useUserStore((state) => state.user);
    const { showToast } = useToastStore();
    const [showPassword, setShowPassword] = useState(false);


    const { mutate: useUpdMemberPasswordApi, isPending: isLoading } = useMutation({
        mutationFn: useUpdMemberPassword,
    });

    const methods = useForm<SchemaType>({
        resolver: zodResolver(Schema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const { handleSubmit, formState: { isSubmitting } } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            const res = await useCheckMemberPassword({
                strMemberGUID: user?.strUserGUID,
                strPassword: data?.oldPassword
            });

            if (res?.data?.length > 0) {
                showToast("error", "Mật khẩu đã tồn tại");
                return;
            }

            const payload = {
                strMemberGUID: user?.strUserGUID,
                strNewPassword: data?.newPassword,
                strOldPassword: data?.oldPassword
            };

            useUpdMemberPasswordApi(payload, {
                onSuccess: () => {
                    onClose();
                    showToast("success", "Cập nhật thành công");
                },
                onError: () => {
                    showToast("error", "Cập nhật thất bại");
                },
            });

        } catch (err) {
            showToast("error", "Lỗi khi kiểm tra mật khẩu");
        }


    });

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm max-w-2xl space-y-5">

                <Field.Text
                    name="oldPassword"
                    label={{ text: "Mật khẩu hiện tại", icon: <span className="text-red-500">*</span> }}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                />

                <div className="space-y-2">
                    <Field.Text
                        name="newPassword"
                        label={{ text: "Mật khẩu mới", icon: <span className="text-red-500">*</span> }}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                    />
                    <p className="text-xs text-gray-500 italic leading-relaxed">
                        Mật khẩu yêu cầu phải 8-30 ký tự bao gồm tối thiểu 1 chữ thường, chữ hoa, chữ số và ký tự đặc biệt
                    </p>
                </div>

                <Field.Text
                    name="confirmPassword"
                    label={{ text: "Nhập lại Mật khẩu mới", icon: <span className="text-red-500">*</span> }}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                />

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="show-password"
                        className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                    />
                    <label htmlFor="show-password" className="text-sm text-gray-600 italic cursor-pointer select-none">
                        Hiện mật khẩu
                    </label>
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

export default ChangePasswordUser;