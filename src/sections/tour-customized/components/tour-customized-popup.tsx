import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";

import { Field, Form } from "@/components/hook-form";
import { useToastStore } from "@/zustand/useToastStore";
import { RotateCcw, Trash2 } from "lucide-react";
import { CURRENCYS_OPTIONS, STARS2_OPTIONS } from "@/utils/oprion-data";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { addNewTourCustomized } from "@/hooks/actions/useTour";
import { useUser } from "@/hooks/actions/useAuth";
import { useListCompanyOwner } from "@/hooks/actions/useCompanyOwner";
import { useEffect, useState } from "react";
import { useListCity } from "@/hooks/actions/useCity";
import { CircleX } from "lucide-react";
import { useListTourCustomized } from "@/hooks/actions/useUser";


export const Schema = z
    .object({
        agentHost: z.string().min(1, "Vui lòng chọn Agent Host"),
        currency: z.string().min(1, "Vui lòng chọn ĐVTT"),
        tourName: z.string().min(1, "Tên Tour là bắt buộc"),
        dateStart: z.string().min(1, "Ngày bắt đầu là bắt buộc"),

        nationality: z.string().min(1, "Vui lòng chọn Quốc tịch"),

        adults: z.coerce.number().min(1, "Tối thiểu 1 người lớn"),
        children: z.coerce.number().default(0),

        category: z.string().min(1, "Vui lòng chọn Loại"),

        remark: z.string().optional(),

        // room types
        sgl: z.coerce.number().min(0).default(0),
        dbl: z.coerce.number().min(0).default(0),
        twn: z.coerce.number().min(0).default(0),
        tpl: z.coerce.number().min(0).default(0),

        // list điểm đến (required)
        listLocation: z.string().min(1, "Vui lòng chọn thêm điểm đến"),

        bannerImg: z.any().optional(),

        country: z.string().optional(),
        city: z.string().optional(),
    })
    .refine(
        (data) =>
            data.sgl > 0 || data.dbl > 0 || data.twn > 0 || data.tpl > 0,
        {
            message: "Phải nhập ít nhất 1 phòng trong SGL / DBL / TWN / TPL",
            path: ["sgl"],
        }
    );

type SchemaType = zod.infer<typeof Schema>;
type Props = {
    onClose: () => void;
};
const TourCustomizedPopup = ({ onClose }: Props) => {
    const { user } = useUser();
    const { coData, coLoading } = useListCompanyOwner();
    const [nationalityCode, setNationalityCode] = useState("");
    const [preview, setPreview] = useState<string | null>(null);
    const AGENT_HOST_OPTIONS = coData
        ? [
            {
                label: coData.strCompanyName,
                value: coData.strCompanyGUID,
            },
        ]
        : [];


    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setPreview(url);

        methods.setValue("bannerImg", file);
    };

    const { showToast } = useToastStore();
    const methods = useForm<SchemaType>({
        resolver: zodResolver(Schema) as any,
        defaultValues: {
            agentHost: coData?.strCompanyGUID || "",
            currency: "",
            tourName: "",
            dateStart: "2026-04-25",

            nationality: "",

            sgl: 0,
            dbl: 2,
            twn: 0,
            tpl: 0,

            adults: 30,
            children: 3,

            category: "1",

            remark: "<p>Ghi chú</p>",

            listLocation: "",
        }
    });

    const { handleSubmit, formState: { isSubmitting } } = methods;

    const { mutate: addNewTourCustomizedApi, isPending: isLoading } = useMutation({
        mutationFn: addNewTourCustomized,
    });

    const onValid = async (data: SchemaType) => {
        const existingTourNames = [
            "Test Tour 1044",
            "Ha Noi Tour",
            "Da Nang Tour",
        ];

        const isDuplicateTourName = existingTourNames.some(
            (name) => name.trim().toLowerCase() === data.tourName.trim().toLowerCase()
        );
        if (isDuplicateTourName) {
            methods.setError("tourName", {
                type: "manual",
                message: "Tên tour đã tồn tại",
            });
            return;
        }



        if (locations.length === 0) {
            showToast("error", "Vui lòng thêm điểm đến");
            return;
        }
        const currentCountry = methods.getValues("country");
        const currentCity = methods.getValues("city");
        if (currentCountry && currentCity) {
            const confirmMissing = window.confirm("Vui lòng chọn thêm điểm đến");
            if (!confirmMissing) return;
        }
        const payload = {
            strCompanyGUID: user?.strCompanyGUID || "",
            strCompanyAgentHostGUID: data.agentHost, // nếu đang là GUID thì OK, không thì cần map lại

            intLangID: null,
            strCountryGUID: data.nationality,

            intAdult: data.adults,
            intNoOfChild: data.children,

            intSGL: data.sgl,
            intDBL: data.dbl,
            intTWN: data.twn,
            intTPL: data.tpl,

            dtmDateFrom: data.dateStart,

            strServiceName: data.tourName,

            intNoOfDay: null,
            intPerPaxID: null,

            intCurrencyID: data.currency, // nếu là ID thì giữ number/string ID

            strListEasiaCateID: data.category,

            strRemark: data.remark,

            strListLocation: buildListLocation(),
        };
        addNewTourCustomizedApi(payload, {
            onSuccess: async (res: any) => {
                showToast("success", "Thêm tour tùy chỉnh thành công");

                const guid = res?.[0]?.[0]?.strTourCustomizedGUID;

                if (!guid) return;

                // delay 1 chút cho backend insert xong
                setTimeout(async () => {
                    const detail = await useListTourCustomized({
                        strTourCustomizedGUID: guid,
                        strFilter: null,
                        intTourStepID: 2,
                        strCodeChkVer: null,
                        intMemberTypeID: 1,
                        strOrder: null,
                        intCurPage: 1,
                        intPageSize: 5,
                        tblsReturn: "[0]"
                    });

                    console.log("detail", detail?.[0]?.[0]);
                    onClose();
                }, 500);
            },
            onError: () => {
                showToast("error", "Thêm tour tùy chỉnh thất bại");
            },
        });
    }


    const onINValid = (errors: any) => {
        console.log(errors);
        showToast("error", "Vui lòng kiểm tra lại thông tin");
    }
    const onSubmit = handleSubmit(onValid, onINValid);

    useEffect(() => {
        if (coData) {
            methods.reset({
                ...methods.getValues(),
                agentHost: coData.strCompanyGUID,
            });
        }
    }, [coData]);


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

    const COUNTRY_OPTIONS_LIST = ctData.map((item: any) => ({
        label: item.strName,
        value: item.code,
    }));


    // thành phố
    const { ctData: ntData } = useListCity({
        strTableName: "MC04",
        strFeildSelect: "MC04_CityCode AS strCityCode,MC04_CityName AS strCityName",
        strWhere: `WHERE IsActive=1 
               AND MC04_CityCode LIKE '%${nationalityCode}%' 
               AND MC04.IsActive=1 
               ORDER BY MC04_CityName`,
    });

    const CITY_OPTIONS = ntData.map((item: any) => ({
        label: item.strCityName,
        value: item.strCityCode,
    }));


    const [locations, setLocations] = useState<
        { countryCode: string; cityCode: string; nights: number }[]
    >([]);

    const watchedCountry = methods.watch("country");

    // xóa lỗi khi gõ lại tên tour
    const watchedTourName = methods.watch("tourName");
    useEffect(() => {
        if (watchedTourName) {
            methods.clearErrors("tourName")
        }
    }, [watchedTourName])
    // xóa lỗi nationality khi chọn quốc gia
    const watchedNationality = methods.watch("nationality")

    useEffect(() => {
        if (watchedNationality)
            methods.clearErrors("nationality")
    }, [watchedNationality])


    const handleAddLocation = () => {
        const countryVal = methods.getValues("country");
        const cityVal = methods.getValues("city");

        if (!countryVal) return showToast("error", "Vui lòng chọn quốc gia");
        if (!cityVal) return showToast("error", "Vui lòng chọn thành phố");
        if (!countryVal || !cityVal) return;



        setLocations((prev) => {
            // tránh duplicate city
            if (prev.some((x) => x.cityCode === cityVal)) return prev;

            return [
                ...prev,
                {
                    countryCode: countryVal,
                    cityCode: cityVal,
                    nights: 1,
                },
            ];
        });

        // reset form fields
        methods.setValue("city", "");
        methods.clearErrors(["country", "city", "listLocation"]);
    };

    useEffect(() => {
        if (!watchedCountry) return;

        setNationalityCode(watchedCountry);

        // reset city khi đổi country
        methods.setValue("city", "");
    }, [watchedCountry]);


    const buildListLocation = () => {
        return locations
            .map((x) => `${x.cityCode}!${x.nights}`)
            .join("#") + (locations.length ? "#" : "");
    };

    // keep form field `listLocation` in sync with locations state
    useEffect(() => {
        methods.setValue("listLocation", buildListLocation());
    }, [locations]);

    // initialize from existing form value if any (parse format CITYCODE!N#...)
    useEffect(() => {
        const initial = methods.getValues("listLocation") || "";
        if (!initial) return;
        const parsed = initial
            .split("#")
            .filter(Boolean)
            .map((t) => {
                const [cityCode, nights] = t.split("!");
                return {
                    countryCode: "",
                    cityCode: cityCode || "",
                    nights: Number(nights) || 1,
                };
            });

        if (parsed.length) setLocations(parsed);
    }, []);

    const renderForm = (
        <div className="bg-white rounded-4xl p-8 border border-gray-100 shadow-sm space-y-8 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-end gap-2">
                    <div className="flex-1">
                        <Field.Select
                            name="agentHost"
                            label={{ text: "Agent Host", icon: <span className="text-red-500">*</span> }}
                            options={AGENT_HOST_OPTIONS}
                            disabled={coLoading || AGENT_HOST_OPTIONS.length === 0}
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

                <Field.SearchSelect
                    name="nationality"
                    label={{ text: "Nationality" }}
                    options={COUNTRY_OPTIONS}
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

            <div className="space-y-2 border border-slate-200 rounded-2xl p-4">
                <label className="">Danh sách điểm đến</label>
                {methods.formState.errors.listLocation && (
                    <div className="flex items-center gap-2 text-red-500 text-xs mt-2 px-4">
                        <CircleX size={16} />
                        <span>{methods.formState.errors.listLocation.message}</span>
                    </div>
                )}

                <div className="flex gap-2">
                    <div className="flex-1">
                        <Field.SearchSelect
                            name="country"
                            options={COUNTRY_OPTIONS_LIST}
                        />
                    </div>

                    <div className="flex-1">
                        <Field.SearchSelect
                            name="city"
                            options={CITY_OPTIONS}
                            disabled={!watchedCountry}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleAddLocation}
                        className="px-4 py-2 bg-[#004b91] text-white rounded-lg text-sm cursor-pointer hover:bg-[#003d75] transition"
                    >
                        Thêm điểm đến
                    </button>
                </div>

                <div className="space-y-3">
                    {locations.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
                        >
                            {/* LEFT: location info */}
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-800">
                                    {item.cityCode}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {item.countryCode}
                                </span>
                            </div>

                            {/* CENTER: nights */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Nights</span>

                                <select
                                    value={item.nights}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);

                                        setLocations((prev) =>
                                            prev.map((x, i) =>
                                                i === index ? { ...x, nights: value } : x
                                            )
                                        );
                                    }}
                                    className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                                        <option key={n} value={n}>
                                            {n}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* RIGHT: delete */}
                            <button
                                onClick={() =>
                                    setLocations((prev) => prev.filter((_, i) => i !== index))
                                }
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>


            </div>



            <div className="space-y-2">
                <label className="">Remark</label>
                <div className="rounded-2xl overflow-hidden border border-gray-200">
                    <Field.Editor name="remark" />
                </div>
            </div>



            <div className="space-y-2">
                <label className="">Banner Img</label>

                <label className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleUpload}
                    />

                    {preview ? (
                        <img
                            src={preview}
                            alt="preview"
                            className="w-full h-[200px] object-cover rounded-xl"
                        />
                    ) : (
                        <>
                            <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-sm text-gray-400 font-medium">
                                Nhấp để tải ảnh lên
                            </span>
                        </>
                    )}
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
    );

    return (
        <div className="">
            <Form methods={methods} onSubmit={onSubmit}>
                {renderForm}
            </Form>
        </div>
    );
};

export default TourCustomizedPopup;
