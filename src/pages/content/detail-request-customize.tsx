import { CONFIG } from "../../config-global";
import DetailRequestCustomize from "@/sections/content/request/components/detail-request-customize";

const metadata = { title: `Agent - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <DetailRequestCustomize />
        </>
    );
}