import { useEffect } from "react";

import { Field, Form } from "@/components/hook-form";

import PanelPopup from "@/components/popup/panel-popup";

import { useListCity } from "@/hooks/actions/useCity";

import { addTourCustomizedDayDestination } from "@/hooks/actions/useUser";

import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { useToastStore } from "@/zustand/useToastStore";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";

interface Props {
    open: boolean;

    onClose: () => void;

    strUserGUID: string;

    strTourCustomizedDayGUID: string;
}

export const Schema = z.object({
    country: z.string().min(1),

    city: z.string().min(1),

    intNoOfDays: z.string().min(1),
});

type SchemaType = z.infer<
    typeof Schema
>;

const AddDestination = ({
    open,
    onClose,
    strUserGUID,
    strTourCustomizedDayGUID,
}: Props) => {
    const { showToast } =
        useToastStore();
    const queryClient = useQueryClient();

    // FORM
    const methods = useForm<SchemaType>(
        {
            resolver: zodResolver(
                Schema
            ) as any,

            defaultValues: {
                country: "",
                city: "",
                intNoOfDays: "1",
            },
        }
    );

    const {
        handleSubmit,
        watch,
        setValue,
        reset,
    } = methods;

    const watchedCountry =
        watch("country");

    // API
    const {
        mutateAsync:
        addTourCustomizedDayDestinationApi,
        isPending: isLoading,
    } = useMutation({
        mutationFn:
            addTourCustomizedDayDestination,
    });

    // COUNTRY
    const { ctData } = useListCity({
        strTableName: "MC02",

        strFeildSelect:
            "MC02_CountryCode AS code, MC02_CountryName AS strName",

        strWhere:
            "WHERE (IsActive=1) ORDER BY MC02_CountryName ASC",
    });

    const COUNTRY_OPTIONS_LIST =
        ctData.map((item: any) => ({
            label: item.strName,

            value: item.code,
        }));

    // CITY
    const { ctData: ntData } =
        useListCity({
            strTableName: "MC04",

            strFeildSelect:
                "MC04_CityCode AS strCityCode, MC04_CityName AS strCityName",

            strWhere: `WHERE IsActive=1
      AND MC04_CityCode LIKE '%${watchedCountry}%'
      ORDER BY MC04_CityName`,
        });

    const CITY_OPTIONS = ntData.map(
        (item: any) => ({
            label: item.strCityName,

            value: item.strCityCode,
        })
    );

    // RESET CITY WHEN CHANGE COUNTRY
    useEffect(() => {
        setValue("city", "");
    }, [watchedCountry]);


    // SUBMIT
    const onSubmit = handleSubmit(
        async (values) => {
            const payload = {
                strUserGUID,

                strTourCustomizedDayGUID,

                intNoOfDays:
                    values.intNoOfDays,

                strLocationCode:
                    values.city,
            };

            try {
                await addTourCustomizedDayDestinationApi(
                    payload
                );

                showToast(
                    "success",
                    "Add destination successfully"
                );
                queryClient.invalidateQueries({
                    queryKey: [
                        QUERY_KEYS.USER
                            .LIST_SERVICE_TOUR_CUSTOMIZED,
                    ],
                });
                reset();

                onClose();
            } catch (error) {
                showToast(
                    "error",
                    "Add destination failed"
                );
            }
        }
    );

    return (
        <PanelPopup
            open={open}
            onClose={onClose}
            title="Add Destination"
            className="w-[500px]"
        >
            <Form
                methods={methods}
                onSubmit={onSubmit}
            >
                <div className="space-y-4">
                    <div>
                        <div className="mb-1 text-sm font-medium">
                            Country
                        </div>

                        <Field.SearchSelect
                            name="country"
                            options={
                                COUNTRY_OPTIONS_LIST
                            }
                        />
                    </div>

                    <div>
                        <div className="mb-1 text-sm font-medium">
                            City
                        </div>

                        <Field.SearchSelect
                            name="city"
                            options={CITY_OPTIONS}
                            disabled={
                                !watchedCountry
                            }
                        />
                    </div>

                    <div>
                        <div className="mb-1 text-sm font-medium">
                            Nunber of Days
                        </div>
                        <div>
                            <Field.Select
                                name="intNoOfDays"
                                options={Array.from({ length: 10 }, (_, i) => ({
                                    label: `${i + 1}`,
                                    value: `${i + 1}`,
                                }))}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 rounded-lg bg-[#4a6fa5] hover:bg-[#3b5b7e] text-white disabled:opacity-50 cursor-pointer"
                        >
                            {isLoading
                                ? "Saving..."
                                : "Save"}
                        </button>
                    </div>
                </div>
            </Form>
        </PanelPopup>
    );
};

export default AddDestination;