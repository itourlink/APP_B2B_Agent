import { CONFIG } from "@/config-global";
import { baseUrlImage } from "@/locales";

export const getUrlImage = (path?: unknown) => {
  if (typeof path !== "string") {
    console.error("getUrlImage received non-string:", path);
    return "/no-image.png";
  }

  const encodedPath = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${baseUrlImage}/${encodedPath}`;
};

export const getUrlImageUp = (path?: string) => {
  if (!path) return "/no-image.png";

  return `${CONFIG.serverUrlSP}${encodeURI(path)}`;
};