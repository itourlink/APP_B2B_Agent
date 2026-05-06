import { TabsPills } from "@/components/tab/tabspills"
import { useState } from "react";
import ReportRevenue from "./components/report-revenue";
import ReportCost from "./components/report-cost";
import ReportCommission from "./components/report-commission";
import { Percent, Receipt, TrendingUp } from "lucide-react";

const REPORT_TABS = [
    { id: "commission", label: "Báo cáo hoa hồng", icon: Percent, component: ReportCommission },
    { id: "cost", label: "Báo cáo chi phí dự kiến", icon: Receipt, component: ReportCost },
    { id: "revenue", label: "Báo cáo doanh thu dự kiến", icon: TrendingUp, component: ReportRevenue },
];

const ReportFinanceView = () => {
    const [activeTab, setActiveTab] = useState("commission");

    const ActiveComponent = REPORT_TABS.find((tab) => tab.id === activeTab)?.component || ReportCommission;
    return (
        <div className="space-y-6">
            <TabsPills
                tabs={REPORT_TABS}
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