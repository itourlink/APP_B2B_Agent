import { baseUrlImage } from "@/locales";

export const getUrlImage = (path?: string) => {
  if (!path) return "/no-image.png"; 

  return `${baseUrlImage}/${encodeURI(path)}`;
};