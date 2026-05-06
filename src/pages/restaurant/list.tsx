
import RestaurantView from "@/sections/restaurant/restaurant-view"
import { CONFIG } from "../../config-global"

const metadata = { title: `Restaurant - ${CONFIG.appName}`}

 export default function Page() {
    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <RestaurantView />
        </>
    )
 }
