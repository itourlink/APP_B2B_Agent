import { TabsPills } from "@/components/tab/tabspills";
import { useState } from "react";
import RequestNew from "./components/request-new";
import RequestDone from "./components/request-done";
import { CheckCircle, FilePlus } from "lucide-react";
import { useTranslate } from "@/locales";

const REQUEST_TABS = [
    { id: "newRequest", labelKey: "tabNewRequest", icon: FilePlus, component: RequestNew },
    { id: "done", labelKey: "tabDoneRequest", icon: CheckCircle, component: RequestDone },
];

const RequestBookingView = () => {
    const { t } = useTranslate("request");
    const [activeTab, setActiveTab] = useState("newRequest");

    const ActiveComponent = REQUEST_TABS.find((tab) => tab.id === activeTab)?.component || RequestNew;
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

export default RequestBookingView
