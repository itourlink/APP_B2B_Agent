import { TranslateIcon } from "@/assets/icons/auth/translate-icon";
import { allLangs, useTranslate, type LanguageValue } from "@/locales";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

const fagsMock: Record<string, string> = {
  en: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1ec-1f1e7.svg",
  vi: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1fb-1f1f3.svg",
};

const listLangs = [
  {
    label: "English",
    value: "en",
    icon: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1ec-1f1e7.svg",
  },
  {
    label: "Tiếng Việt",
    value: "vi",
    icon: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1fb-1f1f3.svg",
  },
];

interface SelectLangsProps {
  handleEnter: () => void;
  handleLeave: () => void;
  open: boolean;
}

export const SelectLangs = ({
  handleEnter,
  handleLeave,
  open,
}: SelectLangsProps) => {
  const { onChangeLang } = useTranslate();

  const [selectedLang, setSelectedLang] = useState<{
    value: string;
    label: string;
    icon: string;
  }>({
    value: listLangs[0].value,
    label: listLangs[0].label,
    icon: listLangs[0].icon,
  });

  useEffect(() => {
    const currentLang = localStorage.getItem("i18nextLng") || allLangs[0].value;
    const selected = allLangs.find((lang) => lang.value === currentLang);
    if (selected) {
      setSelectedLang({
        value: selected.value,
        label: selected.label,
        icon: fagsMock[selected.value] || "",
      });
    }
  }, []);

  const handleLanguages = (newLang: string) => {
    const selected = allLangs.find((lang) => lang.value === newLang);
    if (selected) {
      setSelectedLang({
        value: selected.value,
        label: selected.label,
        icon: fagsMock[selected.value] || "",
      });
      onChangeLang(newLang as LanguageValue);
      localStorage.setItem("i18nextLng", newLang);
    }
  };
  return (
    <div
      onMouseEnter={() => {
        handleEnter();
      }}
      onMouseLeave={() => {
        handleLeave();
      }}
      className="flex w-10 h-10 relative justify-center items-center gap-2.5 rounded-lg border border-[rgba(64,64,64,0.5)]"
    >
      <TranslateIcon />
      <AnimatePresence>
        {open && (
          <motion.div
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute w-36 bg-white/20 backdrop-blur-md rounded-2xl right-0 top-[110%] overflow-hidden z-50 p-2 space-y-1 shadow-xl border border-[rgba(64,64,64,0.5)]"
          >
            {listLangs.map((lang) => (
              <div
                key={lang.value}
                onClick={() => {
                  handleLanguages(lang.value);
                  handleLeave();
                }}
                className={twMerge(
                  "flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors",
                  "hover:bg-[#4a6fa5] hover:text-white",
                  selectedLang.value === lang.value && "bg-[#4a6fa5] text-white ",
                  selectedLang.value !== lang.value && "text-black"
                )}
              >
                <img src={lang.icon} alt={lang.label} className="w-5 h-5" />
                <p className="">{lang.label}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
