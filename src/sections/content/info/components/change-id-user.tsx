import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";

import { Field, Form } from "@/components/hook-form";
import PrimaryButton from "@/components/button/primary-button";
import { useToastStore } from "@/zustand/useToastStore";

const Schema = zod.object({
    username: zod
        .string()
        .min(1, "Tên đăng nhập là bắt buộc")
        .min(4, "Tên đăng nhập phải có ít nhất 4 ký tự")
        .regex(/^[a-zA-Z0-9]+$/, "Tên đăng nhập chỉ được chứa chữ cái và số"),
});

type SchemaType = zod.infer<typeof Schema>;

const ChangeIdUser = () => {
    const { showToast } = useToastStore();

    const defaultValues: SchemaType = {
        username: "50EC12",
    };

    const methods = useForm<SchemaType>({
        resolver: zodResolver(Schema),
        defaultValues,
    });

    const { handleSubmit, formState: { isSubmitting } } = methods;

    const onSubmit = handleSubmit(async (_) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            showToast("success", "Thay đổi tên đăng nhập thành công");
        } catch (error) {
            showToast("error", "Có lỗi xảy ra khi cập nhật");
        }
    });

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm max-w-2xl">
                <div className="space-y-6">
                    <Field.Text
                        name="username"
                        label={{
                            text: "Tên đăng nhập",
                            icon: <span className="text-red-500">*</span>
                        }}
                        placeholder="Nhập tên đăng nhập mới"
                    />

                    <div className="flex justify-start">
                        <PrimaryButton
                            text="Lưu"
                            type="submit"
                            isLoading={isSubmitting}
                            className="px-10 py-2.5 bg-[#004b91] hover:bg-[#003d75] rounded-lg transition-all font-medium text-white shadow-sm"
                        />
                    </div>
                </div>
            </div>
        </Form>
    );
};

export default ChangeIdUser;