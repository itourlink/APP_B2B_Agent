import { useState } from "react";
import { User, Building2, Users2, CreditCard } from "lucide-react";
import BankAccount from "./components/bank-account";
import InfoCompany from "./components/info-company";
import InfoPerson from "./components/info-person";
import UserManagement from "./components/user-management";
import { TabsPills } from "@/components/tab/tabspills";

const INFO_TABS = [
    { id: "person", label: "Thông tin cá nhân", icon: User, component: InfoPerson },
    { id: "company", label: "Thông tin công ty", icon: Building2, component: InfoCompany },
    { id: "management", label: "Quản lý thành viên", icon: Users2, component: UserManagement },
    { id: "bank", label: "Tài khoản ngân hàng", icon: CreditCard, component: BankAccount },
];

const InfoView = () => {
    const [activeTab, setActiveTab] = useState("person");

    const ActiveComponent = INFO_TABS.find((tab) => tab.id === activeTab)?.component || InfoPerson;

    return (
        <div className="space-y-6">
            <TabsPills
                tabs={INFO_TABS}
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <ActiveComponent />
            </div>
        </div>
    );
};

export default InfoView;