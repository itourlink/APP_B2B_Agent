import { Home, ArrowLeft, Map } from "lucide-react";
import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks/use-router";

const Page404 = () => {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
            <div className="max-w-md w-full text-center">
                <div className="relative mb-8">
                    <h1 className="text-[150px] font-black text-[#4a6fa5]/10 leading-none select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white p-4 rounded-full shadow-xl shadow-blue-100/50">
                            <Map size={64} className="text-[#4a6fa5] animate-bounce" strokeWidth={1.5} />
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    Ối! Trang này không tồn tại
                </h2>
                <p className="text-gray-500 mb-10 leading-relaxed">
                    Có vẻ như chuyến đi của bạn đã rẽ nhầm hướng. Đừng lo lắng, chúng tôi sẽ giúp bạn quay lại lộ trình đúng đắn.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => router.push(paths.content.agent)}
                        className="cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-full hover:bg-gray-100 hover:border-gray-300 transition-all active:scale-95 text-[14px]"
                    >
                        <ArrowLeft size={18} />
                        <h1 className="text-[13px] uppercase font-bold text-gray-800">  Quay lại</h1>
                    </button>

                    <button
                        onClick={() => router.push(paths.content.agent)}
                        className="cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-[#4a6fa5] text-white font-bold rounded-full shadow-lg shadow-blue-200 hover:bg-[#3b5b7e] transition-all active:scale-95 uppercase tracking-wide text-[13px]"
                    >
                        <Home size={18} />
                        Về trang chủ
                    </button>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-200/60">
                    <p className="text-sm text-gray-400">
                        © 2026 iTourlink. Hệ thống kết nối du lịch hàng đầu.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Page404;