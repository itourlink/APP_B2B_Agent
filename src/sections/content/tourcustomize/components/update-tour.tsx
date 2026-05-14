import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";

import { Field, Form } from "@/components/hook-form";
import { useToastStore } from "@/zustand/useToastStore";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { CURRENCYS_OPTIONS, STARS2_OPTIONS } from "@/utils/oprion-data";
import { useLocation } from "react-router-dom";
import { useListCity } from "@/hooks/actions/useCity";
import { useEffect, useState } from "react";
import { AgentHostSelect } from "../../request/components/agent-host-select";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listCompanyOwner } from "@/hooks/actions/useCompanyOwner";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useUserStore } from "@/zustand/useUserStore";
import { useDebounce } from "@/hooks/components/use-debounce";
import { updTourCustomized } from "@/hooks/actions/useUser";
import { CONFIG } from "@/config-global";
import BannerMediaField from "@/components/media/banner-media-field";

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
    linkImgBannerTCM: zod.any().optional(),
});

type SchemaType = zod.infer<typeof Schema>;

interface Props {
    onBack: () => void
}
const UpdateTour = ({ onBack }: Props) => {
    const location = useLocation();
    const item = location.state?.item;
    const queryClient = useQueryClient();
    const { showToast } = useToastStore();
    const methods = useForm<SchemaType>({
        resolver: zodResolver(Schema) as any,
        defaultValues: {
            agentHost: item?.strCompanyAgentHostGUID,
            currency: String(item?.intCurrencyID ?? ""),
            tourName: item?.strServiceName,
            dateStart: item?.dtmDateFrom
                ? item.dtmDateFrom.split("T")[0]
                : "",
            sgl: item?.intSGL,
            dbl: item?.intDBL,
            twn: item?.intTWN,
            tpl: item?.intTPL,
            adults: item?.intAdult,
            children: item?.intNoOfChild,
            category: item?.strListEasiaCateID,
            remark: item?.strRemark,
            linkImgBannerTCM: item?.LinkImgBannerTCM,
        },
    });

    const { reset } = methods;

    useEffect(() => {
        if (item) {
            reset({
                agentHost: item?.strCompanyAgentHostGUID,
                currency: String(item?.intCurrencyID ?? ""),
                tourName: item?.strServiceName,
                dateStart: item?.dtmDateFrom
                    ? item.dtmDateFrom.split("T")[0]
                    : "",
                sgl: item?.intSGL,
                dbl: item?.intDBL,
                twn: item?.intTWN,
                tpl: item?.intTPL,
                adults: item?.intAdult,
                children: item?.intNoOfChild,
                category: item?.strListEasiaCateID,
                remark: item?.strRemark,
                linkImgBannerTCM: item?.LinkImgBannerTCM,
            });
        }
    }, [item, reset]);

    const {
        handleSubmit,
        setValue,
        formState: { isSubmitting },
    } = methods;


    const onSubmit = handleSubmit(async (data) => {

        try {
            const payload = {
                strTourCustomizedGUID: item?.strTourCustomizedGUID,

                strCompanyAgentHostGUID: data.agentHost,

                intCurrencyID: Number(data.currency),

                strServiceName: data.tourName,

                dtmDateFrom: data.dateStart,

                strNationalityGUID: data.nationality || "",

                intSGL: Number(data.sgl || 0),
                intDBL: Number(data.dbl || 0),
                intTWN: Number(data.twn || 0),
                intTPL: Number(data.tpl || 0),

                intAdult: Number(data.adults || 0),

                intNoOfChild: Number(data.children || 0),

                strListEasiaCateID: data.category,

                strRemark: data.remark || "",

                linkImgBannerTCM: data.linkImgBannerTCM,
            };

            updTourCustomizedApi(payload, {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: [
                            QUERY_KEYS.USER.LIST_SERVICE_TOUR_CUSTOMIZED,
                        ],
                    });

                    queryClient.invalidateQueries({
                        queryKey: [
                            QUERY_KEYS.USER.LIST_TOUR_CUSTOMIZED,
                        ],
                    });

                    showToast("success", "Update tour thành công");

                    onBack();
                },

                onError: (error: any) => {
                    console.log("update error", error);

                    console.log(data.linkImgBannerTCM);
                    console.log(data.linkImgBannerTCM instanceof File);

                    showToast("error", "Update tour thất bại");
                },
            });
        } catch (error) {
            console.log("submit error", error);

            showToast("error", "Có lỗi xảy ra");

        }
    });

    const { ctData } = useListCity({
        strTableName: "MC02",
        strFeildSelect: "MC02_CountryCode AS code, MC02_CountryGUID AS intID,MC02_CountryName AS strName,MC02_CountryGUID AS id,MC02_CountryName AS text,MC02_CountryName AS strCountryName, MC02_CountryFlagIcon strCountryFlagIcon",
        strWhere: "WHERE (IsActive=1)  ORDER BY MC02_CountryName ASC ",
    })

    const COUNTRY_OPTIONS = ctData.map((item: any) => ({
        label: item.strName,
        value: item.id,
    }));
    const user = useUserStore((state) => state.user);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);

    const { mutate: updTourCustomizedApi } = useMutation({
        mutationFn: updTourCustomized,
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
                intPageSize: 9999,
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

    const [preview, setPreview] = useState(
        item?.LinkImgBannerTCM || ""
    );

    const renderForm = (
        <div className="bg-white rounded-4xl p-8 border border-gray-100 shadow-sm space-y-8 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-end gap-2">
                    <div className="flex-1">
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

                <Field.SearchSelect
                    name="nationality"
                    label={{ text: "Nationality" }}
                    options={COUNTRY_OPTIONS}
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

            <BannerMediaField
                title="Banner IMG"
                value={preview}
                onChange={(path) => {
                    setPreview(
                        `${CONFIG.serverUrlSP}${path.replace(/^\//, "")}`
                    );

                    setValue("linkImgBannerTCM", path);
                }}
            />

            <div className="flex justify-start pt-6 border-t border-gray-50">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cursor-pointer px-12 py-3 bg-[#004b91] hover:bg-[#003d75] rounded-xl text-white font-bold shadow-lg shadow-blue-100 transition-all active:scale-95 uppercase text-sm tracking-wide disabled:opacity-50"
                >
                    {isSubmitting ? "Đang lưu..." : "Lưu"}
                </button>
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto p-3">
            <button
                type="button"
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
