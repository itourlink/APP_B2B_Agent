import DetailReportFinance from "@/sections/content/reportfinance/components/detail-report-finance";
import { CONFIG } from "../../config-global";

const metadata = { title: `Agent - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <DetailReportFinance />
        </>
    );
}