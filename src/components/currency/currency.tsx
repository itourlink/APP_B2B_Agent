import { useRef, useState } from "react";
import { SelectCurrency } from "./select-currency";

const Currency = () => {

    const [open, setOpen] = useState<Record<string, boolean>>({
        currency: false,
    });
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleEnter = (key: string) => {
        clearTimeout(timer.current ?? undefined);
        setOpen((prev) => {
            const newState: Record<string, boolean> = {};

            Object.keys(prev).forEach((k) => {
                newState[k] = false;
            });

            newState[key] = true;

            return newState;
        });
    };

    const handleLeave = (key: string) => {
        timer.current = setTimeout(() => {
            setOpen((prev) => ({ ...prev, [key]: false }));
        }, 300);
    };


    return (
        <>
            <SelectCurrency
                open={open.currency}
                handleEnter={() => handleEnter("currency")}
                handleLeave={() => handleLeave("currency")}
            />
        </>
    )
}

export default Currency