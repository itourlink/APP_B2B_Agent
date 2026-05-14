import { useState } from "react";
import PanelPopup from "@/components/popup/panel-popup";
import ListMedia from "@/components/media/list-media";

interface Props {
    title: string;
    value?: string;
    onChange: (path: string) => void;
}

const BannerMediaField = ({ title, value, onChange }: Props) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex flex-col">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider text-[11px] pb-2">
                {title}
            </label>

            <button
                type="button"
                onClick={() => setOpen(true)}
            >
                <label
                    className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer overflow-hidden"
                >
                    {value && (
                        <img
                            src={value}
                            alt="banner"
                            className="w-full h-64 object-cover rounded-xl"
                        />
                    )}
                </label>
            </button>

            {open && (
                <PanelPopup
                    className="max-w-[900px]"
                    title="Media"
                    open={open}
                    onClose={() => setOpen(false)}
                >
                    <ListMedia
                        onSelect={(item) => {
                            onChange(item.path);
                            setOpen(false);
                        }}
                    />
                </PanelPopup>
            )}
        </div>
    );
};

export default BannerMediaField;