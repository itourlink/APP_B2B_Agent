import { useListCompanyPartner } from '@/hooks/actions/useCompanyOwner';
import { getUrlImage } from '@/utils/format-image';
import { Mail, Phone, MapPin, Link2 } from 'lucide-react';


const PartnerCard = ({ partner }: any) => {
    return (
        <div className="relative group overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] 
                        transition-all duration-300 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)]
                        hover:-translate-y-1">


            <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">

                    <div className="w-full md:w-[35%] flex justify-center items-center py-6 px-4 
                                    bg-gray-50/50 backdrop-blur-sm rounded-xl border border-gray-100">
                        <img
                            src={getUrlImage(partner?.strCompanyLogo)}
                            alt={partner?.strCompanyName}
                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>

                    <div className="w-full md:w-[65%] space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="block p-1 bg-blue-50 text-[#2563eb] rounded-md">
                                <Link2 size={16} />
                            </span>
                            <h3 className="text-gray-900 font-bold text-xl uppercase tracking-tight group-hover:text-[#1d4ed8]">
                                {partner?.strCompanyName}
                            </h3>
                        </div>

                        <div className="space-y-3 pt-2 border-t border-gray-100">
                            <button className="flex items-center gap-2.5 text-[#2566b0] text-sm font-medium hover:underline group-hover:underline">
                                <Link2 size={14} className="text-[#2566b0]" />
                                <span>[Liên kết tarrif]</span>
                            </button>

                            <div className="flex items-start gap-3">
                                <MapPin size={16} className="text-gray-400 mt-1 shrink-0" />
                                <p className="text-gray-700 text-[15px] leading-relaxed line-clamp-2">
                                    <span className="font-semibold text-gray-800">Địa chỉ:</span> {partner?.strCompanyAddr}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Phone size={16} className="text-gray-400 shrink-0" />
                                <p className="text-gray-700 text-[15px]">
                                    <span className="font-semibold text-gray-800">Di động:</span> {partner?.strCompanyPhone}
                                </p>
                            </div>

                            {partner.email && (
                                <div className="flex items-center gap-3">
                                    <Mail size={16} className="text-gray-400 shrink-0" />
                                    <p className="text-gray-700 text-[15px]">
                                        <span className="font-semibold text-gray-800">Email:</span> {partner?.strCompanyEmail}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-100/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        </div>
    );
};

const Partner = () => {
    const { tpData, tpLoading, tpError } = useListCompanyPartner();

    if (tpLoading) return <PartnerSkeleton />;
    if (tpError) return <PartnerError />;

    return (
        <section className="max-w-7xl mx-auto p-10 bg-gray-50 min-h-screen">
            <div className="text-center mb-16 relative">
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                    Các Đối Tác Của Bạn
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-10 max-w-5xl mx-auto">
                {tpData?.map((partner: any) => (
                    <PartnerCard
                        key={partner?.strCompanyGUID}
                        partner={partner}
                    />
                ))}
            </div>
        </section>
    );
};

export default Partner;


const PartnerSkeleton = () => {
    return (
        <div className="grid grid-cols-1 gap-10 max-w-5xl mx-auto">
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className="rounded-2xl border border-gray-200 p-8 bg-white animate-pulse space-y-6"
                >
                    <div className="flex gap-8">
                        <div className="w-[35%] h-[120px] bg-gray-200 rounded-xl" />
                        <div className="w-[65%] space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-2/3" />
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-5/6" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const PartnerError = () => {
    return (
        <div className="text-center py-20">
            <p className="text-red-500 font-medium">
                Không tải được danh sách đối tác
            </p>
        </div>
    );
};