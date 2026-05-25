import { useEffect, useState } from "react";

type Props = {
    onExpire?: () => void;
};

const PaymentCountdown = ({ onExpire }: Props) => {
    const [timeLeft, setTimeLeft] = useState(240);

    useEffect(() => {
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
    }, [onExpire]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins}m ${secs}s`;
    };

    return (
        <div className="w-full bg-[#f19f1b] text-white text-center text-xs md:text-sm py-2 px-4 shadow-sm font-medium flex items-center justify-center gap-1">
            <span className="inline-block w-4 h-4 rounded-full border border-white text-center text-[10px] leading-[14px] font-bold">
                !
            </span>

            Nếu quý khách không thực hiện thanh toán, đơn hàng sẽ tự động hủy sau{" "}
            {formatTime(timeLeft)}
        </div>
    );
};

export default PaymentCountdown;