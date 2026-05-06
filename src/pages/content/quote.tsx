import QuoteView from "@/sections/content/quote/quote-view";
import { CONFIG } from "../../config-global";

const metadata = { title: `Agent - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <QuoteView />
        </>
    );
}
