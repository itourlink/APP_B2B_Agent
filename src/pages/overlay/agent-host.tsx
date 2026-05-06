import AgentHostView from "@/sections/overlay/agent-host/agent-host-view";
import { CONFIG } from "../../config-global";

const metadata = { title: `Agent Host - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <AgentHostView />
        </>
    );
}
