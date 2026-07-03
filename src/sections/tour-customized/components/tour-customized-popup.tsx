import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";

import { Field, Form } from "@/components/hook-form";
import { useToastStore } from "@/zustand/useToastStore";
import { RotateCcw, Trash2, CircleX } from "lucide-react";
import { CURRENCYS_OPTIONS, STARS2_OPTIONS } from "@/utils/option-data";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { addNewTourCustomized } from "@/hooks/actions/useTour";
import { useUser } from "@/hooks/actions/useAuth";
import { useListCompanyOwner } from "@/hooks/actions/useCompanyOwner";
import { useEffect, useState } from "react";
import { useListCity } from "@/hooks/actions/useCity";
import { useListTourCustomized } from "@/hooks/actions/useUser";
import BannerMediaField from "@/components/media/banner-media-field";
import { CONFIG } from "@/config-global";
import type { SubmitErrorHandler } from "react-hook-form";
import { useTranslate } from "@/locales";

type Props = {
    onClose: () => void;
};

const TourCustomizedPopup = ({ onClose }: Props) => {
    const { t } = useTranslate("tourcustomize");
    const today = new Date().toISOString().split("T")[0]


    const Schema = z
        .object({
            agentHost: z.string().min(1, t("selectAgentHost")),
            currency: z.string().min(1, t("selectCurrency")),
            tourName: z.string().min(1, t("tourNameRequired")),
            dateStart: z
                .string()
                .min(1, t("startDateRequired"))
                .refine((value) => value >= today, {
                    message: t("dayNoti")
                }),

            nationality: z.string().min(1, t("selectNationality")),

            adults: z.coerce.number().min(1, t("minimumOneAdult")),
            children: z.coerce.number(),

            category: z.array(z.string()).min(1, t("selectCategory")),

            remark: z.string().optional(),

            sgl: z.coerce.number().optional(),
            dbl: z.coerce.number().optional(),
            twn: z.coerce.number().optional(),
            tpl: z.coerce.number().optional(),

            listLocation: z.string().min(1, t("selectDestination")),

            bannerImg: z.any().optional(),

            country: z.string().optional(),
            city: z.string().optional(),
        });

    type SchemaType = zod.infer<typeof Schema>;

    const { user } = useUser();
    const { coData, coLoading } = useListCompanyOwner();
    const [nationalityCode, setNationalityCode] = useState("");

    const AGENT_HOST_OPTIONS = coData
        ? [
            {
                label: coData.strCompanyName,
                value: coData.strCompanyGUID,
            },
        ]
        : [];

    const { showToast } = useToastStore();

    const methods = useForm<SchemaType>({
        resolver: zodResolver(Schema) as any,
    });


    const { watch, setValue } = methods;

    const [sgl, dbl, twn, tpl] = watch([
        "sgl",
        "dbl",
        "twn",
        "tpl",
    ]);

    useEffect(() => {
        const total =
            Number(sgl || 0) +
            Number(dbl || 0) * 2 +
            Number(twn || 0) * 2 +
            Number(tpl || 0) * 3;

        setValue("adults", total);
    }, [sgl, dbl, twn, tpl, setValue]);

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

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
                message: t("tourNameExists"),
            });
            return;
        }

        if (locations.length === 0) {
            showToast("error", t("addDestination"));
            return;
        }

        const currentCountry = methods.getValues("country");
        const currentCity = methods.getValues("city");

        if (currentCountry && currentCity) {
            const confirmMissing = window.confirm(t("addDestination"));
            if (!confirmMissing) return;
        }

        const payload = {
            strCompanyGUID: user?.strCompanyGUID || "",
            strCompanyAgentHostGUID: data.agentHost,

            intLangID: null,
            strCountryGUID: data.nationality,

            intAdult: data.adults,
            intNoOfChild: data.children,

            intSGL: data.sgl,
            intDBL: data.dbl,
            intTWN: data.twn,
            intTPL: data.tpl,

            dtmDateFrom: new Date(data.dateStart).toISOString(),

            strServiceName: data.tourName,

            intNoOfDay: null,
            intPerPaxID: null,

            intCurrencyID: data.currency,

            strListEasiaCateID: data.category.join(","),

            strRemark: data.remark,

            strListLocation: buildListLocation(),
        };

        addNewTourCustomizedApi(payload, {
            onSuccess: async (res: any) => {
                showToast("success", t("customTourAddedSuccess"));

                const guid = res?.[0]?.[0]?.strTourCustomizedGUID;

                if (!guid) return;

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
                        tblsReturn: "[0]",
                    });

                    onClose();

                    const itemDetailTour = detail?.[0]?.[0];

                    const params = new URLSearchParams({
                        strTourCode: itemDetailTour?.strTourCode ?? "",
                    });

                    // const url = `http://localhost:5173/detail-tour?${params.toString()}`;
                    const url = `https://myagentmember.itourlink.com/detail-tour?${params.toString()}`;

                    window.open(
                        url,
                        "_blank"
                    );

                }, 500);
            },
            onError: () => {
                showToast("error", t("customTourAddedFailed"));
            },
        });
    };

    const onINValid: SubmitErrorHandler<SchemaType> = () => {
        showToast("error", t("checkInformationAgain"));
    };

    const onSubmit = handleSubmit(onValid, onINValid);

    useEffect(() => {
        if (coData) {
            methods.reset({
                ...methods.getValues(),
                agentHost: coData.strCompanyGUID,
            });
        }
    }, [coData]);

    const { ctData } = useListCity({
        strTableName: "MC02",
        strFeildSelect:
            "MC02_CountryCode AS code, MC02_CountryGUID AS intID,MC02_CountryName AS strName,MC02_CountryGUID AS id,MC02_CountryName AS text,MC02_CountryName AS strCountryName, MC02_CountryFlagIcon strCountryFlagIcon",
        strWhere: "WHERE (IsActive=1)  ORDER BY MC02_CountryName ASC ",
    });

    const COUNTRY_OPTIONS = ctData.map((item: any) => ({
        label: item.strName,
        value: item.id,
        flag: item.strCountryFlagIcon,
    }));

    const COUNTRY_OPTIONS_LIST = ctData.map((item: any) => ({
        label: item.strName,
        value: item.code,
        flag: item.strCountryFlagIcon,
    }));

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

    const watchedTourName = methods.watch("tourName");

    useEffect(() => {
        if (watchedTourName) {
            methods.clearErrors("tourName");
        }
    }, [watchedTourName]);

    const watchedNationality = methods.watch("nationality");

    useEffect(() => {
        if (watchedNationality) {
            methods.clearErrors("nationality");
        }
    }, [watchedNationality]);

    const handleAddLocation = () => {
        const countryVal = methods.getValues("country");
        const cityVal = methods.getValues("city");

        if (!countryVal) return showToast("error", t("selectCountry"));
        if (!cityVal) return showToast("error", t("selectCity"));
        if (!countryVal || !cityVal) return;

        setLocations((prev) => {
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

        methods.setValue("city", "");
        methods.clearErrors(["country", "city", "listLocation"]);
    };

    useEffect(() => {
        if (!watchedCountry) return;

        setNationalityCode(watchedCountry);
        methods.setValue("city", "");
    }, [watchedCountry]);

    const buildListLocation = () => {
        return (
            locations.map((x) => `${x.cityCode}!${x.nights}`).join("#") +
            (locations.length ? "#" : "")
        );
    };

    useEffect(() => {
        methods.setValue("listLocation", buildListLocation());
    }, [locations]);

    useEffect(() => {
        const initial = methods.getValues("listLocation") || "";
        if (!initial) return;

        const parsed = initial
            .split("#")
            .filter(Boolean)
            .map((item) => {
                const [cityCode, nights] = item.split("!");

                return {
                    countryCode: "",
                    cityCode: cityCode || "",
                    nights: Number(nights) || 1,
                };
            });

        if (parsed.length) setLocations(parsed);
    }, []);

    const watchedBannerImg = methods.watch("bannerImg");

    const [preview, setPreview] = useState(
        watchedBannerImg
            ? `${CONFIG.serverUrlSP}${String(watchedBannerImg).replace(/^\//, "")}`
            : ""
    );

    useEffect(() => {
        if (!watchedBannerImg) {
            setPreview("");
            return;
        }

        setPreview(
            `${CONFIG.serverUrlSP}${String(watchedBannerImg).replace(/^\//, "")}`
        );
    }, [watchedBannerImg]);

    const renderForm = (
        <div className="bg-white rounded-4xl p-8 border border-gray-100 shadow-sm space-y-8 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-end gap-2">
                    <div className="flex-1">
                        <Field.Select
                            name="agentHost"
                            label={{
                                text: t("agentHost"),
                                icon: <span className="text-red-500">*</span>,
                            }}
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
                    label={{
                        text: t("currency"),
                        icon: <span className="text-red-500">*</span>,
                    }}
                    options={CURRENCYS_OPTIONS}
                    placeholder={t("choice")}

                />

                <Field.SearchSelect
                    name="nationality"
                    label={{ text: t("nationality") }}
                    options={COUNTRY_OPTIONS}
                    placeholder={t("choice")}

                />

                <Field.Text
                    name="tourName"
                    label={{
                        text: t("tourName"),
                        icon: <span className="text-red-500">*</span>,
                    }}
                    placeholder={t("enterTourName")}
                />

                <Field.Text
                    name="dateStart"
                    type="date"
                    min={today}
                    label={{
                        text: t("dateStart"),
                        icon: <span className="text-red-500">*</span>,
                    }}
                />

                <Field.Text min={0} name="sgl" type="number" label={{ text: t("singleRoom") }} placeholder="0" />
                <Field.Text min={0} name="dbl" type="number" label={{ text: t("doubleRoom") }} placeholder="0" />
                <Field.Text min={0} name="twn" type="number" label={{ text: t("twinRoom") }} placeholder="0" />
                <Field.Text min={0} name="tpl" type="number" label={{ text: t("tripleRoom") }} placeholder="0" />

                <Field.Text
                    min={0}
                    name="adults"
                    type="number"
                    label={{
                        text: t("adults"),
                        icon: <span className="text-red-500">*</span>,
                    }}
                    placeholder="0"
                />

                <Field.Text
                    name="children"
                    type="number"
                    label={{ text: t("children") }}
                    placeholder="0"
                />

                <Field.MultiSelect
                    name="category"
                    label={{
                        text: t("category"),
                        icon: <span className="text-red-500">*</span>,
                    }}
                    options={STARS2_OPTIONS}
                />
            </div>

            <div className="space-y-2 border border-slate-200 rounded-2xl p-4">
                <label>{t("destinationList")} <span className="text-red-500">*</span></label>

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
                            placeholder={t("choice")}

                        />

                    </div>

                    <div className="flex-1">
                        <Field.SearchSelect
                            name="city"
                            options={CITY_OPTIONS}
                            disabled={!watchedCountry}
                            placeholder={t("choice")}

                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleAddLocation}
                        className="px-4 py-2 bg-[#004b91] text-white rounded-lg text-sm cursor-pointer hover:bg-[#003d75] transition"
                    >
                        {t("addDestinationButton")}
                    </button>
                </div>

                <div className="space-y-3">
                    {locations.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-800">
                                    {item.cityCode}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {item.countryCode}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">
                                    {t("nights")}
                                </span>

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
                <label>{t("remark")}</label>

                <div className="rounded-2xl overflow-hidden border border-gray-200">
                    <Field.Editor
                        name="remark"

                    />
                </div>
            </div>

            <BannerMediaField
                title={t("bannerImg")}
                value={preview}
                onChange={(path) => {
                    setPreview(`${CONFIG.serverUrlSP}${path.replace(/^\//, "")}`);

                    setValue("bannerImg", path);
                }}
            />

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
    );

    return (
        <div>
            <Form methods={methods} onSubmit={onSubmit}>
                {renderForm}
            </Form>
        </div>
    );
};

export default TourCustomizedPopup;
