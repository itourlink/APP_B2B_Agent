import { CONFIG } from "../../config-global";
import RequestBookingView from "@/sections/content/request/request-booking-view";

const metadata = { title: `Agent - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <RequestBookingView />
        </>
    );
}
