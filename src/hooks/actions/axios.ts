import apiClient from "@/axios";
import type { IFiltersRequestParams } from "../interfaces/axios";
import type { AxiosInstance } from "axios";

interface Props {
  url: string;
  filterParams?: IFiltersRequestParams | null;
  client?: AxiosInstance;
}
export const getAxios = async ({
  url,
  filterParams,
  client = apiClient,
}: Props) => {
  const params = new URLSearchParams();

  if (filterParams) {
    const {
      page,
      limit,
      // type,
    } = filterParams;

    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));
    // if (type) params.append("type", type);
  }

  const baseUrl = filterParams ? `${url}?${params.toString()}` : url;

  const response = await client.get(baseUrl);
  return response.data;
};

export function catchAsync<T>(fn: () => Promise<T>): () => Promise<T> {
  return async () => {
    try {
      return await fn();
    } catch (err) {
      console.error("Error:", err);
      throw err;
    }
  };
}
