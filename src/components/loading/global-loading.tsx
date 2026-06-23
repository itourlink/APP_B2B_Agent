// components/global-loading.tsx
import { SplashScreen } from "@/components/loading";
import { useGlobalLoading } from "@/zustand/useGlobalLoading";

export default function GlobalLoading() {
    const { isGlobalLoading } = useGlobalLoading();

    if (!isGlobalLoading) return null;

    return <SplashScreen />;
}