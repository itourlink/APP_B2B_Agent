import { SplashScreen } from "@/components/loading";
import { CONFIG } from "@/config-global";
import { useUser } from "@/hooks/actions/useAuth";
import { useIsLoggedIn } from "@/zustand/useUserStore";
import { useEffect } from "react";

export const AuthRoute = ({ children }: { children: React.ReactNode }) => {
    const { userLoading } = useUser();

    const isLoggedIn = useIsLoggedIn();

    useEffect(() => {
        if (!userLoading && !isLoggedIn) {
            window.location.href = `${CONFIG.serverUrl}auth/login`;
        }
    }, [userLoading, isLoggedIn]);

    if (userLoading) return <SplashScreen />;

    return children;
};