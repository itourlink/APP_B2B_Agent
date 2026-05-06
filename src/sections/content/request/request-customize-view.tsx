import { TabsPills } from "@/components/tab/tabspills";
import { useState } from "react";
import { FilePlus, XCircle } from "lucide-react";
import RequestCustomizeNew from "./components/request-customize-new";
import RequestCancel from "./components/request-cancel";

const REQUEST_TABS = [
    { id: "newRequest", label: "Yêu cầu mới", icon: FilePlus, component: RequestCustomizeNew },
    { id: "cancel", label: "Yêu cầu bị hủy", icon: XCircle, component: RequestCancel },
];

const RequestCustomizeView = () => {
    const [activeTab, setActiveTab] = useState("newRequest");

    const ActiveComponent = REQUEST_TABS.find((tab) => tab.id === activeTab)?.component || RequestCustomizeNew;

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

export default RequestCustomizeView