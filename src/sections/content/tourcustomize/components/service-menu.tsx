import type  { ReactNode } from 'react';

export interface IServiceMenuItem {
    icon: ReactNode;
    label: string;
    value: string;
    color?: string;
}

interface Props {
    items: IServiceMenuItem[];
    onChange: (value: string) => void;
}

const ServiceMenu = ({ items, onChange }: Props) => {
    return (
        <div className="relative inline-block">
            {/* Dropdown Card */}
            <div className="w-64 bg-white rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.15)] border border-gray-100 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Tooltip arrow */}
                <div className="absolute -top-1.5 left-4 w-3 h-3 bg-white border-t border-l border-gray-100 rotate-45" />

                {items.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => onChange(item.label)}
                        className="w-full flex items-center px-4 py-3 hover:bg-gray-50 transition-colors duration-150 group"
                    >
                        <span className={`${item.color || 'text-blue-700'} mr-4 group-hover:scale-110 transition-transform`}>
                            {item.icon}
                        </span>
                        <span className="text-gray-700 text-[15px] font-medium">
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ServiceMenu;