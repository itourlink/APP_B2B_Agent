import { TabsPills } from "@/components/tab/tabspills";
import { useState } from "react";
import RequestNew from "./components/request-new";
import RequestDone from "./components/request-done";
import { CheckCircle, FilePlus } from "lucide-react";

const REQUEST_TABS = [
    { id: "newRequest", label: "Yêu cầu mới", icon: FilePlus, component: RequestNew },
    { id: "done", label: "Yêu cầu đã xử lý", icon: CheckCircle, component: RequestDone },
];

const RequestBookingView = () => {
    const [activeTab, setActiveTab] = useState("newRequest");

    const ActiveComponent = REQUEST_TABS.find((tab) => tab.id === activeTab)?.component || RequestNew;

    return (
        <div className="space-y-6">
            <TabsPills
                tabs={REQUEST_TABS}
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <ActiveComponent />
            </div>
        </div>
    );
}

export default RequestBookingView