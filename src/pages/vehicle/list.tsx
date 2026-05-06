import VehicleView from "@/sections/vehicle/vehicle-view";
import { CONFIG } from "../../config-global"

const metadata = { title: `Vehicle - ${CONFIG.appName}`}

export default function Page() { 

    return ( 
        <>
            <div>
                <title>{metadata.title}</title>
                <VehicleView />
            </div>
        </>
    )
}