import { SplashScreen } from "@/components/loading";
import { CONFIG } from "@/config-global";
import { useUser } from "@/hooks/actions/useAuth";
import { useEffect } from "react";

type Props = {
    children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
    const { user, userLoading } = useUser();

    useEffect(() => {
        if (!userLoading && !user) {
            window.location.href = `${CONFIG.serverUrl}auth/login`;
        }
    }, [user, userLoading]);

    if (userLoading) {
        return <SplashScreen />;
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
}