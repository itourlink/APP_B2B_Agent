import DetailQuote from "@/sections/content/quote/components/detail-quote";
import { CONFIG } from "../../config-global";

const metadata = { title: `Agent - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <DetailQuote />
        </>
    );
}