import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";

import { Field, Form } from "@/components/hook-form";
import { useToastStore } from "@/zustand/useToastStore";
import { useEffect, useState } from "react";
import PanelPopup from "@/components/popup/panel-popup";
import ChangeIdUser from "./change-id-user";
import ChangePasswordUser from "./change-password-user";
import { useUserStore } from "@/zustand/useUserStore";
import { useMutation } from "@tanstack/react-query";
import { updMemberInfoProfile } from "@/hooks/actions/useUser";
import BannerMediaField from "@/components/media/banner-media-field";
import { CONFIG } from "@/config-global";
import { useTranslate } from "@/locales";

const Schema = zod.object({
  avartarFile: zod.any().optional(),
  username: zod.string().default(""),
  title: zod.string().default(""),
  firstName: zod.string().default(""),
  lastName: zod.string().default(""),
  phone: zod.string().default(""),
  email: zod.string().email().or(zod.literal("")),
  position: zod.string().default(""),
  company: zod.string().default(""),
  skype: zod.string().default(""),
  facebook: zod.string().default(""),
  address: zod.string().default(""),
  bio: zod.string().default(""),
  signature: zod.string().default(""),
  language: zod.number().default(0),
  currency: zod.number().default(0),
});

type SchemaType = zod.infer<typeof Schema>;

const default_form_values: SchemaType = {
  avartarFile: undefined,
  username: "",
  title: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  position: "",
  company: "",
  skype: "",
  facebook: "",
  address: "",
  language: 0,
  currency: 0,
  bio: "",
  signature: "",
};

const InfoPerson = () => {
  const { t } = useTranslate("info");

  const titleOptions = [
    { label: t("titleMr"), value: "2" },
    { label: t("titleMs"), value: "3" },
    { label: t("titleMrs"), value: "4" },
  ];

  const languageOptions = [
    { label: t("selectOption"), value: "" },
    { label: t("languageVietnamese"), value: "18" },
    { label: t("languageEnglish"), value: "19" },
    { label: t("languageFrench"), value: "20" },
  ];

  const currencyOptions = [
    { label: t("selectOption"), value: "" },
    { label: t("currencyVnd"), value: "1" },
    { label: t("currencyUsd"), value: "2" },
    { label: t("currencyEur"), value: "3" },
    { label: t("currencyJpy"), value: "4" },
    { label: t("currencyRub"), value: "5" },
    { label: t("currencyAud"), value: "6" },
    { label: t("currencyHkd"), value: "7" },
    { label: t("currencyGbp"), value: "8" },
  ];

  const user = useUserStore((state) => state.user);

  const userLoading = useUserStore((state) => state.loading);

  const { showToast } = useToastStore();

  const { mutate: updMemberInfoProfileApi, isPending: isLoading } = useMutation({
    mutationFn: updMemberInfoProfile,
  });

  const [open, setOpen] = useState({
    changeId: false,
    changePw: false,
  });

  const methods = useForm<SchemaType>({
    resolver: zodResolver(Schema) as any,
    defaultValues: default_form_values,
  });

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (!user) return;

    reset({
      avartarFile: user?.strAvatar || undefined,
      username: "",
      title: "",
      firstName: user?.strFirstName || "",
      lastName: user?.strLastName || "",
      phone: user?.strCompanyPhone || "",
      email: user?.strEmail || "",
      position: "",
      company: "",
      skype: "",
      facebook: "",
      address: "",
      language: Number(user?.intLangID) || 0,
      currency: Number(user?.intCurrencyID) || 0,
      bio: "",
      signature: "",
    });
  }, [user, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      strMemberGUID: user?.strUserGUID,
      strFirstName: data.firstName,
      strLastName: data.lastName,
      strMobile: data.phone,
      strEmailWorking: data.email,
      strContactAddr: data.address,
      strAvatar: data.avartarFile,
      strJobTitle: data.position,
      strCompany: data.company,
      strFacebook: data.facebook,
      strSkype: data.skype,
      strRemark: data.bio,
      strSignature: data.signature,
      intSaluteID: Number(data.title),
      intLangID: Number(data.language),
      intCurrencyID: Number(data.currency),
    };

    updMemberInfoProfileApi(payload, {
      onSuccess: () => {
        showToast("success", t("updateSuccess"));
      },
      onError: () => {
        showToast("error", t("updateError"));
      },
    });
  });

  const [preview, setPreview] = useState(
    user?.strAvatar
      ? `${CONFIG.serverUrlSP}${user.strAvatar.replace(/^\//, "")}`
      : ""
  );

  if (userLoading) {
    return (
      <div className="w-full flex justify-center items-center py-10">
        {t("loadingData")}
      </div>
    );
  }

  return (
    <div className="">
      <Form methods={methods} onSubmit={onSubmit}>
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
          <BannerMediaField
            title={t("avatar")}
            value={preview}
            onChange={(path) => {
              setPreview(`${CONFIG.serverUrlSP}${path.replace(/^\//, "")}`);

              setValue("avartarFile", path);
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
            <Field.Select
              name="title"
              label={{
                text: t("title"),
                icon: <span className="text-red-500">*</span>,
              }}
              options={titleOptions}
            />

            <Field.Text
              name="firstName"
              label={{
                text: t("firstName"),
                icon: <span className="text-red-500">*</span>,
              }}
              placeholder={t("enterFirstName")}
            />

            <Field.Text
              name="lastName"
              label={{
                text: t("lastName"),
                icon: <span className="text-red-500">*</span>,
              }}
              placeholder={t("enterLastName")}
            />

            <Field.Text
              name="phone"
              label={{
                text: t("phone"),
                icon: <span className="text-red-500">*</span>,
              }}
              placeholder={t("enterPhone")}
            />

            <Field.Text
              name="email"
              label={{
                text: t("email"),
                icon: <span className="text-red-500">*</span>,
              }}
              placeholder={t("enterEmail")}
            />

            <div />

            <Field.Text
              name="position"
              label={{ text: t("position") }}
              placeholder={t("enterPosition")}
            />

            <Field.Text
              name="company"
              label={{ text: t("company") }}
              placeholder={t("enterCompany")}
            />

            <Field.Text
              name="skype"
              label={{ text: t("skype") }}
              placeholder={t("enterSkype")}
            />

            <Field.Text
              name="facebook"
              label={{ text: t("facebook") }}
              placeholder={t("enterFacebook")}
            />

            <Field.Text
              name="address"
              label={{ text: t("address") }}
              placeholder={t("enterAddress")}
            />

            <Field.Select
              name="language"
              label={{
                text: t("language"),
                icon: <span className="text-red-500">*</span>,
              }}
              options={languageOptions}
            />

            <Field.Select
              name="currency"
              label={{
                text: t("currency"),
                icon: <span className="text-red-500">*</span>,
              }}
              options={currencyOptions}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              {t("bio")}
            </label>
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <Field.Editor name="bio" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              {t("signature")}
            </label>
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <Field.Editor name="signature" />
            </div>
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
      </Form>

      {open.changeId && (
        <PanelPopup
          title={t("changeUsername")}
          open={open.changeId}
          onClose={() => setOpen((prev) => ({ ...prev, changeId: false }))}
        >
          <ChangeIdUser />
        </PanelPopup>
      )}

      {open.changePw && (
        <PanelPopup
          title={t("changePassword")}
          open={open.changePw}
          onClose={() => setOpen((prev) => ({ ...prev, changePw: false }))}
        >
          <ChangePasswordUser
            onClose={() => setOpen((prev) => ({ ...prev, changePw: false }))}
          />
        </PanelPopup>
      )}
    </div>
  );
};

export default InfoPerson;
