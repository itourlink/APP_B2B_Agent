import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Copy,
  Play,
  SquarePen,
  Users,
  ChevronDown,
  X,
  Plus,
} from "lucide-react";

import PanelPopup from "@/components/popup/panel-popup";
import { useTranslate } from "@/locales";
import { useRouter } from "@/routes/hooks/use-router";
import { fDateTime } from "@/utils/format-time";
import { formatMoney } from "@/utils/format-number";
import { useToastStore } from "@/zustand/useToastStore";

import DetailTourHeaderPopup from "./detail-tour-header-popup";
import UpdatePriceMarkup from "./update-price-markup";
import DetailTourHeaderPopupVer from "./detail-tour-header-popup-ver";
import EmailTourCustomize from "./email/email-tourcustomize";
import PreviewPDF from "./preview/previewPDF";

interface HeaderProps {
  item?: any;
  onUpdate: () => void;
  isLocked?: boolean;
}

export const DetailTourHeader = ({ item, onUpdate, isLocked }: HeaderProps) => {
  const { t } = useTranslate("tourcustomize");
  const router = useRouter();
  const { showToast } = useToastStore();

  const [open, setOpen] = useState({
    update: false,
  });
  const [openCustomerPopup, setOpenCustomerPopup] = useState(false);
  const [openVerPopup, setOpenVerPopup] = useState(false);
  const [openEmailPopup, setOpenEmailPopup] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  return (
    <div
      className={
        isLocked
          ? "flex w-full items-center justify-between border-b border-gray-100 bg-white px-6 py-4 font-sans opacity-50 pointer-events-none transition-opacity"
          : "flex w-full items-center justify-between border-b border-gray-100 bg-white px-6 py-4 font-sans"
      }
    >
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="cursor-pointer">
          <ArrowLeft size={20} />
        </button>

        <div className="space-y-1">
          <div className="group relative inline-block">
            <button
              onClick={onUpdate}
              className="flex cursor-pointer items-center gap-2"
            >
              <h1 className="text-xl font-bold tracking-tight text-gray-800">
                {item?.strServiceName || t("noTourName")}
              </h1>
            </button>

            <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100">
              {t("clickToEdit")}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[13px] font-normal text-gray-500">
            <div className="flex items-center gap-1.5">
              <span># {item?.strTourCode || "---"}</span>
              <Copy
                onClick={() => {
                  navigator.clipboard.writeText(item?.strTourCode || "");
                  showToast("success", t("copyTourCodeSuccess"));
                }}
                size={14}
                className="cursor-pointer text-blue-400 hover:text-[#004b91]"
              />
            </div>

            <span className="text-gray-300">|</span>

            <div className="flex items-center font-medium text-gray-700">
              [
              <span className="mx-0.5 flex items-center text-[10px]">
                {item?.strEasiaCateName}
              </span>
              ]
            </div>

            <span className="text-gray-300">|</span>

            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>
                {fDateTime(item?.dtmDateFrom)} - {fDateTime(item?.dtmDateTo)}
              </span>
            </div>

            <span className="text-gray-300">|</span>

            <div className="flex items-center gap-1.5">
              <Users size={14} />
              <span>{item?.intTotalPax || 0}</span>
              <div className="group relative inline-flex">
                <button
                  onClick={() => setOpenCustomerPopup(true)}
                  className="cursor-pointer text-blue-400 hover:text-[#004b91]"
                >
                  <SquarePen size={12} />
                </button>
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100">
                  {t("updateListCustomer")}
                </span>
              </div>
            </div>
            <span className="text-gray-300">|</span>

            <div className="flex items-center gap-1 text-[13px] text-gray-700">
              <span className="font-medium">Ver</span>

              <button
                type="button"
                onClick={() => setOpenVerPopup(true)}
                className="cursor-pointer flex items-center gap-0.5 rounded px-1 text-gray-700 hover:bg-gray-100 hover:text-[#004b91]"
              >
                <Plus size={12} />
              </button>

              <button
                type="button"
                onClick={() => setOpenVerPopup(true)}
                className="cursor-pointer flex items-center gap-0.5 rounded px-1 text-gray-700 hover:bg-gray-100 hover:text-[#004b91]"
              >
                <span className="font-semibold">{item?.intVersion || 1}</span>
                <ChevronDown size={13} />
              </button>

              <button
                type="button"
                className="cursor-pointer rounded px-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
              >
                <X size={12} />
              </button>
            </div>

            <DetailTourHeaderPopupVer
              open={openVerPopup}
              onClose={() => setOpenVerPopup(false)}
              tourCustomizedGUID={item?.strTourCustomizedGUID || ""}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="mr-2 text-right">
          <div className="text-2xl font-normal tracking-tight text-gray-800 underline decoration-gray-300 underline-offset-4">
            {formatMoney(item?.dblTotalMarkupPrice)}
          </div>
          <div className="group relative inline-block">
            <button
              onClick={() => setOpen((prev) => ({ ...prev, update: true }))}
              className="flex cursor-pointer items-center justify-end gap-1 text-[13px] font-normal text-green-500"
            >
              <span className="text-[10px]">↑</span>
              {item?.dblMarkupService}(%){" "}
              {item?.intMarkupTypeID === 2 && <span>({t("fixed")})</span>}
            </button>

            <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100">
              {t("clickToUpdate")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpenEmailPopup(true)}
            className="cursor-pointer rounded-lg border border-blue-400 px-4 py-2 text-[13px] font-bold uppercase text-[#004b91] transition-all hover:bg-blue-50"
          >
            {t("sendEmail")}
          </button>

          {/* <button className="cursor-pointer rounded-lg bg-[#004b91] px-5 py-2 text-[13px] font-bold uppercase text-white transition-all hover:bg-[#003c73]">
            {t("book")}
          </button> */}

          <button className="cursor-pointer flex items-center gap-2 rounded-lg bg-[#ff9800] px-4 py-2 text-[13px] font-bold uppercase text-white transition-all hover:bg-[#f57c00]">
            <Play size={14} className="fill-current" />
            {t("preview")}
          </button>

          <button
            type="button"
            onClick={() => setOpenPreview(true)}
            className="cursor-pointer flex items-center gap-2 rounded-lg bg-[#1e5bab] px-4 py-2 text-[13px] font-bold uppercase text-white transition-all hover:bg-[#154a8a]"
          >
            <Play size={14} className="fill-current" />
            {t("previewPdfDemo")}
          </button>
        </div>
      </div>

      {open.update && (
        <PanelPopup
          title={t("updatePrice")}
          open={open.update}
          onClose={() => setOpen((prev) => ({ ...prev, update: false }))}
        >
          <UpdatePriceMarkup
            item={item}
            onClose={() => setOpen((prev) => ({ ...prev, update: false }))}
          />
        </PanelPopup>
      )}

      <PanelPopup
        title={t("configCustomerInformation")}
        open={openCustomerPopup}
        onClose={() => setOpenCustomerPopup(false)}
        className="w-[950px]"
      >
        <DetailTourHeaderPopup
          strTourCustomizedGUID={item?.strTourCustomizedGUID || ""}
          strTourCode={item?.strTourCode || ""}
        />
      </PanelPopup>

      <PanelPopup
        title={t("sendEmail")}
        open={openEmailPopup}
        onClose={() => setOpenEmailPopup(false)}
        className="w-[950px]"
      >
        <EmailTourCustomize
          open={openEmailPopup}
          strTourCustomizedGUID={item?.strTourCustomizedGUID || ""}
          onClose={() => setOpenEmailPopup(false)}
        />
      </PanelPopup>

      <PanelPopup
        title={t("preview")}
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        className="max-w-[100vw]"
        bodyClassName="p-0"
      >
        <PreviewPDF strTourCustomizedGUID={item?.strTourCustomizedGUID} />
      </PanelPopup>
    </div>
  );
};
