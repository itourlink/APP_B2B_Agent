import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CurrencyState {
  currencyId: number | null;
  setCurrencyId: (id: number) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currencyId: null,

      setCurrencyId: (id) =>
        set({
          currencyId: id
        })
    }),
    {
      name: "currency-storage"
    }
  )
);