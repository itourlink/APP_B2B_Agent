import { CONFIG } from "../../config-global";
import TourView from "@/sections/tour/tour-view";

const metadata = { title: `Tour - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <TourView />
        </>
    );
}
