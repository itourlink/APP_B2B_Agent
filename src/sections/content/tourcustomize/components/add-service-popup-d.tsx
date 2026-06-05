import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";
import { useForm } from "react-hook-form";

import { Field, Form } from "@/components/hook-form";
import PanelPopup from "@/components/popup/panel-popup";
import { useTranslate } from "@/locales";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddTourCustomizedPriceItemByManual } from "@/hooks/actions/useUser";
import { useToastStore } from "@/zustand/useToastStore";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";

const schema = zod.object({
  day2: zod.string().optional(),
  enableDay2: zod.boolean().default(true),
});

type SchemaType = zod.infer<typeof schema>;

const AddServicePopupD = ({ item, strTourCustomizedDayGUID, open, onClose }: any) => {

  const queryClient = useQueryClient();
  const { showToast } = useToastStore();
  const { t } = useTranslate("tourcustomize");

  const { mutate: AddTourCustomizedPriceItemByManualApi } = useMutation({
    mutationFn: AddTourCustomizedPriceItemByManual,
  });

  const timeOptions = [
    { label: t("morning"), value: "Morning" },
    { label: t("noon"), value: "Noon" },
    { label: t("afternoon"), value: "Afternoon" },
    { label: t("evening"), value: "Evening" },
    { label: t("night"), value: "Night" },
  ];

  const timeMapping: Record<string, number> = {
    Morning: 1,
    Noon: 2,
    Afternoon: 3,
    Evening: 4,
    Night: 5,
  };

  const methods = useForm<SchemaType>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      day2: "",
      enableDay2: true,
    },
  });

  const { handleSubmit, watch, setValue } = methods;

  const onSubmit = handleSubmit(async (data) => {

    const dayShift = data.day2
      ? `${strTourCustomizedDayGUID}!${timeMapping[data.day2]}#`
      : "";

    const payload = {
      strModuleItemGUID: null,
      strTourCustomizedDayGUID: dayShift,
      strSupplierMappingPriceGUID: null,
      strTourGUID: item?.strTourGUID,
      intEasiaCateID: item?.selectedStar,
      intMealTypeID: null,
      strLocationCode: null,
    };

    AddTourCustomizedPriceItemByManualApi(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            QUERY_KEYS.USER.LIST_SERVICE_TOUR_CUSTOMIZED,
          ],
        });

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.USER.LIST_TOUR_CUSTOMIZED],
        });

        onClose();

        showToast("success", t("addRequestSuccess"));
      },

      onError: () => {
        showToast("error", t("addRequestError"));
      },
    });
  });

  const handleCheckboxGroup = (value: string) => {
    const currentValue = watch("day2");

    setValue("day2", currentValue === value ? "" : value);
  };

  return (
    <PanelPopup open={open} onClose={onClose} title="" className="w-[980px]">
      <Form methods={methods} onSubmit={onSubmit}>
        <div className="overflow-hidden border border-gray-200">
          <div className="border-b p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-[15px] font-bold uppercase leading-6 text-[#0b4a8b]">
                  {item?.strServiceName}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  by {item?.strOwnerCompanyName}
                </p>
              </div>

              <span className="text-[30px] font-bold leading-none text-[#f28c28]">
                ${item?.dblPriceFrom}
              </span>
            </div>
          </div>

          <div className="space-y-5 p-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Field.Check name="enableDay2" />

                <span className="text-[16px] font-medium">
                  {t("dayWithNumber", { number: 2 })}
                </span>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-2 pl-6">
                {timeOptions.map((item) => {
                 const checked = watch("day2") === item.value;

                  return (
                    <label
                      key={item.value}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleCheckboxGroup(item.value)}
                        className="h-4 w-4 accent-[#0b4a8b]"
                      />

                      <span className="text-[15px]">{item.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="cursor-pointer rounded-md bg-[#0b4a8b] px-5 py-2 text-white hover:bg-[#083765]"
              >
                {t("addService")}
              </button>
            </div>
          </div>
        </div>
      </Form>
    </PanelPopup>
  );
};

export default AddServicePopupD;