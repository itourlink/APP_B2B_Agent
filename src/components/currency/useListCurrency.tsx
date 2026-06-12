import { useMemo } from "react";
import { useComboboxByCode } from "@/hooks/actions/useComboBox";
import { useCurrency } from "@/components/currency/useCurrency";

export interface Currency {
  value: string;
  label: string;
  symbol: string;
}

export const useListCurrency = () => {
  const { currencyId } = useCurrency();

  const { data: currencyOptions = [] } =
    useComboboxByCode("075");

  const currencyData = useMemo<Currency[]>(
    () =>
      currencyOptions.map((item) => ({
        value: item.value,
        label:
          item.label.match(/\(([A-Z]{3})/)?.[1] ??
          item.label,
        symbol:
          item.label.match(/^([^\s]+)/)?.[1] ?? "",
      })),
    [currencyOptions]
  );

  const selectedCurrency = useMemo(
    () =>
      currencyData.find(
        (item) => Number(item.value) === currencyId
      ),
    [currencyData, currencyId]
  );

  return {
    currencyData,
    selectedCurrency,
  };
};