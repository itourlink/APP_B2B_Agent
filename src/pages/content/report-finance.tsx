import ReportFinanceView from "@/sections/content/reportfinance/report-finance-view";
import { CONFIG } from "../../config-global";

const metadata = { title: `Agent - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <ReportFinanceView />
        </>
    );
}
