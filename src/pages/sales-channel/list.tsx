
import SalesChannelView from "@/sections/sales-channel/sales-channel-view"
import { CONFIG } from "../../config-global"

const metadata = { title: `Sales Channel - ${CONFIG.appName}` }

export default function Page() {
    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <SalesChannelView />
        </>
    )
}
