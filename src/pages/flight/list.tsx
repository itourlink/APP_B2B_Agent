import FlightView from "@/sections/flight/flight-view"
import { CONFIG } from "../../config-global"

const metadata = { title:  `Flight - ${CONFIG.appName}`}
export default function Page() {

    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <FlightView />
        </>

    )
}