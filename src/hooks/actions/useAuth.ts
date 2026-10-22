import apiClient from "@/axios";
import { useUserStore } from "@/zustand/useUserStore";
import { useEffect } from "react";
import type { IUser } from "../interfaces/auth";
import type { ApiResponseUser } from "../interfaces/axios";

let hasFetchedUser = false;

export const useUser = () => {
  const user = useUserStore((state) => state.user);
  const userLoading = useUserStore((state) => state.loading);

  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const setLoading = useUserStore((state) => state.setLoading);

  useEffect(() => {
    if (hasFetchedUser || user !== null) return;
    hasFetchedUser = true;

    const fetchUser = async () => {
      setLoading(true);

      try {
        const res = (await apiClient.get<ApiResponseUser<IUser>>(
          "user/GetMemberDetail"
        )) as unknown as ApiResponseUser<IUser>;

        if (res?.isSuccess) {
          const user = res.data?.[0]?.[0] || null;
          setUser(user);
        } else {
          clearUser();
        }
      } catch {
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [clearUser, setLoading, setUser, user]);

  return { user, userLoading };
};
