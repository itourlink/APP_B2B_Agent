import PaymentBookingCartView from "@/sections/booking/payment-booking-cart-view";
import { CONFIG } from "../../config-global";

const metadata = { title: `Payment Booking- ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <PaymentBookingCartView />
        </>
    );
}