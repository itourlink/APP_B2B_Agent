import { useState } from "react";
import { Search, RotateCcw, FileDown, Lightbulb, Clock, CheckCircle, Plane, FlagIcon, XCircle } from "lucide-react";
import PrimaryButton from "@/components/button/primary-button";
import CustomFilter from "@/components/form/custom-filter";
import { TabsPills } from "@/components/tab/tabspills";

// Import 6 component con của bạn
import ServicePropose from "./components/service-propose";
import ServiceReservationHold from "./components/service-reservation-hold";
import ServiceBooked from "./components/service-booked";
import ServiceMoving from "./components/service-moving";
import ServiceDone from "./components/service-done";
import ServiceCancel from "./components/service-cancel";
import { useToastStore } from "@/zustand/useToastStore";

const SERVICE_TABS = [
    { id: "suggest", label: "Đề xuất", icon: Lightbulb, component: ServicePropose },
    { id: "hold", label: "Đang giữ chỗ", icon: Clock, component: ServiceReservationHold },
    { id: "booked", label: "Đã Đặt", icon: CheckCircle, component: ServiceBooked },
    { id: "moving", label: "Đang đi/Đang di chuyển", icon: Plane, component: ServiceMoving },
    { id: "done", label: "Kết thúc", icon: FlagIcon, component: ServiceDone },
    { id: "cancel", label: "Hủy", icon: XCircle, component: ServiceCancel },
];

const ServiceView = () => {
    const [activeTab, setActiveTab] = useState("suggest");
    const { showToast } = useToastStore()
    const [filters, setFilters] = useState({
        startTime: "",
        endTime: "",
        search: "",
        idOrder: ""
    });

    const [appliedFilters, setAppliedFilters] = useState(filters);

    const ActiveComponent = SERVICE_TABS.find((tab) => tab.id === activeTab)?.component || ServicePropose;

    const onChangeFilters = (key: string, value: string | number) => {
        let newValue: string | number = value;

        if ((key === "startTime" || key === "endTime") && value) {
            const date = new Date(Number(value));

            if (key === "startTime") {
                date.setUTCHours(0, 0, 0, 0);
            } else {
                date.setUTCHours(23, 59, 59, 999);
            }

            newValue = date.toISOString();
        }

        setFilters((prev) => ({
            ...prev,
            [key]: String(newValue),
        }));
    };

    const handleSearch = () => {
        setAppliedFilters(filters);
    };

    const handleReset = () => {
        const defaultFilters = {
            startTime: "",
            endTime: "",
            search: "",
            idOrder: ""
        };
        setFilters(defaultFilters);
        setAppliedFilters(defaultFilters);
    };

    return (
        <div className="p-4">
            {/* Filter UI */}
            <CustomFilter
                onChangeFilters={onChangeFilters}
                search={[
                    {
                        keySearch: "idOrder",
                        value: filters.idOrder,
                        placeHoder: "Mã đặt mua",
                    },
                ]}
                time={{
                    keyStartTime: "startTime",
                    keyendTime: "endTime",
                    startTime: filters.startTime ? new Date(filters.startTime).getTime() : 0,
                    endTime: filters.endTime ? new Date(filters.endTime).getTime() : 0,
                }}
            />

            <div className="flex gap-2 mt-3">
                <PrimaryButton
                    text="Tìm kiếm"
                    onClick={handleSearch}
                    className="bg-[#4e6d9a] hover:bg-[#3d567a] rounded-lg px-4 py-2 text-sm w-fit text-white"
                    prefixIcon={<Search size={18} />}
                />

                <PrimaryButton
                    text="Reset"
                    onClick={handleReset}
                    className="bg-gray-200 hover:bg-gray-300 text-black rounded-lg px-4 py-2 text-sm w-fit"
                    prefixIcon={<RotateCcw size={18} />}
                />
                <PrimaryButton
                    text="Export Excel"
                    onClick={() => showToast("info", "Sắp ra mắt")}
                    className="bg-gray-200 hover:bg-gray-300 text-black rounded-lg px-4 py-2 text-sm w-fit"
                    prefixIcon={<FileDown size={18} />}
                />
            </div>

            <div className="space-y-6 pt-4">
                <TabsPills
                    tabs={SERVICE_TABS}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                />

                <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

                    <ActiveComponent appliedFilters={appliedFilters} />
                </div>
            </div>
        </div>
    );
};

export default ServiceView;