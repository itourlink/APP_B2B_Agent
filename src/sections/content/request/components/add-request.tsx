import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";

import { Field, Form } from "@/components/hook-form";
import { useToastStore } from "@/zustand/useToastStore";
import { ArrowLeft } from "lucide-react";
import { MEALS_OPTIONS, STARS_OPTIONS } from "@/utils/oprion-data";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useAddSaleRequest } from "@/hooks/actions/useUser";
import { useUserStore } from "@/zustand/useUserStore";
import { useDebounce } from "@/hooks/components/use-debounce";
import { useState } from "react";
import { AgentHostSelect } from "./agent-host-select";
import { listCompanyOwner } from "@/hooks/actions/useCompanyOwner";
import { useListCity } from "@/hooks/actions/useCity";
import { useTranslate } from "@/locales";

type SchemaType = {
    agentHost: string;
    dateStart: string;
    duration: number;
    adults: number;
    children: number;
    nationality: string;
    category: string;
    meal: string;
    destination: string;
    title: string;
    specialNote: string;
};

const createSchema = (t: (key: string) => string) => zod.object({
    agentHost: zod.string().min(1, t("agentHostRequired")),
    dateStart: zod.string().min(1, t("dateStartRequired")),
    duration: zod.coerce.number().min(1, t("durationMinimum")).default(0),
    adults: zod.coerce.number().min(1, t("adultMinimum")).default(0),
    children: zod.coerce.number().default(0),
    nationality: zod.string().default("Vietnam"),
    category: zod.string(),
    meal: zod.string(),
    destination: zod.string().min(1, t("destinationRequired")),
    title: zod.string().min(1, t("titleRequired")),
    specialNote: zod.string().default(""),
});

const AddRequest = ({ onBack }: { onBack: () => void }) => {
    const { t } = useTranslate("request");
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
            listCompanyOwner({
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
        resolver: zodResolver(createSchema((key) => t(key))) as any,
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
                showToast("success", t("addRequestSuccess"));
            },
            onError: () => {
                showToast("error", t("addRequestError"));
            },
        });
    });


    // quốc gia

    const { ctData } = useListCity({
        strTableName: "MC02",
        strFeildSelect: "MC02_CountryCode AS code, MC02_CountryGUID AS intID,MC02_CountryName AS strName,MC02_CountryGUID AS id,MC02_CountryName AS text,MC02_CountryName AS strCountryName, MC02_CountryFlagIcon strCountryFlagIcon",
        strWhere: "WHERE (IsActive=1)  ORDER BY MC02_CountryName ASC ",
    })

    const COUNTRY_OPTIONS = ctData.map((item: any) => ({
        label: item.strName,
        value: item.id,
    }));

    const renderForm = (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AgentHostSelect
                    name="agentHost"
                    label={t("agentHost")}
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
                    label={{ text: t("requestTitle"), icon: <span className="text-red-500">*</span> }}
                    placeholder={t("requestTitlePlaceholder")}
                />
                <Field.Text
                    name="dateStart"
                    type="date"
                    label={{ text: t("dateStart"), icon: <span className="text-red-500">*</span> }}
                />
                <Field.Text
                    name="duration"
                    type="number"
                    label={{ text: t("duration"), icon: <span className="text-red-500">*</span> }}
                />

                <Field.Text
                    name="adults"
                    type="number"
                    label={{ text: t("adults"), icon: <span className="text-red-500">*</span> }}
                />
                <Field.Text
                    name="children"
                    type="number"
                    label={{ text: t("children"), icon: <span className="text-red-500">*</span> }}
                />
                <Field.SearchSelect
                    name="nationality"
                    label={{ text: t("nationality") }}
                    options={COUNTRY_OPTIONS}
                />
                <Field.MultiSelect
                    name="category"
                    label={{ text: t("category"), icon: <span className="text-red-500">*</span> }}
                    options={STARS_OPTIONS}
                />
                <Field.MultiSelect
                    name="meal"
                    label={{ text: t("meal"), icon: <span className="text-red-500">*</span> }}
                    options={MEALS_OPTIONS}
                />

                <Field.Text
                    name="destination"
                    label={{ text: t("destination"), icon: <span className="text-red-500">*</span> }}
                    placeholder={t("destinationPlaceholder")}
                />


                <Field.Text
                    name="specialNote"
                    label={{ text: t("specialNote") }}
                    placeholder={t("specialNotePlaceholder")}
                />
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="cursor-pointer w-full px-16 py-2.5 bg-[#004b91] hover:bg-[#003d75] rounded-lg text-white transition-colors disabled:opacity-50"
                >
                    {isSubmitting || isLoading ? t("saving") : t("save")}
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
                <span className="text-sm font-medium">{t("back")}</span>
            </button>

            <Form methods={methods} onSubmit={onSubmit}>
                {renderForm}
            </Form >

        </div>

    );
};

export default AddRequest;
