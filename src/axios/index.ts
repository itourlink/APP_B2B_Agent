import axios from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { ACCESS_TOKEN } from "@/utils/constants";

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  timeout: 60000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    const language = localStorage.getItem("i18nextLng") || "vi";

    config.headers["Accept-Language"] = language;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  async (error) => {
    if (error.response?.status === 401) {
      console.error("Phiên làm việc hết hạn hoặc không có quyền.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;