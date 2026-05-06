import { SelectLangs } from "@/components/lang/select-langs"
import { useRef, useState } from "react";

const Lang = () => {

    const [open, setOpen] = useState<Record<string, boolean>>({
        lang: false,
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
            <SelectLangs
                open={open.lang}
                handleEnter={() => handleEnter("lang")}
                handleLeave={() => handleLeave("lang")}
            />
        </>
    )
}

export default Lang