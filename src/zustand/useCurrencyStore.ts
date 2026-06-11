import { create } from "zustand";

interface CurrencyState {
  currencyId: number | null;
  setCurrencyId: (id: number) => void;
}

export const useCurrencyStore = create<CurrencyState>((set) => ({
  currencyId: null,
  setCurrencyId: (currencyId) => set({ currencyId }),
}));