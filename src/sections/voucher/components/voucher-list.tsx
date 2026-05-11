import { useListSupplierVoucherByAgent } from "@/hooks/actions/useVoucher.tsx";
import { useRouter } from "@/routes/hooks/use-router";
import { paths } from "@/routes/paths";
import { Loader2, Ticket } from "lucide-react";

const VoucherList = () => {
    const router = useRouter();
    const { voucherData, voucherLoading, voucherError } = useListSupplierVoucherByAgent();

    if (voucherLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-[#2566b0]" />
                <p className="text-gray-500 font-medium">Đang tải danh sách voucher...</p>
            </div>
        );
    }

    if (voucherError) {
        return (
            <div className="p-8 text-center text-red-500">
                Có lỗi xảy ra khi tải danh sách voucher. Vui lòng thử lại sau.
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto mt-30">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <Ticket className="w-6 h-6 text-[#2566b0]" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Danh sách Voucher</h1>
            </div>

            {voucherData?.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
                    <p className="text-gray-500">Hiện không có voucher nào khả dụng.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {voucherData?.map((voucher: any) => (
                        <div
                            key={voucher.strSupplierVoucherGUID}
                            onClick={() => router.push(`${paths.shop.voucher.detail}/${voucher.strSupplierVoucherGUID}`)}
                            className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-blue-200 transition-all cursor-pointer relative"
                        >
                            <div className="p-5 flex gap-4">
                                <div className="w-20 h-20 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                                    <Ticket className="w-10 h-10 text-[#2566b0]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 mb-1 truncate group-hover:text-[#2566b0] transition-colors">
                                        {voucher.strVoucherName}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                                        {voucher.strSupplierName}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-[#2566b0] font-bold">
                                            {voucher.dblPrice?.toLocaleString()} {voucher.strCurrencyCode}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-gray-50 rounded-l-full border-l border-y border-gray-100" />
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-gray-50 rounded-r-full border-r border-y border-gray-100" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VoucherList;