import { useCurrencyStore } from "@/zustand/useCurrencyStore";

export const useCurrency = () => {
  const currencyId = useCurrencyStore(
    (state) => state.currencyId
  );

  const setCurrencyId = useCurrencyStore(
    (state) => state.setCurrencyId
  );

  return {
    currencyId,
    setCurrencyId,
  };
};