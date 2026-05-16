import { Field, Form } from "@/components/hook-form";
import { useListSQLData } from "@/hooks/actions/useSql";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "@/hooks/actions/useAuth";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { AddTourCustomizedPriceItemByManual } from "@/hooks/actions/useUser";
import { useToastStore } from "@/zustand/useToastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";




interface AddManualProps {
    selectedDay?: {
        strCountryCode?: unknown;
        strLocationCode?: unknown;
        strListLocation?: unknown;
    } | null;
    onClose?: () => void;
    strTourCustomizedDayGUID?: string;
}

interface ManualFormValues {
    countryCode: string;
    regionCode: string;
    cityCode: string;
    unitId: string;
    serviceName: string;
    supplierName: string;
    currencyId: string;
    price: string;
    sglSupPrice: string;
    tplRedPrice: string;
    remark: string;
}

interface SelectOption {
    label: string;
    value: string;
}

const getStringValue = (value: unknown) => {
    return typeof value === "string" ? value.trim() : "";
};

const getFirstLocationToken = (value: unknown) => {
    const normalizedValue = getStringValue(value);

    if (!normalizedValue) return "";

    const firstLocationToken =
        normalizedValue.split("#").filter(Boolean)[0] ?? "";

    return firstLocationToken.split("!")[0]?.trim() ?? "";
};

const resolveInitialCountryCode = (
    selectedDay: AddManualProps["selectedDay"],
    countryOptions: SelectOption[]
) => {
    const candidateCountryCodes = [
        getStringValue(selectedDay?.strCountryCode),
        getStringValue(selectedDay?.strLocationCode),
        getFirstLocationToken(selectedDay?.strListLocation),
    ].filter(Boolean);

    for (const candidateCountryCode of candidateCountryCodes) {
        const matchedCountry = countryOptions.find(
            (country) => country.value === candidateCountryCode
        );

        if (matchedCountry) {
            return matchedCountry.value;
        }
    }

    return "";
};

const AddManual = ({ selectedDay, onClose, strTourCustomizedDayGUID }: AddManualProps) => {
    const [isOvernight, setIsOvernight] = useState(false);
    const [isPriceByRoom, setIsPriceByRoom] = useState(false);

    const methods = useForm<ManualFormValues>({
        defaultValues: {
            countryCode: "",
            regionCode: "",
            cityCode: "",
            unitId: "",
            serviceName: "",
            supplierName: "",
            currencyId: "1",
            price: "",
            sglSupPrice: "",
            tplRedPrice: "",
            remark: "",
        },
    });

    const countryCode = methods.watch("countryCode");
    const regionCode = methods.watch("regionCode");

    const { ctData: countryData = [], ctLoading: isCountryLoading } =
        useListSQLData({
            strTableName: "MC02",
            strFeildSelect:
                "MC02_CountryCode AS code, MC02_CountryName AS strName",
            strWhere: "WHERE (IsActive=1) ORDER BY MC02_CountryName ASC",
            parameters: -1,
            enabled: true,
        });

    const { ctData: regionData = [], ctLoading: isRegionLoading } =
        useListSQLData({
            strTableName: "MC03",
            strFeildSelect:
                "MC03_RegionCode AS strRegionCode, MC03_RegionName AS strRegionName",
            strWhere: countryCode
                ? `WHERE IsActive=1
AND MC03_RegionCode LIKE '%${countryCode}%'
AND MC03.IsActive=1
ORDER BY MC03_RegionName`
                : "",
            parameters: -1,
            enabled: !!countryCode,
        });

    const { ctData: cityData = [], ctLoading: isCityLoading } = useListSQLData({
        strTableName: "MC04",
        strFeildSelect:
            "MC04_CityCode AS strCityCode, MC04_CityName AS strCityName",
        strWhere: regionCode
            ? `WHERE IsActive=1
AND MC04_CityCode LIKE '%${regionCode}%'
AND MC04.IsActive=1
ORDER BY MC04_CityName`
            : "",
        parameters: -1,
        enabled: !!regionCode,
    });

    const countryOptions = useMemo<SelectOption[]>(
        () =>
            countryData
                .map((item: any) => ({
                    label: String(item?.strName ?? ""),
                    value: String(item?.code ?? ""),
                }))
                .filter((item: SelectOption) => Boolean(item.label && item.value)),
        [countryData]
    );

    const regionOptions = useMemo<SelectOption[]>(
        () =>
            regionData
                .map((item: any) => ({
                    label: String(item?.strRegionName ?? ""),
                    value: String(item?.strRegionCode ?? ""),
                }))
                .filter((item: SelectOption) => Boolean(item.label && item.value)),
        [regionData]
    );

    const cityOptions = useMemo<SelectOption[]>(
        () =>
            cityData
                .map((item: any) => ({
                    label: String(item?.strCityName ?? ""),
                    value: String(item?.strCityCode ?? ""),
                }))
                .filter((item: SelectOption) => Boolean(item.label && item.value)),
        [cityData]
    );

    useEffect(() => {
        if (!countryOptions.length) return;

        const currentCountryCode = methods.getValues("countryCode");

        if (currentCountryCode) return;

        const initialCountryCode = resolveInitialCountryCode(
            selectedDay,
            countryOptions
        );

        if (!initialCountryCode) return;

        methods.setValue("countryCode", initialCountryCode);
    }, [countryOptions, methods, selectedDay]);

    useEffect(() => {
        methods.setValue("regionCode", "");
        methods.setValue("cityCode", "");
    }, [countryCode, methods]);

    useEffect(() => {
        methods.setValue("cityCode", "");
    }, [regionCode, methods]);

    useEffect(() => {
        if (!isOvernight) {
            setIsPriceByRoom(false);
        }
    }, [isOvernight]);


    const { user } = useUser();
    const { showToast } = useToastStore();
    const queryClient = useQueryClient();

    const {
        mutateAsync: AddTourCustomizedPriceItemByManualApi,
        isPending: isSaving,
    } = useMutation({
        mutationFn: AddTourCustomizedPriceItemByManual,
    });
    const onSubmit = methods.handleSubmit(async (values) => {
        if (!user?.strUserGUID) {
            showToast("error", "Khong tim thay user");
            return;
        }

        if (!values.countryCode) {
            showToast("error", "Vui long chon country");
            return;
        }

        if (!values.serviceName.trim()) {
            showToast("error", "Vui long nhap service name");
            return;
        }

        if (!values.supplierName.trim()) {
            showToast("error", "Vui long nhap supplier name");
            return;
        }
        const payload = {
            strTourCustomizedDayGUID,

            strLocationCode:
                values.cityCode ||
                values.regionCode ||
                values.countryCode,

            intPerPaxID: String(values.unitId),

            strServiceName: values.serviceName.trim(),

            strSupplierName: values.supplierName.trim(),

            dblPrice: String(values.price || "0"),

            dblSglSupPrice: isOvernight
                ? String(values.sglSupPrice || "0")
                : "0",

            dblTplRedPrice: isOvernight
                ? String(values.tplRedPrice || "0")
                : "0",

            IsForSleep: isOvernight,

            intCurrencyID: String(values.currencyId),

            strRemark: values.remark?.trim() || "",

            IsPriceByRoom: isOvernight
                ? isPriceByRoom
                : false,
        };

        try {
            await AddTourCustomizedPriceItemByManualApi(payload);

            showToast("success", "Add manual successfully");

            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.USER.LIST_SERVICE_TOUR_CUSTOMIZED],
            });

            methods.reset({
                countryCode: values.countryCode,
                regionCode: "",
                cityCode: "",
                unitId: "1",
                serviceName: "",
                supplierName: "",
                currencyId: "1",
                price: "0",
                sglSupPrice: "0",
                tplRedPrice: "0",
                remark: "",
            });

            setIsOvernight(false);
            setIsPriceByRoom(false);
            onClose?.();
        } catch (error) {
            showToast("error", "Add manual failed");
        }
    });
    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <div className="w-full font-sans">
                <div className="p-1">
                    <div className="grid grid-cols-4 gap-x-6 gap-y-5">
                        <div className="col-span-3">
                            <label className="mb-1 block text-sm text-gray-700">
                                Location <span className="text-red-500">*</span>
                            </label>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <Field.SearchSelect
                                    name="countryCode"
                                    options={countryOptions}
                                    placeholder={
                                        isCountryLoading
                                            ? "Loading countries..."
                                            : "-- Chon Quoc gia/Country --"
                                    }
                                />

                                <Field.SearchSelect
                                    name="regionCode"
                                    options={regionOptions}
                                    disabled={!countryCode}
                                    placeholder={
                                        isRegionLoading
                                            ? "Loading regions..."
                                            : "-- Chon Vung/Region --"
                                    }
                                />

                                <Field.SearchSelect
                                    name="cityCode"
                                    options={cityOptions}
                                    disabled={!regionCode}
                                    placeholder={
                                        isCityLoading
                                            ? "Loading cities..."
                                            : "-- Chon Dia danh/City --"
                                    }
                                />
                            </div>
                        </div>

                        <div className="col-span-1">
                            <label className="mb-1 block text-sm text-gray-700">
                                Unit <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...methods.register("unitId")}
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="1">Per Pax</option>
                                <option value="2">Per Group</option>
                            </select>
                        </div>

                        <div className="col-span-3">
                            <label className="mb-1 block text-sm text-gray-700">
                                Service name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...methods.register("serviceName")}
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="mb-1 block text-sm text-gray-700">
                                Tên nhà cung cấp <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...methods.register("supplierName")}
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div className="col-span-4 -mt-2">
                            <div className="flex items-start gap-8">
                                <div>
                                    <label className="mb-2 block text-sm text-gray-700">
                                        Is Overnight
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setIsOvernight((prev) => !prev)}
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isOvernight ? "bg-[#3b82f6]" : "bg-gray-300"
                                            }`}
                                    >
                                        <span
                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isOvernight ? "translate-x-5" : "translate-x-0"
                                                }`}
                                        />
                                    </button>
                                </div>

                                {isOvernight && (
                                    <div>
                                        <label className="mb-2 block text-sm text-gray-700">
                                            Is Price By Room
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setIsPriceByRoom((prev) => !prev)}
                                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isPriceByRoom ? "bg-[#3b82f6]" : "bg-gray-300"
                                                }`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isPriceByRoom ? "translate-x-5" : "translate-x-0"
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="col-span-4 mt-1">
                            <label className="mb-1 block text-sm text-gray-700">
                                Mô tả
                            </label>
                            <textarea
                                {...methods.register("remark")}
                                rows={3}
                                className="block w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mt-6 rounded-3xl border border-gray-300 p-5">
                        <h3 className="mb-5 text-[18px] font-semibold text-gray-800">
                            Price
                        </h3>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Currency
                                </label>
                                <select
                                    {...methods.register("currencyId")}
                                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                                    <option value="1">$ (USD : U.S Dollar)</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Don gia <span className="text-red-500">*</span>
                                </label>

                                <Field.Text
                                    name="price"
                                    type="number"
                                    placeholder="0"
                                    min={0}
                                />
                            </div>

                            {isOvernight && (
                                <>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            {isPriceByRoom ? "SGL" : "Sgl Sup"}
                                        </label>

                                        <Field.Text
                                            name="sglSupPrice"
                                            type="number"
                                            placeholder="0"
                                            min={0}
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            {isPriceByRoom ? "TPL" : "Tpl Reduction"}
                                        </label>

                                        <Field.Text
                                            name="tplRedPrice"
                                            type="number"
                                            placeholder="0"
                                            min={0}
                                        />
                                    </div>
                                </>
                            )}

                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="cursor-pointer rounded bg-[#004a99] px-10 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#003875] focus:outline-none"
                    >
                        {isSaving ? "Đang lưu..." : "Lưu"}
                    </button>
                </div>
            </div>
        </Form>
    );
};

export default AddManual;
