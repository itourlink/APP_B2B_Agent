import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { SIDEBAR_DATA, type ISidebarProps } from "./sidebar-data";
import { twMerge } from "tailwind-merge";
import { useRouter } from "@/routes/hooks/use-router";
import { useLocation } from "react-router-dom";

export const Sidebar = () => {
    const location = useLocation();

    return (
        <aside className="w-72 h-screen bg-white border-r border-gray-100 flex flex-col transition-all">
            <nav className="flex-1 px-3 pt-5 space-y-1 overflow-y-auto pb-4 custom-scrollbar">
                {SIDEBAR_DATA.map((item, index) => (
                    <SidebarItem
                        key={index}
                        item={item}
                        activePath={location.pathname}
                    />
                ))}
            </nav>
        </aside>
    );
};

const SidebarItem = ({
    item,
    activePath
}: {
    item: ISidebarProps,
    activePath: string
}) => {
    const router = useRouter();

    const hasChildren = item.children && item.children.length > 0;

    const isMatchPath = (path: string, matchPaths?: string[]) => {
        if (matchPaths && matchPaths.length > 0) {
            return matchPaths.includes(activePath);
        }
        return activePath === path;
    };

    const isParentActive =
        (item.matchPaths
            ? item.matchPaths.some(p => activePath.startsWith(p))
            : activePath === item.path) ||
        item.children?.some((c: any) =>
            isMatchPath(c.path, c.matchPaths)
        );

    const [isOpen, setIsOpen] = useState(isParentActive);

    const Icon = item.icon;

    useEffect(() => {
        if (
            item.children?.some((c: any) =>
                isMatchPath(c.path, c.matchPaths)
            )
        ) {
            setIsOpen(true);
        }
    }, [activePath, item.children]);

    return (
        <div className="w-full space-y-1">
            <div
                onClick={() => {
                    if (hasChildren) {
                        setIsOpen(!isOpen);
                    } else {
                        router.push(item.path);
                    }
                }}
                className={twMerge(
                    "flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group",
                    isParentActive
                        ? "bg-blue-50/80 text-[#4a6fa5]"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
            >
                <div className="flex items-center gap-3">
                    {Icon && (
                        <Icon
                            size={20}
                            strokeWidth={isParentActive ? 2.5 : 2}
                            className={twMerge(
                                "transition-colors",
                                isParentActive
                                    ? "text-[#4a6fa5]"
                                    : "text-gray-400 group-hover:text-gray-600"
                            )}
                        />
                    )}
                    <span
                        className={twMerge(
                            "text-[14px] transition-all",
                            isParentActive ? "font-bold" : "font-medium"
                        )}
                    >
                        {item.title}
                    </span>
                </div>

                {hasChildren && (
                    <div
                        className={twMerge(
                            "transition-transform duration-200",
                            isOpen ? "rotate-180" : "rotate-0"
                        )}
                    >
                        <ChevronDown size={16} />
                    </div>
                )}
            </div>

            {hasChildren && isOpen && (
                <div className="ml-9 space-y-1 relative">
                    <div className="absolute -left-3 top-0 bottom-2 w-px bg-gray-100" />

                    {item.children?.map((child: any, index: number) => {
                        const isChildActive = isMatchPath(child.path, child.matchPaths);

                        return (
                            <div
                                key={index}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(child.path);
                                }}
                                className={twMerge(
                                    "px-4 py-2 rounded-lg cursor-pointer text-[13px] transition-all relative flex items-center gap-2",
                                    isChildActive
                                        ? "text-[#4a6fa5] font-bold bg-blue-50/50"
                                        : "text-gray-500 hover:text-[#4a6fa5] hover:translate-x-1"
                                )}
                            >
                                {isChildActive && (
                                    <div className="w-1 h-1 bg-[#4a6fa5] rounded-full shadow-[0_0_5px_#4a6fa5]" />
                                )}
                                {child.title}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};