import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";

import { Field, Form } from "@/components/hook-form";
import { useToastStore } from "@/zustand/useToastStore";
import { CURRENCYS_OPTIONS, LANGUES_OPTIONS } from "../../../../utils/oprion-data";
import { useUserStore } from "@/zustand/useUserStore";
import { useMutation } from "@tanstack/react-query";
import { useUpdCompanyInfo } from "@/hooks/actions/useUser";

const Schema = zod.object({
    companyName: zod.string().min(1, "Tên công ty là bắt buộc"),
    phone: zod.string().min(1, "Số điện thoại là bắt buộc"),
    email: zod.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),
    website: zod.string().default(""),
    language: zod.string().min(1, "Vui lòng chọn ngôn ngữ"),
    currency: zod.string().min(1, "Vui lòng chọn ĐVTT"),
    refCode: zod.string().default(""),
    address: zod.string().min(1, "Địa chỉ là bắt buộc"),
});

type SchemaType = zod.output<typeof Schema>;

const InfoCompany = () => {
    const { showToast } = useToastStore();
    const user = useUserStore((state) => state.user);
    const { mutate: useUpdCompanyInfoApi, isPending: isLoading } = useMutation({
        mutationFn: useUpdCompanyInfo,
    });

    const defaultValues: SchemaType = {
        companyName: `${user?.strCompanyName}`,
        phone: `${user?.strCompanyPhone}`,
        email: `${user?.strEmail}`,
        website: `${user?.strCompanyWeb}`,
        language: `${user?.intLangID}`,
        currency: `${user?.intCurrencyID}`,
        refCode: `${user?.strRefCode}`,
        address: `${user?.strCompanyAddr}`,
    };

    const methods = useForm<SchemaType>({
        resolver: zodResolver(Schema) as any,
        defaultValues,
    });

    const { handleSubmit, formState: { isSubmitting } } = methods;

    const onSubmit = handleSubmit(async (data) => {
        const payload = {
            strCompanyGUID: user?.strCompanyGUID,
            strMemberGUID: user?.strUserGUID,
            strCompanyName: data?.companyName,
            strCompanyCode: null,
            strCompanyPhone: data?.phone,
            strCompanyEmail: data?.email,
            strCompanyAddr: data?.address,
            strCompanyLogo: "",
            strCompanyWeb: data?.website,
            strCompanyTaxCode: null,
            strDescription: null,
            strAgentPolicy: null,
            intLangID: data?.language,
            intCurrencyID: data?.currency,
            strCompanyRefCode: "",
        };

        useUpdCompanyInfoApi(payload, {
            onSuccess: () => {
                showToast("success", "Cập nhật thành công");
            },
            onError: () => {
                showToast("error", "Cập nhật thất bại");
            },
        });
    });


    const renderForm = (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-bold self-start">Logo</span>
                    <div className="w-40 h-32 bg-gray-100 flex items-center justify-center border border-gray-200 rounded-lg">
                        <div className="text-gray-300">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-6">
                    <div className="md:col-span-3 flex gap-2 items-end">
                        <div className="flex-1">
                            <Field.Text
                                name="companyName"
                                label={{ text: "Tên công ty", icon: <span className="text-red-500">*</span> }}
                                placeholder="Nhập tên công ty"
                            />
                        </div>
                        <span className="mb-3 text-gray-500 text-sm">{user?.strCompanyCode}</span>
                    </div>
                    <Field.Text
                        name="phone"
                        label={{ text: "Số điện thoại", icon: <span className="text-red-500">*</span> }}
                        placeholder="Số điện thoại"
                    />

                    <Field.Text
                        name="email"
                        label={{ text: "Email", icon: <span className="text-red-500">*</span> }}
                        placeholder="Nhập email"
                    />
                    <Field.Text
                        name="website"
                        label={{ text: "Trang web" }}
                        placeholder="Nhập website"
                    />
                    <Field.Select
                        name="language"
                        label={{ text: "Ngôn ngữ", icon: <span className="text-red-500">*</span> }}
                        options={LANGUES_OPTIONS}

                    />
                    <Field.Select
                        name="currency"
                        label={{ text: "ĐVTT", icon: <span className="text-red-500">*</span> }}
                        options={CURRENCYS_OPTIONS}
                    />

                    <Field.Text
                        name="refCode"
                        label={{ text: "Ref code" }}
                        placeholder="Mã giới thiệu"
                    />
                    <div className="md:col-span-3">
                        <Field.Text
                            name="address"
                            label={{ text: "Địa chỉ", icon: <span className="text-red-500">*</span> }}
                            placeholder="Nhập địa chỉ"
                        />
                    </div>
                </div>
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
    );

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            {renderForm}
        </Form>
    );
};

export default InfoCompany;