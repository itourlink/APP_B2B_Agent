import { ChevronDown, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

export const AgentHostSelect = ({ name, label, data, isLoading, searchTerm, setSearchTerm, fetchNextPage, hasNextPage, isFetchingNextPage }: any) => {
    const { control, setValue } = useFormContext();
    const [isOpen, setIsOpen] = useState(false);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

        if (scrollHeight - scrollTop <= clientHeight + 10) {
            if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        }
    };

    return (
        <div className="relative space-y-1">
            <label className="text-sm font-medium flex gap-1 items-center">
                {label} <span className="text-red-500">*</span>
            </label>

            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => {
                    const selectedItem = data.find((i: any) => i.strCompanyGUID === field.value);

                    return (
                        <div className="relative">
                            <div
                                onClick={() => setIsOpen(!isOpen)}
                                className={`flex items-center justify-between w-full p-2.5 bg-white border rounded-lg cursor-pointer transition-all ${error ? "border-red-500" : "border-gray-300 hover:border-blue-400"
                                    }`}
                            >
                                <span className={`truncate ${selectedItem ? "text-gray-900" : "text-gray-400"}`}>
                                    {selectedItem ? selectedItem.strCompanyName : "Select ..."}
                                </span>
                                <ChevronDown size={18} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                            </div>

                            {isOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

                                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[350px]">
                                        <div className="p-2 border-b bg-gray-50">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                                <input
                                                    autoFocus
                                                    className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                                    placeholder="Tìm kiếm..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật searchTerm ở AddRequest
                                                />
                                            </div>
                                        </div>

                                        <div className="overflow-y-auto flex-1 custom-scrollbar" onScroll={handleScroll}>
                                            {isLoading ? (
                                                <div className="p-4 text-center text-sm text-gray-500">Đang tải...</div>
                                            ) : data.length === 0 ? (
                                                <div className="p-4 text-center text-sm text-gray-500">Không có kết quả</div>
                                            ) : (
                                                data.map((item: any) => (
                                                    <div
                                                        key={item.strCompanyGUID}
                                                        className={`p-3 border-b border-gray-50 hover:bg-blue-50 cursor-pointer ${field.value === item.strCompanyGUID ? "bg-blue-50" : ""
                                                            }`}
                                                        onClick={() => {
                                                            setValue(name, item.strCompanyGUID);
                                                            setIsOpen(false);
                                                        }}
                                                    >
                                                        <div className="font-bold text-gray-800 text-sm uppercase">{item.strCompanyName}</div>
                                                        <div className="flex items-start gap-1 mt-1 text-[11px] text-gray-500">
                                                            <MapPin size={12} className="mt-0.5 shrink-0" />
                                                            <span>{item.strCompanyAddr}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                            {isFetchingNextPage && (
                                <div className="p-2 text-center text-[10px] text-gray-400 italic">
                                    Đang tải thêm...
                                </div>
                            )}
                            {error && <p className="text-[11px] text-red-500 mt-1">{error.message}</p>}
                        </div>
                    );
                }}
            />
        </div>
    );
};