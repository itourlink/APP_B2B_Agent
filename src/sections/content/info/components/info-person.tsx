import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";

import { Field, Form } from "@/components/hook-form";
import { useToastStore } from "@/zustand/useToastStore";
import { useEffect, useState } from "react";
import PanelPopup from "@/components/popup/panel-popup";
import ChangeIdUser from "./change-id-user";
import ChangePasswordUser from "./change-password-user";
import {
  CURRENCYS_OPTIONS,
  LANGUES_OPTIONS,
  TITLES_OPTIONS,
} from "../../../../utils/oprion-data";
import { useUserStore } from "@/zustand/useUserStore";
import { getUrlImage } from "@/utils/format-image";
import { useMutation } from "@tanstack/react-query";
import { updMemberInfoProfile } from "@/hooks/actions/useUser";
import { isValidValue } from "@/utils/utilts";

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

const MAX_AVATAR_SIZE_MB = 2;
const MAX_AVATAR_SIZE_BYTES = MAX_AVATAR_SIZE_MB * 1024 * 1024;

const InfoPerson = () => {
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

  const [avatarPreview, setAvatarPreview] = useState("");

  const methods = useForm<SchemaType>({
    resolver: zodResolver(Schema) as any,
    defaultValues: default_form_values,
  });

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (!user) return;

    reset({
      avartarFile: undefined,
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

    setAvatarPreview(isValidValue(user?.strAvatar) ? getUrlImage(isValidValue(user?.strAvatar)) : "");
  }, [user, reset]);

  const avartarFile = watch("avartarFile");

  useEffect(() => {
    if (!avartarFile) return;
    if (!(avartarFile instanceof File)) return;

    const previewUrl = URL.createObjectURL(avartarFile);
    setAvatarPreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [avartarFile]);

  const validateAvatarFile = (file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return "Chỉ được chọn file ảnh";
    }

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      return `Ảnh phải nhỏ hơn ${MAX_AVATAR_SIZE_MB}MB`;
    }

    return null;
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    const errorMessage = validateAvatarFile(selectedFile);

    if (errorMessage) {
      showToast("error", errorMessage);
      setValue("avartarFile", undefined, { shouldValidate: true });
      event.target.value = "";
      return;
    }

    setValue("avartarFile", selectedFile, {
      shouldValidate: true,
      shouldDirty: true,
    });

    event.target.value = "";
  };



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
        showToast("success", "Cập nhật thành công");
      },
      onError: () => {
        showToast("error", "Cập nhật thất bại");
      },
    });
  });

  if (userLoading) {
    return (
      <div className="w-full flex justify-center items-center py-10">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="">
      <Form methods={methods} onSubmit={onSubmit}>
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
          <div className="flex gap-8 items-start">
            <div className="flex flex-col items-center gap-2">
              <input
                type="file"
                accept="image/*"
                id="avatar-upload"
                className="hidden"
                onChange={handleAvatarChange}
              />

              <label htmlFor="avatar-upload" className="cursor-pointer">
                <div
                  className={`overflow-hidden w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 ${avatarPreview ? "" : "border-dashed"
                    } border-gray-300 relative hover:opacity-80 transition`}
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="avatar-preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs text-center px-2">
                      Ảnh đại diện
                    </span>
                  )}
                </div>
              </label>
            </div>

            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-gray-500">Tên đăng nhập</p>
              <div className="flex items-center gap-4">
                <span className="font-bold text-lg">{isValidValue(user?.strFullName)}</span>
                <button
                  onClick={() =>
                    setOpen((prev) => ({ ...prev, changeId: true }))
                  }
                  type="button"
                  className="cursor-pointer text-blue-600 text-sm hover:underline"
                >
                  (Thay đổi)
                </button>
                <button
                  onClick={() =>
                    setOpen((prev) => ({ ...prev, changePw: true }))
                  }
                  type="button"
                  className="cursor-pointer text-blue-600 text-sm hover:underline"
                >
                  Đổi mật khẩu
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
            <Field.Select
              name="title"
              label={{
                text: "Danh xưng",
                icon: <span className="text-red-500">*</span>,
              }}
              options={TITLES_OPTIONS}
            />

            <Field.Text
              name="firstName"
              label={{
                text: "Tên",
                icon: <span className="text-red-500">*</span>,
              }}
              placeholder="Nhập tên"
            />

            <Field.Text
              name="lastName"
              label={{
                text: "Họ và đệm",
                icon: <span className="text-red-500">*</span>,
              }}
              placeholder="Nhập họ"
            />

            <Field.Text
              name="phone"
              label={{
                text: "Di động",
                icon: <span className="text-red-500">*</span>,
              }}
              placeholder="Nhập số điện thoại"
            />

            <Field.Text
              name="email"
              label={{
                text: "Email",
                icon: <span className="text-red-500">*</span>,
              }}
              placeholder="Nhập email"
            />

            <div />

            <Field.Text
              name="position"
              label={{ text: "Chức vụ" }}
              placeholder="Nhập chức vụ"
            />

            <Field.Text
              name="company"
              label={{ text: "Đơn vị công tác" }}
              placeholder="Tên công ty"
            />

            <Field.Text
              name="skype"
              label={{ text: "Skype" }}
              placeholder="Link skype"
            />

            <Field.Text
              name="facebook"
              label={{ text: "Facebook" }}
              placeholder="Link facebook"
            />

            <Field.Text
              name="address"
              label={{ text: "Địa chỉ" }}
              placeholder="Nhập địa chỉ"
            />

            <Field.Select
              name="language"
              label={{
                text: "Ngôn ngữ",
                icon: <span className="text-red-500">*</span>,
              }}
              options={LANGUES_OPTIONS}
            />

            <Field.Select
              name="currency"
              label={{
                text: "Đơn vị tiền tệ (ĐVTT)",
                icon: <span className="text-red-500">*</span>,
              }}
              options={CURRENCYS_OPTIONS}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              Giới thiệu bản thân
            </label>
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <Field.Editor name="bio" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Signature</label>
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
              {isSubmitting || isLoading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </div>
      </Form>

      {open.changeId && (
        <PanelPopup
          title="Thay đổi tên đăng nhập"
          open={open.changeId}
          onClose={() =>
            setOpen((prev) => ({ ...prev, changeId: false }))
          }
        >
          <ChangeIdUser />
        </PanelPopup>
      )}

      {open.changePw && (
        <PanelPopup
          title="Đổi mật khẩu"
          open={open.changePw}
          onClose={() =>
            setOpen((prev) => ({ ...prev, changePw: false }))
          }
        >
          <ChangePasswordUser
            onClose={() =>
              setOpen((prev) => ({ ...prev, changePw: false }))
            }
          />
        </PanelPopup>
      )}
    </div>
  );
};

export default InfoPerson;