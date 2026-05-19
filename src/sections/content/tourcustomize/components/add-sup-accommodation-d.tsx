import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";
import { useForm } from "react-hook-form";

import { Field, Form } from "@/components/hook-form";
import PanelPopup from "@/components/popup/panel-popup";
import { useTranslate } from "@/locales";

const schema = zod.object({
  day1: zod.array(zod.string()).default([]),
  day2: zod.array(zod.string()).default([]),
  enableDay1: zod.boolean().default(true),
  enableDay2: zod.boolean().default(false),
  selectAll: zod.boolean().default(false),
});

type SchemaType = zod.infer<typeof schema>;

const AddSupAccommodationD = ({ open, onClose }: any) => {
  const { t } = useTranslate("tourcustomize");

  const timeOptions = [
    { label: t("morning"), value: "Morning" },
    { label: t("noon"), value: "Noon" },
    { label: t("afternoon"), value: "Afternoon" },
    { label: t("evening"), value: "Evening" },
    { label: t("night"), value: "Night" },
  ];

  const methods = useForm<SchemaType>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      day1: ["Night"],
      day2: [],
      enableDay1: true,
      enableDay2: false,
      selectAll: false,
    },
  });

  const { handleSubmit, watch, setValue } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log("DATA", data);
  });

  const handleCheckboxGroup = (fieldName: "day1" | "day2", value: string) => {
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

    const allValues = timeOptions.map((item) => item.value);

    if (checked) {
      setValue("day1", allValues);
      setValue("day2", allValues);
    } else {
      setValue("day1", []);
      setValue("day2", []);
    }
  };

  return (
    <PanelPopup open={open} onClose={onClose} title="" className="w-[980px]">
      <Form methods={methods} onSubmit={onSubmit}>
        <div className="overflow-hidden border border-gray-200">
          <div className="border-b p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-[15px] font-bold uppercase leading-6 text-[#0b4a8b]">
                  {t("sampleHotelName")}; {t("sampleVillaSuperior")}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {t("sampleTravelCompany")}
                </p>
              </div>

              <span className="text-[30px] font-bold leading-none text-[#f28c28]">
                $21.6
              </span>
            </div>
          </div>

          <div className="space-y-5 p-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Field.Check name="enableDay1" />

                <span className="text-[16px] font-medium">
                  {t("dayWithNumber", { number: 1 })}
                </span>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-2 pl-6">
                {timeOptions.map((item) => {
                  const checked = watch("day1")?.includes(item.value);

                  return (
                    <label
                      key={item.value}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleCheckboxGroup("day1", item.value)}
                        className="h-4 w-4 accent-[#0b4a8b]"
                      />

                      <span className="text-[15px]">{item.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <Field.Check name="enableDay2" />

                <span className="text-[16px] font-medium">
                  {t("dayWithNumber", { number: 2 })}
                </span>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-2 pl-6">
                {timeOptions.map((item) => {
                  const checked = watch("day2")?.includes(item.value);

                  return (
                    <label
                      key={item.value}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleCheckboxGroup("day2", item.value)}
                        className="h-4 w-4 accent-[#0b4a8b]"
                      />

                      <span className="text-[15px]">{item.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={watch("selectAll")}
                onChange={(event) => handleSelectAll(event.target.checked)}
                className="h-4 w-4 accent-[#0b4a8b]"
              />

              <span className="text-[16px] font-medium">{t("selectAll")}</span>
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

export default AddSupAccommodationD;
