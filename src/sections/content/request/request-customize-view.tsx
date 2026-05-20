import { TabsPills } from "@/components/tab/tabspills";
import { useState } from "react";
import { FilePlus, XCircle } from "lucide-react";
import RequestCustomizeNew from "./components/request-customize-new";
import RequestCancel from "./components/request-cancel";
import { useTranslate } from "@/locales";

const REQUEST_TABS = [
    { id: "newRequest", labelKey: "tabNewRequest", icon: FilePlus, component: RequestCustomizeNew },
    { id: "cancel", labelKey: "tabCancelledRequest", icon: XCircle, component: RequestCancel },
];

const RequestCustomizeView = () => {
    const { t } = useTranslate("request");
    const [activeTab, setActiveTab] = useState("newRequest");

    const ActiveComponent = REQUEST_TABS.find((tab) => tab.id === activeTab)?.component || RequestCustomizeNew;
    const requestTabs = REQUEST_TABS.map(({ labelKey, ...tab }) => ({
        ...tab,
        label: t(labelKey),
    }));

    return (
        <div className="space-y-6">
            <TabsPills
                tabs={requestTabs}
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
