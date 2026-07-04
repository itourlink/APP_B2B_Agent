import TariffView from "@/sections/tariff/taiff-view";
import { CONFIG } from "../../config-global";

const metadata = { title: `Tariff - ${CONFIG.appName}` };

export default function TariffPage() {
    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <TariffView />
        </>
    )
}


