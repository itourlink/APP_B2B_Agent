import { CONFIG } from "../../config-global";
import RequestCustomizeView from "@/sections/content/request/request-customize-view";

const metadata = { title: `Agent - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <RequestCustomizeView />
        </>
    );
}
