import SigninView from "@/sections/auth/sign-in-view";
import { CONFIG } from "../../config-global";

const metadata = { title: `Sign-up - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <SigninView />
        </>
    );
}
