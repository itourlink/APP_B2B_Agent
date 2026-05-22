import { CONFIG } from "../../config-global";
import PaymentBookingView from "@/sections/booking/payment-booking-view";

const metadata = { title: `Payment Booking - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <PaymentBookingView />
        </>
    );
}
