import { TabsPills } from "@/components/tab/tabspills"
import { useState } from "react";
import { ClipboardCheck, Clock } from "lucide-react";
import ReportPendingApproval from "./components/report-pending-approval";
import ReportPaymentReview from "./components/report-payment-review";

const REPORT_TABS = [
    { id: "pending", label: "Chờ duyệt", icon: Clock, component: ReportPendingApproval },
    { id: "review", label: "Kiểm tra các khoản thanh toán", icon: ClipboardCheck, component: ReportPaymentReview },
];
const ReportApprovedView = () => {
    const [activeTab, setActiveTab] = useState("pending");

    const ActiveComponent = REPORT_TABS.find((tab) => tab.id === activeTab)?.component || ReportPendingApproval;
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

export default ReportApprovedView