import { create } from "zustand";

type State = {
    isGlobalLoading: boolean;
    setGlobalLoading: (value: boolean) => void;
};

export const useGlobalLoading = create<State>((set) => ({
    isGlobalLoading: false,

    setGlobalLoading: (value) =>
        set({
            isGlobalLoading: value,
        }),
}));