import { useCompanyDes } from '@/hooks/actions/useCompanyOwner';
import { getUrlImage } from '@/utils/format-image';
import { isValidValue } from '@/utils/utilts';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import imgDefault from "@/assets/images/default-image.jpg"

const TopDestinationCard = ({ dest }: any) => {
    if (!dest?.strCityImage) {
        return (
            <div className="flex-none flex flex-col items-center gap-4 group cursor-pointer">
                <div className="w-28 h-40 md:w-32 md:h-48 rounded-[24px] bg-gray-50 border border-gray-100 flex items-center justify-center 
                                shadow-[0_8px_16px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_12px_24px_-8px_rgba(37,99,235,0.1)] hover:-translate-y-1">
                    <div className="p-4 bg-white/60 rounded-full border border-gray-100 backdrop-blur-sm">
                        <ImageIcon size={28} className="text-gray-400" strokeWidth={1.5} />
                    </div>
                </div>
                <p className="text-gray-900 font-semibold text-sm drop-shadow-sm group-hover:text-[#2566b0] truncate w-32 text-center px-2">
                    {dest?.strDestinationName}
                </p>
            </div>
        );
    }

    const imageSrc =
        dest?.strCityImage === "" ||
            (typeof dest?.strCityImage === "object" &&
                dest?.strCityImage !== null &&
                Object.keys(dest?.strCityImage).length === 0)
            ? imgDefault
            : getUrlImage(isValidValue(dest?.strCityImage));


    return (
        <div className="flex-none flex flex-col items-center gap-4 group cursor-pointer">
            <div className="relative w-28 h-40 md:w-32 md:h-48 rounded-[24px] overflow-hidden 
                            shadow-[0_8px_16px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 
                            hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:scale-102">

                <img
                    src={getUrlImage(dest?.strCityImage)}
                    alt={dest?.strDestinationName}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="absolute inset-0 bg-black/10 group-hover:opacity-0 transition-opacity duration-300"></div>

            </div>

            <p className="text-gray-900 font-semibold text-sm drop-shadow-sm group-hover:text-[#2566b0] truncate w-32 text-center px-2">
                {dest?.strDestinationName}
            </p>
        </div>
    );
};

const DestinationCarousel = () => {
    const { t } = useTranslation("hotel")

    const [filters] = useState({
        page: 1,
        pageSize: 20,
        intFilterByCateID: 1
    });

    const { tcdData, tcdLoading, tcdError } = useCompanyDes(filters);

    const scrollRef = useRef<HTMLDivElement | null>(null);
    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;

        const scrollAmount = 300; // chỉnh độ trượt

        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };
    return (
        <section className="bg-white p-10 max-w-7xl mx-auto rounded-[32px] shadow-[0_16px_32px_-8px_rgba(0,0,0,0.03)] my-16">
            <div className="text-center mb-16 relative">
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                    {t("yourPartners")}
                </h2>
            </div>

            <div className="relative flex items-center justify-center gap-10">

                <button onClick={() => scroll('left')} className="cursor-pointer absolute -left-6 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white text-gray-900
                                   shadow-[0_12px_24px_-8px_rgba(0,0,0,0.15)] border border-gray-100
                                   transition-all duration-300 hover:bg-[#2566b0] hover:text-white hover:scale-105 hover:-translate-x-1
                                   active:scale-95">
                    <ChevronLeft size={24} strokeWidth={1.5} />
                </button>

                <div ref={scrollRef} className="flex gap-10 overflow-x-auto py-8 px-10 scrollbar-hide">
                    {tcdLoading && (
                        Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                    )}

                    {!tcdLoading && tcdError && (
                        <div className="text-red-500 text-center w-full">
                            {t("loadPartnerFailed")}
                        </div>
                    )}

                    {!tcdLoading && !tcdError && tcdData.map((dest: any) => (
                        <TopDestinationCard key={dest?.No} dest={dest} />
                    ))}
                </div>

                <button onClick={() => scroll('right')} className="cursor-pointer absolute -right-6 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white text-gray-900
                                   shadow-[0_12px_24px_-8px_rgba(0,0,0,0.15)] border border-gray-100
                                   transition-all duration-300 hover:bg-[#2566b0] hover:text-white hover:scale-105 hover:translate-x-1
                                   active:scale-95">
                    <ChevronRight size={24} strokeWidth={1.5} />
                </button>

            </div>
        </section>
    );
};

export default DestinationCarousel;

const SkeletonCard = () => (
    <div className="flex-none flex flex-col items-center gap-4 animate-pulse">
        <div className="w-28 h-40 md:w-32 md:h-48 rounded-[24px] bg-gray-200" />
        <div className="w-24 h-4 bg-gray-200 rounded" />
    </div>
);
