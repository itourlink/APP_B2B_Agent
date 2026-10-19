import { CONFIG } from "@/config-global";
import { baseUrlImage } from "@/locales";

export const getUrlImage = (path?: string | null) => {
  if (!path || typeof path !== "string" || path.trim() === "") return "/no-image.png";

  const trimmed = path.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return encodeURI(trimmed);
  }

  const cleanPath = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
  return `${baseUrlImage}/${encodeURI(cleanPath)}`;
};

export const getUrlImageUp = (path?: string | null) => {
  if (!path || typeof path !== "string" || path.trim() === "") return "/no-image.png";

  const trimmed = path.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return encodeURI(trimmed);
  }

  const base = CONFIG.serverUrlSP.endsWith("/")
    ? CONFIG.serverUrlSP
    : `${CONFIG.serverUrlSP}/`;
  const cleanPath = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
  return `${base}${encodeURI(cleanPath)}`;
};