import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useForm } from "react-hook-form";

import BannerMediaField from "@/components/media/banner-media-field";
import { Field, Form } from "@/components/hook-form";
import { CONFIG } from "@/config-global";
import { QUERY_KEYS } from "@/hooks/actions/query-keys";
import { useListCity } from "@/hooks/actions/useCity";
import { listCompanyOwner } from "@/hooks/actions/useCompanyOwner";
import { updTourCustomized } from "@/hooks/actions/useUser";
import { useDebounce } from "@/hooks/components/use-debounce";
import { useTranslate } from "@/locales";
import { AgentHostSelect } from "../../request/components/agent-host-select";
import { CURRENCYS_OPTIONS, STARS2_OPTIONS } from "@/utils/option-data";
import { useToastStore } from "@/zustand/useToastStore";
import { useUserStore } from "@/zustand/useUserStore";

type SchemaType = {
  agentHost: string;
  currency: string;
  tourName: string;
  dateStart: string;
  nationality: string;
  sgl: number;
  dbl: number;
  twn: number;
  tpl: number;
  adults: number;
  children: number;
  category: string;
  remark: string;
  linkImgBannerTCM?: any;
};

interface Props {
  onBack: () => void;
}

const UpdateTour = ({ onBack }: Props) => {
  const { t } = useTranslate("tourcustomize");
  const location = useLocation();
  const item = location.state?.item;
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  const schema = zod.object({
    agentHost: zod.string().min(1, t("agentHostRequired")),
    currency: zod.string().default(""),
    tourName: zod.string().min(1, t("tourNameRequired")),
    dateStart: zod.string().min(1, t("dateStartRequired")),
    nationality: zod.string().default(""),
    sgl: zod.number().default(0),
    dbl: zod.number().default(2),
    twn: zod.number().default(0),
    tpl: zod.number().default(0),
    adults: zod.number().min(1, t("adultMinimum")),
    children: zod.number().default(0),
    category: zod.string().min(1, t("categoryRequired")),
    remark: zod.string().default(""),
    linkImgBannerTCM: zod.any().optional(),
  });

  const methods = useForm<SchemaType>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      agentHost: item?.strCompanyAgentHostGUID,
      currency: String(item?.intCurrencyID ?? ""),
      tourName: item?.strServiceName,
      dateStart: item?.dtmDateFrom ? item.dtmDateFrom.split("T")[0] : "",
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
    if (!item) return;

    reset({
      agentHost: item?.strCompanyAgentHostGUID,
      currency: String(item?.intCurrencyID ?? ""),
      tourName: item?.strServiceName,
      dateStart: item?.dtmDateFrom ? item.dtmDateFrom.split("T")[0] : "",
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
            queryKey: [QUERY_KEYS.USER.LIST_SERVICE_TOUR_CUSTOMIZED],
          });

          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.USER.LIST_TOUR_CUSTOMIZED],
          });

          showToast("success", t("updateTourSuccess"));
          onBack();
        },
        onError: () => {
          showToast("error", t("updateTourError"));
        },
      });
    } catch (error) {
      showToast("error", t("unexpectedError"));
    }
  });

  const { ctData } = useListCity({
    strTableName: "MC02",
    strFeildSelect:
      "MC02_CountryCode AS code, MC02_CountryGUID AS intID,MC02_CountryName AS strName,MC02_CountryGUID AS id,MC02_CountryName AS text,MC02_CountryName AS strCountryName, MC02_CountryFlagIcon strCountryFlagIcon",
    strWhere: "WHERE (IsActive=1)  ORDER BY MC02_CountryName ASC ",
  });

  const countryOptions = ctData.map((country: any) => ({
    label: country.strName,
    value: country.id,
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
    isLoading,
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
        tblsReturn: "[0]",
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const lastDataArray = lastPage?.[0] || [];
      return lastDataArray.length < 10 ? undefined : allPages.length + 1;
    },
  });

  const listData = data?.pages.flatMap((page) => page[0]) ?? [];
  const [preview, setPreview] = useState(item?.LinkImgBannerTCM || "");

  return (
    <div className="mx-auto max-w-5xl p-3">
      <button
        type="button"
        onClick={() => onBack()}
        className="group flex cursor-pointer items-center gap-2 py-2 text-gray-500 transition-colors hover:text-[#004b91]"
      >
        <div className="rounded-full p-1.5 transition-colors group-hover:bg-blue-50">
          <ArrowLeft size={20} />
        </div>
        <span className="text-sm font-medium">{t("back")}</span>
      </button>

      <Form methods={methods} onSubmit={onSubmit}>
        <div className="space-y-8 rounded-4xl border border-gray-100 bg-white p-8 font-sans shadow-sm">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex items-end gap-2">
              <div className="flex-1">
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
              </div>
              <button
                type="button"
                className="mb-1 rounded-lg bg-gray-50 p-2.5 text-gray-400 hover:text-[#004b91]"
              >
                <RotateCcw size={18} />
              </button>
            </div>

            <Field.Select
              name="currency"
              label={{
                text: t("currencyUnit"),
                icon: <span className="text-red-500">*</span>,
              }}
              options={CURRENCYS_OPTIONS}
            />

            <Field.Text
              name="tourName"
              label={{
                text: t("tourNameLabel"),
                icon: <span className="text-red-500">*</span>,
              }}
              placeholder={t("enterTourName")}
            />

            <Field.Text
              name="dateStart"
              type="date"
              label={{
                text: t("dateStart"),
                icon: <span className="text-red-500">*</span>,
              }}
            />

            <Field.SearchSelect
              name="nationality"
              label={{ text: t("nationality") }}
              options={countryOptions}
            />

            <Field.Text name="sgl" type="number" label={{ text: "SGL" }} />
            <Field.Text name="dbl" type="number" label={{ text: "DBL" }} />
            <Field.Text name="twn" type="number" label={{ text: "TWN" }} />
            <Field.Text name="tpl" type="number" label={{ text: "TPL" }} />

            <Field.Text
              name="adults"
              type="number"
              label={{
                text: t("numberOfAdults"),
                icon: <span className="text-red-500">*</span>,
              }}
            />

            <Field.Text
              name="children"
              type="number"
              label={{ text: t("numberOfChildren") }}
            />

            <Field.Select
              name="category"
              label={{
                text: t("category"),
                icon: <span className="text-red-500">*</span>,
              }}
              options={STARS2_OPTIONS}
              placeholder={t("selectCategoryPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
              {t("remark")}
            </label>
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <Field.Editor name="remark" />
            </div>
          </div>

          <BannerMediaField
            title={t("bannerImage")}
            value={preview}
            onChange={(path) => {
              setPreview(`${CONFIG.serverUrlSP}${path.replace(/^\//, "")}`);
              setValue("linkImgBannerTCM", path);
            }}
          />

          <div className="flex justify-start border-t border-gray-50 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer rounded-xl bg-[#004b91] px-12 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-blue-100 transition-all active:scale-95 hover:bg-[#003d75] disabled:opacity-50"
            >
              {isSubmitting ? t("saving") : t("save")}
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default UpdateTour;
