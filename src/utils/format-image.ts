import { CONFIG } from "@/config-global";
import { baseUrlImage } from "@/locales";

export const getUrlImage = (path?: string) => {
  if (!path) return "/no-image.png"; 

  return `${baseUrlImage}/${encodeURI(path)}`;
};

export const getUrlImageUp = (path?: string) => {
  if (!path) return "/no-image.png"; 

  return `${CONFIG.serverUrlSP}${encodeURI(path)}`;
};