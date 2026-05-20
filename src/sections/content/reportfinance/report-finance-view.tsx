import { TabsPills } from "@/components/tab/tabspills"
import { useState } from "react";
import ReportRevenue from "./components/report-revenue";
import ReportCost from "./components/report-cost";
import ReportCommission from "./components/report-commission";
import { Percent, Receipt, TrendingUp } from "lucide-react";
import { useTranslate } from "@/locales";

const REPORT_TABS = [
    { id: "commission", labelKey: "tabCommission", icon: Percent, component: ReportCommission },
    { id: "cost", labelKey: "tabCost", icon: Receipt, component: ReportCost },
    { id: "revenue", labelKey: "tabRevenue", icon: TrendingUp, component: ReportRevenue },
];

const ReportFinanceView = () => {
    const { t } = useTranslate("reportfinance");
    const [activeTab, setActiveTab] = useState("commission");

    const ActiveComponent = REPORT_TABS.find((tab) => tab.id === activeTab)?.component || ReportCommission;
    
    const reportTabs = REPORT_TABS.map(({ labelKey, ...tab }) => ({
        ...tab,
        label: t(labelKey),
    }));

    return (
        <div className="space-y-6">
            <TabsPills
                tabs={reportTabs}
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <ActiveComponent />
            </div>
        </div>
    )
}

export default ReportFinanceView