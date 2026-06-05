import { DetailTour } from "@/sections/content/tourcustomize/components/detail-tour";
import { CONFIG } from "../../config-global";

const metadata = { title: `Agent member - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <DetailTour />
        </>
    );
}