import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { Field, Form } from "@/components/hook-form";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { updTourCustomizedForMarkup } from "@/hooks/actions/useUser";
import { useTranslate } from "@/locales";
import { useToastStore } from "@/zustand/useToastStore";

interface Props {
  item?: any;
  onClose: () => void;
}

type SchemaType = {
  intMarkupTypeID: string;
  dblMarkupService: string;
};

const UpdatePriceMarkup = ({ item, onClose }: Props) => {
  const { t } = useTranslate("tourcustomize");
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  const schema = zod.object({
    intMarkupTypeID: zod
      .string()
      .min(1, t("markupTypeRequired")),
    dblMarkupService: zod
      .string()
      .min(1, t("markupValueRequired")),
  });

  const defaultValues: SchemaType = {
    intMarkupTypeID: item?.intMarkupTypeID?.toString() || "1",
    dblMarkupService: item?.dblMarkupService?.toString() || "",
  };

  const methods = useForm<SchemaType>({
    resolver: zodResolver(schema),
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

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      strTourCustomizedGUID: item?.strTourCustomizedGUID,
      intMarkupTypeID: data?.intMarkupTypeID,
      dblMarkupService: data?.dblMarkupService,
    };

    updTourCustomizedForMarkupApi(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.USER.LIST_TOUR_CUSTOMIZED, item?.strTourCode],
        });

        showToast("success", t("updateSuccess"));
        onClose();
      },
      onError: () => {
        showToast("error", t("updateError"));
      },
    });
  });

  return (
    <div className="space-y-4">
      <div>
        <div className="font-semibold">{t("tourNameLabel")}:</div>
        <div>{item?.strServiceName}</div>
      </div>

      <div>
        <div className="font-semibold">{t("totalCostPrice")}:</div>
        <div>
          ₫{Number(item?.dblTotalMarkupPrice || 0).toLocaleString()}
        </div>
      </div>

      <Form methods={methods} onSubmit={onSubmit}>
        <div className="space-y-4">
          <Field.Text
            name="dblMarkupService"
            label={{
              text: t("markupValue"),
              icon: <span className="text-red-500">*</span>,
            }}
          />

          <Field.Select
            name="intMarkupTypeID"
            label={{
              text: t("markupType"),
            }}
            options={[
              {
                label: "%",
                value: "1",
              },
              {
                label: t("fixed"),
                value: "2",
              },
            ]}
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2"
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="cursor-pointer rounded-xl bg-[#004b91] px-12 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-blue-100 transition-all active:scale-95 hover:bg-[#003d75] disabled:opacity-50"
            >
              {isLoading ? t("updating") : t("update")}
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default UpdatePriceMarkup;
