// import BannerSlider from "@/components/banner/banner-slider";
// import { slidesVoucher } from "@/components/banner/banner-data";
import VoucherList from "./components/voucher-list";

const VoucherView = () => {
    return (
        <main className="min-h-screen bg-gray-50">
            {/* <BannerSlider slides={slidesVoucher} /> */}
            <VoucherList />
        </main>
    )
}

export default VoucherView