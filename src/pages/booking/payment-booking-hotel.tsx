import PaymentBookingHotelView from "@/sections/booking/payment-booking-hotel-view";
import { CONFIG } from "../../config-global";

const metadata = { title: `Payment Booking- ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <div>
                <title>{metadata.title}</title>
            </div>
            <PaymentBookingHotelView />
        </>
    );
}