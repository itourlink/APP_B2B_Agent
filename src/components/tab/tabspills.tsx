import type { LucideIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface ITabOption {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface TabsPillsProps {
  tabs: ITabOption[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const TabsPills = ({ tabs, activeTab, onChange, className }: TabsPillsProps) => {
  return (
    <div className={twMerge(
      "bg-white p-1.5 rounded-[20px] shadow-sm border border-gray-100 flex flex-wrap items-center gap-1 w-fit",
      className
    )}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={twMerge(
              "flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 relative group outline-none cursor-pointer",
              isActive
                ? "bg-[#4a6fa5] text-white shadow-md shadow-blue-100"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            {Icon && <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />}
            <span className={twMerge(
              "text-[14px] whitespace-nowrap",
              isActive ? "font-bold" : "font-medium"
            )}>
              {tab.label}
            </span>

            <div className="absolute inset-0 rounded-full active:scale-95 transition-transform" />
          </button>
        );
      })}
    </div>
  );
};