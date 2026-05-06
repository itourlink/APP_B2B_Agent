
import VehicleDetail from "@/sections/vehicle/components/vehicle-detail";
import { CONFIG } from "../../config-global";

const metadata = { title: `Vehicle Detail - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            
            <VehicleDetail />
        </>
    );
}