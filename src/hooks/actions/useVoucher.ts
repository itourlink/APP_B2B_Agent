// import { useQuery } from "@tanstack/react-query";
// import { AxiosError } from "axios";
// import { IFiltersRequestParams, IPaginationMeta } from "../interfaces/axios";
// import { getAxios } from "./axios";
// import { IVoucher, IVoucherHistory } from "../interfaces/voucher";
// import apiClient from "@/axios";
// import { QUERY_KEYS } from "./query-keys";

// export function useGetListVoucher(filterParams?: IFiltersRequestParams) {
//   const { data, isLoading, error, isFetching, refetch } = useQuery<
//     IPaginationMeta<IVoucher>,
//     AxiosError
//   >({
//     queryKey: [QUERY_KEYS.VOUCHER.LIST_VOUCHER, filterParams],
//     queryFn: () =>
//       getAxios({
//         url: "voucher",
//         filterParams,
//       }),
//     staleTime: 0,
//   });

//   const isEmpty = Array.isArray(data?.result)
//     ? data.result.length === 0
//     : !data;

//   return {
//     voucher: data,
//     voucherLoading: isLoading,
//     voucherFetching: isFetching,
//     voucherError: error,
//     voucherEmpty: isEmpty,
//     voucherRefetch: refetch,
//   };
// }

// export const useGetVoucherHistory = (filterParams?: IFiltersRequestParams) => {
//   const { data, isLoading, error, isFetching, refetch } = useQuery<
//     IPaginationMeta<IVoucherHistory>,
//     AxiosError
//   >({
//     queryKey: [QUERY_KEYS.COMMISSION.COMMISSION_HISTORY, filterParams],
//     queryFn: () =>
//       getAxios({
//         url: "voucher/hist",
//         filterParams,
//       }),
//     staleTime: 0,
//   });

//   const isEmpty = Array.isArray(data) ? data.length === 0 : !data;

//   return {
//     history: data,
//     hisLoading: isLoading,
//     hisFetching: isFetching,
//     hisError: error,
//     hisEmpty: isEmpty,
//     hisRefetch: refetch,
//   };
// };
// export const transferVoucher = async (data: {
//   voucherId: string;
//   newOwnerEmail: string;
// }) => {
//   const res = await apiClient.post("voucher/transfer", data);
//   return res.data;
// };
// export const usedVoucher = async (data: { voucherId: string }) => {
//   const res = await apiClient.post("voucher/use-voucher-bogo", data);
//   return res.data;
// };
