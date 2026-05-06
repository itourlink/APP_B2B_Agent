import BoatView from "@/sections/boat/boat-view";
import { CONFIG } from "../../config-global";

const metadata = { title: `Boat - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <BoatView />
        </>
    );
}
