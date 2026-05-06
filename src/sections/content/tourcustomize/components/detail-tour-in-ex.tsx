import { QUERY_KEYS } from '@/hooks/actions/query-keys';
import { useListTourCustomizedInExService } from '@/hooks/actions/useUser';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Pen } from 'lucide-react'

interface DetailTourInExProps {
    item?: any
}

const SkeletonItem = () => (
    <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
);

const DetailTourInEx = ({ item }: DetailTourInExProps) => {

    const { data, isLoading, error } = useQuery({
        queryKey: [QUERY_KEYS.USER.LIST_TOUR_CUSTOMIZED_INEX, item?.strTourCustomizedGUID],
        queryFn: () =>
            useListTourCustomizedInExService({
                strTourCustomizedGUID: item?.strTourCustomizedGUID,
                IsSelected: true
            }),
        placeholderData: keepPreviousData,
    });

    const listData = data?.[0] ?? [];

    const includeList = listData.filter((i: any) => i?.isInclude);
    const excludeList = listData.filter((i: any) => !i?.isInclude);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <h3 className="text-lg font-bold text-gray-800">Bao Gồm / Không Bao Gồm</h3>
                <Pen size={16} className="text-[#4a6fa5] cursor-pointer" />
            </div>

            <div className="grid grid-cols-2 gap-8 text-[13px] leading-relaxed">

                {/* ✅ Bao gồm */}
                <div className="space-y-2">
                    <p className="font-bold text-gray-700">Bao gồm:</p>

                    {error ? (
                        <div className="text-red-500 text-sm">
                            Có lỗi xảy ra, vui lòng thử lại.
                        </div>
                    ) : isLoading ? (
                        <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <SkeletonItem key={i} />
                            ))}
                        </div>
                    ) : (
                        <ul className="list-disc list-inside space-y-1 text-gray-600 pl-2">
                            {includeList.map((item: any) => (
                                <li key={item.excludeID}>
                                    {item?.strInExName || item?.include}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* ❌ Không bao gồm */}
                <div className="space-y-2">
                    <p className="font-bold text-gray-700">Không bao gồm:</p>

                    {error ? (
                        <div className="text-red-500 text-sm">
                            Có lỗi xảy ra, vui lòng thử lại.
                        </div>
                    ) : isLoading ? (
                        <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <SkeletonItem key={i} />
                            ))}
                        </div>
                    ) : (
                        <ul className="list-disc list-inside space-y-1 text-gray-600 pl-2">
                            {excludeList.map((item: any) => (
                                <li key={item.excludeID}>
                                    {item?.strInExName || item?.include}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>
        </div>
    )
}

export default DetailTourInEx;