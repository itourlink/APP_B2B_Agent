import { Search } from "lucide-react";

type Props = {
    message?: string;
    className?: string;
};

export const EmptyState = ({
    message = "Không tìm thấy dữ liệu.",
    className = "",
}: Props) => {
    return (
        <div
            className={`w-full bg-[#f8fafc] border border-[#e5e7eb] rounded-2xl py-16 flex flex-col items-center justify-center text-center ${className}`}
        >
            <Search size={32} className="text-[#003580] mb-4" />
            <p className="text-gray-600 font-medium">
                {message}
            </p>
        </div>
    );
};
