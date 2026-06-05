import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { SendHorizontal } from "lucide-react";

import { Field, Form } from "@/components/hook-form";
import { useUser } from "@/hooks/actions/useAuth";
import {
  useGetContentTourCustomizedForSendMail,
  useGetSendMail,
  useUpdTourCustomizedForSent,
} from "@/hooks/actions/useMail";
import { useToastStore } from "@/zustand/useToastStore";
import { useTranslation } from "react-i18next";

type EmailTourCustomizeProps = {
  open: boolean;
  strTourCustomizedGUID: string;
   onClose: () => void;
};

type EmailTourCustomizeFormValues = {
  recipient: string;
  subject: string;
  content: string;
};


const EmailTourCustomize = ({
  open,
  strTourCustomizedGUID,
    onClose,
}: EmailTourCustomizeProps) => {
  const { t } = useTranslation("tourcustomize")
  const { user } = useUser();
  const { showToast } = useToastStore();

  const methods = useForm<EmailTourCustomizeFormValues>({
    defaultValues: {
      recipient: "",
      subject: "",
      content: "",
    },
  });

  const {
    register,
    setValue,
    handleSubmit,

    formState: { errors },
  } = methods;

  const { mediaData, mediaLoading, mediaError } =
    useGetContentTourCustomizedForSendMail(
      open ? strTourCustomizedGUID : undefined,
    );

  const { mutate: sendMail, isPending } = useGetSendMail();
  const { mutate: updateSent } = useUpdTourCustomizedForSent();
  const senderEmail = useMemo(
    () => user?.strEmail || user?.strEmailWorking || "agent.test@gmail.com",
    [user?.strEmail, user?.strEmailWorking],
  );


  useEffect(() => {
    if (!mediaData) return;

    // Nếu mediaData là { data: [...] } thì lấy mediaData.data
    // Nếu mediaData đã là [...] thì lấy trực tiếp mediaData
    const responseData = Array.isArray(mediaData) ? mediaData : mediaData?.data;

    if (!Array.isArray(responseData)) return;

    const emailConfig = responseData?.[0]?.[0];
    const htmlRows = responseData?.[1] || [];

    const subject = emailConfig?.strMailTitle || "";

  

    const content = htmlRows
      .slice()
      .sort((a: any, b: any) => Number(a.intOrder) - Number(b.intOrder))
      .map((item: any) => item.strHTML || "")
      .join("")
      .replace(
        /<table([^>]*)>/g,
        `<table style="width:100%; border-collapse:collapse; table-layout:fixed;">`,
      )
      .replace(
        /<td style="text-align:center;width:10%"><b>Day<\/b><\/td>/g,
        `<td style="width:20%; text-align:center; padding:12px; border:1px solid #d1d5db;"><b>Day</b></td>`,
      )
      .replace(
        /<td style="text-align:center"><b>Hotel \/ Train \/ Boat<\/b><\/td>/g,
        `<td style="width:35%; text-align:center; padding:12px; border:1px solid #d1d5db;"><b>Hotel / Train / Boat</b></td>`,
      )
      .replace(
        /<td style="text-align:center"><b>Tour\/Module<\/b><\/td>/g,
        `<td style="width:30%; text-align:center; padding:12px; border:1px solid #d1d5db;"><b>Tour/Module</b></td>`,
      )
      .replace(
        /<td style="text-align:center"><b>Other<\/b><\/td>/g,
        `<td style="width:15%; text-align:center; padding:12px; border:1px solid #d1d5db;"><b>Other</b></td>`,
      )
      .replace(
        /<td style="vertical-align:top;background:#f1f1f1">/g,
        `<td style="vertical-align:top; background:#f8fafc; padding:14px 12px; border:1px solid #d1d5db;">`,
      )
      .replace(
        /<td style="vertical-align:top;">/g,
        `<td style="vertical-align:top; padding:14px 12px; border:1px solid #d1d5db;">`,
      );

    setValue("subject", subject);
    setValue("content", content);
  }, [mediaData, setValue]);


  const onSubmit = handleSubmit((data) => {
    if (!data.recipient) {
      showToast("error", t("recipientRequired"));
      return;
    }

    if (!data.subject.trim()) {
      showToast("error", t("subjectRequired"));
      return;
    }

    if (!data.content.trim()) {
      showToast("error", t("contentRequired"));
      return;
    }

    sendMail(
      {
        strEmailsSendTo: data.recipient,
        strEmailsCC: senderEmail || null,
        strEmailsBCC: null,
        strAttachments: null,
        strSubject: data.subject,
        IsBodyHtml: true,
        strBody: data.content,
        intEmailConfigID: 1,
      },
      {
        onSuccess: () => {
          updateSent({
        strTourCustomizedGUID,
            
          });

          showToast("success",t("sendEmailSuccess"));
           onClose();
        },
        onError: () => {
          showToast("error", t("sendEmailFailed"));
        },
      },
    );
  });

  if (mediaLoading) {
    return (
      <div className="p-5 text-sm text-gray-500">
       {t("loadingEmailContent")}
      </div>
    );
  }

  if (mediaError) {
    return (
      <div className="p-5 text-sm text-red-500">
      {t("emailContentLoadFailed")}
      </div>
    );
  }

  return (
    <Form methods={methods} onSubmit={onSubmit} className="space-y-5 p-5">
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          {t("sendTo")} <span className="text-red-500">*</span>
        </label>

        <input
          {...register("recipient", {
            required: t("recipientRequired"),
          })}
          placeholder={t("recipientPlaceholder")}
          className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm text-gray-700 outline-none transition focus:border-[#004b91]"
        />

        {errors.recipient && (
          <p className="mt-1 text-xs text-red-500">
            {String(errors.recipient.message)}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
         {t("sendFrom")}
        </label>

        <div className="flex min-h-11 items-center rounded-md border border-gray-300 bg-white px-3 py-2">
          <span className="inline-flex items-center rounded border border-gray-300 bg-gray-100 px-2 py-1 text-sm text-gray-700">
            {senderEmail}
          </span>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          {t("emailSubject")}<span className="text-red-500">*</span>
        </label>

        <input
          {...register("subject")}
          className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm text-gray-700 outline-none transition focus:border-[#004b91]"
        />

        {errors.subject && (
          <p className="mt-1 text-xs text-red-500">
            {String(errors.subject.message)}
          </p>
        )}
      </div>

      <div>
        <Field.Editor name="content" label={t("emailContent")} />
      </div>

      <div className="flex items-center justify-end border-t border-gray-200 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-[#004b91] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#003a70] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <SendHorizontal size={16} />
          {isPending ? "Đang gửi..." : "Gửi"}
        </button>
      </div>
    </Form>
  );
};

export default EmailTourCustomize;
