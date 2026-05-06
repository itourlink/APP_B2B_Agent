import RestaurantDetail from "@/sections/restaurant/components/restaurant-detail";

import { CONFIG } from "../../config-global";

const metadata = { title: `Restaurant Detail - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            
            <RestaurantDetail />
        </>
    );
}