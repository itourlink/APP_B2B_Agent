import { CONFIG } from "@/config-global";
import CartView from "@/sections/overlay/cart/cart-view";

const metadata = { title: `Agent - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <CartView />
        </>
    );
}