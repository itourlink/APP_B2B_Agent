import { CONFIG } from "@/config-global";
import NotificationView from "@/sections/overlay/notification/notification-view";

const metadata = { title: `Agent - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <NotificationView />
        </>
    );
}