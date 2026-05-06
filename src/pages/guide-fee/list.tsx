import GuideFeeView from "@/sections/guide-fee/guide-fee-view";
import { CONFIG } from "../../config-global"

const metadata = { title:  `Flight - ${CONFIG.appName}`}
export default function Page() {

    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <GuideFeeView />
        </>

    )
}

