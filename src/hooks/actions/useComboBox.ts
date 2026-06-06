// hooks/actions/useCombobox.ts

import apiClient from "@/axios";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./query-keys";

export interface ComboboxItem {
  strValueFeild: string;
  strTextFeild: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface ComboboxByCodePayload {
  strCombocode?: string | null;
  strWhere?: string;
}

const fetchComboboxByCode = async (body: ComboboxByCodePayload) => {
  const res = await apiClient.post<ComboboxItem[]>(
    "public/GetComboboxByCode",
    body
  );
  return res.data;
};

export const useComboboxByCode = (
  strCombocode?: string,
  strWhere: string = ""
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMBOBOX_BY_CODE, strCombocode, strWhere],

    queryFn: () =>
      fetchComboboxByCode({
        strCombocode: strCombocode || "",
        strWhere,
      }),

    enabled: !!strCombocode,

    select: (data): SelectOption[] => {
  const rows = Array.isArray(data?.[0]) ? data[0] : Array.isArray(data) ? data : [];

  return rows
    .map((item: any) => ({
      value: String(item.strValueFeild ?? ""),
      label: String(item.strTextFeild ?? ""),
    }))
    .filter((item: SelectOption) => item.value && item.label);
},
  });
};