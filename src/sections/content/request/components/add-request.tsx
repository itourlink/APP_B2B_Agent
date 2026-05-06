import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";

import { Field, Form } from "@/components/hook-form";
import { useToastStore } from "@/zustand/useToastStore";
import { ArrowLeft } from "lucide-react";
import { COUNTRIES_OPTIONS, MEALS_OPTIONS, STARS_OPTIONS } from "@/utils/oprion-data";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useAddSaleRequest, useListCompanyOwner } from "@/hooks/actions/useUser";
import { useUserStore } from "@/zustand/useUserStore";
import { useDebounce } from "@/hooks/components/use-debounce";
import { useState } from "react";
import { AgentHostSelect } from "./agent-host-select";

const Schema = zod.object({
    agentHost: zod.string().min(1, "Vui lòng chọn Agent Host"),
    dateStart: zod.string().min(1, "Ngày bắt đầu là bắt buộc"),
    duration: zod.coerce.number().min(1, "Thời lượng phải lớn hơn 0").default(0),
    adults: zod.coerce.number().min(1, "Tối thiểu 1 người lớn").default(0),
    children: zod.coerce.number().default(0),
    nationality: zod.string().default("Vietnam"),
    category: zod.array(zod.string())
        .transform((val) => val.join(",")),
    meal: zod.array(zod.string())
        .transform((val) => val.join(",")),
    destination: zod.string().min(1, "Điểm đến là bắt buộc"),
    title: zod.string().min(1, "Tiêu đề là bắt buộc"),
    specialNote: zod.string().default(""),
});

type SchemaType = zod.infer<typeof Schema>;

const AddRequest = ({ onBack }: { onBack: () => void }) => {
    const { showToast } = useToastStore();
    const user = useUserStore((state) => state.user);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);
    const queryClient = useQueryClient();

    const { mutate: useAddCompanyBankAccountApi } = useMutation({
        mutationFn: useAddSaleRequest,
    });
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useInfiniteQuery({
        queryKey: [QUERY_KEYS.USER.LIST_COMPANY_OWNER, debouncedSearch],
        queryFn: ({ pageParam = 1 }) =>
            useListCompanyOwner({
                strUserPartnerGUID: user?.strUserGUID,
                strCompanyPartnerGUID: user?.strCompanyGUID,
                intCurPage: pageParam,
                intPageSize: 10,
                strFilterCompanyName: debouncedSearch,
                IsOwnerFriend: true,
                tblsReturn: "[0]"
            }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const lastDataArray = lastPage?.[0] || [];
            return lastDataArray.length < 10 ? undefined : allPages.length + 1;
        },
    });

    const listData = data?.pages.flatMap(page => page[0]) ?? [];

    const methods = useForm<SchemaType>({
        resolver: zodResolver(Schema) as any,
        defaultValues: {
            agentHost: "",
            duration: 0,
            adults: 0,
            children: 0,
            nationality: "Vietnam",
            category: "",
            meal: "",
            destination: "",
            title: "",
            specialNote: "",
        },
    });

    const { handleSubmit, formState: { isSubmitting } } = methods;

    const onSubmit = handleSubmit(async (data) => {
        const payload = {
            intLangID: 0,
            strAgentCode: user?.strAgentCode,
            strMemberCode: user?.strMemberCode,
            strCompanyGUID: searchTerm,
            strCountryGUID: "DF5DD7F2-43F2-48F4-BFB2-F3D6BE4C9838",
            strDestination: data?.destination,
            strRequestTitle: data?.title,
            strRemark: "",
            dtmDateStart: data?.dateStart,
            intDuration: data?.duration,
            intAdult: data?.adults,
            intNoOfChild: data?.children,
            strListEasiaCateID: data?.category,
            strListMealIncludedTypeID: data?.meal
        };

        useAddCompanyBankAccountApi(payload, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.USER.LIST_SALE_REQUEST],
                });
                onBack();
                showToast("success", "Thêm yêu cầu thành công");
            },
            onError: () => {
                showToast("error", "Thêm yêu cầu thất bại");
            },
        });
    });



    const renderForm = (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AgentHostSelect
                    name="agentHost"
                    label="Agent Host"
                    data={listData}
                    isLoading={isLoading}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    fetchNextPage={fetchNextPage}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                />
                <Field.Text
                    name="title"
                    label={{ text: "Title", icon: <span className="text-red-500">*</span> }}
                    placeholder="Tiêu đề yêu cầu..."
                />
                <Field.Text
                    name="dateStart"
                    type="date"
                    label={{ text: "Date Start", icon: <span className="text-red-500">*</span> }}
                />
                <Field.Text
                    name="duration"
                    type="number"
                    label={{ text: "Thời lượng", icon: <span className="text-red-500">*</span> }}
                />

                <Field.Text
                    name="adults"
                    type="number"
                    label={{ text: "No of Adults", icon: <span className="text-red-500">*</span> }}
                />
                <Field.Text
                    name="children"
                    type="number"
                    label={{ text: "No of Child", icon: <span className="text-red-500">*</span> }}
                />
                <Field.Select
                    name="nationality"
                    label={{ text: "Nationality" }}
                    options={COUNTRIES_OPTIONS}
                />
                <Field.MultiSelect
                    name="category"
                    label={{ text: "Danh mục", icon: <span className="text-red-500">*</span> }}
                    options={STARS_OPTIONS}
                />
                <Field.MultiSelect
                    name="meal"
                    label={{ text: "Meal", icon: <span className="text-red-500">*</span> }}
                    options={MEALS_OPTIONS}
                />

                <Field.Text
                    name="destination"
                    label={{ text: "Destination", icon: <span className="text-red-500">*</span> }}
                    placeholder="Nhập điểm đến..."
                />


                <Field.Text
                    name="specialNote"
                    label={{ text: "SpecialNote" }}
                    placeholder="Nhập ghi chú đặc biệt..."
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
    )
    return (
        <div className="">
            <button
                onClick={onBack}
                className="cursor-pointer flex items-center gap-2 text-gray-500 hover:text-[#004b91] transition-colors group py-2"
            >
                <div className="p-1.5 rounded-full group-hover:bg-blue-50 transition-colors">
                    <ArrowLeft size={20} />
                </div>
                <span className="text-sm font-medium">Quay lại</span>
            </button>

            <Form methods={methods} onSubmit={onSubmit}>
                {renderForm}
            </Form >

        </div>

    );
};

export default AddRequest;
