import Voucherview from "@/sections/voucher/voucher-view";
import { CONFIG } from "@/config-global";
const metadata = { title: `Voucher - ${CONFIG.appName}` }
const VoucherListPage = () => {
    return (
        <div>
            <title>{metadata.title}</title>
            <Voucherview />
        </div>
    );
};

export default VoucherListPage;