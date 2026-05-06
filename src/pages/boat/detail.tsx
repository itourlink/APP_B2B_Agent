import BoatDetail from "@/sections/boat/components/boat-detail";
import { CONFIG } from "../../config-global";

const metadata = { title: `Boat - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <BoatDetail />
        </>
    );
}
