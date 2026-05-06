import { CONFIG } from "../../config-global";
import NotificationView from "@/sections/notification/notification-view";

const metadata = { title: `Notification - ${CONFIG.appName}` };

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
