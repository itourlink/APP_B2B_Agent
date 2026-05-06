import Page404 from "@/sections/error/page404";
import { CONFIG } from "../../config-global";

const metadata = { title: `Page 404 - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <Page404 />
        </>
    );
}
