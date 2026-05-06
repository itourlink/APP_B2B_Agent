import HotelDetail from "@/sections/hotel/components/hotel-detail";
import { CONFIG } from "../../config-global";

const metadata = { title: `Hotel Detail - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <HotelDetail />
        </>
    );
}
