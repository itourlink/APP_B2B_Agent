import TourBookingsView from "@/sections/content/tourcustomize/tour-bookings-view";
import { CONFIG } from "../../config-global";

const metadata = { title: `Agent - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <TourBookingsView />
        </>
    );
}
