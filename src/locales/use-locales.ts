import dayjs from "dayjs";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { allLangs } from "./all-langs";
import { fallbackLng } from "./config-locales";

import type { LanguageValue } from "./config-locales";

// ----------------------------------------------------------------------

export function useTranslate(ns?: string) {
  const { t, i18n } = useTranslation(ns);

  const fallback = allLangs.filter((lang) => lang.value === fallbackLng)[0];

  const currentLang = allLangs.find(
    (lang) => lang.value === i18n.resolvedLanguage
  );

  const onChangeLang = useCallback(
    async (newLang: LanguageValue) => {
      i18n.changeLanguage(newLang);

      try {
        if (currentLang) {
          dayjs.locale(currentLang.adapterLocale);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [currentLang, i18n]
  );

  return {
    t,
    i18n,
    onChangeLang,
    currentLang: currentLang ?? fallback,
  };
}
