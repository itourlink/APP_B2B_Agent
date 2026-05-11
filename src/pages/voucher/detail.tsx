import { CONFIG } from "@/config-global";
import VoucherDetail from "@/sections/voucher/components/voucher-detail";

const metadata = {title: `Voucher - ${CONFIG.appName}`}
const VoucherDetailPage = () => {
    return (
        <div>
            <title>{metadata.title}</title>
            <VoucherDetail />
        </div>
    );
};

export default VoucherDetailPage;