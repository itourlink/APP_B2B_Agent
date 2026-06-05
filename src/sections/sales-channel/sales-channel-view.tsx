import { useRouter } from '@/routes/hooks/use-router';
import { paths } from '@/routes/paths';
import { ChevronLeft, MessageCircle, Mail, Facebook, Send } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const SalesChannelView = () => {
    const router = useRouter();
    const location = useLocation();

    const company =
        new URLSearchParams(location.search).get("company") || "";

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6 bg-transparent font-sans">
            <div className="max-w-[640px] w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-10">

                <h1 className="text-[22px] md:text-[26px] font-bold text-[#1a202c] text-center mb-4 leading-tight">
                    Bạn chưa đủ điều kiện để thiết lập kênh người bán
                </h1>

                <p className="text-gray-500 text-center text-[15px] mb-8 leading-relaxed px-4">
                    Nếu bạn muốn thiết lập kênh người bán, hãy liên hệ với <span className="font-semibold text-[#2566b0]">Itourlink</span> theo những thông tin dưới đây để được hỗ trợ nhanh nhất.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    <ContactItem
                        icon={<MessageCircle size={18} className="text-[#0066FF]" />}
                        label="ZALO"
                        value="+84338685670"
                        href="https://zalo.me/84338685670"
                    />

                    <ContactItem
                        icon={<Mail size={18} className="text-[#EA4335]" />}
                        label="EMAIL"
                        value="pngsoftsales@gmail.com"
                        href="mailto:pngsoftsales@gmail.com"
                    />

                    <ContactItem
                        icon={<Send size={18} className="text-[#00AFF0]" />}
                        label="SKYPE"
                        value="pngsupport"
                        href="skype:pngsupport?chat"
                    />

                    <ContactItem
                        icon={<Facebook size={18} className="text-[#1877F2]" />}
                        label="MESSENGER"
                        value="itourlink"
                        href="https://m.me/itourlink"
                    />
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={() =>
                            router.push(
                                `${paths.shop.tour.list}?company=${company}`
                            )
                        }
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#2566b0] hover:bg-[#1d4f8a] cursor-pointer text-white text-sm font-medium rounded-full transition-all duration-200"
                    >
                        <ChevronLeft size={18} />
                        Quay lại
                    </button>
                </div>

            </div>
        </div>
    );
};

const ContactItem = ({ icon, label, value, href }: any) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-3.5 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
    >
        <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full group-hover:bg-white transition-colors">
            {icon}
        </div>

        <div className="overflow-hidden">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                {label}
            </p>

            <p className="text-[13px] font-medium text-gray-700 truncate">
                {value}
            </p>
        </div>
    </a>
);

export default SalesChannelView;