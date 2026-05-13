import { Field, Form } from "@/components/hook-form";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { updTourCustomizedForMarkup } from "@/hooks/actions/useUser";
import { useToastStore } from "@/zustand/useToastStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z as zod } from "zod";

interface Props {
    item?: any;
    onClose: () => void;
}

const Schema = zod.object({
    intMarkupTypeID: zod
        .string()
        .min(1, "Vui lòng chọn Markup Type"),

    dblMarkupService: zod
        .string()
        .min(1, "Vui lòng nhập giá"),
});

type SchemaType = zod.infer<typeof Schema>;

const UpdatePriceMarkup = ({
    item,
    onClose,
}: Props) => {
    const queryClient = useQueryClient();

    const { showToast } = useToastStore();

    const defaultValues: SchemaType = {
        intMarkupTypeID:
            item?.intMarkupTypeID?.toString() ||
            "1",

        dblMarkupService:
            item?.dblMarkupService?.toString() ||
            "",
    };

    const methods = useForm<SchemaType>({
        resolver: zodResolver(Schema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const {
        mutate: updTourCustomizedForMarkupApi,
        isPending: isLoading,
    } = useMutation({
        mutationFn: updTourCustomizedForMarkup,
    });

    const onSubmit = handleSubmit(
        async (data) => {
            const payload = {
                strTourCustomizedGUID:
                    item?.strTourCustomizedGUID,

                intMarkupTypeID:
                    data?.intMarkupTypeID,

                dblMarkupService:
                    data?.dblMarkupService,
            };

            updTourCustomizedForMarkupApi(
                payload,
                {
                    onSuccess: () => {
                        queryClient.invalidateQueries({
                            queryKey: [
                                QUERY_KEYS.USER.LIST_TOUR_CUSTOMIZED,
                                item?.strTourCode
                            ],
                        });

                        showToast(
                            "success",
                            "Cập nhật thành công"
                        );

                        onClose();
                    },
                    onError: () => {
                        showToast("error", "Cập nhật thất bại");
                    },
                }
            );
        }
    );

    return (
        <div className="space-y-4">
            <div>
                <div className="font-semibold">
                    Tour name:
                </div>

                <div>
                    {item?.strServiceName}
                </div>
            </div>

            <div>
                <div className="font-semibold">
                    Total Cost Price:
                </div>

                <div>
                    ₫
                    {Number(
                        item?.dblTotalMarkupPrice || 0
                    ).toLocaleString()}
                </div>
            </div>

            <Form
                methods={methods}
                onSubmit={onSubmit}
            >
                <div className="space-y-4">
                    <Field.Text
                        name="dblMarkupService"
                        label={{
                            text: "Markup Value",
                            icon: (
                                <span className="text-red-500">
                                    *
                                </span>
                            ),
                        }}
                    />

                    <Field.Select
                        name="intMarkupTypeID"
                        label={{
                            text: "Markup Type",
                        }}
                        options={[
                            {
                                label: "%",
                                value: "1",
                            },
                            {
                                label: "Fixed",
                                value: "2",
                            },
                        ]}
                    />

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                isLoading ||
                                isSubmitting
                            }
                            className="cursor-pointer px-12 py-3 bg-[#004b91] hover:bg-[#003d75] rounded-xl text-white font-bold shadow-lg shadow-blue-100 transition-all active:scale-95 uppercase text-sm tracking-wide disabled:opacity-50"

                        >
                            {isLoading
                                ? "Updating..."
                                : "Update"}
                        </button>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default UpdatePriceMarkup;