import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";

import { Field, Form } from "@/components/hook-form";
import BannerMediaField from "@/components/media/banner-media-field";

import { useToastStore } from "@/zustand/useToastStore";
import { useUserStore } from "@/zustand/useUserStore";

import { CURRENCYS_OPTIONS, LANGUES_OPTIONS } from "@/utils/oprion-data";

import { CONFIG } from "@/config-global";

import { useMutation } from "@tanstack/react-query";

import { useUpdCompanyInfo } from "@/hooks/actions/useUser";

const Schema = zod.object({
    companyLogo: zod.string().default(""),
    companyName: zod
        .string()
        .min(1, "Tên công ty là bắt buộc"),

    phone: zod
        .string()
        .min(1, "Số điện thoại là bắt buộc"),

    email: zod
        .string()
        .email("Email không hợp lệ")
        .min(1, "Email là bắt buộc"),

    website: zod.string().default(""),

    language: zod
        .string()
        .min(1, "Vui lòng chọn ngôn ngữ"),

    currency: zod
        .string()
        .min(1, "Vui lòng chọn ĐVTT"),

    refCode: zod.string().default(""),

    address: zod
        .string()
        .min(1, "Địa chỉ là bắt buộc"),
});

type SchemaType = zod.output<typeof Schema>;

const InfoCompany = () => {
    const { showToast } = useToastStore();

    const user = useUserStore(
        (state) => state.user
    );

    const {
        mutate: useUpdCompanyInfoApi,
        isPending: isLoading,
    } = useMutation({
        mutationFn: useUpdCompanyInfo,
    });

    const defaultValues: SchemaType = {
        companyLogo:
            user?.strCompanyLogo || "",

        companyName:
            user?.strCompanyName || "",

        phone:
            user?.strCompanyPhone || "",

        email:
            user?.strEmail || "",

        website:
            user?.strCompanyWeb || "",

        language: String(
            user?.intLangID || ""
        ),

        currency: String(
            user?.intCurrencyID || ""
        ),

        refCode:
            user?.strRefCode || "",

        address:
            user?.strCompanyAddr || "",
    };

    const methods =
        useForm<SchemaType>({
            resolver:
                zodResolver(Schema),
            defaultValues,
        });

    const {
        handleSubmit,
        formState: { isSubmitting },
        setValue,
        reset,
    } = methods;

    const [preview, setPreview] =
        useState("");

    useEffect(() => {
        if (!user) return;

        reset(defaultValues);

        setPreview(
            user?.strCompanyLogo
                ? `${CONFIG.serverUrlSP}${user.strCompanyLogo.replace(
                    /^\//,
                    ""
                )}`
                : ""
        );
    }, [user]);

    const onSubmit = handleSubmit(
        async (data) => {
            const payload = {
                strCompanyGUID:
                    user?.strCompanyGUID,

                strMemberGUID:
                    user?.strUserGUID,

                strCompanyName:
                    data?.companyName,

                strCompanyCode: null,

                strCompanyPhone:
                    data?.phone,

                strCompanyEmail:
                    data?.email,

                strCompanyAddr:
                    data?.address,

                strCompanyLogo:
                    data?.companyLogo,

                strCompanyWeb:
                    data?.website,

                strCompanyTaxCode:
                    null,

                strDescription:
                    null,

                strAgentPolicy:
                    null,

                intLangID:
                    data?.language,

                intCurrencyID:
                    data?.currency,

                strCompanyRefCode:
                    "",
            };

            useUpdCompanyInfoApi(
                payload,
                {
                    onSuccess: () => {
                        showToast(
                            "success",
                            "Cập nhật thành công"
                        );
                    },

                    onError: () => {
                        showToast(
                            "error",
                            "Cập nhật thất bại"
                        );
                    },
                }
            );
        }
    );

    return (
        <Form
            methods={methods}
            onSubmit={onSubmit}
        >
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <BannerMediaField
                        title="Logo"
                        value={preview}
                        onChange={(
                            path
                        ) => {
                            const image =
                                `${CONFIG.serverUrlSP}${path.replace(
                                    /^\//,
                                    ""
                                )}`;

                            setPreview(
                                image
                            );

                            setValue(
                                "companyLogo",
                                path
                            );
                        }}
                    />

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-6">
                        <div className="md:col-span-3 flex gap-2 items-end">
                            <div className="flex-1">
                                <Field.Text
                                    name="companyName"
                                    label={{
                                        text: "Tên công ty",
                                        icon: (
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        ),
                                    }}
                                    placeholder="Nhập tên công ty"
                                />
                            </div>

                            <span className="mb-3 text-gray-500 text-sm">
                                {
                                    user?.strCompanyCode
                                }
                            </span>
                        </div>

                        <Field.Text
                            name="phone"
                            label={{
                                text: "Số điện thoại",
                                icon: (
                                    <span className="text-red-500">
                                        *
                                    </span>
                                ),
                            }}
                            placeholder="Số điện thoại"
                        />

                        <Field.Text
                            name="email"
                            label={{
                                text: "Email",
                                icon: (
                                    <span className="text-red-500">
                                        *
                                    </span>
                                ),
                            }}
                            placeholder="Nhập email"
                        />

                        <Field.Text
                            name="website"
                            label={{
                                text: "Trang web",
                            }}
                            placeholder="Nhập website"
                        />

                        <Field.Select
                            name="language"
                            label={{
                                text: "Ngôn ngữ",
                                icon: (
                                    <span className="text-red-500">
                                        *
                                    </span>
                                ),
                            }}
                            options={
                                LANGUES_OPTIONS
                            }
                        />

                        <Field.Select
                            name="currency"
                            label={{
                                text: "ĐVTT",
                                icon: (
                                    <span className="text-red-500">
                                        *
                                    </span>
                                ),
                            }}
                            options={
                                CURRENCYS_OPTIONS
                            }
                        />

                        <Field.Text
                            name="refCode"
                            label={{
                                text: "Ref code",
                            }}
                            placeholder="Mã giới thiệu"
                        />

                        <div className="md:col-span-3">
                            <Field.Text
                                name="address"
                                label={{
                                    text: "Địa chỉ",
                                    icon: (
                                        <span className="text-red-500">
                                            *
                                        </span>
                                    ),
                                }}
                                placeholder="Nhập địa chỉ"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={
                            isSubmitting ||
                            isLoading
                        }
                        className="cursor-pointer w-full px-16 py-2.5 bg-[#004b91] hover:bg-[#003d75] rounded-lg text-white transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ||
                            isLoading
                            ? "Đang lưu..."
                            : "Lưu"}
                    </button>
                </div>
            </div>
        </Form>
    );
};

export default InfoCompany;