import type { IUser } from "@/hooks/interfaces/auth";
import { create } from "zustand";

interface UserState {
  user: IUser | null;
  loading: boolean;
  setUser: (user: IUser | null) => void;
  setLoading: (loading: boolean) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
  clearUser: () => set({ user: null, loading: false }),
}));

export const useIsLoggedIn = () => {
  const user = useUserStore((state) => state.user);
  return !!user;
};