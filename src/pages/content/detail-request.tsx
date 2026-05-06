import DetailRequest from "@/sections/content/request/components/detail-request";
import { CONFIG } from "../../config-global";

const metadata = { title: `Agent - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <DetailRequest />
        </>
    );
}