import { useTranslate } from "@/locales";
import { useEffect, useState } from "react";

type Props = {
    onExpire?: () => void;
    isExpired?: boolean;
    initialSeconds?: number;
};

const PaymentCountdown = ({
    onExpire,
    isExpired = false,
    initialSeconds = 240,
}: Props) => {
    const { t } = useTranslate("booking")
    const [timeLeft, setTimeLeft] = useState(initialSeconds);

    useEffect(() => {
        if (isExpired) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onExpire?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [onExpire, isExpired]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins}m ${secs}s`;
    };

    if (isExpired) {
        return (
            <div className="w-full bg-red-600 text-white text-center text-sm py-2 px-4 font-medium">
                ⚠️ {t("bookingSessionNotFoundOrExpired")}
            </div>
        );
    }

    return (
        <div className="w-full bg-[#f19f1b] text-white text-center text-xs md:text-sm py-2 px-4 shadow-sm font-medium flex items-center justify-center gap-1">
            <span className="inline-block w-4 h-4 rounded-full border border-white text-center text-[10px] leading-[14px] font-bold">
                !
            </span>

            {t("orderWillBeCancelledAfter")}{" "}
            {formatTime(timeLeft)}
        </div>
    );
};

export default PaymentCountdown;