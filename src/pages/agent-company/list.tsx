import AgentCompanyView from "@/sections/agent-company/agent-company-view"
import { CONFIG } from "../../config-global"

const metadata = { title: `Agent Company - ${CONFIG.appName}` }
export default function Page() {

    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <AgentCompanyView />
        </>

    )
}