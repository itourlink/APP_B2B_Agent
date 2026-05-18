import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";

import PanelPopup from "@/components/popup/panel-popup";
import { Form, Field } from "@/components/hook-form";

const TIME_OPTIONS = [
    { label: "Morning", value: "Morning" },
    { label: "Noon", value: "Noon" },
    { label: "Afternoon", value: "Afternoon" },
    { label: "Evening", value: "Evening" },
    { label: "Night", value: "Night" },
];

const Schema = zod.object({
    day1: zod.array(zod.string()).default([]),
    day2: zod.array(zod.string()).default([]),

    enableDay1: zod.boolean().default(true),
    enableDay2: zod.boolean().default(false),

    selectAll: zod.boolean().default(false),
});

type SchemaType = zod.infer<typeof Schema>;

const AddSupAccommodationD = ({
    open,
    onClose,
}: any) => {
    const methods = useForm<SchemaType>({
        resolver: zodResolver(Schema) as any,
        defaultValues: {
            day1: ["Night"],
            day2: [],
            enableDay1: true,
            enableDay2: false,
            selectAll: false,
        },
    });

    const {
        handleSubmit,
        watch,
        setValue,
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        console.log("DATA", data);
    });

    const handleCheckboxGroup = (
        fieldName: "day1" | "day2",
        value: string
    ) => {
        const currentValues = watch(fieldName) || [];

        if (currentValues.includes(value)) {
            setValue(
                fieldName,
                currentValues.filter((item) => item !== value)
            );
        } else {
            setValue(fieldName, [...currentValues, value]);
        }
    };

    const handleSelectAll = (checked: boolean) => {
        setValue("selectAll", checked);

        const allValues = TIME_OPTIONS.map((i) => i.value);

        if (checked) {
            setValue("day1", allValues);
            setValue("day2", allValues);
        } else {
            setValue("day1", []);
            setValue("day2", []);
        }
    };

    return (
        <PanelPopup
            open={open}
            onClose={onClose}
            title=""
            className="w-[980px]"
        >
            <Form methods={methods} onSubmit={onSubmit}>
                <div className="border border-gray-200 overflow-hidden">

                    {/* Header */}
                    <div className="p-4 border-b">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h3 className="text-[#0b4a8b] font-bold uppercase leading-6 text-[15px]">
                                    KHÁCH SẠN BÃI CHÁY HẠ LONG; VILLA SUPERIOR
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    by CÔNG TY KẾT NỐI DU LỊCH
                                </p>
                            </div>

                            <span className="text-[#f28c28] font-bold text-[30px] leading-none">
                                $21.6
                            </span>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-5">

                        {/* Day 1 */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Field.Check name="enableDay1" />

                                <span className="text-[16px] font-medium">
                                    Day 1
                                </span>
                            </div>

                            <div className="pl-6 flex flex-wrap gap-x-4 gap-y-2">
                                {TIME_OPTIONS.map((item) => {
                                    const checked = watch("day1")?.includes(item.value);

                                    return (
                                        <label
                                            key={item.value}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() =>
                                                    handleCheckboxGroup(
                                                        "day1",
                                                        item.value
                                                    )
                                                }
                                                className="w-4 h-4 accent-[#0b4a8b]"
                                            />

                                            <span className="text-[15px]">
                                                {item.label}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Day 2 */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Field.Check name="enableDay2" />

                                <span className="text-[16px] font-medium">
                                    Day 2
                                </span>
                            </div>

                            <div className="pl-6 flex flex-wrap gap-x-4 gap-y-2">
                                {TIME_OPTIONS.map((item) => {
                                    const checked = watch("day2")?.includes(item.value);

                                    return (
                                        <label
                                            key={item.value}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() =>
                                                    handleCheckboxGroup(
                                                        "day2",
                                                        item.value
                                                    )
                                                }
                                                className="w-4 h-4 accent-[#0b4a8b]"
                                            />

                                            <span className="text-[15px]">
                                                {item.label}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Select all */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={watch("selectAll")}
                                onChange={(e) =>
                                    handleSelectAll(e.target.checked)
                                }
                                className="w-4 h-4 accent-[#0b4a8b]"
                            />

                            <span className="text-[16px] font-medium">
                                Select All
                            </span>
                        </div>

                        {/* Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-[#0b4a8b] hover:bg-[#083765] text-white px-5 py-2 rounded-md cursor-pointer"
                            >
                                Thêm dịch vụ
                            </button>
                        </div>
                    </div>
                </div>
            </Form>
        </PanelPopup>
    );
};

export default AddSupAccommodationD;