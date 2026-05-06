// ---------------------------REQUEST---------------------------------

export const netWorkConfig = {
  refetchOnWindowFocus: false,
};
export interface IFiltersRequestParams {
  id?: string;
  page?: string | number;
  limit?: string | number;
}
export interface IParamsRequest {
  limit: number;
  page: number;
}
export interface AxiosErrorResponse {
  message?: string;
  status?: number;
  statusText?: string;
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
    statusText?: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  message: string | null;
  errors: any;
}
export interface ApiResponseUser<T> {
  data: T[][];
  isSuccess: boolean;
  message: string | null;
  errors: any;
}