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

// tránh redirect nhiều lần
let isRedirecting = false;

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error) => {
    const status = error.response?.status;

    if (status === 401) {
      const token = localStorage.getItem(ACCESS_TOKEN);

      if (token && !isRedirecting) {
        isRedirecting = true;

        localStorage.removeItem(ACCESS_TOKEN);

        window.location.href = `${import.meta.env.VITE_SERVER_URL}auth/login`;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;