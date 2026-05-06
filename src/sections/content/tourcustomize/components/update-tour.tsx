import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";

import { Field, Form } from "@/components/hook-form";
import PrimaryButton from "@/components/button/primary-button";
import { useToastStore } from "@/zustand/useToastStore";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { AGENT_HOST, COUNTRIES_OPTIONS, CURRENCYS_OPTIONS, STARS2_OPTIONS } from "@/utils/oprion-data";

const Schema = zod.object({
    agentHost: zod.string().min(1, "Vui lòng chọn Agent Host"),
    currency: zod.string().default("Vietnamese Dong"),
    tourName: zod.string().min(1, "Tour name là bắt buộc"),
    dateStart: zod.string().min(1, "Ngày bắt đầu là bắt buộc"),
    nationality: zod.string().default(""),
    sgl: zod.number().default(0),
    dbl: zod.number().default(2),
    twn: zod.number().default(0),
    tpl: zod.number().default(0),
    adults: zod.number().min(1, "Tối thiểu 1 người lớn"),
    children: zod.number().default(0),
    category: zod.string().min(1, "Vui lòng chọn hạng sao"),
    remark: zod.string().default(""),
    bannerImg: zod.any().optional(),
});

type SchemaType = zod.infer<typeof Schema>;

interface Props {
    onBack: () => void
}
const UpdateTour = ({ onBack }: Props) => {
    const { showToast } = useToastStore();
    const methods = useForm<SchemaType>({
        resolver: zodResolver(Schema) as any,
        defaultValues: {
            agentHost: "CÔNG TY KẾT NỐI DU LỊCH",
            currency: "Vietnamese Dong",
            tourName: "Test tour",
            dateStart: "2026-09-29",
            sgl: 0,
            dbl: 2,
            twn: 0,
            tpl: 0,
            adults: 4,
            children: 0,
            category: "5",
            remark: "",
        },
    });

    const { handleSubmit, formState: { isSubmitting } } = methods;

    const onSubmit = handleSubmit(async (_) => {
        try {
            showToast("success", "Tạo yêu cầu mới thành công");
        } catch (error) {
            showToast("error", "Có lỗi xảy ra, vui lòng kiểm tra lại");
        }
    });

    const renderForm = (
        <div className="bg-white rounded-4xl p-8 border border-gray-100 shadow-sm space-y-8 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-end gap-2">
                    <div className="flex-1">
                        <Field.Select
                            name="agentHost"
                            label={{ text: "Agent Host", icon: <span className="text-red-500">*</span> }}
                            options={AGENT_HOST}
                        />
                    </div>
                    <button
                        type="button"
                        className="p-2.5 text-gray-400 hover:text-[#004b91] bg-gray-50 rounded-lg mb-1"
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>

                <Field.Select
                    name="currency"
                    label={{ text: "ĐVTT", icon: <span className="text-red-500">*</span> }}
                    options={CURRENCYS_OPTIONS}
                />

                <Field.Text
                    name="tourName"
                    label={{ text: "Tour name", icon: <span className="text-red-500">*</span> }}
                    placeholder="Nhập tên tour..."
                />

                <Field.Text
                    name="dateStart"
                    type="date"
                    label={{ text: "Date Start", icon: <span className="text-red-500">*</span> }}
                />

                <Field.Select
                    name="nationality"
                    label={{ text: "Nationality" }}
                    options={COUNTRIES_OPTIONS}
                    placeholder="Select country"
                />

                <Field.Text name="sgl" type="number" label={{ text: "SGL" }} />
                <Field.Text name="dbl" type="number" label={{ text: "DBL" }} />
                <Field.Text name="twn" type="number" label={{ text: "TWN" }} />
                <Field.Text name="tpl" type="number" label={{ text: "TPL" }} />

                <Field.Text
                    name="adults"
                    type="number"
                    label={{ text: "No of Adults", icon: <span className="text-red-500">*</span> }}
                />

                <Field.Text
                    name="children"
                    type="number"
                    label={{ text: "No of Child" }}
                />

                <Field.Select
                    name="category"
                    label={{ text: "Category", icon: <span className="text-red-500">*</span> }}
                    options={STARS2_OPTIONS}
                    placeholder="Chọn hạng sao"
                />
            </div>





            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider text-[11px]">Remark</label>
                <div className="rounded-2xl overflow-hidden border border-gray-200">
                    <Field.Editor name="remark" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider text-[11px]">Banner Img</label>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <span className="text-sm text-gray-400 font-medium">Nhấp để tải ảnh lên</span>
                </div>
            </div>

            <div className="flex justify-start pt-6 border-t border-gray-50">
                <PrimaryButton
                    text="Lưu"
                    isLoading={isSubmitting}
                    className="px-12 py-3 bg-[#004b91] hover:bg-[#003d75] rounded-xl text-white font-bold shadow-lg shadow-blue-100 transition-all active:scale-95 uppercase text-sm tracking-wide"
                />
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto p-3">
            <button
                onClick={() => onBack()}
                className="cursor-pointer flex items-center gap-2 text-gray-500 hover:text-[#004b91] transition-colors group py-2"
            >
                <div className="p-1.5 rounded-full group-hover:bg-blue-50 transition-colors">
                    <ArrowLeft size={20} />
                </div>
                <span className="text-sm font-medium">Quay lại</span>
            </button>

            <Form methods={methods} onSubmit={onSubmit}>
                {renderForm}
            </Form>
        </div>
    );
};

export default UpdateTour;