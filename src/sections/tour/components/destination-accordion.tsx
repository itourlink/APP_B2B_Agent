import { useCompanyDes } from '@/hooks/actions/useCompanyOwner';
import { useTranslate } from '@/locales';
import { getUrlImage } from '@/utils/format-image';
import { useState } from 'react';

const DestinationCard = ({ destination, isHovered, onMouseEnter, onMouseLeave }: any) => {
    const { t } = useTranslate("tour")

    return (
        <div
            className={`relative rounded-xl overflow-hidden transition-all duration-700 ease-in-out cursor-pointer group 
        ${isHovered ? 'flex-grow-[4] sm:flex-grow-[3]' : 'flex-grow-[1]'}`}
            style={{
                flexBasis: 0,
                height: '400px',
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <img
                src={getUrlImage(destination?.strCityImage)}
                alt={destination?.strDestinationName}
                className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            <div className={`absolute bottom-0 left-0 p-4 transition-all duration-500 ease-in-out w-full
        ${isHovered ? 'p-6' : 'p-4'}`}>

                <h3 className="text-white font-bold text-xl drop-shadow-md">
                    {destination?.strDestinationName}
                </h3>

                <div className={`mt-4 transition-all duration-500 ease-out 
          ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <button className="cursor-pointer border border-white/80 text-white/90 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 hover:border-white transition-colors duration-200">
                        {t("viewAll")}
                    </button>
                </div>
            </div>
        </div>
    );
};

const DestinationAccordion = () => {
    const { t } = useTranslate("tour")

    const [filters] = useState({
        page: 1,
        pageSize: 4,
        intFilterByCateID: 18
    });

    const { tcdData, tcdLoading, tcdError } = useCompanyDes(filters);
    const [hoveredIndex, setHoveredIndex] = useState(0);

    if (tcdLoading) return <DestinationSkeleton />;
    if (tcdError) return <DestinationError />;
    if (!tcdData || tcdData.length === 0) {
        return <DestinationEmpty />;
    }
    return (
        <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                    {t("topDestinations")}
                </h2>
            </div>

            <div className="flex flex-row items-stretch gap-4">
                {tcdData?.map((dest: any, index: any) => (
                    <DestinationCard
                        key={dest?.No}
                        destination={dest}
                        isHovered={index === hoveredIndex}
                        onMouseEnter={() => setHoveredIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default DestinationAccordion;


const DestinationSkeleton = () => {
    return (
        <div className="flex flex-row items-stretch gap-4">
            {[...Array(4)].map((_, i) => (
                <div
                    key={i}
                    className="flex-grow rounded-xl h-[400px] bg-gray-200 animate-pulse"
                />
            ))}
        </div>
    );
};

const DestinationError = () => {
    const { t } = useTranslate("tour")
    return (
        <div className="text-center py-20">
            <p className="text-red-500 font-medium">
                {t("somethingWentWrongPleaseTryAgain")}
            </p>
        </div>
    );
};


const DestinationEmpty = () => {
    const { t } = useTranslate("tour")

    return (
        <div className="text-center py-20">
            <p className="text-gray-500 font-medium">
                {t("noDestinationData")}
            </p>
        </div>
    );
};