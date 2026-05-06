import { useListTour } from '@/hooks/actions/useTour';
import { useRouter } from '@/routes/hooks/use-router';
import { paths } from '@/routes/paths';
import { getUrlImage } from '@/utils/format-image';
import { formatPrice } from '@/utils/format-number';
import { Flag, Clock, MapPin, LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';

export const TourCard = ({ tour }: any) => {
    const router = useRouter();

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={getUrlImage(tour?.strTourImageUrl)}
                    alt={tour?.strTourName}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-[#1a4a8d] font-bold text-lg leading-tight uppercase mb-4 h-14 line-clamp-2">
                    {tour?.strTourName}
                </h3>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Flag size={14} className="text-gray-400" />
                        <span className="truncate">Bởi: {tour?.strOwnerCompanyName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-400" />
                        <span>Thời lượng: {tour?.duration}</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-gray-400 mt-1 shrink-0" />
                        <span className="line-clamp-2 leading-snug">
                            Các điểm đến: {tour?.strListTourDestinationName}
                        </span>
                    </div>
                </div>

                <div className="mb-4">
                    <span className="bg-[#e6f0ff] text-[#3b82f6] text-xs font-medium px-3 py-1 rounded-full">
                        {tour?.strLangCode === "CATEID_SETTOUR" ? "Tour hằng ngày" : "Trọn gói"}
                    </span>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500">Giá từ</p>
                        <p className="text-[#2563eb] font-bold text-xl">
                            {formatPrice(tour?.dblPriceFrom)}
                        </p>
                    </div>
                    <button
                        onClick={() => router.replaceParams(paths.tour.detail, { item: tour })}
                        className="cursor-pointer text-[#2566b0] border border-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    >
                        Xem chi tiết
                    </button>
                </div>
            </div>
        </div>
    );
};


const TourCardSkeleton = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm animate-pulse">
            <div className="h-48 bg-gray-200" />

            <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />

                <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                </div>

                <div className="h-6 bg-gray-200 rounded-full w-24 mb-4" />

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                        <div className="h-3 bg-gray-200 rounded w-12 mb-2" />
                        <div className="h-5 bg-gray-200 rounded w-20" />
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-24" />
                </div>
            </div>
        </div>
    );
};

const TourList = () => {


    const [filters] = useState({
        page: 1,
        pageSize: 15,
    });
    const { tourData, tourLoading, tourError } = useListTour(filters);

    // const totalRecords = tourData?.[0]?.intTotalRecords || 0;
    // const totalPages = Math.ceil(totalRecords / filters.pageSize);
    // const handlePageChange = (page: number) => {
    //     setFilters((prev) => ({
    //         ...prev,
    //         page,
    //     }));
    // };

    if (tourLoading) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <TourCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    if (tourError) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500 text-sm">
                    Có lỗi xảy ra khi tải tour
                </p>
            </div>
        );
    }

    if (!tourData || tourData.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500 text-sm">
                    Không có tour nào
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">
                    Tour nổi bật
                </h2>
                <div className="flex items-center gap-3 bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm">
                    <span className="text-sm text-gray-500 ml-2">
                        Hiển thị dạng:
                    </span>
                    <button className="p-1.5 bg-[#2566b0] text-white rounded-md shadow-sm">
                        <LayoutGrid size={18} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-md transition-colors">
                        <List size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {tourData.map((tour: any) => (
                    <TourCard key={tour.strTourGUID} tour={tour} />
                ))}
            </div>

            {/* <Pagination
                currentPage={filters.page}
                onPageChange={handlePageChange}
                totalPages={totalPages || 1}
            /> */}
        </div>
    );
};

export default TourList;